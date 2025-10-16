"use client"

import { useEffect, useRef, useState } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

type Props = { end?: number; duration?: number; onComplete?: () => void }

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

export default function LocalCountUp({ end = 0, duration = 1, onComplete }: Props) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      setValue(Math.round(end))
      onComplete && onComplete()
      return
    }

    const start = performance.now()
    startRef.current = start

    function step(now: number) {
      const elapsed = now - (startRef.current ?? now)
      const t = Math.min(1, elapsed / (Math.max(0.05, duration) * 1000))
      const eased = easeOutCubic(t)
      setValue(Math.round(eased * end))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        rafRef.current = null
        onComplete && onComplete()
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [end, duration, onComplete, prefersReduced])

  return <>{value}</>
}
