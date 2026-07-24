import { ChevronRight } from 'lucide-react'

const GOAL_EMOJI = {
  diet: '🥗',
  high_protein: '💪',
  low_sodium: '❤️',
  low_sugar: '🍎',
}

export function GoalCard({ goal, selected, onSelect }) {
  const emoji = GOAL_EMOJI[goal.id] || '🌿'

  return (
    <button
      type="button"
      onClick={() => onSelect(goal.id)}
      className={`surface-card surface-card-hover flex min-h-[88px] w-full items-center gap-4 p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected
          ? 'border-primary/40 bg-primary-soft/50 ring-2 ring-primary/20'
          : ''
      }`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary-soft text-2xl shadow-soft">
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-ink">{goal.label}</span>
        <span className="mt-1 block text-sm text-ink-muted">{goal.description}</span>
      </span>
      <ChevronRight
        className={`h-5 w-5 shrink-0 transition ${selected ? 'text-primary' : 'text-ink-muted'}`}
        aria-hidden
      />
    </button>
  )
}
