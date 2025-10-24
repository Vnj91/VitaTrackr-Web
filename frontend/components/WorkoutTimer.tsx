"use client"

import React from 'react'

type Props = { userId?: string; onLogged?: ()=>void }

export default function WorkoutTimer({ userId, onLogged }: Props) {
  const [running, setRunning] = React.useState(false)
  const [startTs, setStartTs] = React.useState<number| null>(null)
  const [elapsed, setElapsed] = React.useState(0)
  const [pausedAt, setPausedAt] = React.useState<number| null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(()=>{
    let t: any = null
    if (running && startTs) {
      t = setInterval(()=>{
        setElapsed(Math.floor((Date.now() - startTs)/1000))
      }, 1000)
    }
    return ()=>{ if (t) clearInterval(t) }
  }, [running, startTs])

  function format(sec: number) {
    const m = Math.floor(sec/60).toString().padStart(2,'0')
    const s = (sec%60).toString().padStart(2,'0')
    return `${m}:${s}`
  }

  function handleStart() {
    setStartTs(Date.now())
    setRunning(true)
    setPausedAt(null)
  }

  function handlePause() {
    setRunning(false)
    setPausedAt(Date.now())
  }

  async function handleFinish() {
    try {
      setSaving(true)
      if (!userId) throw new Error('Not logged in')
      const durationSec = elapsed
      const calories = Math.max(0, Math.round(durationSec * 6)) // rough calories heuristic (6 cal/sec ~ 360/min) — tweak later
      const payload = { userId, date: new Date().toISOString(), durationSec, calories }
      const res = await import('../services/workoutsService').then(m=>m.logWorkout(payload))
      if (onLogged) onLogged()
      // reset
      setRunning(false)
      setStartTs(null)
      setElapsed(0)
      setPausedAt(null)
      if (typeof window !== 'undefined') window.alert('Workout saved')
    } catch (err: any) {
      if (typeof window !== 'undefined') window.alert(err?.message || 'Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded p-3 w-40 z-50">
      <div className="text-center font-mono text-lg">{format(elapsed)}</div>
      <div className="flex gap-2 mt-2">
        {!running && <button onClick={handleStart} className="flex-1 bg-green-500 text-white rounded px-2 py-1">Start</button>}
        {running && <button onClick={handlePause} className="flex-1 bg-yellow-500 text-black rounded px-2 py-1">Pause</button>}
        <button onClick={handleFinish} disabled={saving} className="flex-1 bg-red-500 text-white rounded px-2 py-1">{saving ? 'Saving' : 'Finish'}</button>
      </div>
    </div>
  )
}
