export function Badge({ children, className = '', tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-soft text-primary',
    accent: 'bg-accent-soft text-[#E65100]',
    soft: 'bg-secondary-soft text-ink-muted',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${tones[tone] || tones.primary} ${className}`}
    >
      {children}
    </span>
  )
}
