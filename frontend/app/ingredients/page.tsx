"use client"

import React, { useState } from 'react'
import { useIngredientsViewModel } from '../../viewmodels/useIngredientsViewModel'
import { INGREDIENTS } from '../../data/ingredientSynonyms'
import dynamic from 'next/dynamic'
const Modal = dynamic(()=>import('../../components/Modal'), { ssr: false })
import RecipeCard from '../../components/RecipeCard'
import MotionList from '../../components/MotionList'
import MotionListItem from '../../components/MotionListItem'

export default function IngredientsPage() {
  const { loading, error, recipe, submitIngredients } = useIngredientsViewModel()
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [customOpen, setCustomOpen] = useState(false)
  const [customName, setCustomName] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parts = text.split(',').map(s => s.trim()).filter(Boolean)
    await submitIngredients(parts.length ? parts : text)
  }

  function updateSuggestions(v: string) {
    const q = v.trim().toLowerCase()
    if (!q) return setSuggestions([])
    const matches = INGREDIENTS.filter(i => i.name.includes(q) || (i.synonyms||[]).some(s=>s.includes(q)))
    setSuggestions(matches.slice(0,6))
  }

  function loadCustoms() {
    try { const c = JSON.parse(localStorage.getItem('vt:customIngredients') || '[]'); return Array.isArray(c)?c:[] } catch(e){ return [] }
  }

  React.useEffect(()=>{
    const c = loadCustoms()
    if (c.length) setSuggestions(s => [...c.slice(0,6), ...s].slice(0,6))
  },[])

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Ingredients</h1>
        <form onSubmit={onSubmit} className="surface p-4 rounded shadow">
          <label className="block relative">
            <span className="text-sm muted">Enter ingredients (comma separated)</span>
            <input value={text} onChange={e=>{ setText(e.target.value); updateSuggestions(e.target.value) }} className="mt-1 block w-full border rounded p-2" placeholder="eg. chicken, rice, broccoli" />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border mt-1 rounded z-10">
                {suggestions.map(s=> (
                  <div key={s.name} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={()=>{ const parts = text.split(',').map(t=>t.trim()).filter(Boolean); parts.push(s.name); setText(parts.join(', ')); setSuggestions([]) }}>{s.name} {s.synonyms && s.synonyms.length>0 && <small className="text-muted">({s.synonyms[0]})</small>}</div>
                ))}
              </div>
            )}
          </label>
          <div className="mt-4">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? 'Generating...' : 'Generate Recipe'}</button>
          </div>
        </form>
        <div className="mt-3">
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>setCustomOpen(true)}>Add custom ingredient</button>
        </div>

        <div className="mt-6">
          {error && (
            <div className="text-red-600">
              {error.includes('OpenAI key not configured') ? (
                <>
                  <strong>Recipe generation is not available.</strong><br />
                  <span>Please set <code>OPENAI_API_KEY</code> in your <code>.env</code> file and restart the backend server.</span>
                </>
              ) : error}
            </div>
          )}
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
      <Modal open={customOpen} onClose={()=>setCustomOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Add custom ingredient</h3>
        <div className="mb-2">
          <input className="w-full border p-2" placeholder="Name" value={customName} onChange={e=>setCustomName(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>{
            (async ()=>{
              try {
                const token = typeof window !== 'undefined' && localStorage.getItem('token')
                if (token) {
                  // call backend to persist
                  const u = JSON.parse(localStorage.getItem('user') || 'null')
                  if (u && u.id) {
                    const resp = await fetch(`/api/profile/${u.id}/ingredient`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ name: customName }) })
                    if (!resp.ok) throw new Error('Failed')
                    const j = await resp.json()
                    // update suggestions list
                    setSuggestions(s => [ { name: customName }, ...s ].slice(0,6))
                    setCustomOpen(false)
                    setCustomName('')
                    alert('Added custom ingredient')
                    return
                  }
                }
                const cur = loadCustoms()
                cur.unshift({ name: customName })
                localStorage.setItem('vt:customIngredients', JSON.stringify(cur.slice(0,20)))
                setCustomOpen(false)
                setCustomName('')
                alert('Added custom ingredient')
              } catch(e){ alert('Failed') }
            })()
          }}>Save</button>
          <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>setCustomOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}
