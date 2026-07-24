export function EmptyState({
  title = '조건에 맞는 제품이 없습니다.',
  description,
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden>
        🌿
      </span>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
    </div>
  )
}
