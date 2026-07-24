import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const UNITS = ['kcal', 'g', 'g', 'g', 'mg']

/** 단위가 다른 항목을 나란히 비교하기 위해 항목별 최댓값 기준 0~100 스케일 */
function scalePair(productVal, averageVal) {
  const p = productVal == null || Number.isNaN(Number(productVal)) ? 0 : Number(productVal)
  const a = averageVal == null || Number.isNaN(Number(averageVal)) ? 0 : Number(averageVal)
  const max = Math.max(p, a, 1)
  return { product: (p / max) * 100, average: (a / max) * 100, rawP: p, rawA: a }
}

export function NutritionChart({ chart, categoryName }) {
  const labels = chart?.labels || ['칼로리', '단백질', '지방', '당류', '나트륨']
  const productRaw = chart?.product || []
  const averageRaw = chart?.categoryAverage || []
  const scopeLabel = categoryName || '동일 카테고리'
  const averageDatasetLabel = `평균 (${scopeLabel})`

  const scaled = labels.map((_, index) =>
    scalePair(productRaw[index], averageRaw[index]),
  )

  const data = {
    labels,
    datasets: [
      {
        label: '해당 제품',
        data: scaled.map((s) => s.product),
        backgroundColor: '#2E7D32',
        borderRadius: 10,
        maxBarThickness: 28,
      },
      {
        label: averageDatasetLabel,
        data: scaled.map((s) => s.average),
        backgroundColor: '#C8E6C9',
        borderRadius: 10,
        maxBarThickness: 28,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          color: '#64748B',
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const index = context.dataIndex
            const unit = UNITS[index] || ''
            const pair = scaled[index]
            const raw = context.datasetIndex === 0 ? pair.rawP : pair.rawA
            const missing =
              context.datasetIndex === 0
                ? productRaw[index] == null
                : averageRaw[index] == null
            if (missing) return `${context.dataset.label}: 정보 없음`
            return `${context.dataset.label}: ${raw}${unit}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B' },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: '#E2E8F0' },
        ticks: {
          color: '#64748B',
          stepSize: 25,
          callback(value) {
            return `${value}`
          },
        },
        title: {
          display: true,
          text: '항목별 상대 비율 (0–100)',
          color: '#64748B',
          font: { size: 11 },
        },
      },
    },
  }

  return (
    <section className="surface-card p-6">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>
          📊
        </span>
        <h3 className="text-lg font-bold text-ink">영양성분 비교</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        <span className="font-semibold text-ink">{scopeLabel}</span> 평균과
        해당 제품을 비교합니다.
      </p>
      <div className="mt-3 rounded-2xl bg-primary-soft/70 px-3 py-2 text-xs text-ink">
        비교 기준은 항상 <strong>{scopeLabel}</strong> 평균입니다. (전체 식품
        평균이 아닙니다)
      </div>
      <div className="mt-4 h-64">
        <Bar data={data} options={options} />
      </div>
    </section>
  )
}
