"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function PageTransition({ children }: any) {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  const prefersReduced = usePrefersReducedMotion()

  // don't animate on first mount to avoid initial flash
  if (!mounted) return <>{children}</>

  const variants = prefersReduced
    ? {
        initial: { opacity: 1, y: 0, scale: 1 },
        enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.06 } },
        exit: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.04 } }
      }
    : {
        initial: { opacity: 0, y: 8, scale: 0.998 },
        enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: 'easeOut' } },
        exit: { opacity: 0, y: -6, scale: 0.995, transition: { duration: 0.28, ease: 'easeIn' } }
      }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial="initial" animate="enter" exit="exit" variants={variants} className="relative overflow-hidden">
        {/* subtle animated background blob (disabled for reduced motion) */}
        {!prefersReduced && (
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40" initial={{ scale: 0.95 }} animate={{ scale: 1.02 }} transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}>
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#eef2ff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
              </defs>
              <g fill="url(#g1)">
                <motion.path d="M0,200 C150,100 350,300 800,150 L800,400 L0,400 Z" animate={{ d: [
                  'M0,200 C150,100 350,300 800,150 L800,400 L0,400 Z',
                  'M0,180 C180,120 360,260 800,170 L800,400 L0,400 Z',
                  'M0,210 C140,80 340,320 800,160 L800,400 L0,400 Z'
                ]}} transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
              </g>
            </svg>
          </motion.div>
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  )
}
