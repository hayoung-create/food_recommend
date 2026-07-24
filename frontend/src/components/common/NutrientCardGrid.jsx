import { formatNutrient } from '../../utils/format'
import {
  getNutrientLevel,
  NUTRIENT_LEVEL_STYLES,
} from '../../utils/nutrientLevel'
import { SurfaceCard } from './SurfaceCard'

const NUTRIENT_META = [
  { key: 'calories', label: '열량', unit: ' kcal', emoji: '🔥' },
  { key: 'carb', label: '탄수화물', unit: ' g', emoji: '🍞' },
  { key: 'protein', label: '단백질', unit: ' g', emoji: '💪' },
  { key: 'fat', label: '지방', unit: ' g', emoji: '🧈' },
  { key: 'sugar', label: '당류', unit: ' g', emoji: '🍬' },
  { key: 'sodium', label: '나트륨', unit: ' mg', emoji: '🧂' },
  { key: 'saturatedFat', label: '포화지방', unit: ' g', emoji: '⚠️' },
  { key: 'cholesterol', label: '콜레스테롤', unit: ' mg', emoji: '❤️' },
]

export function NutrientCardGrid({ nutrition, title = '영양성분 (100g)' }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          🥗
        </span>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {NUTRIENT_META.map((item) => {
          const raw = nutrition?.[item.key]
          const level = getNutrientLevel(item.key, raw)
          const style = NUTRIENT_LEVEL_STYLES[level]
          const display =
            raw === null || raw === undefined || Number.isNaN(Number(raw))
              ? '정보 없음'
              : `${formatNutrient(raw)}${item.unit}`

          return (
            <SurfaceCard
              key={item.key}
              className={`border ${style.card} p-4`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl" aria-hidden>
                  {item.emoji}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}
                >
                  {style.label}
                </span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{item.label}</p>
              <p className={`mt-1 text-xl font-bold ${style.value}`}>{display}</p>
            </SurfaceCard>
          )
        })}
      </div>
    </section>
  )
}
