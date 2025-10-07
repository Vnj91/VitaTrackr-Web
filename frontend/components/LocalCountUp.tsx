"use client"

import { useEffect, useState } from 'react'

export default function LocalCountUp({ end = 0, duration = 1 } : { end?: number; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const steps = Math.max(10, Math.round(60 * duration))
    const increment = end / steps
    let current = 0
    const id = setInterval(() => {
      current += increment
      if (current >= end) {
        setValue(end)
        clearInterval(id)
      } else {
        setValue(Math.round(current))
      }
    }, (duration * 1000) / steps)
    return () => clearInterval(id)
  }, [end, duration])

  return <>{value}</>
}
