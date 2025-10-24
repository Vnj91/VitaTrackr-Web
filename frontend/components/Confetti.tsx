"use client"

import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Lightweight canvas confetti. Pure JS, no deps. Call `start()` to trigger a burst.
export default function Confetti({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)
  const particlesRef = useRef<any[]>([])
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (typeof window === 'undefined') return
      const c = canvasRef.current
      if (!c) return
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function render() {
      const c = canvasRef.current
      if (!c) return
      const context = c.getContext('2d')
      if (!context) return
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vy += 0.2 // gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vr
        context.save()
        context.translate(p.x, p.y)
        context.rotate(p.rotation)
        context.fillStyle = p.color
        context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        context.restore()
        if (p.y > c.height + 50) particles.splice(i, 1)
      }
      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [prefersReduced])

  // provide a safe start() helper that pushes into internal ref
  useEffect(() => {
    const el = canvasRef.current
    if (!el || prefersReduced) return

    const helper = (count = 24) => {
      const canvas = canvasRef.current!
      const colors = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6']
      const newParts: any[] = []
      for (let i=0;i<count;i++) {
        newParts.push({
          x: canvas.width/2 + (Math.random()-0.5)*200,
          y: canvas.height/3 + (Math.random()-0.5)*80,
          vx: (Math.random()-0.5) * 8,
          vy: -Math.random()*8 - 2,
          vr: (Math.random()-0.5) * 0.2,
          rotation: Math.random()*6,
          size: 6 + Math.random()*8,
          color: colors[Math.floor(Math.random()*colors.length)]
        })
      }
      particlesRef.current = particlesRef.current.concat(newParts)
    }

    // attach helper to element in a non-enumerable way if possible (best-effort)
    try {
      Object.defineProperty(el, 'startConfetti', { value: helper, writable: false, configurable: true })
    } catch (_) {
      ;(el as any).startConfetti = helper
    }
  }, [prefersReduced])

  if (prefersReduced) return null
  return <canvas ref={canvasRef} className={className} style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 60 }} />
}
