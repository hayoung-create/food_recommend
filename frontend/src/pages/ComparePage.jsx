import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProduct, fetchRecommendations } from '../api'
import { CompareRadar } from '../components/compare/CompareRadar'
import { CompareScatter } from '../components/compare/CompareScatter'
import { CompareTable } from '../components/compare/CompareTable'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'
import { getCompareGoalLabel } from '../utils/compare'
import { GOAL_META } from '../utils/goals'

function parseIds(raw) {
  if (!raw) return []
  return raw
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
    .slice(0, 5)
}

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const goal = searchParams.get('goal') || 'diet'
  const category = searchParams.get('category') || undefined
  const idsParam = searchParams.get('ids') || ''
  const ids = useMemo(() => parseIds(idsParam), [idsParam])

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  const isValidGoal = Boolean(GOAL_META[goal])
  const backQuery = new URLSearchParams({ goal })
  if (category) backQuery.set('category', category)

  useEffect(() => {
    if (!isValidGoal || ids.length === 0) {
      setLoading(false)
      setProducts([])
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetchRecommendations(goal, category, { page: 1, pageSize: 500 }),
      Promise.all(ids.map((id) => fetchProduct(id, goal, category))),
    ])
      .then(([reco, details]) => {
        if (cancelled) return
        const rankMap = new Map(
          (reco.items || []).map((item) => [
            item.id,
            { rank: item.rank, recommendScore: item.recommendScore },
          ]),
        )
        const order = new Map(ids.map((id, index) => [id, index]))
        const merged = details
          .map((detail) => {
            const meta = rankMap.get(detail.id)
            return {
              ...detail,
              rank: meta?.rank ?? detail.rank,
              recommendScore: meta?.recommendScore ?? detail.recommendScore,
            }
          })
          .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
        setProducts(merged)
      })
      .catch((err) => {
        if (cancelled) return
        setProducts([])
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [goal, category, ids, retryKey, isValidGoal])

  return (
    <div className="min-h-screen bg-background">
      <Header title="제품 비교" showBack showHome showSearch={false} />
      <PageContainer id="main-content" className="space-y-6 pb-10">
        {!isValidGoal ? (
          <ErrorState message="건강 목표를 선택해 주세요." />
        ) : null}

        {isValidGoal && ids.length === 0 ? (
          <EmptyState
            title="비교할 제품이 없습니다"
            description="추천 결과에서 제품을 선택한 뒤 다시 시도해 주세요."
          />
        ) : null}

        {isValidGoal && ids.length > 0 && loading ? (
          <Spinner label="비교 데이터를 불러오는 중…" />
        ) : null}

        {isValidGoal && ids.length > 0 && !loading && error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetryKey((key) => key + 1)}
          />
        ) : null}

        {isValidGoal && ids.length > 0 && !loading && !error ? (
          <>
            <section className="surface-card p-6">
              <p className="text-sm font-medium text-primary">Compare</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">
                {getCompareGoalLabel(goal)} 비교
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                선택한 {products.length}개 제품의 영양성분을 나란히 비교합니다.
                {category ? ` (분류: ${category})` : ''}
              </p>
              <Link
                to={`/recommend?${backQuery}`}
                className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                추천 결과로 돌아가기
              </Link>
            </section>

            <CompareTable products={products} />
            <CompareScatter products={products} goal={goal} />
            <CompareRadar products={products} />
          </>
        ) : null}
      </PageContainer>
    </div>
  )
}
