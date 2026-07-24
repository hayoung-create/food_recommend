export function PageContainer({
  children,
  className = '',
  id,
  as = 'main',
}) {
  const Tag = as

  return (
    <Tag
      id={id}
      className={`mx-auto w-full max-w-content px-4 py-6 sm:py-8 md:px-8 md:py-12 ${className}`}
    >
      {children}
    </Tag>
  )
}
