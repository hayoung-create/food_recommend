"""
건강 목표 기반 추천 오케스트레이션.

상세 점수 계산은 nutrition_score / thresholds / weights / penalty 모듈에 위임한다.
카테고리 필터 → 해당 집합 점수 계산 → 점수 내림차순 정렬 API는 유지한다.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional

from services.nutrition_score import calculate_goal_score
from services.nutrition_weights import (
    GOAL_DIET,
    GOAL_HIGH_PROTEIN,
    GOAL_LOW_SODIUM,
    GOAL_LOW_SUGAR,
    GOAL_WEIGHTS,
    VALID_GOALS,
)

# main.py / 차트용 — 기존 필드 키 유지
NUTRIENT_FIELDS = ("calories", "protein", "fat", "sugar", "sodium")

REASON_THRESHOLD = 70.0
DEFAULT_REASON = "종합적인 영양 균형을 고려하여 추천되었습니다."

REASON_TEMPLATES: dict[str, str] = {
    "protein": "단백질 함량이 목표에 잘 맞습니다.",
    "calories": "칼로리가 낮아 다이어트에 적합합니다.",
    "fat": "지방 함량이 낮아 목표에 적합합니다.",
    "sugar": "당류 함량이 낮아 당 섭취를 줄이는 데 적합합니다.",
    "sodium": "나트륨 함량이 낮아 저염식에 적합합니다.",
    "saturated_fat": "포화지방이 낮아 목표에 적합합니다.",
    "cholesterol": "콜레스테롤이 낮아 목표에 적합합니다.",
    "carb": "탄수화물이 낮아 저당식에 적합합니다.",
}

REASON_TEMPLATES_BY_GOAL: dict[str, dict[str, str]] = {
    GOAL_HIGH_PROTEIN: {
        "protein": "단백질 함량이 높아 고단백 식단에 적합합니다.",
    },
    GOAL_DIET: {
        "protein": "단백질이 충분해 포만감 유지에 도움이 됩니다.",
        "calories": "칼로리가 낮아 다이어트에 적합합니다.",
    },
}


@dataclass
class ScoredProduct:
    product: Any
    recommend_score: int
    component_scores: dict[str, float]
    reasons: list[str]
    penalty: float = 0.0


def build_reasons(
    goal: str,
    component_scores: dict[str, float],
    penalty_labels: list[str],
) -> list[str]:
    """가중치 상위 2개 항목이 임계값 이상이면 추천 문구 생성."""
    weights = GOAL_WEIGHTS[goal]
    templates = {**REASON_TEMPLATES, **REASON_TEMPLATES_BY_GOAL.get(goal, {})}
    top_fields = sorted(weights.keys(), key=lambda f: weights[f], reverse=True)[:2]
    reasons: list[str] = []
    for field in top_fields:
        if component_scores.get(field, 0.0) >= REASON_THRESHOLD:
            template = templates.get(field)
            if template:
                reasons.append(template)
    if not reasons:
        reasons.append(DEFAULT_REASON)
    if penalty_labels:
        reasons.append(f"참고: {', '.join(penalty_labels)} 항목으로 일부 감점되었습니다.")
    return reasons


def score_products(products: list[Any], goal: str) -> list[ScoredProduct]:
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}")

    scored: list[ScoredProduct] = []
    for product in products:
        final, components, penalty, penalty_labels = calculate_goal_score(product, goal)
        scored.append(
            ScoredProduct(
                product=product,
                recommend_score=int(round(final)),
                component_scores=components,
                reasons=build_reasons(goal, components, penalty_labels),
                penalty=penalty,
            )
        )

    scored.sort(
        key=lambda item: (
            item.recommend_score,
            item.product.protein if item.product.protein is not None else float("-inf"),
        ),
        reverse=True,
    )
    return scored


def recommend_top5(
    products: list[Any],
    goal: str,
    category: Optional[str] = None,
    category2: Optional[str] = None,
    top_n: Optional[int] = 5,
    offset: int = 0,
) -> dict[str, Any]:
    """카테고리/중분류 지정 시 해당 제품만 점수 계산. 미지정 시 전체."""
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}")
    if offset < 0:
        raise ValueError("offset must be >= 0")

    scoped = products
    if category2:
        scoped = [
            p
            for p in products
            if getattr(p, "category2", None) == category2
            and (not category or p.category == category)
        ]
    elif category:
        scoped = [p for p in products if p.category == category]

    filter_active = bool(category or category2)
    low_sample_warning = filter_active and len(scoped) < 5
    scored = score_products(scoped, goal) if scoped else []
    total = len(scored)

    if top_n is None:
        page_items = scored[offset:]
    else:
        page_items = scored[offset : offset + top_n]

    return {
        "goal": goal,
        "category": category,
        "category2": category2,
        "scopedNormalization": filter_active,
        "sampleSize": len(scoped),
        "lowSampleWarning": low_sample_warning,
        "total": total,
        "offset": offset,
        "items": page_items,
    }


__all__ = [
    "GOAL_DIET",
    "GOAL_HIGH_PROTEIN",
    "GOAL_LOW_SODIUM",
    "GOAL_LOW_SUGAR",
    "VALID_GOALS",
    "GOAL_WEIGHTS",
    "NUTRIENT_FIELDS",
    "ScoredProduct",
    "score_products",
    "recommend_top5",
]
