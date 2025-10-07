import MotionCard from './MotionCard'

export default function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <MotionCard className="p-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm muted">{label}</div>
    </MotionCard>
  )
}
