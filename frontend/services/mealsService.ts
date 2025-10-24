export async function addMeal(payload: { title?: string; ingredients?: string[]; nutrition?: any }) {
  const headers: any = { 'Content-Type': 'application/json' }
  const token = typeof window !== 'undefined' && localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resp = await fetch('/api/meals', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  if (!resp.ok) throw new Error('Failed to add meal')
  return resp.json()
}
