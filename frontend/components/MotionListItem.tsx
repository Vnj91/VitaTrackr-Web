"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function MotionListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } }
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
