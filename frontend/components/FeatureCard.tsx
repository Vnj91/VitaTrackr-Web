"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function FeatureCard({ title, desc, href, icon }: { title:string, desc:string, href:string, icon: string }){
  const IconNode = () => {
    switch(icon){
      case 'dumbbell': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M21 7h-2v10h2V7zM5 7H3v10h2V7zM7 9h10v6H7z" fill="currentColor"/></svg>
      )
      case 'chart': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 13v5M12 8v10M17 5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
      case 'users': return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
      default: return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>
      )
    }
  }

  return (
    <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href={href} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-200">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-md"><IconNode /></div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </motion.a>
  )
}
