/** Radar Chart 표시용 영양 축 (시각화 전용, 추천 알고리즘과 무관) */
export const RADAR_AXES = [
  { key: 'calories', label: '열량' },
  { key: 'carb', label: '탄수화물' },
  { key: 'protein', label: '단백질' },
  { key: 'fat', label: '지방' },
  { key: 'sugar', label: '당류' },
  { key: 'sodium', label: '나트륨' },
  { key: 'saturatedFat', label: '포화지방' },
  { key: 'cholesterol', label: '콜레스테롤' },
]

export const RADAR_COLORS = [
  { border: '#2E7D32', fill: 'rgba(46, 125, 50, 0.22)' },
  { border: '#81C784', fill: 'rgba(129, 199, 132, 0.22)' },
  { border: '#FFB74D', fill: 'rgba(255, 183, 77, 0.25)' },
]

const RADAR_MAX_PRODUCTS = 3

function readNutrient(product, key) {
  const raw = product.nutrition?.[key] ?? product[key]
  if (raw === null || raw === undefined || Number.isNaN(Number(raw))) {
    return null
  }
  return Number(raw)
}

/**
 * 추천 점수 상위 N개 (Radar 가독성용).
 * 동점이면 기존 선택 순서 유지.
 */
export function pickTopProductsForRadar(products, limit = RADAR_MAX_PRODUCTS) {
  if (!products?.length) return []
  return [...products]
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      const scoreDiff =
        (b.product.recommendScore ?? 0) - (a.product.recommendScore ?? 0)
      if (scoreDiff !== 0) return scoreDiff
      return a.index - b.index
    })
    .slice(0, limit)
    .map((entry) => entry.product)
}

/**
 * 축별 Min-Max 정규화 (0~100). 비교 대상 제품 집합 기준.
 * null은 0으로 표시.
 */
export function buildRadarNormalizedSeries(products) {
  const labels = RADAR_AXES.map((axis) => axis.label)

  const ranges = RADAR_AXES.map((axis) => {
    const values = products
      .map((product) => readNutrient(product, axis.key))
      .filter((value) => value !== null)
    if (!values.length) return { min: 0, max: 0 }
    return { min: Math.min(...values), max: Math.max(...values) }
  })

  const series = products.map((product) => ({
    id: product.id,
    name: product.name,
    values: RADAR_AXES.map((axis, axisIndex) => {
      const value = readNutrient(product, axis.key)
      if (value === null) return 0
      const { min, max } = ranges[axisIndex]
      if (max === min) return 50
      return ((value - min) / (max - min)) * 100
    }),
  }))

  return { labels, series }
}

export function hexToRgba(hex, alpha) {
  const cleaned = hex.replace('#', '')
  const r = Number.parseInt(cleaned.slice(0, 2), 16)
  const g = Number.parseInt(cleaned.slice(2, 4), 16)
  const b = Number.parseInt(cleaned.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
