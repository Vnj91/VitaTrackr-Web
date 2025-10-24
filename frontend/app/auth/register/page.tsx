"use client"

import React, { useState } from 'react'
import { useAuthViewModel } from '../../../viewmodels/useAuthViewModel'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { toast } from '../../../components/Toast'

export default function RegisterPage() {
  const { loading, error, register } = useAuthViewModel()
  const router = useRouter()
  const [name, setName] = useState('')
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
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    if (eErr || pErr) return
    const data = await register({ name, email, password })
    if (data && data.token) {
      toast('Account created — please sign in', 'success')
      // redirect to login
      router.push('/auth/login')
    } else {
      toast('Account created', 'success')
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Create account</h1>
  <form onSubmit={onSubmit} className="surface p-4 rounded" aria-describedby="register-help">
          <label className="block">
            <span className="text-sm muted">Name</span>
            <input id="register-name" value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>
          <label className="block mt-3">
            <span className="text-sm muted">Email</span>
            <input id="register-email" aria-describedby="register-email-help" value={email} onChange={e=>{ setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }} className="mt-1 block w-full border rounded p-2" />
            <div id="register-email-help" className="text-xs muted mt-1">Use your work or personal email.</div>
            {emailError && <div className="text-xs text-red-600 mt-1">{emailError}</div>}
          </label>
          <label className="block mt-3">
            <span className="text-sm muted">Password</span>
            <input id="register-password" aria-describedby="register-password-help" type="password" value={password} onChange={e=>{ setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)) }} className="mt-1 block w-full border rounded p-2" />
            <div id="register-password-help" className="text-xs muted mt-1">Minimum 6 characters.</div>
            {passwordError && <div className="text-xs text-red-600 mt-1">{passwordError}</div>}
          </label>
          <div className="mt-4">
            <button type="submit" disabled={loading || !!emailError || !!passwordError} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">{loading ? <><LoadingSpinner size={16}/> Creating...</> : 'Create account'}</button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
      </main>
    </div>
  )
}
