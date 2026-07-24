"""
범용 보일러플레이트 - 백엔드 (FastAPI + SQLite)
================================================
'작동하는 최소 뼈대'입니다. 서버 실행 · CORS · DB 연결까지 다 되어 있어요.
여기에 **데이터 모델(도메인)만** AI(Cursor)에게 시켜서 추가하면 됩니다.

실행:
    pip install -r requirements.txt
    uvicorn main:app --reload
    → 브라우저에서 http://127.0.0.1:8000/health 로 확인
"""
from contextlib import asynccontextmanager

from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, col, create_engine, select

from models import Product
from services.recommendation import (
    GOAL_DIET,
    GOAL_HIGH_PROTEIN,
    GOAL_LOW_SODIUM,
    GOAL_LOW_SUGAR,
    NUTRIENT_FIELDS,
    VALID_GOALS,
    recommend_top5,
    score_products,
)

# --------------------------------------------------------------------------
# [배선] DB 연결 (SQLite) — 이 부분은 그대로 두고, 아래에 모델만 추가하면 됩니다.
#   · check_same_thread=False : FastAPI에서 SQLite를 쓸 때 필요한 설정
#     (이걸 빠뜨리면 초보가 잡기 어려운 에러가 나서, 미리 넣어 둠)
# --------------------------------------------------------------------------
engine = create_engine("sqlite:///app.db", connect_args={"check_same_thread": False})


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버가 켜질 때, 정의된 모델들의 테이블을 자동으로 만든다.
    # (아직 모델이 없으면 아무것도 안 만들어짐 → 모델을 추가하면 그때 테이블 생성)
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(title="My App API", lifespan=lifespan)

# [배선] 브라우저의 React(다른 포트)에서 이 API를 부를 수 있게 허용 (없으면 CORS 에러)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 교육용 전체 허용. 실무에선 도메인 지정
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API 살아있음. /health 로 확인하세요."}


@app.get("/health")
def health():
    """서버가 살아있는지 확인하는 용도. 화면(React)이 이걸 불러서 '연결됨'을 표시한다."""
    return {"status": "ok"}


# 도메인 모델: models.Product (서버 기동 시 products 테이블 생성)
# 런타임 API는 SQLite만 조회한다. 공공 API 호출은 scripts/collect_foods.py 전용.

GOAL_META = [
    {
        "id": GOAL_DIET,
        "label": "다이어트",
        "description": "칼로리는 낮추고, 영양은 균형있게",
    },
    {
        "id": GOAL_HIGH_PROTEIN,
        "label": "고단백 식단",
        "description": "단백질은 높이고, 건강한 근육을 위해",
    },
    {
        "id": GOAL_LOW_SODIUM,
        "label": "저염식",
        "description": "나트륨은 낮추고, 건강한 식습관을 위해",
    },
    {
        "id": GOAL_LOW_SUGAR,
        "label": "저당식",
        "description": "당류는 낮추고, 가볍고 건강하게",
    },
]


def _require_goal(goal: str) -> str:
    """잘못된 goal이면 400. 허용 목록을 detail에 포함."""
    if goal not in VALID_GOALS:
        raise HTTPException(
            status_code=400,
            detail=(
                "잘못된 건강 목표입니다. "
                f"사용 가능: {', '.join(sorted(VALID_GOALS))}"
            ),
        )
    return goal


@app.get("/api/goals")
def list_goals():
    """건강 목표 목록 (C-1)."""
    return {"items": GOAL_META}


@app.get("/api/categories")
def list_categories():
    """DB에 존재하는 식품분류 동적 목록 (C-2)."""
    with Session(engine) as session:
        rows = session.exec(
            select(Product.category)
            .where(col(Product.category).is_not(None))
            .where(Product.category != "")
            .distinct()
            .order_by(Product.category)
        ).all()
    return {"items": list(rows)}


