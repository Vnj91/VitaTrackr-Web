export type RecipeRequest = {
  ingredients: string[] | string
  user?: { allergies?: string[]; goal?: string }
}

export async function generateRecipe(payload: RecipeRequest) {
  const headers: any = { 'Content-Type': 'application/json' }
  const token = typeof window !== 'undefined' && localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const resp = await fetch('/api/recipes', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  if (!resp.ok) throw new Error('Failed to generate recipe')
  return resp.json()
}
