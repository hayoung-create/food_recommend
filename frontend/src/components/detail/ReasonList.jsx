import { CircleCheck } from 'lucide-react'
import { SurfaceCard } from '../common/SurfaceCard'

export function ReasonList({ reasons }) {
  const items = reasons?.length
    ? reasons
    : ['종합적인 영양 균형을 고려하여 추천되었습니다.']

  return (
    <SurfaceCard className="p-6">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          💪
        </span>
        <h3 className="text-lg font-bold text-ink">추천 이유</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((reason, index) => (
          <li
            key={`${index}-${reason}`}
            className="flex items-start gap-3 rounded-2xl bg-secondary-soft/70 px-4 py-3"
          >
            <CircleCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <span className="text-sm leading-relaxed text-ink">{reason}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  )
}
