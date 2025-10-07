import React from 'react'
import HeroSection from '../components/HeroSection'
import StatCard from '../components/StatCard'

export default function Page() {
  return (
    <div className="min-h-screen">
      <main className="p-6">
        <HeroSection />
        <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard value={105} label="Expert Trainers" />
          <StatCard value={970} label="Members Joined" />
          <StatCard value={135} label="Fitness Programs" />
        </section>

        <section className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded overflow-hidden surface h-48" />
            <div className="rounded overflow-hidden surface h-48 md:col-span-2" />
            <div className="rounded overflow-hidden surface h-48" />
          </div>
        </section>
      </main>
    </div>
  )
}
