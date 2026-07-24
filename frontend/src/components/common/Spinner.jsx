export function Spinner({ label = '불러오는 중…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary-soft border-t-primary"
        aria-hidden
      />
      <p className="text-sm">{label}</p>
    </div>
  )
}
