import React from 'react'
import MotionCard from './MotionCard'
import { addMeal } from '../services/mealsService'
import { toggleFavorite } from '../services/recipesService'
import { useState } from 'react'

export default function RecipeCard({ loading = false, id, initialFavorited = false }: { loading?: boolean; id?: string; initialFavorited?: boolean }) {
  const [saving, setSaving] = useState(false)
  const [favorited, setFavorited] = useState(initialFavorited)
  if (loading) {
    return (
      <MotionCard className="p-4">
        <div className="h-6 w-3/4 skeleton mb-3" />
        <div className="h-4 w-full skeleton mb-2" />
        <div className="h-3 w-1/2 skeleton mt-2" />
      </MotionCard>
    )
  }
  async function handleAdd() {
    try {
      setSaving(true)
      const res = await addMeal({ title: 'Simple Veggie Bowl', ingredients: ['mixed greens', 'roasted chickpeas', 'quinoa'] })
      // lightweight feedback; app has Toast components but avoid coupling here
      if (typeof window !== 'undefined') window.alert('Added recipe to your meals')
      try {
          const token = typeof window !== 'undefined' && localStorage.getItem('token')
          if (token) {
            // attempt to persist a lightweight recent meal record via profile endpoint
            try {
              const u = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('user') || 'null' : 'null')
              if (u && u.id) {
                await fetch('/api/profile/' + u.id + '/lastmeal', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: 'Simple Veggie Bowl', portions: 1 }) })
              }
            } catch(e) { /* ignore */ }
          }
        const prev = JSON.parse(localStorage.getItem('vt:lastMeals') || '[]')
        prev.unshift({ title: 'Simple Veggie Bowl', portions: 1, createdAt: new Date().toISOString() })
        localStorage.setItem('vt:lastMeals', JSON.stringify(prev.slice(0,10)))
      } catch(e){}
    } catch (err) {
      if (typeof window !== 'undefined') window.alert('Failed to add meal')
    } finally {
      setSaving(false)
    }
  }

  // suggested portion heuristic
  const suggestedPortion = (() => {
    try {
      const prev = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('vt:lastMeals') || '[]' : '[]')
      if (!prev || prev.length === 0) return null
      // return most recent portions if available
      return prev[0].portions || 1
    } catch(e) { return null }
  })()

  async function handleToggleFavorite() {
    if (!id) {
      // no-op when not provided
      setFavorited(!favorited)
      return
    }
    try {
      // optimistic UI
      setFavorited(!favorited)
      await toggleFavorite(id)
    } catch (err) {
      // revert on error
      setFavorited(favorited)
      if (typeof window !== 'undefined') window.alert('Failed to update favorites')
    }
  }

  return (
    <MotionCard className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Simple Veggie Bowl</h3>
          <p className="text-sm muted">A quick recipe based on your ingredients.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            aria-label="Favorite recipe"
            className="rounded-full w-8 h-8 flex items-center justify-center hover:opacity-90"
          >
            <span className={`text-xl ${favorited ? 'text-red-500' : 'text-gray-400'}`}>{favorited ? '♥' : '♡'}</span>
          </button>
          <button
            onClick={handleAdd}
            disabled={saving}
            aria-label="Add to meals"
            className="ml-2 rounded-full bg-green-500 text-white w-8 h-8 flex items-center justify-center hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '…' : '+'}
          </button>
        </div>
      </div>
      <ul className="mt-2 list-disc list-inside text-sm">
        <li>2 cups mixed greens</li>
        <li>1 cup roasted chickpeas</li>
        <li>1/2 cup quinoa</li>
      </ul>
      {suggestedPortion && <div className="text-sm muted mt-2">Suggested portion: {suggestedPortion} serving(s)</div>}
    </MotionCard>
  )
}
