"""건강 목표별 영양소 가중치 (합계 1.0)."""

from __future__ import annotations

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

# Product 모델 필드명 기준
GOAL_WEIGHTS: dict[str, dict[str, float]] = {
    GOAL_DIET: {
        "calories": 0.35,
        "protein": 0.30,
        "sugar": 0.15,
        "fat": 0.10,
        "saturated_fat": 0.05,
        "sodium": 0.05,
    },
    GOAL_HIGH_PROTEIN: {
        "protein": 0.50,
        "calories": 0.15,
        "fat": 0.15,
        "saturated_fat": 0.10,
        "sugar": 0.05,
        "sodium": 0.05,
    },
    GOAL_LOW_SODIUM: {
        "sodium": 0.60,
        "saturated_fat": 0.10,
        "cholesterol": 0.10,
        "calories": 0.10,
        "sugar": 0.05,
        "protein": 0.05,
    },
    GOAL_LOW_SUGAR: {
        "sugar": 0.60,
        "carb": 0.15,
        "calories": 0.10,
        "protein": 0.10,
        "fat": 0.05,
    },
}
