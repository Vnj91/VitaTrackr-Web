"use client"

import React from 'react'
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold text-white">FitForge</h4>
          <p className="text-sm text-gray-400 mt-2">Build strength. Stay consistent. Join our community.</p>
        </div>
        <div>
          <h5 className="font-semibold">Links</h5>
          <ul className="mt-2 space-y-1">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Follow</h5>
          <div className="flex items-center space-x-3 mt-2">
            <a aria-label="Instagram" href="#" className="p-2 rounded hover:bg-gray-800">IG</a>
            <a aria-label="Facebook" href="#" className="p-2 rounded hover:bg-gray-800">FB</a>
            <a aria-label="YouTube" href="#" className="p-2 rounded hover:bg-gray-800">YT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} FitForge — All rights reserved</div>
    </footer>
  )
}
