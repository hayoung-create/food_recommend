export function SurfaceCard({
  children,
  className = '',
  hover = true,
  as: Tag = 'div',
  ...props
}) {
  return (
    <Tag
      className={`surface-card ${hover ? 'surface-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
