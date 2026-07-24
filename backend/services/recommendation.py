"""
건강 목표 기반 추천 점수 계산 (PRD 규칙).

- Robust Min-Max 정규화 (5~95 백분위 클리핑, 극단값 완화)
- 낮을수록 가점 항목 반전
- 다이어트: 단백질은 절대량이 아니라 열량 대비(100kcal당 g)
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

# 다이어트: 칼로리·지방 비중↑, 단백질↓, 나트륨 추가
GOAL_WEIGHTS: dict[str, dict[str, float]] = {
    GOAL_DIET: {
        "calories": 0.40,
        "fat": 0.25,
        "sugar": 0.15,
        "sodium": 0.10,
        "protein": 0.10,
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

# 정규화 시 양끝 5% 극단값 완화 (샘플이 충분할 때만)
ROBUST_PERCENTILE_LOW = 5.0
ROBUST_PERCENTILE_HIGH = 95.0
ROBUST_MIN_SAMPLES = 10

REASON_THRESHOLD = 0.70
DEFAULT_REASON = "종합적인 영양 균형을 고려하여 추천되었습니다."

REASON_TEMPLATES: dict[str, str] = {
    "protein": "열량 대비 단백질이 높아 포만감 유지에 도움이 됩니다.",
    "calories": "칼로리가 낮아 다이어트에 적합합니다.",
    "fat": "지방 함량이 낮아 다이어트에 적합합니다.",
    "sugar": "당류 함량이 낮아 당 섭취를 줄이고 싶은 사용자에게 적합합니다.",
    "sodium": "나트륨 함량이 낮아 저염식을 원하는 사용자에게 적합합니다.",
}

# 고단백 목표는 절대 단백질 문구 유지
REASON_TEMPLATES_BY_GOAL: dict[str, dict[str, str]] = {
    GOAL_HIGH_PROTEIN: {
        "protein": "단백질 함량이 높아 고단백 식단에 적합합니다.",
        "fat": "지방 함량이 상대적으로 낮아 고단백 식단에 적합합니다.",
    },
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
    # robust 클리핑 범위 밖 값은 0~1로 클램프
    if value <= min_v:
        return 0.0
    if value >= max_v:
        return 1.0
    return (value - min_v) / (max_v - min_v)


def apply_direction(field: str, normalized: float) -> float:
    """B-2: 낮을수록 가점이면 반전."""
    if field in LOWER_IS_BETTER:
        return 1.0 - normalized
    return normalized


def _percentile(sorted_values: list[float], percent: float) -> float:
    """0~100 백분위 (선형 보간)."""
    if not sorted_values:
        return 0.0
    if len(sorted_values) == 1:
        return sorted_values[0]
    rank = (percent / 100.0) * (len(sorted_values) - 1)
    low = int(rank)
    high = min(low + 1, len(sorted_values) - 1)
    weight = rank - low
    return sorted_values[low] * (1.0 - weight) + sorted_values[high] * weight


def metric_value(product: Any, field: str, goal: str) -> Optional[float]:
    """점수에 쓰는 원시 지표. 다이어트 단백질은 100kcal당 g."""
    if goal == GOAL_DIET and field == "protein":
        calories = getattr(product, "calories", None)
        protein = getattr(product, "protein", None)
        if calories is None or protein is None:
            return None
        calories_f = float(calories)
        if calories_f <= 0:
            return None
        return (float(protein) / calories_f) * 100.0

    raw = getattr(product, field, None)
    if raw is None:
        return None
    return float(raw)


def _field_values(products: list[Any], field: str, goal: str) -> list[float]:
    values: list[float] = []
    for product in products:
        value = metric_value(product, field, goal)
        if value is not None:
            values.append(value)
    return values


def build_ranges(
    products: list[Any],
    fields: list[str],
    goal: str,
) -> dict[str, tuple[float, float]]:
    """항목별 (min, max). 샘플이 충분하면 5~95 백분위로 클리핑."""
    ranges: dict[str, tuple[float, float]] = {}
    for field in fields:
        values = _field_values(products, field, goal)
        if not values:
            ranges[field] = (0.0, 0.0)
            continue
        if len(values) >= ROBUST_MIN_SAMPLES:
            ordered = sorted(values)
            low = _percentile(ordered, ROBUST_PERCENTILE_LOW)
            high = _percentile(ordered, ROBUST_PERCENTILE_HIGH)
            if high <= low:
                low, high = min(values), max(values)
            ranges[field] = (low, high)
        else:
            ranges[field] = (min(values), max(values))
    return ranges


def component_score(
    product: Any,
    field: str,
    ranges: dict[str, tuple[float, float]],
    goal: str,
) -> float:
    """단일 영양 항목 점수. 결측이면 0 (B-9)."""
    raw = metric_value(product, field, goal)
    if raw is None:
        return 0.0
    min_v, max_v = ranges[field]
    normalized = min_max_normalize(raw, min_v, max_v)
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
        score = component_score(product, field, ranges, goal)
        components[field] = score
        total += score * weight
    return total, components


def recommend_score_from_weighted(weighted: float) -> int:
    """B-4: 0~100 환산."""
    return int(round(weighted * 100))


def build_reasons(goal: str, components: dict[str, float]) -> list[str]:
    """B-10: 가중치 상위 2개 항목이 임계값을 넘으면 문구 생성."""
    weights = GOAL_WEIGHTS[goal]
    templates = {**REASON_TEMPLATES, **REASON_TEMPLATES_BY_GOAL.get(goal, {})}
    top_fields = sorted(weights.keys(), key=lambda f: weights[f], reverse=True)[:2]
    reasons: list[str] = []
    for field in top_fields:
        if components.get(field, 0.0) >= REASON_THRESHOLD:
            template = templates.get(field)
            if template:
                reasons.append(template)
    if not reasons:
        reasons.append(DEFAULT_REASON)
    return reasons


def score_products(products: list[Any], goal: str) -> list[ScoredProduct]:
    if goal not in VALID_GOALS:
        raise ValueError(f"Invalid goal: {goal}")

    fields = list(GOAL_WEIGHTS[goal].keys())
    ranges = build_ranges(products, fields, goal)

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
