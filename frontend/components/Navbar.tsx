"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import MotionButton from './MotionButton'

function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('theme')
    if (stored === 'dark') {
      document.body.classList.add('dark')
      setDark(true)
    } else if (stored === 'light') {
      document.body.classList.remove('dark')
      setDark(false)
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) document.body.classList.add('dark')
    else document.body.classList.remove('dark')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button type="button" onClick={toggle} aria-label="Toggle theme" className="px-2 py-1 rounded border">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}

export default function Navbar() {
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
    if (typeof window !== 'undefined') {
      try { window.location.href = '/dev/mock-login' } catch (_) {}
    }
  }

  if (!shouldRender) return null

  return (
    <nav data-vt-navbar className="surface shadow" role="navigation" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg">VitaTrack</span>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ if(typeof window !== 'undefined') try { window.location.href='/' } catch(_) {}}}>Dashboard</MotionButton>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ if(typeof window !== 'undefined') window.location.href='/ingredients'}}>Ingredients</MotionButton>
          <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ if(typeof window !== 'undefined') window.location.href='/workouts'}}>Workouts</MotionButton>
            {/* dev button placeholder keeps DOM stable to avoid hydration mismatch */}
            <span aria-hidden className="nav-dev-placeholder" />
            {mounted && isLocal ? (
              <MotionButton className="px-2 py-1 text-sm" onClick={()=>{ if(typeof window !== 'undefined') try { window.location.href='/dev' } catch(_) {}}}>Dev</MotionButton>
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
                  <MotionButton className="px-3 text-sm" onClick={()=>{ if(typeof window !== 'undefined') window.location.href='/auth/login'}}>Sign in</MotionButton>
                  <MotionButton className="px-3 text-sm" onClick={()=>{ if(typeof window !== 'undefined') window.location.href='/auth/register'}}>Register</MotionButton>
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
