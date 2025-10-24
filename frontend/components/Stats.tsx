"use client"

import React, { useEffect, useState } from 'react'

function useCount(target:number, duration=1000){
  const [value, setValue] = useState(0)
  useEffect(()=>{
    let raf:number
    const start = Date.now()
    const tick = () => {
      const now = Date.now()
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(t * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function Stats({ items }:{ items: {label:string, value:number, duration?:number}[] }){
  function StatItem({ label, value, duration }:{ label:string, value:number, duration?:number }){
    const v = useCount(value, duration || 1200)
    return (
      <div className="bg-white/5 rounded p-6">
        <div className="text-3xl font-bold">{v}</div>
        <div className="text-sm text-indigo-100 mt-1">{label}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center py-6">
      {items.map((it, idx)=> <StatItem key={idx} label={it.label} value={it.value} duration={it.duration} />)}
    </div>
  )
}
