import { getFoodEmoji } from '../../utils/getFoodEmoji'

/** 카드·상세 공통 대표 이모지 아바타 (기본 56px) */
const SIZE_CLASS = {
  sm: 'h-12 w-12 text-xl',
  md: 'h-14 w-14 text-2xl',
  lg: 'h-16 w-16 text-3xl sm:h-[72px] sm:w-[72px]',
}

/**
 * 식품명 기반 대표 이모지 썸네일.
 * 매핑 로직은 getFoodEmoji()에만 둔다.
 */
export function FoodImage({
  name,
  size = 'md',
  className = '',
  alt,
}) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md
  const emoji = getFoodEmoji(name || '')
  const label =
    alt === ''
      ? undefined
      : (alt ?? (name ? `${name} 대표 이모지` : '식품 대표 이모지'))

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft p-2 shadow-card transition duration-300 ease-premium hover:scale-105 hover:shadow-soft ${sizeClass} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span className="leading-none" aria-hidden={label ? true : undefined}>
        {emoji}
      </span>
    </span>
  )
}
