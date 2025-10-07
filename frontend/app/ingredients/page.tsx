"use client"

import React, { useState } from 'react'
import { useIngredientsViewModel } from '../../viewmodels/useIngredientsViewModel'
import RecipeCard from '../../components/RecipeCard'
import MotionList from '../../components/MotionList'
import MotionListItem from '../../components/MotionListItem'

export default function IngredientsPage() {
  const { loading, error, recipe, submitIngredients } = useIngredientsViewModel()
  const [text, setText] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parts = text.split(',').map(s => s.trim()).filter(Boolean)
    await submitIngredients(parts.length ? parts : text)
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Ingredients</h1>
        <form onSubmit={onSubmit} className="surface p-4 rounded shadow">
          <label className="block">
            <span className="text-sm muted">Enter ingredients (comma separated)</span>
            <input value={text} onChange={e=>setText(e.target.value)} className="mt-1 block w-full border rounded p-2" placeholder="eg. chicken, rice, broccoli" />
          </label>
          <div className="mt-4">
            <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? 'Generating...' : 'Generate Recipe'}</button>
          </div>
        </form>

        <div className="mt-6">
          {error && <div className="text-red-600">{error}</div>}
          <MotionList>
            {!recipe && loading && (
              <MotionListItem>
                <RecipeCard loading />
              </MotionListItem>
            )}

            {recipe && (
              <MotionListItem>
                <div>
                  <h2 className="text-lg font-medium">{recipe.title || 'Generated Recipe'}</h2>
                  <pre className="mt-2 p-3 surface rounded text-sm muted">{JSON.stringify(recipe, null, 2)}</pre>
                </div>
              </MotionListItem>
            )}
          </MotionList>
        </div>
      </main>
    </div>
  )
}
