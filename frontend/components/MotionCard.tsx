"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function MotionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReduced = usePrefersReducedMotion()
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
