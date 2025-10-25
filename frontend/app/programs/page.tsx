"use client"

import React from 'react'

export default function ProgramsPage(){
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Programs (deprecated)</h1>
        <p className="text-gray-700">Fitness programs have been deprecated in this build. The app is focusing on nutrition features: calories tracking, recipe generation and suggestions.</p>
        <div className="mt-6">
          <p className="mb-3">You can access nutrient features here:</p>
          <div className="flex gap-3">
            <a href="/profile" className="px-3 py-2 bg-indigo-600 text-white rounded">Profile (calories)</a>
            <a href="/recipes" className="px-3 py-2 bg-green-600 text-white rounded">Recipes</a>
            <a href="/nutrition" className="px-3 py-2 bg-gray-200 rounded">Nutrition</a>
          </div>
        </div>
      </main>
    </div>
  )
}
