"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function MotionList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const container = {
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

  return (
    <motion.div initial="hidden" animate="show" variants={container} className={className}>
      {children}
    </motion.div>
  )
}
