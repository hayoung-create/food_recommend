/**
 * 식품분류 칩 목록.
 * selectedCategory: null이면 "전체" 선택.
 */
export function CategoryChips({
  categories,
  selectedCategory,
  onSelect,
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

  const chips = [{ id: null, label: '전체' }, ...categories.map((name) => ({ id: name, label: name }))]

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink">식품분류</p>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible"
        role="listbox"
        aria-label="식품분류 선택"
      >
        {chips.map((chip) => {
          const selected = selectedCategory === chip.id
          return (
            <button
              key={chip.id ?? 'all'}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(chip.id)}
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
  )
}
