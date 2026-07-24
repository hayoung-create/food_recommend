import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchProduct } from '../api'
import { ErrorState } from '../components/common/ErrorState'
import { HealthScoreCard } from '../components/common/HealthScoreCard'
import { NutrientCardGrid } from '../components/common/NutrientCardGrid'
import { Spinner } from '../components/common/Spinner'
import { SurfaceCard } from '../components/common/SurfaceCard'
import { NutritionChart } from '../components/detail/NutritionChart'
import { ProductSummary } from '../components/detail/ProductSummary'
import { ReasonList } from '../components/detail/ReasonList'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'

export default function DetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const goal = searchParams.get('goal') || 'diet'
  const category = searchParams.get('category')

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProduct(id, goal, category || undefined)
      .then((data) => {
        if (cancelled) return
        setProduct(data)
      })
      .catch((err) => {
        if (cancelled) return
        setProduct(null)
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, goal, category, retryKey])

  const scopeLabel = product?.scoreScopeCategory
    ? `「${product.scoreScopeCategory}」 분류 기준`
    : '전체 식품 기준'

  return (
    <div className="min-h-screen bg-background">
      <Header title="제품 상세" showBack showSearch={false} />
      <PageContainer id="main-content" className="space-y-8 pb-14">
        {loading ? <Spinner label="제품 정보를 불러오는 중…" /> : null}

        {!loading && error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetryKey((key) => key + 1)}
          />
        ) : null}

        {!loading && !error && product ? (
          <>
            <ProductSummary product={product} />
            <HealthScoreCard
              score={product.recommendScore}
              goalId={product.goal}
              scopeLabel={scopeLabel}
            />
            <NutrientCardGrid nutrition={product.nutrition} />
            <NutritionChart
              chart={product.chart}
              categoryName={product.scoreScopeCategory || product.category}
            />
            <ReasonList reasons={product.reasons} />
            <SurfaceCard hover={false} className="bg-secondary-soft/60 text-sm text-ink-muted">
              💡 신호등 색상은 100g 기준 일반적인 영양 가이드로, 개인 건강 상태를
              대체하지 않습니다.
            </SurfaceCard>
          </>
        ) : null}
      </PageContainer>
    </div>
  )
}
