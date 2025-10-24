"use client"

import React, { useState } from 'react'
import { useAuthViewModel } from '../../../viewmodels/useAuthViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { toast } from '../../../components/Toast'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { loading, error, login } = useAuthViewModel()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string|null>(null)
  const [passwordError, setPasswordError] = useState<string|null>(null)

  function validateEmail(v:string){
    if (!v) return 'Email is required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'Enter a valid email'
    return null
  }
  function validatePassword(v:string){
    if (!v) return 'Password required'
    if (v.length < 6) return 'Minimum 6 characters'
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // client-side validation
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    if (eErr || pErr) return
    const data = await login({ email, password })
    if (data && data.token) {
      toast('Signed in', 'success')
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="surface p-4 rounded" aria-describedby="login-help">
          <label className="block">
            <span className="text-sm muted">Email</span>
            <input id="login-email" aria-describedby="email-help" value={email} onChange={e=>{ setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }} className="mt-1 block w-full border rounded p-2" />
            <div id="email-help" className="text-xs muted mt-1">We&apos;ll never share your email.</div>
            {emailError && <div className="text-xs text-red-600 mt-1">{emailError}</div>}
          </label>
          <label className="block mt-3">
            <span className="text-sm muted">Password</span>
            <input id="login-password" aria-describedby="password-help" type="password" value={password} onChange={e=>{ setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)) }} className="mt-1 block w-full border rounded p-2" />
            <div id="password-help" className="text-xs muted mt-1">At least 6 characters.</div>
            {passwordError && <div className="text-xs text-red-600 mt-1">{passwordError}</div>}
          </label>
          <div className="mt-4">
            <button type="submit" disabled={loading || !!emailError || !!passwordError} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
              {loading ? <><LoadingSpinner size={16}/> Signing in...</> : 'Sign in'}
            </button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </main>
    </div>
  )
}
