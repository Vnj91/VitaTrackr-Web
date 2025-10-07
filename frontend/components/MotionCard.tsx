"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function MotionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hover = prefersReduced ? {} : { y: -4, scale: 1.01 }
  const tap = prefersReduced ? {} : { scale: 0.995 }

  return (
    <motion.div
      whileHover={hover}
      whileTap={tap}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={`rounded shadow-sm hover:shadow-md bg-white dark:bg-gray-800 ${className}`}
    >
      {children}
    </motion.div>
  )
}
