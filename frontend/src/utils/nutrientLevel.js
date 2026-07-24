/**
 * 영양성분 신호등 (100g 기준 대략 가이드).
 * good = 초록, caution = 주황, risk = 빨강
 */
export function getNutrientLevel(key, value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'unknown'
  }
  const v = Number(value)

  switch (key) {
    case 'protein':
      if (v >= 12) return 'good'
      if (v >= 6) return 'caution'
      return 'muted'
    case 'calories':
      if (v <= 100) return 'good'
      if (v <= 200) return 'caution'
      return 'risk'
    case 'fat':
      if (v <= 3) return 'good'
      if (v <= 10) return 'caution'
      return 'risk'
    case 'sugar':
      if (v <= 5) return 'good'
      if (v <= 15) return 'caution'
      return 'risk'
    case 'sodium':
      if (v <= 120) return 'good'
      if (v <= 400) return 'caution'
      return 'risk'
    case 'carb':
      if (v <= 15) return 'good'
      if (v <= 40) return 'caution'
      return 'muted'
    case 'saturatedFat':
      if (v <= 1.5) return 'good'
      if (v <= 5) return 'caution'
      return 'risk'
    case 'cholesterol':
      if (v <= 20) return 'good'
      if (v <= 60) return 'caution'
      return 'risk'
    default:
      return 'muted'
  }
}

export const NUTRIENT_LEVEL_STYLES = {
  good: {
    card: 'border-primary/20 bg-primary-soft/60',
    value: 'text-primary',
    badge: 'bg-primary text-white',
    label: '좋음',
  },
  caution: {
    card: 'border-accent/30 bg-accent-soft',
    value: 'text-[#E65100]',
    badge: 'bg-accent text-ink',
    label: '주의',
  },
  risk: {
    card: 'border-danger/25 bg-danger-soft',
    value: 'text-danger',
    badge: 'bg-danger text-white',
    label: '위험',
  },
  muted: {
    card: 'border-border bg-card',
    value: 'text-ink',
    badge: 'bg-border text-ink-muted',
    label: '보통',
  },
  unknown: {
    card: 'border-border bg-secondary-soft',
    value: 'text-ink-muted',
    badge: 'bg-border text-ink-muted',
    label: '정보 없음',
  },
}
