"use client"

import React, { useState } from 'react'
import Link from 'next/link'

export default function RecipesPage(){
  const [ingredients, setIngredients] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const mockGenerate = (ings: string, g: string) => {
    // lightweight placeholder generator so UX is instant — we'll replace this with API wiring later
    const list = ings.split(/[.,\n]/).map(s=>s.trim()).filter(Boolean).slice(0,6)
    const title = list.length ? `${list[0]} & ${list.slice(1).join(', ')}` : 'Custom Recipe'
    return `Recipe: ${title}\n\nIngredients:\n- ${list.join('\n- ')}\n\nInstructions:\n1) Combine ingredients.\n2) Season to taste.\n3) Cook until done.\n\nNotes: Goal - ${g || 'General'}`
  }

  const onGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setResult(null)
    await new Promise(r=>setTimeout(r, 400))
    setResult(mockGenerate(ingredients, goal))
    setLoading(false)
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recipe Generator</h1>
      <p className="text-gray-700 mb-6">Enter ingredients or a goal and press Generate. This runs locally for now.</p>

      <form onSubmit={onGenerate} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Ingredients (comma or newline separated)</span>
          <textarea value={ingredients} onChange={e=>setIngredients(e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="e.g. chicken, garlic, spinach"></textarea>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">Dietary goal (optional)</span>
          <input value={goal} onChange={e=>setGoal(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="e.g. high-protein, low-carb" />
        </label>

        <div className="flex items-center space-x-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60">{loading ? 'Generating…' : 'Generate'}</button>
          <Link href="/" className="text-indigo-600">← Back to home</Link>
        </div>
      </form>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow-sm whitespace-pre-wrap font-mono text-sm">{result}</div>
      )}
    </div>
  )
}