@app.get("/api/recommendations")
def recommendations(
    goal: str = Query(...),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=500),
):
    """목표(필수)·분류(옵션) 기준 추천 목록 (페이지네이션)."""
    _require_goal(goal)

    with Session(engine) as session:
        products = list(session.exec(select(Product)).all())

    offset = (page - 1) * pageSize
    result = recommend_top5(
        products,
        goal,
        category=category,
        top_n=pageSize,
        offset=offset,
    )
    items = []
    for index, scored in enumerate(result["items"], start=offset + 1):
        product = scored.product
        items.append(
            {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "calories": product.calories,
                "protein": product.protein,
                "fat": product.fat,
                "recommendScore": scored.recommend_score,
                "rank": index,
            }
        )

    total = result["total"]
    total_pages = max(1, (total + pageSize - 1) // pageSize) if total else 0

    return {
        "goal": result["goal"],
        "category": result["category"],
        "scopedNormalization": result["scopedNormalization"],
        "sampleSize": result["sampleSize"],
        "lowSampleWarning": result["lowSampleWarning"],
        "page": page,
        "pageSize": pageSize,
        "total": total,
        "totalPages": total_pages,
        "items": items,
    }


def _category_averages(products: list[Product]) -> dict[str, Optional[float]]:
    averages: dict[str, Optional[float]] = {}
    for field in NUTRIENT_FIELDS:
        values = [
            float(getattr(p, field))
            for p in products
            if getattr(p, field) is not None
        ]
        averages[field] = (sum(values) / len(values)) if values else None
    return averages


@app.get("/api/products/{product_id}")
def product_detail(
    product_id: int,
    goal: str = Query(GOAL_DIET),
    category: Optional[str] = Query(None),
):
    """제품 상세 + 점수 + 추천 이유 + 차트용 분류 평균 (C-4)."""
    _require_goal(goal)

    with Session(engine) as session:
        product = session.get(Product, product_id)
        if product is None:
            raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")
        products = list(session.exec(select(Product)).all())

    scope_category = category if category is not None else product.category
    if scope_category:
        scoped = [p for p in products if p.category == scope_category]
    else:
        scoped = products

    scored_list = score_products(scoped, goal) if scoped else []
    scored = next((s for s in scored_list if s.product.id == product.id), None)
    if scored is None:
        if not products:
            raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")
        scored_list = score_products(products, goal)
        scored = next(
            (s for s in scored_list if s.product.id == product.id),
            None,
        )
        if scored is None:
            raise HTTPException(status_code=404, detail="제품을 찾을 수 없습니다.")
        scoped = products
        scope_category = None

    averages = _category_averages(scoped)
    return {
        "id": product.id,
        "name": product.name,
        "category": product.category,
        "maker": product.maker,
        "servingSize": product.serving_size,
        "nutrition": {
            "calories": product.calories,
            "carb": product.carb,
            "protein": product.protein,
            "fat": product.fat,
            "sugar": product.sugar,
            "sodium": product.sodium,
            "saturatedFat": product.saturated_fat,
            "cholesterol": product.cholesterol,
        },
        "recommendScore": scored.recommend_score,
        "reasons": scored.reasons,
        "goal": goal,
        "scoreScopeCategory": scope_category,
        "chart": {
            "labels": ["칼로리", "단백질", "지방", "당류", "나트륨"],
            "fields": list(NUTRIENT_FIELDS),
            "product": [
                product.calories,
                product.protein,
                product.fat,
                product.sugar,
                product.sodium,
            ],
            "categoryAverage": [
                averages.get("calories"),
                averages.get("protein"),
                averages.get("fat"),
                averages.get("sugar"),
                averages.get("sodium"),
            ],
        },
    }


def _normalize_search_text(value: str) -> str:
    return "".join(value.split()).casefold()


@app.get("/api/search")
def search_products(
    q: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    """식품명 부분 일치 검색 — 공백·대소문자 무시 (C-5).
    식품명(q) 또는 식품분류(category) 중 하나 이상 필요.
    q가 비어 있고 category만 있으면 해당 분류 전체 목록을 반환한다.
    """
    needle = _normalize_search_text(q or "")
    if not needle and not category:
        raise HTTPException(
            status_code=400,
            detail="검색어 또는 식품분류를 입력해 주세요.",
        )

    with Session(engine) as session:
        query = select(Product)
        if category:
            query = query.where(Product.category == category)
        products = list(session.exec(query).all())

    if needle:
        matched = [
            p for p in products if needle in _normalize_search_text(p.name or "")
        ]
    else:
        matched = products

    # 결과 없어도 items는 항상 배열
    return {
        "query": q or "",
        "category": category,
        "items": [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "calories": p.calories,
                "protein": p.protein,
                "fat": p.fat,
            }
            for p in matched
        ],
    }
