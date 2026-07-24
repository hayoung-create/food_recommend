import { formatNutrient } from '../../utils/format'

const LEFT_ROWS = [
  { key: 'calories', label: '열량', unit: ' kcal' },
  { key: 'carb', label: '탄수화물', unit: ' g' },
  { key: 'protein', label: '단백질', unit: ' g', highlight: true },
  { key: 'fat', label: '지방', unit: ' g' },
]

const RIGHT_ROWS = [
  { key: 'sugar', label: '당류', unit: ' g' },
  { key: 'sodium', label: '나트륨', unit: ' mg' },
  { key: 'saturatedFat', label: '포화지방', unit: ' g' },
  { key: 'cholesterol', label: '콜레스테롤', unit: ' mg' },
]

function NutrientRow({ label, value, unit, highlight }) {
  const text =
    value === null || value === undefined || Number.isNaN(Number(value))
      ? '정보 없음'
      : `${formatNutrient(value)}${unit}`

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span
        className={`text-sm font-semibold ${highlight ? 'text-primary' : 'text-ink'}`}
      >
        {text}
      </span>
    </div>
  )
}

export function NutritionTable({ nutrition }) {
  return (
    <section className="rounded-card bg-card p-5 shadow-soft">
      <h3 className="text-lg font-bold text-ink">영양성분 (100g 기준)</h3>
      <div className="mt-4 grid gap-x-8 md:grid-cols-2">
        <div>
          {LEFT_ROWS.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={nutrition?.[row.key]}
              unit={row.unit}
              highlight={row.highlight}
            />
          ))}
        </div>
        <div>
          {RIGHT_ROWS.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={nutrition?.[row.key]}
              unit={row.unit}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
