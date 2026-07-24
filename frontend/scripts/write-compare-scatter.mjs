import fs from 'fs'

// Pure ASCII source; Korean via Unicode escapes to avoid Windows encoding issues
const title = '\uAC74\uAC15 \uBAA9\uD45C \uAE30\uBC18 \uC81C\uD488 \uBE44\uAD50'
const empty =
  '\uBE44\uAD50\uD560 \uC218 \uC788\uB294 \uC601\uC591 \uC218\uCE58\uAC00 \uBD80\uC871\uD569\uB2C8\uB2E4.'
const selected = '\uC120\uD0DD \uC81C\uD488'
const chartEmoji = '\uD83D\uDCC8'
const ellipsis = '\u2026'

const content = `import {
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
          label.length > 10 ? \`\${label.slice(0, 10)}${ellipsis}\` : label
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
        label: '${selected}',
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
            return \`\${point.label}: \${axis.xLabel} \${point.x}, \${axis.yLabel} \${point.y}\`
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
          ${chartEmoji}
        </span>
        <h2 className="text-lg font-bold text-ink">
          ${title}
        </h2>
      </div>
      <p className="mt-3 rounded-2xl bg-primary-soft/80 px-4 py-3 text-sm text-ink">
        {axis.insight}
      </p>

      {points.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">
          ${empty}
        </p>
      ) : (
        <div className="mt-4 h-72 sm:h-80">
          <Scatter data={data} options={options} plugins={[productLabelsPlugin]} />
        </div>
      )}
    </section>
  )
}
`

const out = 'c:/food_recommend/frontend/src/components/compare/CompareScatter.jsx'
fs.writeFileSync(out, content, { encoding: 'utf8' })
const check = fs.readFileSync(out, 'utf8')
if (!check.includes(title)) {
  console.error('WRITE FAILED')
  process.exit(1)
}
console.log('OK:', title)
