"use client"

import React, { useState } from 'react'
import { useAuthViewModel } from '../../../viewmodels/useAuthViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { toast } from '../../../components/Toast'

export default function LoginPage() {
  const { loading, error, login } = useAuthViewModel()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // client-side validation
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      toast('Please enter a valid email', 'error')
      return
    }
    if (!password || password.length < 6){
      toast('Password must be at least 6 characters', 'error')
      return
    }
    await login({ email, password })
    // assume login sets user in local state via viewmodel; show toast
    toast('Signed in', 'success')
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="surface p-4 rounded" aria-describedby="login-help">
          <label className="block">
            <span className="text-sm muted">Email</span>
            <input id="login-email" aria-describedby="email-help" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            <div id="email-help" className="text-xs muted mt-1">We'll never share your email.</div>
          </label>
          <label className="block mt-3">
            <span className="text-sm muted">Password</span>
            <input id="login-password" aria-describedby="password-help" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            <div id="password-help" className="text-xs muted mt-1">At least 6 characters.</div>
          </label>
          <div className="mt-4">
            <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
              {loading ? <><LoadingSpinner size={16}/> Signing in...</> : 'Sign in'}
            </button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </main>
    </div>
  )
}
