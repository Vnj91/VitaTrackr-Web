import MotionCard from './MotionCard'
import { ReactNode } from 'react'

export default function StatCard({ value, label }: { value?: ReactNode; label: string }) {
  return (
    <MotionCard className="p-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm muted">{label}</div>
    </MotionCard>
  )
}
