"use client"

import React, { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import Confetti from '../../components/Confetti'
import LocalCountUp from '../../components/LocalCountUp'
import MotionList from '../../components/MotionList'
import MotionListItem from '../../components/MotionListItem'
import WorkoutChart from '../../components/WorkoutChart'

export default function DashboardPage(){
  const [analytics, setAnalytics] = useState<any | null>(null)
  const confettiRef = typeof window !== 'undefined' ? (document.querySelector('canvas[data-confetti]') as any | null) : null

  useEffect(()=>{
    // try to use logged-in user from localStorage
    let u:any = null
    try { u = JSON.parse(localStorage.getItem('user') || 'null') } catch(e){}

    const fetchFor = async (id:string) => {
      try {
        const resp = await fetch(`/api/analytics/proxy/workouts/${encodeURIComponent(id)}`)
        const j = await resp.json()
        if(j && j.data){
          setAnalytics(j)
          // if the proxy returned spring data with workout series, try to use it
          // if(j.source === 'spring' && j.data.weeklySeries) setChartData(j.data.weeklySeries)
          // otherwise fetch sample workouts for chart
        }
      } catch (e) {
        console.error('analytics fetch failed', e)
      }
    }

    const bootstrap = async () => {
      if(u && (u._id || u.id || u.userId)) {
        await fetchFor(u._id || u.id || u.userId)
      } else {
        // fallback to first debug user
        try {
          const r = await fetch('/api/debug/users')
          const users = await r.json()
          if(users && users.length>0){
            const id = users[0]._id || users[0].id || users[0].userId
            if(id) await fetchFor(id)
          }
        } catch (e) {}
      }

      // fetch sample workouts to populate chart if none
      try {
        const r2 = await fetch('/api/workouts/sample')
        const w = await r2.json()
        // map to chart shape: { date: '2025-10-07', calories: 300 }
        const mapped = (Array.isArray(w) ? w : []).map((it:any)=> ({ date: new Date(it.date).toLocaleDateString(), calories: it.calories || 0 }))
  // if(mapped.length>0) setChartData(mapped)
      } catch (e){}
    }

    bootstrap()
  },[])

    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      async function fetchWorkouts() {
        setLoading(true);
        let user = null;
        try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) {}
        let data = [];
        if (user && user.id) {
          try {
            const res = await fetch(`/api/workouts/user/${user.id}`);
            data = await res.json();
          } catch (e) { data = []; }
        }
        // fallback to sample if none
        if (!data || data.length === 0) {
          try {
            const r2 = await fetch('/api/workouts/sample');
            data = await r2.json();
          } catch (e) { data = []; }
        }
        setWorkouts(Array.isArray(data) ? data : []);
        setLoading(false);
      }
      fetchWorkouts();
    }, []);

    // Calculate stats
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
    const chartData = workouts.map((w: any) => ({ date: new Date(w.date).toISOString().slice(0,10), calories: w.calories || 0 }));
    // required series: map chart dates to user's requiredCalories
    let requiredSeries: any[] = []
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      const reqCal = u?.requiredCalories || null
      if (reqCal) {
        requiredSeries = chartData.map(d => ({ date: d.date, required: reqCal }))
      }
    } catch(e) { requiredSeries = [] }
  // reorderable cards state
  const defaultCards = [
    { key: 'totalWorkouts', node: (
      <div className="surface p-4 rounded">
        <StatCard value={<LocalCountUp end={totalWorkouts} duration={0.9} />} label="Total Workouts" />
      </div>
    ) },
    { key: 'totalCalories', node: (
      <div className="surface p-4 rounded">
        <StatCard value={<LocalCountUp end={totalCalories} duration={0.9} />} label="Total Calories" />
      </div>
    ) },
    { key: 'chartPoints', node: (
      <div className="surface p-4 rounded">
        <StatCard value={chartData.length} label="Chart Points" />
      </div>
    ) }
  ]

  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      const key = `vt:cardOrder:${u?.id || 'anon'}`
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultCards.map(c=>c.key)
    } catch(e){ return defaultCards.map(c=>c.key) }
  })

  function persistOrder(order: string[]) {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null')
      const key = `vt:cardOrder:${u?.id || 'anon'}`
      localStorage.setItem(key, JSON.stringify(order))
    } catch(e){}
  }

  function onDragStart(e: React.DragEvent, key: string) { e.dataTransfer.setData('text/plain', key) }
  function onDrop(e: React.DragEvent, overKey: string) {
    const key = e.dataTransfer.getData('text/plain')
    if (!key || key === overKey) return
    const idxFrom = cardOrder.indexOf(key)
    const idxTo = cardOrder.indexOf(overKey)
    const copy = [...cardOrder]
    copy.splice(idxFrom,1)
    copy.splice(idxTo,0,key)
    setCardOrder(copy)
    persistOrder(copy)
  }

  return (
    <div className="min-h-screen p-6">
      <Confetti />
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <div className="flex gap-3 mb-4">
          <a href="/workouts" className="px-4 py-2 bg-green-600 text-white rounded">Start Workout</a>
          <a href="/workouts#log" className="px-4 py-2 bg-indigo-600 text-white rounded">Log Workout</a>
          <a href="/recipes" className="px-4 py-2 bg-yellow-500 text-white rounded">Recipes</a>
        </div>

          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {cardOrder.map(key => {
              const card = defaultCards.find(c=>c.key===key)
              return (
                <MotionListItem key={key}>
                  <div onDragOver={(e:any)=>e.preventDefault()} onDragStart={(e:any)=>onDragStart(e,key)} onDrop={(e:any)=>onDrop(e,key)} draggable>
                    {card?.node}
                  </div>
                </MotionListItem>
              )
            })}
          </MotionList>

        <div className="surface p-4 rounded">
          <h2 className="font-medium mb-2">Recent Activity</h2>
          {loading ? <div className="skeleton h-48" /> : <WorkoutChart data={chartData} requiredSeries={requiredSeries} />}
        </div>

        <div className="mt-4 surface p-4 rounded">
          <h2 className="font-medium mb-2">Goals</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Lose 5kg</div>
              <div className="text-sm muted">Progress: <span id="goal-progress">2</span>/5 kg</div>
            </div>
            <div className="flex gap-2">
              <button onClick={async()=>{ try { await fetch('/api/goals/sample/progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ delta: -1 }) }); if (typeof window !== 'undefined') window.alert('Adjusted') } catch(e){}}} className="px-3 py-1 bg-gray-200 rounded">-</button>
              <button onClick={async()=>{ try { await fetch('/api/goals/sample/progress', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ delta: 1 }) }); if (typeof window !== 'undefined') window.alert('Adjusted') } catch(e){}}} className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
          <div className="mt-3 h-12 bg-gray-50 rounded flex items-center justify-center text-sm muted">Sparkline placeholder</div>
        </div>

      </main>
    </div>
  )
}
