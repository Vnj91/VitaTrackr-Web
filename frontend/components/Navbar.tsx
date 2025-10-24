"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MotionButton from './MotionButton'

function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('theme')
    let isDark = false
    if (stored === 'dark') isDark = true
    else if (stored === 'light') isDark = false
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) isDark = true
    setDark(isDark)
    document.body.classList.toggle('dark', isDark)
  }, [])

  const toggle = () => {
    if (typeof window === 'undefined') return
    const next = !dark
    setDark(next)
    document.body.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    // force update CSS variables for dark/light
    if (next) {
      document.documentElement.style.setProperty('--bg', '17 24 39')
      document.documentElement.style.setProperty('--text', '243 244 246')
      document.documentElement.style.setProperty('--muted', '156 163 175')
      document.documentElement.style.setProperty('--accent', '99 102 241')
      document.documentElement.style.setProperty('--surface', '10 11 12')
    } else {
      document.documentElement.style.setProperty('--bg', '255 255 255')
      document.documentElement.style.setProperty('--text', '17 24 39')
      document.documentElement.style.setProperty('--muted', '107 114 128')
      document.documentElement.style.setProperty('--accent', '79 70 229')
      document.documentElement.style.setProperty('--surface', '247 250 252')
    }
  }

  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme" className="px-2 py-1 rounded border">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [shouldRender, setShouldRender] = useState(true)
  // prevent duplicate navbars if the component is accidentally mounted twice
  useEffect(() => {
    if (typeof window === 'undefined') return
    // global flag to indicate a navbar has been rendered
    // this helps quickly guard against duplicate mounts in dev or layout duplicates
    const key = '__vitatrack_nav_rendered'
    try {
      const win = window as any
      if (win && win[key]) {
        setShouldRender(false)
      } else if (win) {
        win[key] = true
        setShouldRender(true)
      }
    } catch (err) {
      // defensive: if any cross-origin or CSP restriction prevents access, allow render
      setShouldRender(true)
    }
  }, [])

  // avoid hydration mismatch: determine client-only values after mount
  const [mounted, setMounted] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  useEffect(()=>{
    setMounted(true)
    if (typeof window !== 'undefined') {
      const host = window.location.hostname
      setIsLocal(host === 'localhost' || host === '127.0.0.1')
    }
  }, [])
  useEffect(()=>{
    if (typeof window === 'undefined') return
    try {
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user')
      if (t && u) {
        try {
          setUser(JSON.parse(u))
        } catch (err) {
          // corrupted user in storage; clear it to avoid repeated errors
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } catch (err) {
      // access to localStorage may be blocked; ignore gracefully
    }
  }, [])

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (err) {
      // ignore
    }
    setUser(null)
  }

  // Dev helper: open mock login page
  const devLogin = () => {
    try { router.push('/dev/mock-login') } catch (_) {}
  }

  if (!shouldRender) return null

  return (
    <nav data-vt-navbar className="surface shadow" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg">VitaTrack</span>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ try { router.push('/') } catch(_) {} }}>Dashboard</MotionButton>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ try { router.push('/ingredients') } catch(_) {} }}>Ingredients</MotionButton>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ try { router.push('/workouts') } catch(_) {} }}>Workouts</MotionButton>
            {/* dev button placeholder keeps DOM stable to avoid hydration mismatch */}
            <span aria-hidden className="nav-dev-placeholder" />
            {mounted && isLocal ? (
              <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ try { router.push('/dev') } catch(_) {} }}>Dev</MotionButton>
            ) : null}
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ if(typeof window !== 'undefined') window.location.href='/profile'}}>Profile</MotionButton>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {mounted && isLocal && (
            <MotionButton className="px-3 py-1 border rounded bg-yellow-100 text-yellow-800" onClick={devLogin}>Dev Login</MotionButton>
          )}
          {!user ? (
            <>
              {mounted ? (
                <>
                  <MotionButton className="px-3 text-sm" onClick={()=>{ try { router.push('/auth/login') } catch(_) {} }}>Sign in</MotionButton>
                  <MotionButton className="px-3 text-sm" onClick={()=>{ try { router.push('/auth/register') } catch(_) {} }}>Register</MotionButton>
                </>
              ) : (
                <>
                  <span className="px-3 text-sm" aria-hidden>Sign in</span>
                  <span className="px-3 text-sm" aria-hidden>Register</span>
                </>
              )}
            </>
          ) : (
            <>
              <span className="muted">{user.name || user.email}</span>
              <MotionButton className="px-3 py-1 border rounded" onClick={logout}>Logout</MotionButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
