"use client"

import { motion } from 'framer-motion'
import LocalCountUp from './LocalCountUp'
import ParallaxLayer from './ParallaxLayer'
import MotionButton from './MotionButton'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Link from 'next/link'

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } }
  }

  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  const prefersReduced = usePrefersReducedMotion()

  return (
    <section className="py-12 relative overflow-visible">
      {/* decorative animated blob with parallax */}
      <ParallaxLayer depth={0.08} className="absolute -top-10 left-1/2 -translate-x-1/2 -z-10 w-[90%] max-w-4xl">
        {prefersReduced ? (
          <div aria-hidden style={{ opacity: 0.85 }}>
            <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className="w-full h-44">
              <defs>
                <linearGradient id="hgrad" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#eef2ff" />
                  <stop offset="100%" stopColor="#e9f5ff" />
                </linearGradient>
              </defs>
              <path fill="url(#hgrad)" d="M0,100 C120,20 240,180 600,80 L600,200 L0,200 Z" />
            </svg>
          </div>
        ) : (
          <motion.div aria-hidden initial={{ opacity: 0.6 }} animate={{ opacity: 0.9 }} transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}>
            <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice" className="w-full h-44">
              <defs>
                <linearGradient id="hgrad" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#eef2ff" />
                  <stop offset="100%" stopColor="#e9f5ff" />
                </linearGradient>
              </defs>
              <motion.path fill="url(#hgrad)" d="M0,100 C120,20 240,180 600,80 L600,200 L0,200 Z" animate={{ d: [
                'M0,100 C120,20 240,180 600,80 L600,200 L0,200 Z',
                'M0,120 C160,20 260,160 600,90 L600,200 L0,200 Z',
                'M0,80 C100,10 260,200 600,70 L600,200 L0,200 Z'
              ]}} transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
            </svg>
          </motion.div>
        )}
      </ParallaxLayer>

      <motion.div initial="hidden" animate="show" variants={container} className="text-center max-w-4xl mx-auto">
        <motion.h1 variants={item} className="text-4xl md:text-5xl font-extrabold mb-4">Unleash Your Strength: Transform Your Body with Our Fitness Programs</motion.h1>
        <motion.p variants={item} className="text-gray-600 mb-6">Unlock Your Potential: Achieve Your Fitness Goals with Our Tailored Programs</motion.p>
        <motion.div variants={item} className="mb-6">
          <Link href="/auth/register">
            <MotionButton className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">Get Started</MotionButton>
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex justify-center gap-8 mt-6">
          <div className="text-center">
              <div className="text-2xl font-bold"><LocalCountUp end={105} /></div>
            <div className="text-sm muted">Expert Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold"><LocalCountUp end={970} duration={1.4} /></div>
            <div className="text-sm muted">Member Joined</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold"><LocalCountUp end={135} duration={0.9} /></div>
            <div className="text-sm muted">Fitness Programs</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
