"use client"

import React from 'react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

export default function MotionButton({ children, className = '', ...rest }: { children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) {
    return (
      <button type="button" className={`inline-flex items-center justify-center gap-2 ${className}`} {...(rest as any)}>
        {children}
      </button>
    )
  }

  const hover = { scale: 1.03 }
  const tap = { scale: 0.985 }

  return (
    <motion.button
      type="button"
      whileHover={hover}
      whileTap={tap}
  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
  className={`inline-flex items-center justify-center gap-2 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}
