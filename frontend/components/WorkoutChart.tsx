import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function formatShortDate(value: string) {
  try {
    const d = new Date(value)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch (e) { return value }
}

export default function WorkoutChart({ data = [] }: { data?: any[] }) {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={formatShortDate} />
          <YAxis />
          <Tooltip labelFormatter={(label)=> {
            try { return new Date(label).toLocaleString() } catch(e){ return label }
          }} />
          <Line type="monotone" dataKey="calories" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
