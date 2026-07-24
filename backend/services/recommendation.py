"""
건강 목표 기반 추천 점수 계산 (PRD 규칙).

- Min-Max 정규화 (선택 집합 기준)
- 낮을수록 가점 항목 반전
- 목표별 가중합 → recommend_score 0~100
- 동점 시 단백질 높은 순
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Optional

GOAL_DIET = "diet"
GOAL_HIGH_PROTEIN = "high_protein"
GOAL_LOW_SODIUM = "low_sodium"
GOAL_LOW_SUGAR = "low_sugar"

VALID_GOALS = {
    GOAL_DIET,
    GOAL_HIGH_PROTEIN,
    GOAL_LOW_SODIUM,
    GOAL_LOW_SUGAR,
}

GOAL_WEIGHTS: dict[str, dict[str, float]] = {
    GOAL_DIET: {
        "protein": 0.25,
        "calories": 0.35,
        "fat": 0.20,
        "sugar": 0.20,
    },
    GOAL_HIGH_PROTEIN: {
        "protein": 0.70,
        "fat": 0.30,
    },
    GOAL_LOW_SODIUM: {
        "sodium": 1.0,
    },
    GOAL_LOW_SUGAR: {
        "sugar": 1.0,
    },
}

LOWER_IS_BETTER = frozenset({"calories", "fat", "sugar", "sodium"})
NUTRIENT_FIELDS = ("calories", "protein", "fat", "sugar", "sodium")

REASON_THRESHOLD = 0.70
DEFAULT_REASON = "종합적인 영양 균형을 고려하여 추천되었습니다."

REASON_TEMPLATES: dict[str, str] = {
    "protein": "단백질 함량이 높아 고단백 식단에 적합합니다.",
    "calories": "칼로리가 낮아 다이어트에 적합합니다.",
    "fat": "지방 함량이 낮아 다이어트에 적합합니다.",
    "sugar": "당류 함량이 낮아 당 섭취를 줄이고 싶은 사용자에게 적합합니다.",
    "sodium": "나트륨 함량이 낮아 저염식을 원하는 사용자에게 적합합니다.",
}


@dataclass
class ScoredProduct:
    product: Any
    recommend_score: int
    component_scores: dict[str, float]
    reasons: list[str]


def min_max_normalize(value: float, min_v: float, max_v: float) -> float:
    """B-1: Min-Max 정규화. min==max 이면 0.0."""
    if max_v == min_v:
        return 0.0
    return (value - min_v) / (max_v - min_v)


def apply_direction(field: str, normalized: float) -> float:
    """B-2: 낮을수록 가점이면 반전."""
    if field in LOWER_IS_BETTER:
        return 1.0 - normalized
    return normalized


def _field_values(products: list[Any], field: str) -> list[float]:
    values: list[float] = []
    for product in products:
        raw = getattr(product, field, None)
        if raw is not None:
            values.append(float(raw))
    return values


def build_ranges(products: list[Any], fields: list[str]) -> dict[str, tuple[float, float]]:
    ranges: dict[str, tuple[float, float]] = {}
    for field in fields:
        values = _field_values(products, field)
        if not values:
            ranges[field] = (0.0, 0.0)
        else:
            ranges[field] = (min(values), max(values))
    return ranges


def component_score(
    product: Any,
    field: str,
    ranges: dict[str, tuple[float, float]],
) -> float:
    """단일 영양 항목 점수. 결측이면 0 (B-9)."""
    raw = getattr(product, field, None)
    if raw is None:
        return 0.0
    min_v, max_v = ranges[field]
    normalized = min_max_normalize(float(raw), min_v, max_v)
    return apply_direction(field, normalized)


def weighted_score(
    product: Any,
    goal: str,
    ranges: dict[str, tuple[float, float]],
) -> tuple[float, dict[str, float]]:
    weights = GOAL_WEIGHTS[goal]
    components: dict[str, float] = {}
    total = 0.0
    for field, weight in weights.items():
        score = component_score(product, field, ranges)
        components[field] = score
        total += score * weight
    return total, components


def recommend_score_from_weighted(weighted: float) -> int:
    """B-4: 0~100 환산."""
    return int(round(weighted * 100))


def build_reasons(goal: str, components: dict[str, float]) -> list[str]:
    """B-10: 가중치 상위 2개 항목이 임계값을 넘으면 문구 생성."""
    weights = GOAL_WEIGHTS[goal]
    top_fields = sorted(weights.keys(), key=lambda f: weights[f], reverse=True)[:2]
    reasons: list[str] = []
    for field in top_fields:
        if components.get(field, 0.0) >= REASON_THRESHOLD:
            template = REASON_TEMPLATES.get(field)
            if template:
                reasons.append(template)
    if not reasons:
        reasons.append(DEFAULT_REASON)
    return reasons


def score_products(products: list[Any], goal: str) -> list[ScoredProduct]:
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}")

    fields = list(GOAL_WEIGHTS[goal].keys())
    ranges = build_ranges(products, fields)

    scored: list[ScoredProduct] = []
    for product in products:
        weighted, components = weighted_score(product, goal, ranges)
        scored.append(
            ScoredProduct(
                product=product,
                recommend_score=recommend_score_from_weighted(weighted),
                component_scores=components,
                reasons=build_reasons(goal, components),
            )
        )

    # B-5: 점수 내림차순, 동점이면 단백질 높은 순
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
    top_n: Optional[int] = 5,
    offset: int = 0,
) -> dict[str, Any]:
    """점수순 추천 목록. category가 있으면 해당 분류만 모아 재정규화.

    top_n=None 이면 offset 이후 전체, 숫자면 해당 개수만 반환.
    알고리즘(정규화·가중치)은 변경하지 않고 슬라이스만 적용한다.
    """
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}")
    if offset < 0:
        raise ValueError("offset must be >= 0")

    scoped = products
    if category:
        scoped = [p for p in products if p.category == category]

    low_sample_warning = bool(category) and len(scoped) < 5
    scored = score_products(scoped, goal) if scoped else []
    total = len(scored)

    if top_n is None:
        page_items = scored[offset:]
    else:
        page_items = scored[offset : offset + top_n]

    return {
        "goal": goal,
        "category": category,
        "scopedNormalization": bool(category),
        "sampleSize": len(scoped),
        "lowSampleWarning": low_sample_warning,
        "total": total,
        "offset": offset,
        "items": page_items,
    }
