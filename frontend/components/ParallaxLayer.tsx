"use client"

import React, { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

type ParallaxProps = {
  children: React.ReactNode
  depth?: number // multiplier for the parallax effect (smaller = subtler)
  className?: string
  style?: React.CSSProperties
}

export default function ParallaxLayer({ children, depth = 0.12, className = '', style = {} }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (prefersReduced) return

    const el = ref.current
    if (!el) return

    let rafId: number | null = null

    const update = () => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const winH = window.innerHeight || 1
      // progress roughly -1..1 where 0 means element centered in viewport
      const progress = (rect.top - winH / 2) / winH
      // apply a gentle translation based on depth
      const translateY = progress * depth * 100
      el.style.transform = `translate3d(0, ${translateY}px, 0)`
      rafId = null
    }

    const onScroll = () => {
      if (rafId == null) rafId = window.requestAnimationFrame(update)
    }

    // seed initial position
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [depth, prefersReduced])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', transition: 'transform 120ms linear', ...style }}>
      {children}
    </div>
  )
}
