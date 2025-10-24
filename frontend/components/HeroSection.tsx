"use client"

import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import ParallaxLayer from './ParallaxLayer'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import Link from 'next/link'

export default function HeroSection() {
  const controls = useAnimation()

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } }
  }

  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

  const prefersReduced = usePrefersReducedMotion()
  useEffect(()=>{ controls.start('visible') }, [controls])

  return (
    <section className="pt-24 pb-12"> {/* account for fixed header */}
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


      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#0b1220] opacity-95" style={{mixBlendMode:'multiply'}} />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-full blur-3xl opacity-50 transform rotate-45" />
        <div className="max-w-6xl mx-auto relative z-10 px-6 text-white">
          <motion.h1 initial="hidden" animate={controls} variants={{ hidden:{ opacity:0, y:10 }, visible:{ opacity:1, y:0, transition:{ duration:0.6 } } }} className="text-3xl md:text-5xl font-extrabold leading-tight">
            Unleash Your Strength: Transform Your Body with Our Fitness Program
          </motion.h1>
          <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0, transition:{ delay:0.15 } }} className="mt-4 text-lg text-indigo-100 max-w-2xl">
            Personalized plans, expert coaching, and a community that keeps you motivated. Start your journey with a plan built for your goals.
          </motion.p>

          <div className="mt-6 flex items-center space-x-4">
            <Link href="/auth/register" className="inline-block">
              <motion.button whileTap={{ scale:0.97 }} className="px-5 py-3 rounded bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300">Get Started</motion.button>
            </Link>
            <Link href="/programs" className="text-sm text-indigo-200 hover:underline">Explore Programs</Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stats will be rendered by parent page, keep this area for spacing */}
          </div>
        </div>
        <div style={{ height: 220 }} />
      </div>
    </section>
  )
}
