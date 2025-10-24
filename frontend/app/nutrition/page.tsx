import React from 'react'
import Link from 'next/link'

export default function NutritionPage(){
  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Calories & Nutrition</h1>
      <p className="text-gray-700 mb-6">Track calories and macros for your meals and recipes. Placeholder page — tracker UI coming next.</p>
      <Link href="/" className="text-indigo-600">← Back to home</Link>
    </div>
  )
}
