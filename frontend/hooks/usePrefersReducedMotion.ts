"use client"

import { useEffect, useState } from 'react'

/**
 * Hook to centrally detect prefers-reduced-motion and subscribe to changes.
 * Returns true when the user prefers reduced motion.
 */
export default function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // MediaQueryListEvent has .matches; older browsers may call with MediaQueryList
      // so we guard accordingly
      // @ts-ignore
      setPrefersReduced(typeof e.matches === 'boolean' ? e.matches : mq.matches)
    }

    // initialize
    setPrefersReduced(mq.matches)

    // subscribe
    if ('addEventListener' in mq) {
      // modern
      // @ts-ignore - lib.dom types may differ across environments
      mq.addEventListener('change', handleChange)
      return () => {
        // @ts-ignore
        mq.removeEventListener('change', handleChange)
      }
    } else if ('addListener' in mq) {
      // legacy
      // @ts-ignore
      mq.addListener(handleChange)
      return () => {
        // @ts-ignore
        mq.removeListener(handleChange)
      }
    }
  }, [])

  return prefersReduced
}
