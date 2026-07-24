export function Pagination({ page, totalPages, total, pageSize, onChange }) {
  if (totalPages <= 1) return null

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav
      className="surface-card flex flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between"
      aria-label="추천 목록 페이지"
    >
      <p className="text-sm text-ink-muted">
        전체 {total}개 중 {from}–{to}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="inline-flex min-h-11 items-center justify-center rounded-button border border-border bg-card px-4 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          이전
        </button>
        <span className="min-w-[5rem] text-center text-sm font-semibold text-ink">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="inline-flex min-h-11 items-center justify-center rounded-button border border-border bg-card px-4 text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          다음
        </button>
      </div>
    </nav>
  )
}
