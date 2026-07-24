/**
 * 식품분류 2단 칩 (대분류 → 중분류).
 * selectedCategory / selectedCategory2: null 이면 해당 단계 "전체".
 */
export function CategoryChips({
  categories = [],
  selectedCategory,
  selectedCategory2,
  onSelectCategory,
  onSelectCategory2,
  loading = false,
  error = null,
}) {
  if (loading) {
    return (
      <p className="text-sm text-ink-muted" aria-live="polite">
        식품분류를 불러오는 중…
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-danger" role="alert">
        {error}
      </p>
    )
  }

  const majorChips = [
    { id: null, label: '전체' },
    ...categories.map((item) => ({
      id: item.name,
      label: item.count ? `${item.name} (${item.count})` : item.name,
    })),
  ]

  const selectedMajor = categories.find((item) => item.name === selectedCategory)
  const childItems = selectedMajor?.children || []
  const showSub = Boolean(selectedCategory) && childItems.length > 0

  const subChips = [
    { id: null, label: '중분류 전체' },
    ...childItems.map((item) => ({
      id: item.name,
      label: item.count ? `${item.name} (${item.count})` : item.name,
    })),
  ]

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-sm font-semibold text-ink">식품 대분류</p>
        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
          role="listbox"
          aria-label="식품 대분류 선택"
        >
          {majorChips.map((chip) => {
            const selected = selectedCategory === chip.id
            return (
              <button
                key={chip.id ?? 'all-major'}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => onSelectCategory?.(chip.id)}
                className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  selected
                    ? 'border-primary/40 bg-primary-soft text-primary shadow-soft'
                    : 'border-border bg-card text-ink hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
      </div>

      {showSub ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-ink">식품 중분류</p>
          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
            role="listbox"
            aria-label="식품 중분류 선택"
          >
            {subChips.map((chip) => {
              const selected = selectedCategory2 === chip.id
              return (
                <button
                  key={chip.id ?? 'all-sub'}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectCategory2?.(chip.id)}
                  className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    selected
                      ? 'border-primary/40 bg-primary-soft text-primary shadow-soft'
                      : 'border-border bg-card text-ink hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft'
                  }`}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
