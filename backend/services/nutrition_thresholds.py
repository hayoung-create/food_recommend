"""
식약처 100g 기준 DB(app.db) 분포 분석에서 도출한 영양소 기준값.

분석 시점: products 100건 (모두 100g/100ml 기준, 추가 환산 없음)
통계: min / max / mean / median / p10 / p25 / p75 / p90

점수 앵커:
- 높을수록 좋음(단백질): p25 → 0점, p90 → 100점 (선형)
- 낮을수록 좋음: p25 이하 → 100점, p90 이상 → 0점 (선형)
"""

from __future__ import annotations

from typing import TypedDict


class NutrientStats(TypedDict):
    n: int
    min: float
    max: float
    mean: float
    median: float
    p10: float
    p25: float
    p75: float
    p90: float


# --- DB 분포 분석 결과 (100g 기준) -----------------------------------------

NUTRIENT_STATS: dict[str, NutrientStats] = {
    "calories": {
        "n": 100,
        "min": 44.0,
        "max": 515.0,
        "mean": 200.6,
        "median": 179.5,
        "p10": 111.9,
        "p25": 145.75,
        "p75": 237.75,
        "p90": 314.5,
    },
    "protein": {
        "n": 100,
        "min": 1.45,
        "max": 13.88,
        "mean": 5.9894,
        "median": 5.655,
        "p10": 3.155,
        "p25": 3.995,
        "p75": 7.225,
        "p90": 9.694,
    },
    "carb": {
        "n": 100,
        "min": 8.05,
        "max": 62.93,
        "mean": 30.6751,
        "median": 27.24,
        "p10": 15.099,
        "p25": 20.5225,
        "p75": 41.6925,
        "p90": 51.801,
    },
    "fat": {
        "n": 100,
        "min": 0.16,
        "max": 33.17,
        "mean": 5.9916,
        "median": 4.205,
        "p10": 0.649,
        "p25": 1.97,
        "p75": 7.585,
        "p90": 13.48,
    },
    "sugar": {
        "n": 100,
        "min": 0.0,
        "max": 39.65,
        "mean": 4.0962,
        "median": 1.155,
        "p10": 0.0,
        "p25": 0.105,
        "p75": 4.535,
        "p90": 12.601,
    },
    "sodium": {
        "n": 100,
        "min": 1.0,
        "max": 699.0,
        "mean": 273.38,
        "median": 241.0,
        "p10": 95.4,
        "p25": 176.75,
        "p75": 365.5,
        "p90": 458.1,
    },
    "saturated_fat": {
        "n": 100,
        "min": 0.08,
        "max": 15.31,
        "mean": 1.6523,
        "median": 0.82,
        "p10": 0.139,
        "p25": 0.27,
        "p75": 1.655,
        "p90": 4.34,
    },
    "cholesterol": {
        "n": 100,
        "min": 0.0,
        "max": 211.21,
        "mean": 25.6107,
        "median": 15.805,
        "p10": 0.0,
        "p25": 0.0,
        "p75": 42.995,
        "p90": 59.507,
    },
}


class ScoreAnchor(TypedDict):
    """영양소 0~100 점수 변환 앵커 (100g 기준 값)."""

    higher_is_better: bool
    # higher: low→0, high→100 / lower: best→100, worst→0
    low_or_best: float
    high_or_worst: float


SCORE_ANCHORS: dict[str, ScoreAnchor] = {
    "protein": {
        "higher_is_better": True,
        "low_or_best": NUTRIENT_STATS["protein"]["p25"],
        "high_or_worst": NUTRIENT_STATS["protein"]["p90"],
    },
    "calories": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["calories"]["p25"],
        "high_or_worst": NUTRIENT_STATS["calories"]["p90"],
    },
    "carb": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["carb"]["p25"],
        "high_or_worst": NUTRIENT_STATS["carb"]["p90"],
    },
    "fat": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["fat"]["p25"],
        "high_or_worst": NUTRIENT_STATS["fat"]["p90"],
    },
    "sugar": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["sugar"]["p25"],
        "high_or_worst": NUTRIENT_STATS["sugar"]["p90"],
    },
    "sodium": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["sodium"]["p25"],
        "high_or_worst": NUTRIENT_STATS["sodium"]["p90"],
    },
    "saturated_fat": {
        "higher_is_better": False,
        "low_or_best": NUTRIENT_STATS["saturated_fat"]["p25"],
        "high_or_worst": NUTRIENT_STATS["saturated_fat"]["p90"],
    },
    "cholesterol": {
        "higher_is_better": False,
        # p25=0 이라 p10~p90 사용 (전부 0점이 되지 않도록)
        "low_or_best": NUTRIENT_STATS["cholesterol"]["p10"],
        "high_or_worst": NUTRIENT_STATS["cholesterol"]["p90"],
    },
}
