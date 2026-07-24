import { formatNutrient } from '../../utils/format'

const ROWS = [
  { key: 'name', label: '제품명', type: 'text' },
  { key: 'category', label: '식품분류', type: 'text' },
  { key: 'rankScore', label: '추천', type: 'rank' },
  { key: 'calories', label: '칼로리', unit: ' kcal', type: 'nutrient' },
  { key: 'carb', label: '탄수화물', unit: ' g', type: 'nutrient' },
  { key: 'protein', label: '단백질', unit: ' g', type: 'nutrient' },
  { key: 'fat', label: '지방', unit: ' g', type: 'nutrient' },
  { key: 'sugar', label: '당류', unit: ' g', type: 'nutrient' },
  { key: 'sodium', label: '나트륨', unit: ' mg', type: 'nutrient' },
]

function cellValue(product, row) {
  if (row.type === 'text') {
    if (row.key === 'name') return product.name || '—'
    if (row.key === 'category') return product.category || '분류 없음'
  }
  if (row.type === 'rank') {
    const score = product.recommendScore ?? '—'
    const rank = product.rank ? `추천 ${product.rank}위` : '순위 정보 없음'
    return { score: `${score}점`, rank }
  }
  const raw = product.nutrition?.[row.key]
  if (raw === null || raw === undefined || Number.isNaN(Number(raw))) {
    return '정보 없음'
  }
  return `${formatNutrient(raw)}${row.unit}`
}

export function CompareTable({ products }) {
  if (!products?.length) return null

  return (
    <section className="surface-card p-6">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          🥗
        </span>
        <h2 className="text-lg font-bold text-ink">영양성분 비교</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        100g 기준 · 가로로 스크롤할 수 있습니다.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[7rem] bg-card px-3 py-3 text-left font-semibold text-ink-muted"
              >
                항목
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  scope="col"
                  className="min-w-[9rem] px-3 py-3 text-left font-semibold text-ink"
                >
                  <span className="line-clamp-2">{product.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-t border-border/70">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-3 py-3 text-left font-medium text-ink-muted"
                >
                  {row.label}
                </th>
                {products.map((product) => {
                  const value = cellValue(product, row)
                  return (
                    <td key={product.id} className="px-3 py-3 text-ink">
                      {row.type === 'rank' ? (
                        <span className="block">
                          <span className="block font-bold text-primary">
                            {value.score}
                          </span>
                          <span className="text-xs text-ink-muted">{value.rank}</span>
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
