"use client"

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function MotionButton({ children, className = '', ...rest }: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const hover = prefersReduced ? {} : { scale: 1.03 }
  const tap = prefersReduced ? {} : { scale: 0.98 }

  return (
    <motion.button
      whileHover={hover}
      whileTap={tap}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center justify-center gap-2 transition-shadow ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}
