/**
 * 추천 점수 기여도 가로 막대 (영양성분 g/mg 값은 표시하지 않음).
 * embedded: 패널/모달 안에서 카드·제목 없이 본문만 렌더
 */
export function ScoreBreakdownCard({ breakdown, embedded = false }) {
  const items = breakdown?.items || []
  const finalScore = breakdown?.finalScore

  if (items.length === 0 || finalScore === undefined || finalScore === null) {
    return null
  }

  const maxAbs = Math.max(
    ...items.map((item) => Math.abs(Number(item.points) || 0)),
    0.1,
  )

  const body = (
    <div className="space-y-5">
      <ul className="space-y-4">
        {items.map((item) => {
          const points = Number(item.points) || 0
          const isPenalty = item.kind === 'minus' || points < 0
          const widthPercent = Math.min(
            100,
            (Math.abs(points) / maxAbs) * 100,
          )
          const decimals = points % 1 === 0 ? 0 : 1
          const pointsLabel = isPenalty
            ? `${points.toFixed(decimals)}점`
            : `+${points.toFixed(decimals)}점`

          return (
            <li key={item.key}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink">{item.label}</span>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    isPenalty ? 'text-danger' : 'text-primary'
                  }`}
                >
                  {pointsLabel}
                </span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-secondary-soft"
                role="presentation"
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPenalty ? 'bg-danger' : 'bg-primary'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="border-t border-border/80 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-bold text-ink">최종 추천점수</span>
          <span className="text-2xl font-bold text-primary">{finalScore}점</span>
        </div>
      </div>
    </div>
  )

  if (embedded) return body

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          📊
        </span>
        <h3 className="text-lg font-bold text-ink">추천 근거 분석</h3>
      </div>
      <div className="rounded-card bg-card p-6 shadow-card">{body}</div>
    </section>
  )
}
