
"use client"
import React, { useEffect, useState, useCallback } from "react";
import dynamic from 'next/dynamic'
const Modal = dynamic(()=>import('../../components/Modal'), { ssr: false })
import WorkoutChart from '../../components/WorkoutChart'
import { useAuthViewModel } from "../../viewmodels/useAuthViewModel";
import { toast } from "../../components/Toast";

export default function ProfilePage() {
  const { user, loading } = useAuthViewModel();
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("")
  const [saving, setSaving] = useState(false);
  const [heightCm, setHeightCm] = useState<number | ''>('')
  const [weightKg, setWeightKg] = useState<number | ''>('')
  const [age, setAge] = useState<number | ''>('')
  const [sex, setSex] = useState<'male'|'female'|'other'>('male')
  const [activity, setActivity] = useState<number>(1.2)
  const [bmi, setBmi] = useState<number | null>(null)
  const [requiredCalories, setRequiredCalories] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [targetCalories, setTargetCalories] = useState<number | ''>('')
  const [mealTime, setMealTime] = useState<string>('lunch')
  const [calorieLogs, setCalorieLogs] = useState<{date:string, calories:number}[]>([])
  const [todayCalories, setTodayCalories] = useState<number | ''>('')

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAllergies(Array.isArray(user.allergies) ? user.allergies.join(", ") : (user.allergies || ""));
      setConditions(Array.isArray(user.conditions) ? user.conditions.join(", ") : (user.conditions || ""))
      setHeightCm(user.heightCm || '')
      setWeightKg(user.weightKg || '')
      setAge(user.age || '')
      setSex(user.sex || 'male')
      setBmi(user.bmi || null)
      setRequiredCalories(user.requiredCalories || null)
    }
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      // Simulate API call to update user profile
      // Replace with real API when available
      const updatedUser = {
        ...user,
        name,
        allergies: allergies.split(",").map(a => a.trim()).filter(Boolean),
        conditions: conditions.split(",").map(c => c.trim()).filter(Boolean)
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast("Profile updated!", "success");
    } catch (e) {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleCalcBMIAndEstimate() {
    try {
      const res = await fetch(`/api/profile/${user?.id}/calc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heightCm: Number(heightCm), weightKg: Number(weightKg), age: Number(age), sex, activityFactor: Number(activity) })
      })
      const j = await res.json()
      if (res.ok) {
        setBmi(j.bmi)
        setRequiredCalories(j.requiredCalories)
        toast(`BMI: ${j.bmi}, Est cal: ${j.requiredCalories}`, 'info')
      } else {
        toast('Calculation failed', 'error')
      }
    } catch (e) { toast('Failed to compute BMI', 'error') }
  }

  async function handleSaveProfile() {
    setSaving(true)
    try {
  const body = { name, allergies: allergies.split(',').map(s=>s.trim()).filter(Boolean), conditions: conditions.split(',').map(s=>s.trim()).filter(Boolean), heightCm, weightKg, age, sex, requiredCalories }
      const res = await fetch(`/api/profile/${user?.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(j))
        toast('Profile saved', 'success')
      } else toast('Save failed', 'error')
    } catch(e) { toast('Save failed', 'error') }
    finally { setSaving(false) }
  }

  async function autosaveField(partial: any) {
    if (!user?.id) return
    setSaving(true)
    try {
      const body = { ...partial }
      const res = await fetch(`/api/profile/${user.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await res.json()
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(j))
        toast('Saved', 'success')
      }
    } catch(e) { toast('Save failed', 'error') }
    finally { setSaving(false) }
  }

  const loadSuggestions = useCallback(async () => {
    try {
      const res = await fetch(`/api/recipes/suggestions/${user?.id}`)
      const j = await res.json()
      if (res.ok) setSuggestions(j)
    } catch (e) { }
  }, [user?.id])

  useEffect(() => {
    if (user) loadSuggestions()
  }, [user, loadSuggestions])

  const [recentMeals, setRecentMeals] = useState<any[]>([])
  const [suggestionModal, setSuggestionModal] = useState<any|null>(null)
  useEffect(()=>{
    try { const m = JSON.parse(localStorage.getItem('vt:lastMeals') || '[]'); setRecentMeals(Array.isArray(m)?m:[]) } catch(e){ setRecentMeals([]) }
    try { const logs = JSON.parse(localStorage.getItem('vt:calorieLogs') || '[]'); setCalorieLogs(Array.isArray(logs)?logs:[]) } catch(e){ setCalorieLogs([]) }
  },[])

  function saveCalorieLog(dateStr: string, calories: number) {
    try {
      const copy = [...calorieLogs.filter(l=>l.date!==dateStr), { date: dateStr, calories }]
      copy.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime())
      localStorage.setItem('vt:calorieLogs', JSON.stringify(copy))
      setCalorieLogs(copy)
      toast('Calories logged', 'success')
    } catch(e){ toast('Failed to save', 'error') }
  }

  function removeCalorieLog(dateStr:string){
    try{
      const copy = calorieLogs.filter(l=>l.date!==dateStr)
      localStorage.setItem('vt:calorieLogs', JSON.stringify(copy))
      setCalorieLogs(copy)
    }catch(e){ toast('Failed to remove', 'error') }
  }

  async function handleGenerateSuggestion() {
    try {
      const payload = { ingredients: [], user, targetCalories: Number(targetCalories) || requiredCalories, mealTime }
      const res = await fetch('/api/recipes/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await res.json()
      if (res.ok) { toast('Suggestion generated', 'success'); loadSuggestions() } else toast('Failed to generate', 'error')
    } catch(e){ toast('Failed to generate', 'error') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bg-white p-4 rounded shadow">
          <label className="block">
            <span className="text-sm text-gray-600">Name</span>
            <input
              className="mt-1 block w-full border rounded p-2"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => autosaveField({ name })}
              disabled={loading || saving}
              placeholder="Your name"
            />
          </label>
          <label className="block mt-3">
            <span className="text-sm text-gray-600">Allergies (comma separated)</span>
            <input
              className="mt-1 block w-full border rounded p-2"
              value={allergies}
              onChange={e => setAllergies(e.target.value)}
              onBlur={() => autosaveField({ allergies: allergies.split(',').map(s=>s.trim()).filter(Boolean) })}
              disabled={loading || saving}
              placeholder="e.g. nuts, dairy"
            />
          </label>
          <label className="block mt-3">
            <span className="text-sm text-gray-600">Diseases / Conditions (comma separated)</span>
            <input
              className="mt-1 block w-full border rounded p-2"
              value={conditions}
              onChange={e => setConditions(e.target.value)}
              onBlur={() => autosaveField({ conditions: conditions.split(',').map(s=>s.trim()).filter(Boolean) })}
              disabled={loading || saving}
              placeholder="e.g. diabetes, hypertension"
            />
          </label>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="grid grid-cols-3 gap-2">
              <input className="p-2 border rounded" placeholder="Height (cm)" value={heightCm as any} onChange={e=>setHeightCm(e.target.value?Number(e.target.value):'')} />
              <input className="p-2 border rounded" placeholder="Weight (kg)" value={weightKg as any} onChange={e=>setWeightKg(e.target.value?Number(e.target.value):'')} />
              <input className="p-2 border rounded" placeholder="Age" value={age as any} onChange={e=>setAge(e.target.value?Number(e.target.value):'')} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select className="p-2 border rounded" value={sex} onChange={e=>setSex(e.target.value as any)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input className="p-2 border rounded" placeholder="Activity factor (1.2)" value={activity} onChange={e=>setActivity(Number(e.target.value))} />
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-gray-200 rounded" onClick={handleCalcBMIAndEstimate}>Calc BMI</button>
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={handleSaveProfile} disabled={saving}>{saving? 'Saving...' : 'Save Profile'}</button>
              </div>
            </div>
            <div>
              <div className="text-sm muted">BMI: {bmi ?? '—'} • Required Calories: {requiredCalories ?? '—'}</div>
            </div>

            {/* Calories logging and chart */}
            <div className="mt-4 p-3 border rounded bg-white">
              <h3 className="font-medium">Daily Calories</h3>
              <div className="flex gap-2 items-center mt-3">
                <input type="number" className="p-2 border rounded w-40" placeholder="Calories today" value={todayCalories as any} onChange={e=>setTodayCalories(e.target.value?Number(e.target.value):'')} />
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>{
                  const today = new Date(); const iso = today.toISOString().slice(0,10);
                  if (!todayCalories) return toast('Enter calories', 'error')
                  saveCalorieLog(iso, Number(todayCalories))
                  setTodayCalories('')
                }}>Add / Update</button>
                <button className="px-3 py-2 bg-gray-200 rounded" onClick={()=>{
                  // quick fill with requiredCalories if available
                  if (requiredCalories) setTodayCalories(requiredCalories)
                }}>Use target</button>
              </div>

              <div className="mt-4">
                <WorkoutChart data={calorieLogs.map(l=>({ date: l.date, calories: l.calories }))} requiredSeries={calorieLogs.map(l=>({ date: l.date, required: requiredCalories || 0 }))} />
              </div>

              {calorieLogs.length>0 && (
                <div className="mt-3">
                  <ul className="space-y-1">
                    {calorieLogs.map(l=> (
                      <li key={l.date} className="flex justify-between items-center p-2 border rounded">
                        <div>{l.date} — {l.calories} kcal</div>
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-gray-200 rounded" onClick={()=>{ setTodayCalories(l.calories); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
                          <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={()=>removeCalorieLog(l.date)}>Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-2 p-3 border rounded">
              <h3 className="font-medium">Recipe Suggestions</h3>
              <div className="flex gap-2 mt-2">
                <input className="p-2 border rounded" placeholder="Target Calories" value={targetCalories as any} onChange={e=>setTargetCalories(e.target.value?Number(e.target.value):'')} />
                <select className="p-2 border rounded" value={mealTime} onChange={e=>setMealTime(e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
                <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={handleGenerateSuggestion}>Generate</button>
              </div>
              <ul className="mt-3 space-y-2">
                {suggestions.map(s=> (
                  <li key={s._id} className="p-2 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{s.title}</div>
                          <div className="text-sm muted">Calories: {s.nutrition?.calories ?? '—'}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="px-2 py-1 bg-gray-200 rounded" onClick={()=>setSuggestionModal(s)}>Info</button>
                          <button className="px-2 py-1 bg-indigo-600 text-white rounded" onClick={async()=>{
                            try {
                              const payload = { ingredients: s.ingredients || [] }
                              const res = await import('../../services/recipesService').then(m=>m.generateRecipe(payload))
                              if (typeof window !== 'undefined') alert('Regenerated: ' + (res.title || 'ok'))
                            } catch(e){ if (typeof window !== 'undefined') alert('Failed to regenerate') }
                          }}>Regenerate</button>
                        </div>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
            {recentMeals.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">Recent meals</h3>
                <ul className="mt-2 space-y-2">
                  {recentMeals.map((m,i)=> (
                    <li key={i} className="p-2 border rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{m.title}</div>
                        <div className="text-sm muted">Added: {new Date(m.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={async()=>{
                          try {
                            await import('../../services/mealsService').then(s=>s.addMeal({ title: m.title, ingredients: m.ingredients || [] }))
                            if (typeof window !== 'undefined') window.alert('Added again')
                          } catch(e){ if (typeof window !== 'undefined') window.alert('Failed') }
                        }}>Add again</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={async()=>{
                try {
                  const res = await fetch(`/api/profile/${user?.id}/export`)
                  if (!res.ok) throw new Error('Export failed')
                  const j = await res.json()
                  const blob = new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `vitatrackr-profile-${user?.id}.json`
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                } catch(e) { toast('Export failed', 'error') }
              }}>Export profile (JSON)</button>
            </div>
          </div>
        </div>
      </main>
      <Modal open={!!suggestionModal} onClose={()=>setSuggestionModal(null)}>
        {suggestionModal && (
          <div>
            <h3 className="font-semibold mb-2">{suggestionModal.title}</h3>
            <pre className="text-sm muted p-2 bg-gray-50 rounded">{JSON.stringify(suggestionModal, null, 2)}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
}
