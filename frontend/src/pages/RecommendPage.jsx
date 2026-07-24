import { Info } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchRecommendations } from '../api'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Pagination } from '../components/common/Pagination'
import { Spinner } from '../components/common/Spinner'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'
import { CategoryChips } from '../components/recommend/CategoryChips'
import { ProductCard } from '../components/recommend/ProductCard'
import { SelectedGoalBanner } from '../components/recommend/SelectedGoalBanner'
import { GOAL_META } from '../utils/goals'

const MAX_COMPARE = 5
const PAGE_SIZE = 10

export default function RecommendPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const goal = searchParams.get('goal')
  const category = searchParams.get('category')
  const category2 = searchParams.get('category2')
  const pageParam = Number(searchParams.get('page') || '1')
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? pageParam : 1
  const isValidGoal = Boolean(goal && GOAL_META[goal])

  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState(null)

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [lowSampleWarning, setLowSampleWarning] = useState(false)
  const [recoLoading, setRecoLoading] = useState(false)
  const [recoError, setRecoError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  const [selectedIds, setSelectedIds] = useState([])
  const [limitMessage, setLimitMessage] = useState(null)

  const scopeLabel = category2
    ? `「${category} › ${category2}」`
    : category
      ? `「${category}」`
      : null

  // 목표가 바뀌면 비교 선택 초기화 (분류·페이지 변경 시에는 최대 5개까지 유지)
  useEffect(() => {
    setSelectedIds([])
    setLimitMessage(null)
  }, [goal])

  useEffect(() => {
    if (!isValidGoal) return

    let cancelled = false
    setCategoriesLoading(true)
    setCategoriesError(null)

    fetchCategories()
      .then((data) => {
        if (cancelled) return
        setCategories(data.items || [])
      })
      .catch((err) => {
        if (cancelled) return
        setCategoriesError(err.message)
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isValidGoal])

  useEffect(() => {
    if (!isValidGoal) return

    let cancelled = false
    setRecoLoading(true)
    setRecoError(null)

    fetchRecommendations(goal, category || undefined, {
      category2: category2 || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then((data) => {
        if (cancelled) return
        setItems(data.items || [])
        setTotal(data.total ?? 0)
        setTotalPages(data.totalPages ?? 0)
        setLowSampleWarning(Boolean(data.lowSampleWarning))
      })
      .catch((err) => {
        if (cancelled) return
        setRecoError(err.message)
        setItems([])
        setTotal(0)
        setTotalPages(0)
        setLowSampleWarning(false)
      })
      .finally(() => {
        if (!cancelled) setRecoLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isValidGoal, goal, category, category2, page, retryKey])

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      const next = new URLSearchParams(searchParams)
      next.delete('page')
      setSearchParams(next, { replace: true })
    }
  }, [page, totalPages, searchParams, setSearchParams])

  const handleSelectCategory = useCallback(
    (nextCategory) => {
      const next = new URLSearchParams(searchParams)
      if (nextCategory) {
        next.set('category', nextCategory)
      } else {
        next.delete('category')
      }
      next.delete('category2')
      next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const handleSelectCategory2 = useCallback(
    (nextCategory2) => {
      const next = new URLSearchParams(searchParams)
      if (nextCategory2) {
        next.set('category2', nextCategory2)
      } else {
        next.delete('category2')
      }
      next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const handlePageChange = useCallback(
    (nextPage) => {
      const next = new URLSearchParams(searchParams)
      if (nextPage <= 1) {
        next.delete('page')
      } else {
        next.set('page', String(nextPage))
      }
      setSearchParams(next, { replace: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [searchParams, setSearchParams],
  )

  const handleToggleSelect = useCallback((productId) => {
    const id = Number(productId)
    if (!Number.isFinite(id)) return

    setSelectedIds((prev) => {
      const exists = prev.some((value) => Number(value) === id)
      if (exists) {
        setLimitMessage(null)
        return prev.filter((value) => Number(value) !== id)
      }
      if (prev.length >= MAX_COMPARE) {
        setLimitMessage(`비교는 최대 ${MAX_COMPARE}개까지 선택할 수 있습니다.`)
        return prev
      }
      setLimitMessage(null)
      return [...prev, id]
    })
  }, [])

  const handleCompare = () => {
    if (selectedIds.length < 1) return
    const params = new URLSearchParams({
      goal,
      ids: selectedIds.join(','),
    })
    if (category) params.set('category', category)
    if (category2) params.set('category2', category2)
    navigate(`/compare?${params}`)
  }

  const atLimit = selectedIds.length >= MAX_COMPARE

  return (
    <div className="min-h-screen bg-background">
      <Header title="추천 결과" showBack showHome />
      <PageContainer id="main-content" className="space-y-6 pb-28">
        {!isValidGoal ? (
          <ErrorState message="건강 목표를 선택해 주세요." />
        ) : (
          <>
            <SelectedGoalBanner goalId={goal} />

            <CategoryChips
              categories={categories}
              selectedCategory={category}
              selectedCategory2={category2}
              onSelectCategory={handleSelectCategory}
              onSelectCategory2={handleSelectCategory2}
              loading={categoriesLoading}
              error={categoriesError}
            />

            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink">추천 제품</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    점수가 높을수록 목표에 더 적합한 제품입니다. 한 페이지에{' '}
                    {PAGE_SIZE}개씩 표시됩니다.
                    {scopeLabel
                      ? ` ${scopeLabel} 분류 제품만 대상으로 정렬합니다.`
                      : ' 전체 식품을 대상으로 정렬합니다.'}
                  </p>
                </div>
                <p
                  className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary"
                  aria-live="polite"
                >
                  비교 {selectedIds.length} / {MAX_COMPARE} 선택
                </p>
              </div>

              {limitMessage ? (
                <div
                  className="rounded-card border border-warning/40 bg-card px-4 py-3 text-sm text-ink"
                  role="status"
                >
                  {limitMessage}
                </div>
              ) : null}

              {lowSampleWarning ? (
                <div
                  className="flex items-start gap-2 rounded-card border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-ink"
                  role="status"
                >
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <p>
                    해당 분류 제품 수가 적어 비교 결과가 제한적일 수 있습니다.
                  </p>
                </div>
              ) : null}

              {recoLoading ? <Spinner label="추천 결과를 불러오는 중…" /> : null}

              {!recoLoading && recoError ? (
                <ErrorState
                  message={recoError}
                  onRetry={() => setRetryKey((key) => key + 1)}
                />
              ) : null}

              {!recoLoading && !recoError && items.length === 0 ? (
                <EmptyState
                  title="추천 결과가 없습니다."
                  description="다른 식품분류를 선택해 보세요."
                />
              ) : null}

              {!recoLoading && !recoError && items.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {items.map((product) => (
                      <li key={product.id}>
                        <ProductCard
                          product={product}
                          goal={goal}
                          category={category || undefined}
                          category2={category2 || undefined}
                          selectable
                          selected={selectedIds.some(
                            (value) => Number(value) === Number(product.id),
                          )}
                          onToggleSelect={handleToggleSelect}
                          selectDisabled={atLimit}
                        />
                      </li>
                    ))}
                  </ul>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                  />
                </>
              ) : null}
            </section>

            <div className="flex items-start gap-2 rounded-card border border-border bg-card px-4 py-3 text-sm text-ink-muted shadow-card">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p>
                추천 목록은 전체 점수순이며, 제품 비교는 최대 {MAX_COMPARE}개까지
                선택할 수 있습니다.
                {scopeLabel
                  ? ` ${scopeLabel} 분류 제품만 대상으로 비교·정렬합니다.`
                  : ' 전체 식품을 대상으로 비교·정렬합니다.'}
              </p>
            </div>
          </>
        )}
      </PageContainer>

      {isValidGoal ? (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/90 p-4 backdrop-blur-md">
          <div className="mx-auto max-w-content">
            <Button
              disabled={selectedIds.length < 1}
              onClick={handleCompare}
            >
              제품 비교하기
              {selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
