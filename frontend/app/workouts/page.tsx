import React from 'react'
import WorkoutChart from '../../components/WorkoutChart'
import { useWorkoutsViewModel } from '../../viewmodels/useWorkoutsViewModel'

export default function WorkoutsPage() {
  const tokenUser = typeof window !== 'undefined' && localStorage.getItem('user')
  const user = tokenUser ? JSON.parse(tokenUser) : null
  const { loading, error, items } = useWorkoutsViewModel(user?.id)

  // fallback sample data when no backend or no user
  const sampleData = [
    { date: '2025-09-28', calories: 420 },
    { date: '2025-09-29', calories: 380 },
    { date: '2025-09-30', calories: 510 },
    { date: '2025-10-01', calories: 460 },
    { date: '2025-10-02', calories: 500 }
  ]

  const data = (items && items.length > 0) ? items.map((w: any) => ({ date: new Date(w.date).toISOString().slice(0,10), calories: w.calories || 0 })) : sampleData

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Workouts</h1>
        <div className="surface p-4 rounded shadow">
          {loading ? <div className="skeleton h-48" /> : <WorkoutChart data={data} />}
          {error && <div className="text-red-600">{error}</div>}
        </div>
      </main>
    </div>
  )
}
