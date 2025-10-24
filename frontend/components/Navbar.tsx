"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

function MobileIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const toggleRef = React.useRef<HTMLButtonElement | null>(null)

  useEffect(()=>{ setMounted(true) }, [])
  useEffect(()=>{
    try {
      const token = typeof window !== 'undefined' && localStorage.getItem('token')
      const user = typeof window !== 'undefined' && localStorage.getItem('user')
      setLoggedIn(!!(token && user))
    } catch (e) {
      setLoggedIn(false)
    }
  }, [])

  // Minimal menu: Home always, Dashboard only when logged in.
  const baseMenu = [
    { label: 'Home', href: '/' }
  ]

  const menu = loggedIn ? [{ label: 'Home', href: '/' }, { label: 'Dashboard', href: '/dashboard' }] : baseMenu

  const go = (href:string) => { setOpen(false); try{ router.push(href) }catch(_){} }

  // Accessibility: focus management and keyboard handling for mobile menu
  useEffect(()=>{
    if (!open) return
    // focus first interactive element in mobile menu
    try {
      const first = menuRef.current?.querySelector('button, a') as HTMLElement | null
      first?.focus()
    } catch (e) {}
  }, [open])

  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        // return focus to toggle
        setTimeout(()=> toggleRef.current?.focus(), 0)
      }
    }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button aria-label="Home" onClick={()=>go('/')} className="flex items-center space-x-2 focus:outline-none">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><rect width="24" height="24" rx="6" fill="currentColor"/></svg>
            <span className="font-bold text-lg">VitaTrackr</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6" aria-label="Primary">
          {menu.map(m=> (
            <button key={m.href} onClick={()=>go(m.href)} className="text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none">{m.label}</button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button onClick={()=>go('/auth/login')} className="px-3 py-1 rounded text-gray-900 hover:bg-gray-100 focus:outline-none">Login</button>
          <button onClick={()=>go('/auth/register')} className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none">Sign Up</button>
          <button ref={toggleRef} className="md:hidden ml-2 p-2 rounded" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(s=>!s)}>
            <MobileIcon open={open} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <motion.div id="mobile-menu" ref={menuRef} initial={{ height: 0 }} animate={{ height: open ? 'auto' : 0 }} className="md:hidden overflow-hidden border-t">
        <div className="px-4 py-3 space-y-2">
          {menu.map(m => (
            <button key={m.href} onClick={()=>go(m.href)} className="w-full text-left py-2 rounded hover:bg-gray-50 text-gray-900" aria-label={m.label}>{m.label}</button>
          ))}
          <div className="pt-2 border-t mt-2 flex space-x-2">
            <button onClick={()=>go('/auth/login')} className="flex-1 py-2 rounded">Login</button>
            <button onClick={()=>go('/auth/register')} className="flex-1 py-2 rounded bg-indigo-600 text-white">Sign Up</button>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
