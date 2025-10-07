export async function logWorkout(payload: any) {
  const headers: any = { 'Content-Type': 'application/json' }
  const token = typeof window !== 'undefined' && localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch('/api/workouts/log', { method: 'POST', headers, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('Failed to log workout')
  return res.json()
}

export async function getWorkoutsForUser(userId: string) {
  const headers: any = {}
  const token = typeof window !== 'undefined' && localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`/api/workouts/user/${userId}`, { method: 'GET', headers })
  if (!res.ok) throw new Error('Failed to fetch workouts')
  return res.json()
}
