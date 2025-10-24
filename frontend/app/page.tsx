import React from 'react'
import HeroSection from '../components/HeroSection'
import Stats from '../components/Stats'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'

const DumbbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M21 7h-2v10h2V7zM5 7H3v10h2V7zM7 9h10v6H7z" fill="currentColor"/></svg>
)

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 13v5M12 8v10M17 5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
)

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <main className="px-4">
        <HeroSection />

        <section className="mt-6">
          <Stats items={[{ label: 'Expert Trainers', value: 105 }, { label: 'Members Joined', value: 970 }, { label: 'Fitness Programs', value: 135 }]} />
        </section>

        <section className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Personalized Plans" desc="Tailored workouts for your goals" href="/plans" Icon={DumbbellIcon} />
            <FeatureCard title="Track Progress" desc="Visualize your workouts and nutrition" href="/progress" Icon={ChartIcon} />
            <FeatureCard title="Community" desc="Join challenges with friends" href="/community" Icon={UsersIcon} />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
