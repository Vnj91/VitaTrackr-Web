import React from 'react'
import Link from 'next/link'

export default function RecipeSuggestionsPage(){
  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recipe Suggestions</h1>
      <p className="text-gray-700 mb-6">Personalized recipe suggestions based on your preferences and history. Placeholder content for now.</p>
      <Link href="/" className="text-indigo-600">← Back to home</Link>
    </div>
  )
}
