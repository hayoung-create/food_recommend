import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  formatCalories,
  formatFat,
  formatProtein,
} from '../../utils/format'
import { CompareCheckbox } from '../common/CompareCheckbox'
import { FoodImage } from '../common/FoodImage'

const RANK_STYLES = {
  1: 'bg-accent text-ink',
  2: 'bg-border text-ink-muted',
  3: 'bg-primary-soft text-primary',
}

function rankClass(rank) {
  return RANK_STYLES[rank] || 'bg-secondary-soft text-ink-muted'
}

export function ProductCard({
  product,
  goal,
  category,
  selectable = false,
  selected = false,
  onToggleSelect,
  selectDisabled = false,
}) {
  const params = new URLSearchParams({ goal })
  if (category) params.set('category', category)

  const nutrients = [
    formatCalories(product.calories),
    formatProtein(product.protein),
    formatFat(product.fat),
  ].join(' · ')

  return (
    <div
      className={`surface-card flex min-h-11 flex-col gap-3 p-4 transition duration-300 ease-out sm:flex-row sm:items-center sm:gap-4 sm:p-5 ${
        selected
          ? 'border-primary/40 bg-primary-soft/40 ring-2 ring-primary/15'
          : 'surface-card-hover'
      }`}
    >
      {selectable ? (
        <CompareCheckbox
          checked={selected}
          disabled={selectDisabled && !selected}
          label={`${product.name} 비교 선택`}
          onToggle={() => onToggleSelect?.(Number(product.id))}
        />
      ) : null}

      <Link
        to={`/products/${product.id}?${params}`}
        className="flex min-w-0 flex-1 flex-col gap-3 rounded-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankClass(product.rank)}`}
            aria-label={`${product.rank}위`}
          >
            {product.rank}
          </span>

          <FoodImage
            category={product.category}
            name={product.name}
            size="md"
            className="hidden sm:block"
            alt=""
          />

          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-ink">{product.name}</span>
            <span className="mt-0.5 block truncate text-sm text-ink-muted">
              {product.category || '분류 없음'}
            </span>
            <span className="mt-1 block truncate text-xs text-ink-muted">
              {nutrients}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
            {product.recommendScore}점
          </span>
          <ChevronRight className="h-5 w-5 text-ink-muted" aria-hidden />
        </span>
      </Link>
    </div>
  )
}
