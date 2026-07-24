"""
식약처 식품영양성분DB 페이지네이션 수집 → SQLite upsert.

사용:
    cd backend
    .\\venv\\Scripts\\Activate.ps1
    python -m scripts.collect_foods          # 1페이지 스모크
    python -m scripts.collect_foods --all    # 전체 수집

환경변수: DATA_GO_KR_SERVICE_KEY (.env)
매핑: docs/API.md + 아래 FIELD_MAP
"""

from __future__ import annotations

import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Optional

import requests
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine, select

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models import Product  # noqa: E402

load_dotenv(BACKEND_DIR / ".env")

API_URL = "https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02"
DEFAULT_NUM_OF_ROWS = 100
REQUEST_TIMEOUT = 60
REQUEST_INTERVAL_SEC = 0.2
DB_URL = f"sqlite:///{BACKEND_DIR / 'app.db'}"

# API 필드 → Product 컬럼 (A-3 확정)
FIELD_MAP = {
    "food_cd": "FOOD_CD",
    "name": "FOOD_NM_KR",
    "category": "FOOD_CAT1_NM",
    "maker": "MAKER_NM",
    "serving_size": "SERVING_SIZE",
    "calories": "AMT_NUM1",
    "protein": "AMT_NUM3",
    "fat": "AMT_NUM4",
    "carb": "AMT_NUM6",
    "sugar": "AMT_NUM7",
    "sodium": "AMT_NUM13",
    "cholesterol": "AMT_NUM23",
    "saturated_fat": "AMT_NUM24",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})


def get_service_key() -> str:
    key = os.getenv("DATA_GO_KR_SERVICE_KEY")
    if not key or key == "your_service_key_here":
        raise SystemExit("DATA_GO_KR_SERVICE_KEY 가 .env 에 없습니다.")
    return key


