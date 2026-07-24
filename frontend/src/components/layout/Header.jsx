import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Search } from 'lucide-react'

/**
 * tone: default | soft | hero
 */
export function Header({
  title,
  showBack = false,
  showHome = false,
  showSearch = true,
  tone = 'default',
}) {
  const navigate = useNavigate()
  const bgClass =
    tone === 'soft'
      ? 'bg-secondary-soft/90 backdrop-blur-md'
      : tone === 'hero'
        ? 'bg-white/70 backdrop-blur-md'
        : 'bg-white/90 backdrop-blur-md'

  const iconBtn =
    'flex h-11 w-11 items-center justify-center rounded-full text-ink transition duration-300 ease-out hover:bg-primary-soft hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

  return (
    <header className={`sticky top-0 z-20 border-b border-border/50 ${bgClass}`}>
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-4 md:px-8">
        <div className="flex min-w-[72px] items-center gap-2">
          {showBack ? (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => navigate(-1)}
              className={iconBtn}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-2 transition duration-300 hover:opacity-80"
              aria-label="NutriPick 홈"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-soft text-lg">
                🌿
              </span>
              <span className="text-lg font-bold tracking-tight text-ink">
                NutriPick
              </span>
            </Link>
          )}
        </div>

        {title ? (
          <h1 className="truncate text-center text-base font-semibold text-ink">
            {title}
          </h1>
        ) : (
          <span className="sr-only">NutriPick</span>
        )}

        <div className="flex min-w-[72px] items-center justify-end gap-1">
          {showHome ? (
            <button
              type="button"
              aria-label="홈"
              onClick={() => navigate('/')}
              className={iconBtn}
            >
              <Home className="h-5 w-5" />
            </button>
          ) : null}
          {showSearch ? (
            <button
              type="button"
              aria-label="검색"
              onClick={() => navigate('/search')}
              className={iconBtn}
            >
              <Search className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
