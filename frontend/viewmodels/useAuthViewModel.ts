import { useState } from 'react'
import * as authService from '../services/authService'

export function useAuthViewModel() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)

  async function register(payload: { name?: string; email: string; password: string }) {
    setLoading(true); setError(null)
    try {
      const data = await authService.register(payload)
      setUser(data.user)
      // store token in memory/localStorage for demo (in production store httpOnly cookie)
      localStorage.setItem('token', data.token)
      try { localStorage.setItem('user', JSON.stringify(data.user)) } catch(e) {}
      return data
    } catch (err: any) { setError(err.message || 'error') }
    finally { setLoading(false) }
  }

  async function login(payload: { email: string; password: string }) {
    setLoading(true); setError(null)
    try {
      const data = await authService.login(payload)
      setUser(data.user)
      localStorage.setItem('token', data.token)
      try { localStorage.setItem('user', JSON.stringify(data.user)) } catch(e) {}
      return data
    } catch (err: any) { setError(err.message || 'error') }
    finally { setLoading(false) }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // call backend to clear cookie
    try { fetch('/api/auth/logout', { method: 'POST' }) } catch (e) {}
  }

  return { loading, error, user, register, login, logout }
}
