"""
건강 목표별 패널티 규칙.

threshold 는 식약처 100g DB 분위수(주로 p75 / p90)에서 도출.
amount 는 최종 점수(0~100)에서 차감하는 점수.

단일 영양소 규칙 + 복합 규칙(예: 열량과 지방이 동시에 높음)을 지원한다.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from services.nutrition_thresholds import NUTRIENT_STATS
from services.nutrition_weights import (
    GOAL_DIET,
    GOAL_HIGH_PROTEIN,
    GOAL_LOW_SODIUM,
    GOAL_LOW_SUGAR,
)


@dataclass(frozen=True)
class PenaltyRule:
    field: str
    threshold: float
    amount: float
    label: str


@dataclass(frozen=True)
class CompoundPenaltyRule:
    """여러 영양소가 동시에 기준을 넘을 때 추가 감점."""

    conditions: tuple[tuple[str, float], ...]
    amount: float
    label: str


# --- 다이어트 ----------------------------------------------------------------
# 단일: 고열량·고당·고지방·고포화지방
# 복합: 열량+지방이 함께 높으면 추가 감점 (단백질만으로 상위권 방지)
DIET_PENALTIES: tuple[PenaltyRule, ...] = (
    PenaltyRule("calories", NUTRIENT_STATS["calories"]["p90"], 15.0, "고열량"),
    PenaltyRule("calories", NUTRIENT_STATS["calories"]["p75"], 8.0, "열량 높음"),
    PenaltyRule("sugar", NUTRIENT_STATS["sugar"]["p90"], 12.0, "고당류"),
    PenaltyRule("fat", NUTRIENT_STATS["fat"]["p75"], 10.0, "지방 높음"),
    PenaltyRule(
        "saturated_fat",
        NUTRIENT_STATS["saturated_fat"]["p90"],
        10.0,
        "고포화지방",
    ),
)

DIET_COMPOUND_PENALTIES: tuple[CompoundPenaltyRule, ...] = (
    CompoundPenaltyRule(
        conditions=(
            ("calories", NUTRIENT_STATS["calories"]["p75"]),
            ("fat", NUTRIENT_STATS["fat"]["p75"]),
        ),
        amount=12.0,
        label="고열량·고지방",
    ),
)

# --- 고단백 ------------------------------------------------------------------
HIGH_PROTEIN_PENALTIES: tuple[PenaltyRule, ...] = (
    PenaltyRule("fat", NUTRIENT_STATS["fat"]["p90"], 12.0, "고지방"),
    PenaltyRule("fat", NUTRIENT_STATS["fat"]["p75"], 8.0, "지방 높음"),
    PenaltyRule(
        "saturated_fat",
        NUTRIENT_STATS["saturated_fat"]["p90"],
        12.0,
        "고포화지방",
    ),
    PenaltyRule(
        "saturated_fat",
        NUTRIENT_STATS["saturated_fat"]["p75"],
        6.0,
        "포화지방 높음",
    ),
)

HIGH_PROTEIN_COMPOUND_PENALTIES: tuple[CompoundPenaltyRule, ...] = (
    CompoundPenaltyRule(
        conditions=(
            ("fat", NUTRIENT_STATS["fat"]["p75"]),
            ("saturated_fat", NUTRIENT_STATS["saturated_fat"]["p75"]),
        ),
        amount=10.0,
        label="고지방·고포화지방",
    ),
)

# --- 저염식 ------------------------------------------------------------------
LOW_SODIUM_PENALTIES: tuple[PenaltyRule, ...] = (
    PenaltyRule("sodium", NUTRIENT_STATS["sodium"]["p90"], 25.0, "나트륨 매우 높음"),
    PenaltyRule("sodium", NUTRIENT_STATS["sodium"]["p75"], 10.0, "나트륨 높음"),
)

LOW_SODIUM_COMPOUND_PENALTIES: tuple[CompoundPenaltyRule, ...] = ()

# --- 저당식 ------------------------------------------------------------------
# 당류만 낮다고 햄버거 등이 상위가 되지 않도록 열량·지방 패널티 추가
LOW_SUGAR_PENALTIES: tuple[PenaltyRule, ...] = (
    PenaltyRule("sugar", NUTRIENT_STATS["sugar"]["p90"], 25.0, "당류 매우 높음"),
    PenaltyRule("sugar", NUTRIENT_STATS["sugar"]["p75"], 10.0, "당류 높음"),
    PenaltyRule("calories", NUTRIENT_STATS["calories"]["p75"], 10.0, "열량 높음"),
    PenaltyRule("fat", NUTRIENT_STATS["fat"]["p75"], 12.0, "지방 높음"),
    PenaltyRule(
        "saturated_fat",
        NUTRIENT_STATS["saturated_fat"]["p75"],
        8.0,
        "포화지방 높음",
    ),
)

LOW_SUGAR_COMPOUND_PENALTIES: tuple[CompoundPenaltyRule, ...] = (
    CompoundPenaltyRule(
        conditions=(
            ("calories", NUTRIENT_STATS["calories"]["p75"]),
            ("fat", NUTRIENT_STATS["fat"]["p75"]),
        ),
        amount=15.0,
        label="저당이어도 고열량·고지방",
    ),
)

GOAL_PENALTIES: dict[str, tuple[PenaltyRule, ...]] = {
    GOAL_DIET: DIET_PENALTIES,
    GOAL_HIGH_PROTEIN: HIGH_PROTEIN_PENALTIES,
    GOAL_LOW_SODIUM: LOW_SODIUM_PENALTIES,
    GOAL_LOW_SUGAR: LOW_SUGAR_PENALTIES,
}

GOAL_COMPOUND_PENALTIES: dict[str, tuple[CompoundPenaltyRule, ...]] = {
    GOAL_DIET: DIET_COMPOUND_PENALTIES,
    GOAL_HIGH_PROTEIN: HIGH_PROTEIN_COMPOUND_PENALTIES,
    GOAL_LOW_SODIUM: LOW_SODIUM_COMPOUND_PENALTIES,
    GOAL_LOW_SUGAR: LOW_SUGAR_COMPOUND_PENALTIES,
}


def _field_value(product: object, field: str) -> Optional[float]:
    raw = getattr(product, field, None)
    if raw is None:
        return None
    return float(raw)


def apply_penalties(product: object, goal: str) -> tuple[float, list[str]]:
    """적용된 총 감점과 사유 라벨을 반환.

    - 단일 규칙: 같은 필드는 가장 큰 감점만 적용
    - 복합 규칙: 조건을 모두 만족하면 추가 감점
    """
    rules = GOAL_PENALTIES.get(goal, ())
    best_by_field: dict[str, PenaltyRule] = {}

    for rule in rules:
        value = _field_value(product, rule.field)
        if value is None or value < rule.threshold:
            continue
        prev = best_by_field.get(rule.field)
        if prev is None or rule.amount > prev.amount:
            best_by_field[rule.field] = rule

    total = 0.0
    labels: list[str] = []
    for rule in best_by_field.values():
        total += rule.amount
        labels.append(rule.label)

    for compound in GOAL_COMPOUND_PENALTIES.get(goal, ()):
        matched = True
        for field, threshold in compound.conditions:
            value = _field_value(product, field)
            if value is None or value < threshold:
                matched = False
                break
        if matched:
            total += compound.amount
            labels.append(compound.label)

    return total, labels
