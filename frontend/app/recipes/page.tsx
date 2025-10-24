import React from 'react'
import Link from 'next/link'

export default function RecipesPage(){
  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Recipe Generator</h1>
  <p className="text-gray-700 mb-6">Generate recipes from a list of ingredients or by specifying dietary goals. This is a placeholder page — we will wire the generator next.</p>
      <div className="space-x-2">
        <Link href="/" className="text-indigo-600">← Back to home</Link>
      </div>
    </div>
  )
}
