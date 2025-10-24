"use client"

import { useEffect, useState } from 'react'
import * as workoutsService from '../services/workoutsService'

export function useWorkoutsViewModel(userId?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])

  async function load(userIdLocal?: string) {
    const id = userIdLocal || userId
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await workoutsService.getWorkoutsForUser(id)
      setItems(data)
    } catch (err: any) {
      setError(err?.message || 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (userId) load(userId) }, [userId])

  return { loading, error, items, reload: load }
}
