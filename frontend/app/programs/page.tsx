"use client"

import React from 'react'

export default function ProgramsPage(){
  return (
    <div className="min-h-screen p-6">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Programs</h1>
        <p className="muted">AI recommended plans will appear here.</p>
        <div className="mt-4">
          <div className="p-4 surface rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">4-Week Fat Loss</div>
              <div className="text-sm muted">A progressive plan to build consistency.</div>
            </div>
            <ProgramSubscribe id="prog-fatloss-4w" />
          </div>
        </div>
      </main>
    </div>
  )
}

function ProgramSubscribe({ id }: { id: string }){
  const [subscribed, setSubscribed] = React.useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false
      const m = JSON.parse(localStorage.getItem('vt:programSubs') || '{}')
      return !!m[id]
    } catch (e) {
      return false
    }
  })
  function toggle(){
    const next = !subscribed
    (async ()=>{
      try {
        const token = typeof window !== 'undefined' && localStorage.getItem('token')
        const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user')||'null')
        if (token && user && user.id) {
          await fetch(`/api/profile/${user.id}/program`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ id, subscribe: next }) })
          setSubscribed(next)
          return
        }
        const m = JSON.parse(localStorage.getItem('vt:programSubs') || '{}')
        m[id] = next
        localStorage.setItem('vt:programSubs', JSON.stringify(m))
      } catch(e){}
    })()
  }
  return <button onClick={toggle} className={`px-3 py-2 rounded ${subscribed ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
}
