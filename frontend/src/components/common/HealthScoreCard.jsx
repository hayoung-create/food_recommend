import { CircularProgress } from './CircularProgress'
import { SurfaceCard } from './SurfaceCard'
import { getGoalMeta } from '../../utils/goals'

function scoreCaption(score, goalId) {
  const label = getGoalMeta(goalId).label
  if (score >= 80) return `${label}에 아주 잘 맞아요`
  if (score >= 60) return `${label}에 잘 맞는 편이에요`
  return `${label} 기준으로 참고해 보세요`
}

export function HealthScoreCard({ score, goalId, rank, scopeLabel }) {
  return (
    <SurfaceCard className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center sm:gap-8">
      <CircularProgress value={score} emoji="❤️" label="Health Score" />
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="text-sm font-medium text-ink-muted">추천 적합도</p>
        <h3 className="mt-1 text-2xl font-bold text-ink">
          {scoreMessageTitle(score)}
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          {scoreCaption(score, goalId)}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          {rank ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              🏆 추천 {rank}위
            </span>
          ) : null}
          {scopeLabel ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-3 py-1.5 text-xs font-medium text-ink-muted">
              🌿 {scopeLabel}
            </span>
          ) : null}
        </div>
      </div>
    </SurfaceCard>
  )
}

function scoreMessageTitle(score) {
  if (score >= 80) return '우수한 선택'
  if (score >= 60) return '좋은 선택'
  if (score >= 40) return '보통 수준'
  return '신중히 선택'
}
