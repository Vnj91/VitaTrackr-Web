"use client"

import React, { useEffect, useState } from 'react'
import MotionList from '../../components/MotionList'
import MotionListItem from '../../components/MotionListItem'

export default function DevPage() {
  const [users, setUsers] = useState<any[]>([])
  const [workouts, setWorkouts] = useState<any[]>([])
  const [recipe, setRecipe] = useState<any | null>(null)
  const [analytics, setAnalytics] = useState<any | null>(null)

  useEffect(()=>{
    fetch('/api/debug/users').then(r=>r.json()).then(setUsers).catch(()=>{})
    fetch('/api/workouts/sample').then(r=>r.json()).then(setWorkouts).catch(()=>{})
    fetch('/api/recipes/sample').then(r=>r.json()).then(setRecipe).catch(()=>{})

    // try to fetch analytics for seeded user if available
    fetch('/api/debug/users').then(r=>r.json()).then((u:any[])=>{
      if(u && u.length>0){
        const id = u[0]._id || u[0].id || u[0].userId
        if(id){
          fetch(`/api/analytics/proxy/workouts/${encodeURIComponent(id)}`).then(r=>r.json()).then(setAnalytics).catch(()=>{})
        }
      }
    }).catch(()=>{})
  },[])

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Dev Tools</h1>
        <MotionList className="space-y-4">
          <MotionListItem>
            <section className="surface p-4 rounded">
              <h2 className="font-medium">Seeded Users</h2>
              <div className="mb-2"><a href="/dev/mock-login" className="text-sm text-blue-600">Open Mock Login</a></div>
              <pre className="text-sm mt-2">{JSON.stringify(users, null, 2)}</pre>
            </section>
          </MotionListItem>

          <MotionListItem>
            <section className="surface p-4 rounded">
              <h2 className="font-medium">Sample Workouts</h2>
              <pre className="text-sm mt-2">{JSON.stringify(workouts, null, 2)}</pre>
            </section>
          </MotionListItem>

          <MotionListItem>
            <section className="surface p-4 rounded">
              <h2 className="font-medium">Sample Recipe</h2>
              <pre className="text-sm mt-2">{JSON.stringify(recipe, null, 2)}</pre>
            </section>
          </MotionListItem>

          <MotionListItem>
            <section className="surface p-4 rounded">
              <h2 className="font-medium">Analytics (proxy)</h2>
              <pre className="text-sm mt-2">{JSON.stringify(analytics, null, 2)}</pre>
            </section>
          </MotionListItem>
        </MotionList>
      </main>
    </div>
  )
}
