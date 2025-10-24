"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function MotionList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReduced = usePrefersReducedMotion()

  const container = prefersReduced
    ? {
        hidden: { opacity: 0, y: 0 },
        show: { opacity: 1, y: 0, transition: { staggerChildren: 0, when: 'beforeChildren' } }
      }
    : {
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: 0.06,
            when: 'beforeChildren'
          }
        }
      }

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div initial="hidden" animate="show" variants={container} className={className}>
      {children}
    </motion.div>
  )
}
