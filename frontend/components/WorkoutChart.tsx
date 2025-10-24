import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function formatShortDate(value: string) {
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch (e) { return value }
}

export default function WorkoutChart({ data = [], requiredSeries = [] }: { data?: any[], requiredSeries?: any[] }) {
  async function exportChart() {
    try {
      const container = document.querySelector('[data-workout-chart]') as HTMLElement | null
      if (!container) return alert('Chart not found')
      const svg = container.querySelector('svg') as SVGSVGElement | null
      if (!svg) return alert('SVG not found')
      const serializer = new XMLSerializer()
      const str = serializer.serializeToString(svg)
      const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = ()=>{
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.drawImage(img,0,0)
        canvas.toBlob(b=>{
          if (!b) return alert('Export failed')
          const u = URL.createObjectURL(b)
          const a = document.createElement('a')
          a.href = u
          a.download = 'workout-chart.png'
          document.body.appendChild(a)
          a.click()
          a.remove()
        })
      }
      img.onerror = ()=> alert('Failed to export')
      img.src = url
    } catch(e) { alert('Export failed') }
  }
  return (
    <div style={{ width: '100%', height: 220 }} data-workout-chart>
      <div className="flex justify-end mb-2"><button className="px-2 py-1 bg-gray-200 rounded" onClick={exportChart}>Export PNG</button></div>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={formatShortDate} />
          <YAxis />
          <Tooltip labelFormatter={(label)=> {
            try { return new Date(label).toLocaleString() } catch(e){ return label }
          }} />
          <Line type="monotone" dataKey="calories" stroke="#4F46E5" />
          {requiredSeries && requiredSeries.length>0 && (
            <Line type="monotone" dataKey="required" data={requiredSeries} stroke="#EF4444" strokeDasharray="4 4" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
