"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

type Props = { children: React.ReactNode }

export default function PageTransition({ children }: Props) {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])

  const prefersReduced = usePrefersReducedMotion()

  // avoid animating on first mount to prevent flash
  if (!mounted) return <>{children}</>

  const variants = prefersReduced
    ? {
        initial: { opacity: 1 },
        enter: { opacity: 1 },
        exit: { opacity: 1 }
      }
    : {
        initial: { opacity: 0, y: 8, scale: 0.998 },
        enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.36, ease: 'easeOut' } },
        exit: { opacity: 0, y: -6, scale: 0.995, transition: { duration: 0.28, ease: 'easeIn' } }
      }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial="initial" animate="enter" exit="exit" variants={variants} className="relative overflow-hidden">
        {/* subtle decorative background (disabled when prefers-reduced-motion is active) */}
        {!prefersReduced && (
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40">
            <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#eef2ff" />
                  <stop offset="100%" stopColor="#f8fafc" />
                </linearGradient>
              </defs>
              <g fill="url(#g1)">
                <path d="M0,200 C150,100 350,300 800,150 L800,400 L0,400 Z" />
              </g>
            </svg>
          </div>
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  )
}

