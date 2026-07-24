export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
}) {
  const base =
    'inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-button px-5 text-base font-semibold transition duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-primary text-white shadow-soft hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-softHover',
    secondary:
      'border border-border bg-card text-ink hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft',
    soft: 'bg-primary-soft text-primary hover:-translate-y-0.5 hover:bg-primary/10',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  )
}
