/** null/undefined → 표시용 대체 문구 */
export function formatNutrient(value, unit = '', fallback = '정보 없음') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback
  }
  const num = Number(value)
  const text = Number.isInteger(num) ? String(num) : String(Math.round(num * 10) / 10)
  return unit ? `${text}${unit}` : text
}

export function formatCalories(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '정보 없음'
  }
  return `${formatNutrient(value)} kcal`
}

export function formatProtein(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '단백질 정보 없음'
  }
  return `단백질 ${formatNutrient(value, 'g')}`
}

export function formatFat(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '지방 정보 없음'
  }
  return `지방 ${formatNutrient(value, 'g')}`
}
