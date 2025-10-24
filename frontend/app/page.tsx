import React from 'react'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'

// Icons are resolved inside FeatureCard to avoid passing functions from server -> client

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <main className="px-4">
        <HeroSection />

        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Recipe Generator" desc="Generate recipes from ingredients or goals" href="/recipes" icon="recipes" />
            <FeatureCard title="Recipe Suggestions" desc="Smart recipe recommendations based on your preferences" href="/recipes/suggestions" icon="nutrition" />
            <FeatureCard title="Calories Tracker" desc="Track calories and macros for meals and recipes" href="/nutrition" icon="calories" />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
