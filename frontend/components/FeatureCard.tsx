"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function FeatureCard({ title, desc, href, icon }: { title:string, desc:string, href:string, icon: string }){
  const IconNode = () => {
    switch(icon){
      case 'plans':
      case 'dumbbell': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M21 7h-2v10h2V7zM5 7H3v10h2V7zM7 9h10v6H7z" fill="currentColor"/></svg>
      )
      case 'progress':
      case 'chart': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 13v5M12 8v10M17 5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
      case 'community':
      case 'users': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
      case 'recipes': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M3 3h18v2H3V3zm2 6h14v11H5V9zm3 2v7" fill="currentColor"/></svg>
      )
      case 'nutrition': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" fill="currentColor"/></svg>
      )
      case 'calories': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M12 2s3 2 3 5c0 5-6 8-6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="1" fill="currentColor"/></svg>
      )
      case 'trainers': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM4 18c0-2.21 3-4 6-4s6 1.79 6 4v1H4v-1z" fill="currentColor"/></svg>
      )
      case 'pricing': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M12 1v22M5 7h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
      default: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>
      )
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="block bg-white rounded-2xl shadow-md p-6 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-shadow">
      <Link href={href} aria-label={`Open ${title}`} className="block">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-md"><IconNode /></div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-base text-gray-700">{desc}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
