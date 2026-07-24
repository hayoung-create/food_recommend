import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchGoals } from '../api'
import heroHealthyBowl from '../assets/hero-healthy-bowl.png'
import { Button } from '../components/common/Button'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { GoalCard } from '../components/home/GoalCard'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'
import { FALLBACK_GOALS, GOAL_META } from '../utils/goals'

export default function HomePage() {
  const navigate = useNavigate()
  const [goals, setGoals] = useState(FALLBACK_GOALS)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadGoals = () => {
    setLoading(true)
    setError(null)
    fetchGoals()
      .then((data) => {
        const items = (data.items || []).map((goal) => {
          const meta = GOAL_META[goal.id]
          return {
            id: goal.id,
            label: goal.label || meta?.label || goal.id,
            description: goal.description || meta?.description || '',
            Icon: meta?.Icon || FALLBACK_GOALS[0].Icon,
          }
        })
        setGoals(items.length ? items : FALLBACK_GOALS)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleRecommend = () => {
    if (!selectedGoal) return
    navigate(`/recommend?goal=${selectedGoal}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[360px] overflow-hidden md:min-h-[460px]">
        <img
          src={heroHealthyBowl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30"
          aria-hidden
        />
        <div className="relative z-10">
          <Header tone="hero" />
          <PageContainer id="main-content" className="pb-16 pt-10 md:pb-24 md:pt-14">
            <div className="max-w-xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur">
                <span aria-hidden>🍎</span> Health Tech Food Guide
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
                건강 목표에 맞는
                <br />
                가공식품을 골라보세요
              </h2>
              <p className="mt-4 max-w-md text-base text-ink-muted md:text-lg">
                영양 점수로 비교하고, 더 합리적인 선택을 도와드립니다.
              </p>
            </div>
          </PageContainer>
        </div>
      </section>

      <PageContainer as="div" className="space-y-8 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Step 1</p>
            <h3 className="mt-1 text-2xl font-bold text-ink">
              건강 목표를 선택하세요
            </h3>
          </div>
          <span className="hidden text-3xl sm:inline" aria-hidden>
            🥗
          </span>
        </div>

        {loading ? <Spinner label="목표 목록을 불러오는 중…" /> : null}
        {error ? <ErrorState message={error} onRetry={loadGoals} /> : null}

        {!loading && !error ? (
          <div className="flex flex-col gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                selected={selectedGoal === goal.id}
                onSelect={setSelectedGoal}
              />
            ))}
          </div>
        ) : null}

        <Button disabled={!selectedGoal} onClick={handleRecommend}>
          추천받기
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Button>
      </PageContainer>
    </div>
  )
}
