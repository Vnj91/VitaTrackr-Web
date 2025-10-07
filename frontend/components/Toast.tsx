"use client"

import React, { useEffect, useState } from 'react'

export type ToastMessage = { id: string, type?: 'info'|'error'|'success', text: string }

const TOAST_LIFETIME = 5000

export function ToastContainer(){
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(()=>{
    const handler = (e:any) => {
      const payload = e.detail as ToastMessage
      setMessages(m => [...m, payload])
      setTimeout(()=> setMessages(m => m.filter(x=>x.id !== payload.id)), TOAST_LIFETIME)
    }
    window.addEventListener('vitatrack:toast', handler as any)
    return ()=> window.removeEventListener('vitatrack:toast', handler as any)
  },[])

  if (messages.length === 0) return null

  return (
    <div aria-live="polite" className="fixed right-4 top-4 z-50 space-y-2">
      {messages.map(m => (
        <div key={m.id} className={`p-3 rounded shadow text-sm ${m.type==='error'? 'bg-red-100 text-red-800' : m.type==='success'? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {m.text}
        </div>
      ))}
    </div>
  )
}

export function toast(text:string, type:'info'|'error'|'success'='info'){
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`
  const msg:ToastMessage = { id, type, text }
  window.dispatchEvent(new CustomEvent('vitatrack:toast', { detail: msg }))
}
