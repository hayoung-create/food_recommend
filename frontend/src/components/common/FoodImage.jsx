import { FoodIllustrationGraphic } from './FoodIllustrationGraphic'
import { getFoodIllustrationKey } from '../../utils/foodImages'

const SIZE_CLASS = {
  sm: 'h-12 w-12',
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
}

/**
 * 제품 썸네일 일러스트 (키워드 매칭 SVG).
 * 외부 사진 URL을 쓰지 않아 네트워크·저작권 이슈가 없다.
 */
export function FoodImage({
  category,
  name,
  size = 'md',
  className = '',
  alt,
}) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md
  const type = getFoodIllustrationKey(category, name)
  const label = alt === '' ? undefined : alt ?? (name ? `${name} 일러스트` : '식품 일러스트')

  return (
    <span
      className={`inline-block shrink-0 overflow-hidden rounded-xl ${sizeClass} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <FoodIllustrationGraphic type={type} />
    </span>
  )
}
