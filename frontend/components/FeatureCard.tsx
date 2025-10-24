"use client"

import React from 'react'
import { motion } from 'framer-motion'

export default function FeatureCard({ title, desc, href, Icon }: { title:string, desc:string, href:string, Icon: React.FC }){
  return (
    <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href={href} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-200">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-indigo-50 rounded-md"><Icon /></div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </motion.a>
  )
}
