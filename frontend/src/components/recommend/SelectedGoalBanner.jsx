import { getGoalMeta } from '../../utils/goals'
import { SurfaceCard } from '../common/SurfaceCard'

const GOAL_EMOJI = {
  diet: '🥗',
  high_protein: '💪',
  low_sodium: '❤️',
  low_sugar: '🍎',
}

export function SelectedGoalBanner({ goalId }) {
  const goal = getGoalMeta(goalId)
  const emoji = GOAL_EMOJI[goalId] || '🌿'

  return (
    <SurfaceCard className="flex items-center gap-4 border-primary/10 bg-gradient-to-r from-primary-soft/80 to-card p-5">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-card text-3xl shadow-soft">
        {emoji}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-ink-muted">선택한 목표</p>
        <p className="mt-0.5 text-xl font-bold text-ink">{goal.label}</p>
      </div>
    </SurfaceCard>
  )
}
