import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import { getCompareAxis, nutrientValue } from '../../utils/compare'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

const POINT_COLORS = ['#2E7D32', '#81C784', '#FFB74D', '#6B7280', '#EF5350']

const productLabelsPlugin = {
  id: 'productLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    ctx.save()
    ctx.font = '12px Pretendard, system-ui, sans-serif'
    ctx.fillStyle = '#1F2937'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      meta.data.forEach((element, index) => {
        const point = dataset.data[index]
        if (!point || point.x == null || point.y == null) return
        const { x, y } = element.getProps(['x', 'y'], true)
        const label = point.label || dataset.label || ''
        const short =
          label.length > 10 ? `${label.slice(0, 10)}…` : label
        ctx.fillText(short, x + 6, y - 4)
      })
    })
    ctx.restore()
  },
}

export function CompareScatter({ products, goal }) {
  const axis = getCompareAxis(goal)

  const points = products
    .map((product, index) => {
      const x = nutrientValue(product, axis.xKey)
      const y = nutrientValue(product, axis.yKey)
      if (x === null || y === null) return null
      return {
        x,
        y,
        label: product.name,
        backgroundColor: POINT_COLORS[index % POINT_COLORS.length],
      }
    })
    .filter(Boolean)

  const data = {
    datasets: [
      {
        label: '선택 제품',
        data: points,
        backgroundColor: points.map((p) => p.backgroundColor),
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(context) {
            const point = context.raw
            return `${point.label}: ${axis.xLabel} ${point.x}, ${axis.yLabel} ${point.y}`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: axis.xLabel,
          color: '#6B7280',
        },
        grid: { color: '#E5E7EB' },
        ticks: { color: '#6B7280' },
      },
      y: {
        title: {
          display: true,
          text: axis.yLabel,
          color: '#6B7280',
        },
        grid: { color: '#E5E7EB' },
        ticks: { color: '#6B7280' },
      },
    },
  }

  return (
    <section className="surface-card p-6">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          📈
        </span>
        <h2 className="text-lg font-bold text-ink">
          건강 목표 기반 제품 비교
        </h2>
      </div>
      <p className="mt-3 rounded-2xl bg-primary-soft/80 px-4 py-3 text-sm text-ink">
        {axis.insight}
      </p>

      {points.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          비교할 수 있는 영양 수치가 부족합니다.
        </p>
      ) : (
        <div className="mt-4 h-72 sm:h-80">
          <Scatter data={data} options={options} plugins={[productLabelsPlugin]} />
        </div>
      )}
    </section>
  )
}
