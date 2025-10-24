import React from 'react'
import HeroSection from '../components/HeroSection'
import Stats from '../components/Stats'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'

// Icons are resolved inside FeatureCard to avoid passing functions from server -> client

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <main className="px-4">
        <HeroSection />

        <section className="mt-6">
          <Stats items={[{ label: 'Expert Trainers', value: 105 }, { label: 'Members Joined', value: 970 }, { label: 'Fitness Programs', value: 135 }]} />
        </section>

        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Personalized Plans" desc="Tailored workouts for your goals" href="/plans" icon="plans" />
            <FeatureCard title="Progress Tracking" desc="Visualize your workouts and progress over time" href="/progress" icon="progress" />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
