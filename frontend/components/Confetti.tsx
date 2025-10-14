"use client"

import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Lightweight canvas confetti. Pure JS, no deps. Call `start()` to trigger a burst.
export default function Confetti({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const canvas = canvasRef.current!
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let particles: any[] = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.vy += 0.2 // gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size)
        ctx.restore()
        if (p.y > canvas.height + 50) particles.splice(i, 1)
      })
      // write back to element so start() can append
      ;(canvas as any)._particles = particles
      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [prefersReduced])

  // exported helper on the element to trigger confetti
  useEffect(() => {
    const el = canvasRef.current as any
    if (!el || prefersReduced) return

    el.start = (count = 24) => {
      const canvas = canvasRef.current!
      const colors = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6']
      const particles = [] as any[]
      for (let i=0;i<count;i++) {
        particles.push({
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
      // push particles into internal list (store on element)
      el._particles = (el._particles || []).concat(particles)
      // also push into current render cycle
      ;(canvasRef.current as any)._particles = (canvasRef.current as any)._particles || []
      ;(canvasRef.current as any)._particles = (canvasRef.current as any)._particles.concat(particles)
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return <canvas ref={canvasRef} className={className} style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 60 }} />
}
