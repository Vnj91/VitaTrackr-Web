"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function MotionListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReduced = usePrefersReducedMotion()

  const item = prefersReduced
    ? { hidden: { opacity: 0, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0.08 } } }
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } } }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
