"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MockLoginPage(){
  const [users, setUsers] = useState<any[]>([])
  const router = useRouter()

  useEffect(()=>{
    fetch('/api/debug/users').then(r=>r.json()).then(setUsers).catch(()=>{})
  },[])

  const doLogin = (u:any) => {
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', '')
    router.push('/dev')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Mock Login</h1>
      <p className="mb-4">Select a seeded user to simulate login (dev only).</p>
      <div className="grid gap-3">
        {users.length===0 && <div className="muted">No debug users found</div>}
        {users.map(u=> (
          <div key={u._id || u.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm muted">{u.email}</div>
            </div>
            <button onClick={()=>doLogin(u)} className="px-3 py-1 bg-blue-600 text-white rounded">Login as</button>
          </div>
        ))}
      </div>
    </div>
  )
}
