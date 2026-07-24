import { Badge } from '../common/Badge'
import { FoodImage } from '../common/FoodImage'
import { SurfaceCard } from '../common/SurfaceCard'

export function ProductSummary({ product }) {
  const category = [product.category, product.category2]
    .filter(Boolean)
    .join(' · ') || '분류 없음'
  const maker = product.maker || '제조사 정보 없음'

  return (
    <SurfaceCard className="flex gap-5 p-6">
      <FoodImage
        name={product.name}
        size="lg"
        alt={`${product.name} 대표 이미지`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {product.name}
          </h2>
          <Badge>🍎 추천</Badge>
        </div>
        <p className="mt-2 text-sm text-ink-muted">
          {category} · {maker}
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          아래에서 Health Score와 영양 신호등을 확인해 보세요.
        </p>
      </div>
    </SurfaceCard>
  )
}
