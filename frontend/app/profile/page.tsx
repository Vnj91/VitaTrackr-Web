import React from 'react'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bg-white p-4 rounded shadow">
          <label className="block">
            <span className="text-sm text-gray-600">Name</span>
            <input className="mt-1 block w-full border rounded p-2" defaultValue="Tanishq" />
          </label>
          <label className="block mt-3">
            <span className="text-sm text-gray-600">Allergies (comma separated)</span>
            <input className="mt-1 block w-full border rounded p-2" defaultValue="nuts" />
          </label>
          <div className="mt-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save Profile</button>
          </div>
        </div>
      </main>
    </div>
  )
}
