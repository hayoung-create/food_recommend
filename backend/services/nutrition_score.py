"""
영양소별 0~100 점수 및 건강목표별 최종 점수 계산.

흐름:
1) 영양소 점수 (DB 분위수 앵커 기반 선형 보간)
2) 목표 가중치 가중합
3) 목표별 패널티 차감
4) 0~100 클램프
"""

from __future__ import annotations

from typing import Any, Optional

from services.nutrition_penalty import apply_penalties
from services.nutrition_thresholds import SCORE_ANCHORS
from services.nutrition_weights import (
    GOAL_DIET,
    GOAL_HIGH_PROTEIN,
    GOAL_LOW_SODIUM,
    GOAL_LOW_SUGAR,
    GOAL_WEIGHTS,
)


def _clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def _read(product: Any, field: str) -> Optional[float]:
    raw = getattr(product, field, None)
    if raw is None:
        return None
    return float(raw)


def _score_higher_better(value: float, low: float, high: float) -> float:
    if high <= low:
        return 50.0
    if value <= low:
        return 0.0
    if value >= high:
        return 100.0
    return ((value - low) / (high - low)) * 100.0


def _score_lower_better(value: float, best: float, worst: float) -> float:
    if worst <= best:
        return 50.0
    if value <= best:
        return 100.0
    if value >= worst:
        return 0.0
    return (1.0 - (value - best) / (worst - best)) * 100.0


def score_nutrient(field: str, value: Optional[float]) -> float:
    """단일 영양소 0~100. 결측은 0."""
    if value is None:
        return 0.0
    anchor = SCORE_ANCHORS[field]
    low_or_best = anchor["low_or_best"]
    high_or_worst = anchor["high_or_worst"]
    if anchor["higher_is_better"]:
        return _score_higher_better(value, low_or_best, high_or_worst)
    return _score_lower_better(value, low_or_best, high_or_worst)


def score_calories(product: Any) -> float:
    return score_nutrient("calories", _read(product, "calories"))


def score_protein(product: Any) -> float:
    return score_nutrient("protein", _read(product, "protein"))


def score_carbohydrate(product: Any) -> float:
    return score_nutrient("carb", _read(product, "carb"))


def score_fat(product: Any) -> float:
    return score_nutrient("fat", _read(product, "fat"))


def score_sugar(product: Any) -> float:
    return score_nutrient("sugar", _read(product, "sugar"))


def score_sodium(product: Any) -> float:
    return score_nutrient("sodium", _read(product, "sodium"))


def score_saturated_fat(product: Any) -> float:
    return score_nutrient("saturated_fat", _read(product, "saturated_fat"))


def score_cholesterol(product: Any) -> float:
    return score_nutrient("cholesterol", _read(product, "cholesterol"))


NUTRIENT_SCORE_FUNCTIONS = {
    "calories": score_calories,
    "protein": score_protein,
    "carb": score_carbohydrate,
    "fat": score_fat,
    "sugar": score_sugar,
    "sodium": score_sodium,
    "saturated_fat": score_saturated_fat,
    "cholesterol": score_cholesterol,
}


def build_nutrient_scores(product: Any, fields: list[str]) -> dict[str, float]:
    scores: dict[str, float] = {}
    for field in fields:
        fn = NUTRIENT_SCORE_FUNCTIONS[field]
        scores[field] = fn(product)
    return scores


def _weighted_total(nutrient_scores: dict[str, float], weights: dict[str, float]) -> float:
    total = 0.0
    for field, weight in weights.items():
        total += nutrient_scores.get(field, 0.0) * weight
    return total


def _finalize(
    product: Any,
    goal: str,
    weights: dict[str, float],
) -> tuple[float, dict[str, float], float, list[str]]:
    nutrient_scores = build_nutrient_scores(product, list(weights.keys()))
    weighted = _weighted_total(nutrient_scores, weights)
    penalty, penalty_labels = apply_penalties(product, goal)
    final = _clamp(weighted - penalty)
    return final, nutrient_scores, penalty, penalty_labels


def calculate_diet_score(product: Any) -> tuple[float, dict[str, float], float, list[str]]:
    return _finalize(product, GOAL_DIET, GOAL_WEIGHTS[GOAL_DIET])


def calculate_high_protein_score(
    product: Any,
) -> tuple[float, dict[str, float], float, list[str]]:
    return _finalize(product, GOAL_HIGH_PROTEIN, GOAL_WEIGHTS[GOAL_HIGH_PROTEIN])


def calculate_low_sodium_score(
    product: Any,
) -> tuple[float, dict[str, float], float, list[str]]:
    return _finalize(product, GOAL_LOW_SODIUM, GOAL_WEIGHTS[GOAL_LOW_SODIUM])


def calculate_low_sugar_score(
    product: Any,
) -> tuple[float, dict[str, float], float, list[str]]:
    return _finalize(product, GOAL_LOW_SUGAR, GOAL_WEIGHTS[GOAL_LOW_SUGAR])


GOAL_SCORE_FUNCTIONS = {
    GOAL_DIET: calculate_diet_score,
    GOAL_HIGH_PROTEIN: calculate_high_protein_score,
    GOAL_LOW_SODIUM: calculate_low_sodium_score,
    GOAL_LOW_SUGAR: calculate_low_sugar_score,
}


def calculate_goal_score(
    product: Any,
    goal: str,
) -> tuple[float, dict[str, float], float, list[str]]:
    fn = GOAL_SCORE_FUNCTIONS.get(goal)
    if fn is None:
        raise ValueError(f"Invalid goal: {goal}")
    return fn(product)
