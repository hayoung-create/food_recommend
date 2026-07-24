import { getGoalMeta } from './goals'

/** 건강 목표별 Scatter 축 설정 */
export const COMPARE_AXIS_BY_GOAL = {
  diet: {
    xKey: 'calories',
    yKey: 'protein',
    xLabel: '칼로리 (kcal)',
    yLabel: '단백질 (g)',
    insight:
      '왼쪽 위에 위치한 제품일수록 저칼로리·고단백 특성을 가집니다.',
  },
  high_protein: {
    xKey: 'fat',
    yKey: 'protein',
    xLabel: '지방 (g)',
    yLabel: '단백질 (g)',
    insight:
      '왼쪽 위에 위치한 제품일수록 저지방·고단백 특성을 가집니다.',
  },
  low_sodium: {
    xKey: 'sodium',
    yKey: 'protein',
    xLabel: '나트륨 (mg)',
    yLabel: '단백질 (g)',
    insight:
      '왼쪽 위에 위치한 제품일수록 저나트륨·고단백 특성을 가집니다.',
  },
  low_sugar: {
    xKey: 'sugar',
    yKey: 'protein',
    xLabel: '당류 (g)',
    yLabel: '단백질 (g)',
    insight:
      '왼쪽 위에 위치한 제품일수록 저당·고단백 특성을 가집니다.',
  },
}

export function getCompareAxis(goalId) {
  return COMPARE_AXIS_BY_GOAL[goalId] || COMPARE_AXIS_BY_GOAL.diet
}

export function getCompareGoalLabel(goalId) {
  return getGoalMeta(goalId).label
}

/** Scatter용 영양 값 (null → null 유지) */
export function nutrientValue(product, key) {
  const nutrition = product.nutrition || {}
  const value = nutrition[key] ?? product[key]
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null
  }
  return Number(value)
}
