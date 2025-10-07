import { useState } from 'react'
import { generateRecipe } from '../services/recipesService'

export function useIngredientsViewModel() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipe, setRecipe] = useState<any | null>(null)

  async function submitIngredients(ingredients: string[] | string, user?: any) {
    setLoading(true)
    setError(null)
    try {
      const data = await generateRecipe({ ingredients, user })
      setRecipe(data.ai || data)
    } catch (err: any) {
      setError(err?.message || 'unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, recipe, submitIngredients }
}
