"use client"

import React from 'react'
import WorkoutChart from '../../components/WorkoutChart'
import { useWorkoutsViewModel } from '../../viewmodels/useWorkoutsViewModel'
import dynamic from 'next/dynamic'

const WorkoutTimer = dynamic(() => import('../../components/WorkoutTimer'), { ssr: false })

export default function WorkoutsPage() {
  const tokenUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const user = tokenUser ? JSON.parse(tokenUser) : null
  const { loading, error, items, reload } = useWorkoutsViewModel(user?.id)

  // fallback sample data when no backend or no user
  const sampleData = [
    { date: '2025-09-28', calories: 420 },
    { date: '2025-09-29', calories: 380 },
    { date: '2025-09-30', calories: 510 },
    { date: '2025-10-01', calories: 460 },
    { date: '2025-10-02', calories: 500 }
  ]

  const data = (items && items.length > 0) ? items.map((w: any) => ({ date: new Date(w.date).toISOString().slice(0,10), calories: w.calories || 0 })) : sampleData

  // Add workout logging form
  const [form, setForm] = React.useState({ date: '', calories: '', type: 'Cardio' })
  const [logError, setLogError] = React.useState<string|null>(null)
  const [logLoading, setLogLoading] = React.useState(false)
  async function handleLog(e: React.FormEvent) {
    e.preventDefault()
    setLogError(null)
    setLogLoading(true)
    try {
      if (!user?.id) throw new Error('You must be logged in to log a workout.')
      const payload = {
        userId: user.id,
        type: form.type,
        calories: Number(form.calories),
        date: form.date || new Date().toISOString().slice(0,10)
      }
      // log workout
      const res = await import('../../services/workoutsService').then(m => m.logWorkout(payload))
      setForm({ date: '', calories: '', type: 'Cardio' })
      reload && reload()
    } catch (err: any) {
      setLogError(err?.message || 'Failed to log workout')
    } finally {
      setLogLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Workouts</h1>
        <div className="surface p-4 rounded shadow mb-6">
            {loading ? <div className="h-48"><div className="h-full"><div className="animate-pulse bg-gray-200 h-full rounded" /></div></div> : <WorkoutChart data={data} />}
          {error && <div className="text-red-600">{error}</div>}
        </div>
  <form onSubmit={handleLog} className="surface p-4 rounded shadow mb-6 flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f, date: e.target.value}))} className="border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm">Calories</label>
            <input type="number" min={0} value={form.calories} onChange={e=>setForm(f=>({...f, calories: e.target.value}))} className="border rounded p-2" placeholder="e.g. 300" />
          </div>
          <div>
            <label className="block text-sm">Type</label>
            <select value={form.type} onChange={e=>setForm(f=>({...f, type: e.target.value}))} className="border rounded p-2">
              <option>Cardio</option>
              <option>Strength</option>
              <option>Yoga</option>
              <option>Other</option>
            </select>
          </div>
          <button type="submit" disabled={logLoading} className="bg-indigo-600 text-white px-4 py-2 rounded">{logLoading ? 'Logging...' : 'Log Workout'}</button>
          {logError && <div className="text-red-600">{logError}</div>}
        </form>
        <div className="surface p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Recent workouts</h2>
          {loading && <div className="skeleton h-20" />}
          {!loading && items && items.length === 0 && <div>No workouts yet</div>}
          {!loading && items && items.length > 0 && (
            <ul>
              {items.slice(0,10).map((w:any)=> (
                <li key={w._id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{w.type} — {new Date(w.date).toISOString().slice(0,10)}</div>
                    <div className="text-sm muted">{w.durationMin || '—'} min · {w.calories || 0} cal</div>
                  </div>
                  <div>
                    <button onClick={async()=>{ try { await import('../../services/workoutsService').then(m=>m.cloneWorkout(w._id)); reload && reload(); if (typeof window !== 'undefined') window.alert('Cloned workout') } catch (err:any){ if (typeof window !== 'undefined') window.alert(err?.message || 'Failed to clone') } }} className="bg-gray-200 px-3 py-1 rounded">Clone</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <WorkoutTimer userId={user?.id} onLogged={reload} />
    </div>
  )
}
