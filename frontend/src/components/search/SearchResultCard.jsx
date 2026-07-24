import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCalories, formatProtein } from '../../utils/format'
import { CompareCheckbox } from '../common/CompareCheckbox'
import { FoodImage } from '../common/FoodImage'

export function SearchResultCard({
  product,
  goal = 'diet',
  selectable = false,
  selected = false,
  onToggleSelect,
  selectDisabled = false,
}) {
  return (
    <div
      className={`surface-card flex min-h-[72px] items-center gap-3 p-5 transition duration-300 ease-out ${
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
        to={`/products/${product.id}?goal=${goal}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-button focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <FoodImage
          category={product.category}
          name={product.name}
          size="sm"
          alt=""
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate font-bold text-ink">{product.name}</span>
          <span className="mt-0.5 block truncate text-sm text-ink-muted">
            {[product.category, product.category2].filter(Boolean).join(' · ') ||
              '분류 없음'}
          </span>
          <span className="mt-1 block truncate text-xs text-ink-muted">
            {formatCalories(product.calories)} · {formatProtein(product.protein)}
          </span>
        </span>

        <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden />
      </Link>
    </div>
  )
}
