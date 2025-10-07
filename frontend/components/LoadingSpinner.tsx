"use client"

import React from 'react'

export default function LoadingSpinner({ size = 24 }: { size?: number }){
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" className="animate-spin" aria-hidden>
      <circle cx="25" cy="25" r="20" strokeWidth="4" stroke="#e5e7eb" fill="none" />
      <path d="M45 25a20 20 0 0 1-20 20" strokeWidth="4" stroke="#4f46e5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
