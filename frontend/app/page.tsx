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
            <div className="rounded overflow-hidden surface h-48 p-4 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Personalized Plans</h3>
                <p className="text-sm muted">Tailored workouts for your goals</p>
              </div>
            </div>
            <div className="rounded overflow-hidden surface h-48 md:col-span-2 p-4 flex items-center">
              <div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-sm muted">Visualize your workouts and nutrition</p>
              </div>
            </div>
            <div className="rounded overflow-hidden surface h-48 p-4 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm muted">Join challenges with friends</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
