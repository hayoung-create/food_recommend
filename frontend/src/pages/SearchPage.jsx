import { Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchCategories, searchProducts } from '../api'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Spinner } from '../components/common/Spinner'
import { Header } from '../components/layout/Header'
import { PageContainer } from '../components/layout/PageContainer'
import { SearchResultCard } from '../components/search/SearchResultCard'

const MAX_COMPARE = 5
const DEFAULT_GOAL = 'diet'

const selectClassName =
  'h-14 w-full rounded-input border border-border bg-card px-4 text-base text-ink shadow-card transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-48'

function buildSearchParams(q, category) {
  const params = {}
  if (q) params.q = q
  if (category) params.category = category
  return params
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const qParam = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || ''

  const [input, setInput] = useState(qParam)
  const [category, setCategory] = useState(categoryParam)
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(
    Boolean(qParam.trim() || categoryParam),
  )
  const [retryKey, setRetryKey] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [limitMessage, setLimitMessage] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setInput(qParam)
    setCategory(categoryParam)
  }, [qParam, categoryParam])

  useEffect(() => {
    let cancelled = false
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data.items || [])
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const q = qParam.trim()
    const cat = categoryParam

    if (!q && !cat) {
      setItems([])
      setError(null)
      setLoading(false)
      setSearched(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setSearched(true)

    searchProducts(q || undefined, cat || undefined)
      .then((data) => {
        if (cancelled) return
        setItems(data.items || [])
      })
      .catch((err) => {
        if (cancelled) return
        setItems([])
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [qParam, categoryParam, retryKey])

  const applySearch = (nextQ, nextCategory) => {
    const params = buildSearchParams(nextQ, nextCategory)
    if (!params.q && !params.category) {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams(params, { replace: true })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    applySearch(input.trim(), category)
  }

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value
    setCategory(nextCategory)
    applySearch(input.trim(), nextCategory)
  }

  const handleToggleSelect = useCallback((productId) => {
    setSelectedIds((prev) => {
      if (prev.includes(productId)) {
        setLimitMessage(null)
        return prev.filter((id) => id !== productId)
      }
      if (prev.length >= MAX_COMPARE) {
        setLimitMessage(`비교는 최대 ${MAX_COMPARE}개까지 선택할 수 있습니다.`)
        return prev
      }
      setLimitMessage(null)
      return [...prev, productId]
    })
  }, [])

  const handleCompare = () => {
    if (selectedIds.length < 1) return
    const params = new URLSearchParams({
      goal: DEFAULT_GOAL,
      ids: selectedIds.join(','),
    })
    if (categoryParam) params.set('category', categoryParam)
    navigate(`/compare?${params}`)
  }

  const atLimit = selectedIds.length >= MAX_COMPARE

  return (
    <div className="min-h-screen bg-background">
      <Header title="검색" showBack showSearch={false} />
      <PageContainer id="main-content" className="space-y-6 pb-28">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        >
          <label htmlFor="product-search" className="sr-only">
            식품명 검색
          </label>
          <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
              aria-hidden
            />
            <input
              ref={inputRef}
              id="product-search"
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="식품명 (선택) 또는 분류만 선택"
              autoComplete="off"
              className="h-14 w-full rounded-input border border-border bg-card pl-12 pr-4 text-base text-ink shadow-card transition duration-300 placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
          </div>

          <label htmlFor="search-category" className="sr-only">
            식품분류 필터
          </label>
          <select
            id="search-category"
            value={category}
            onChange={handleCategoryChange}
            className={selectClassName}
          >
            <option value="">전체 분류</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex h-14 min-h-14 w-full shrink-0 items-center justify-center rounded-button bg-primary px-5 text-base font-semibold text-white transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-[88px] sm:w-auto"
          >
            검색
          </button>
        </form>

        {loading ? <Spinner label="검색 중…" /> : null}

        {!loading && error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetryKey((key) => key + 1)}
          />
        ) : null}

        {!loading && !error && !searched ? (
          <EmptyState
            title="식품명 또는 분류로 찾아보세요"
            description="분류만 선택해도 해당 식품 목록을 볼 수 있습니다."
          />
        ) : null}

        {!loading && !error && searched && items.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다"
            description="다른 식품명이나 분류로 다시 검색해 보세요."
          />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                검색 결과 {items.length}건
                {categoryParam ? ` · ${categoryParam}` : ''}
                {qParam ? ` · “${qParam}”` : ''}
              </p>
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

            <ul className="space-y-3">
              {items.map((product) => (
                <li key={product.id}>
                  <SearchResultCard
                    product={product}
                    goal={DEFAULT_GOAL}
                    selectable
                    selected={selectedIds.includes(product.id)}
                    onToggleSelect={handleToggleSelect}
                    selectDisabled={atLimit}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </PageContainer>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-card/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-content">
          <Button disabled={selectedIds.length < 1} onClick={handleCompare}>
            제품 비교하기
            {selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}
