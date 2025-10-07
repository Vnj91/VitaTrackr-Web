"use client"

import React, { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import WorkoutChart from '../../components/WorkoutChart'

export default function DashboardPage(){
  const [analytics, setAnalytics] = useState<any | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

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
          if(j.source === 'spring' && j.data.weeklySeries) setChartData(j.data.weeklySeries)
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
        if(mapped.length>0) setChartData(mapped)
      } catch (e){}
    }

    bootstrap()
  },[])

  return (
    <div className="min-h-screen p-6">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="surface p-4 rounded">
            <StatCard value={analytics?.data?.weeklyAverageCalories ?? '—'} label="Avg cal / wk" />
          </div>
          <div className="surface p-4 rounded">
            <StatCard value={analytics?.data?.workoutCountLast30Days ?? '—'} label="Workouts (30d)" />
          </div>
          <div className="surface p-4 rounded">
            <StatCard value={chartData.length} label="Chart points" />
          </div>
        </div>

        <div className="surface p-4 rounded">
          <h2 className="font-medium mb-2">Recent Activity</h2>
          <WorkoutChart data={chartData} />
        </div>

      </main>
    </div>
  )
}
