import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  buildRadarNormalizedSeries,
  hexToRgba,
  pickTopProductsForRadar,
  RADAR_COLORS,
} from '../../utils/radar'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

export function CompareRadar({ products }) {
  const radarProducts = useMemo(
    () => pickTopProductsForRadar(products, 3),
    [products],
  )
  const { labels, series } = useMemo(
    () => buildRadarNormalizedSeries(radarProducts),
    [radarProducts],
  )
  const [activeIndex, setActiveIndex] = useState(null)

  const data = useMemo(() => {
    return {
      labels,
      datasets: series.map((item, index) => {
        const palette = RADAR_COLORS[index % RADAR_COLORS.length]
        const isDimmed = activeIndex !== null && activeIndex !== index
        const isActive = activeIndex === index

        return {
          label: item.name,
          data: item.values,
          borderColor: isDimmed
            ? hexToRgba(palette.border, 0.22)
            : palette.border,
          backgroundColor: isDimmed
            ? hexToRgba(palette.border, 0.04)
            : isActive
              ? hexToRgba(palette.border, 0.35)
              : palette.fill,
          borderWidth: isActive ? 3 : 2,
          pointBackgroundColor: isDimmed
            ? hexToRgba(palette.border, 0.25)
            : palette.border,
          pointRadius: isActive ? 4 : 3,
          pointHoverRadius: 5,
        }
      }),
    }
  }, [labels, series, activeIndex])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      onHover(event, elements) {
        const next = elements.length ? elements[0].datasetIndex : null
        setActiveIndex((prev) => (prev === next ? prev : next))
        if (event?.native?.target) {
          event.native.target.style.cursor = elements.length
            ? 'pointer'
            : 'default'
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            color: '#6B7280',
            padding: 16,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed.r
              return `${context.dataset.label}: ${Math.round(value)}`
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: '#9CA3AF',
            backdropColor: 'transparent',
          },
          grid: { color: '#E5E7EB' },
          angleLines: { color: '#E5E7EB' },
          pointLabels: {
            color: '#6B7280',
            font: { size: 11 },
          },
        },
      },
    }),
    [],
  )

  if (!radarProducts.length) {
    return (
      <section className="surface-card p-6">
        <h2 className="text-lg font-bold text-ink">영양성분 프로필 비교</h2>
        <p className="mt-3 text-sm text-ink-muted">
          비교할 제품이 없습니다.
        </p>
      </section>
    )
  }

  return (
    <section className="surface-card p-6">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          🕸️
        </span>
        <h2 className="text-lg font-bold text-ink">영양성분 프로필 비교</h2>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Scatter는 목표 축에서의 위치 비교, Radar는 영양 프로필 형태 비교입니다.
      </p>

      <div
        className="mt-4 h-80 sm:h-96"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <Radar data={data} options={options} />
      </div>

      <p className="mt-4 rounded-2xl bg-primary-soft/70 px-4 py-3 text-sm text-ink">
        Radar Chart는 선택한 제품 중 추천 점수가 높은 상위 3개의 영양성분
        프로필을 비교합니다.
        {products.length > 3
          ? ` (전체 ${products.length}개 중 상위 ${radarProducts.length}개 표시)`
          : null}
      </p>
    </section>
  )
}
