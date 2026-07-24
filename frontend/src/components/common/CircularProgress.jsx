/** Health Score 원형 프로그레스 (0–100) */
export function CircularProgress({
  value = 0,
  size = 140,
  stroke = 10,
  label = 'Health Score',
  emoji = '❤️',
}) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safe / 100) * circumference

  const tone =
    safe >= 80 ? '#2E7D32' : safe >= 60 ? '#81C784' : safe >= 40 ? '#FFB74D' : '#EF5350'

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8F5E9"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg" aria-hidden>
          {emoji}
        </span>
        <span className="text-3xl font-bold tracking-tight text-ink">{safe}</span>
        <span className="text-[11px] font-medium text-ink-muted">{label}</span>
      </div>
    </div>
  )
}