def parse_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    text = str(value).strip()
    if text == "" or text.upper() in {"N/A", "NA", "-", "NONE", "NULL"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def normalize_items(items: Any) -> list[dict[str, Any]]:
    if items is None:
        return []
    if isinstance(items, dict):
        inner = items.get("item", items)
        if isinstance(inner, list):
            return [x for x in inner if isinstance(x, dict)]
        if isinstance(inner, dict):
            return [inner]
        return []
    if isinstance(items, list):
        return [x for x in items if isinstance(x, dict)]
    return []


def map_item_to_product_dict(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "food_cd": item.get("FOOD_CD") or None,
        "name": (item.get("FOOD_NM_KR") or "").strip() or None,
        "category": item.get("FOOD_CAT1_NM") or None,
        "maker": item.get("MAKER_NM") or None,
        "serving_size": item.get("SERVING_SIZE") or None,
        "calories": parse_float(item.get("AMT_NUM1")),
        "protein": parse_float(item.get("AMT_NUM3")),
        "fat": parse_float(item.get("AMT_NUM4")),
        "carb": parse_float(item.get("AMT_NUM6")),
        "sugar": parse_float(item.get("AMT_NUM7")),
        "sodium": parse_float(item.get("AMT_NUM13")),
        "cholesterol": parse_float(item.get("AMT_NUM23")),
        "saturated_fat": parse_float(item.get("AMT_NUM24")),
    }


def fetch_page(
    service_key: str,
    page_no: int,
    num_of_rows: int = DEFAULT_NUM_OF_ROWS,
    max_retries: int = 3,
) -> Optional[dict[str, Any]]:
    """한 페이지 조회. 실패 시 최대 3회 재시도 후 None(스킵)."""
    params = {
        "serviceKey": service_key,
        "type": "json",
        "pageNo": page_no,
        "numOfRows": num_of_rows,
    }
    last_error: Optional[Exception] = None

    for attempt in range(1, max_retries + 1):
        try:
            response = requests.get(API_URL, params=params, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            data = response.json()
            header = data.get("header") or {}
            if str(header.get("resultCode")) != "00":
                raise RuntimeError(
                    f"API error: {header.get('resultCode')} {header.get('resultMsg')}"
                )
            return data
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            logger.warning(
                "page=%s attempt=%s/%s failed: %s",
                page_no,
                attempt,
                max_retries,
                exc,
            )
            if attempt < max_retries:
                time.sleep(REQUEST_INTERVAL_SEC * attempt)

    logger.error("page=%s skipped after %s retries: %s", page_no, max_retries, last_error)
    return None


def iter_pages(
    service_key: str,
    num_of_rows: int = DEFAULT_NUM_OF_ROWS,
    max_pages: Optional[int] = None,
):
    page_no = 1
    total_count: Optional[int] = None
    consecutive_skips = 0

    while True:
        if max_pages is not None and page_no > max_pages:
            break

        data = fetch_page(service_key, page_no, num_of_rows)
        if data is None:
            consecutive_skips += 1
            if total_count is None:
                logger.error("first page failed; aborting collection")
                break
            if page_no * num_of_rows >= total_count:
                break
            if consecutive_skips >= 10:
                logger.error("too many consecutive page skips; stopping")
                break
            page_no += 1
            time.sleep(REQUEST_INTERVAL_SEC)
            continue

        consecutive_skips = 0
        body = data.get("body") or {}
        if total_count is None:
            total_count = int(body.get("totalCount") or 0)
            logger.info("totalCount=%s numOfRows=%s", total_count, num_of_rows)

        items = normalize_items(body.get("items"))
        yield page_no, items, total_count

        if not items:
            break
        if total_count is not None and page_no * num_of_rows >= total_count:
            break

        page_no += 1
        time.sleep(REQUEST_INTERVAL_SEC)


def collect(
    max_pages: Optional[int] = None,
    num_of_rows: int = DEFAULT_NUM_OF_ROWS,
) -> list[dict[str, Any]]:
    service_key = get_service_key()
    products: list[dict[str, Any]] = []
    skipped_no_name = 0

    for page_no, items, total_count in iter_pages(
        service_key, num_of_rows=num_of_rows, max_pages=max_pages
    ):
        logger.info(
            "page=%s items=%s collected=%s / %s",
            page_no,
            len(items),
            len(products),
            total_count,
        )
        for item in items:
            mapped = map_item_to_product_dict(item)
            if not mapped.get("name"):
                skipped_no_name += 1
                continue
            products.append(mapped)

    logger.info("done: products=%s skipped_no_name=%s", len(products), skipped_no_name)
    return products


def is_standard_serving(serving_size: Optional[str]) -> bool:
    if not serving_size:
        return False
    normalized = serving_size.strip().lower().replace(" ", "")
    return normalized in {"100g", "100ml", "100그램", "100㎖"}


def preprocess_report(rows: list[dict[str, Any]]) -> dict[str, Any]:
    """비표준 serving / 결측은 로그만 남기고 행은 유지 (제외하지 않음)."""
    nutrient_keys = [
        "calories",
        "carb",
        "protein",
        "fat",
        "sugar",
        "sodium",
        "saturated_fat",
        "cholesterol",
    ]
    non_standard = 0
    missing_serving = 0
    nutrient_nulls = {key: 0 for key in nutrient_keys}

    for row in rows:
        serving = row.get("serving_size")
        if serving is None or str(serving).strip() == "":
            missing_serving += 1
        elif not is_standard_serving(str(serving)):
            non_standard += 1
            logger.warning(
                "non-standard serving_size kept: name=%s serving=%s",
                row.get("name"),
                serving,
            )
        for key in nutrient_keys:
            if row.get(key) is None:
                nutrient_nulls[key] += 1

    report = {
        "rows": len(rows),
        "missing_serving": missing_serving,
        "non_standard_serving": non_standard,
        "nutrient_nulls": nutrient_nulls,
    }
    logger.info("preprocess report: %s", report)
    return report


def upsert_products(rows: list[dict[str, Any]]) -> tuple[int, int]:
    SQLModel.metadata.create_all(engine)
    inserted = 0
    updated = 0

    with Session(engine) as session:
        for row in rows:
            food_cd = row.get("food_cd")
            existing: Optional[Product] = None
            if food_cd:
                existing = session.exec(
                    select(Product).where(Product.food_cd == food_cd)
                ).first()

            if existing is not None:
                for key, value in row.items():
                    if key == "food_cd":
                        continue
                    setattr(existing, key, value)
                updated += 1
            else:
                session.add(Product(**row))
                inserted += 1

        session.commit()

    logger.info("upsert: inserted=%s updated=%s", inserted, updated)
    return inserted, updated


def main() -> None:
    max_pages: Optional[int] = 1
    if "--all" in sys.argv:
        max_pages = None
        logger.info("mode: full pagination (--all)")
    else:
        logger.info("mode: smoke (1 page). 전체: python -m scripts.collect_foods --all")

    products = collect(max_pages=max_pages)
    if not products:
        raise SystemExit("수집 결과가 비어 있습니다.")

    preprocess_report(products)
    inserted, updated = upsert_products(products)

    sample = products[0]
    logger.info(
        "sample: name=%s category=%s maker=%s serving=%s kcal=%s",
        sample.get("name"),
        sample.get("category"),
        sample.get("maker"),
        sample.get("serving_size"),
        sample.get("calories"),
    )
    logger.info(
        "collect+upsert OK: rows=%s inserted=%s updated=%s",
        len(products),
        inserted,
        updated,
    )


if __name__ == "__main__":
    main()
