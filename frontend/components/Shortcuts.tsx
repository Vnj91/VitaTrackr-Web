"use client"

import React from 'react'
import Modal from './Modal'

export default function Shortcuts() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(()=>{
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && (document.activeElement && (document.activeElement as HTMLElement).tagName !== 'INPUT')) {
        const el = document.querySelector('input[placeholder*="ingredients"], input[type="search"]') as HTMLInputElement | null
        if (el) { e.preventDefault(); el.focus(); }
      }
      if (e.shiftKey && e.key === '?') setOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Modal open={open} onClose={()=>setOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h3>
        <ul className="list-disc list-inside">
          <li><strong>/</strong> — Focus main search / ingredients input</li>
          <li><strong>Shift+?</strong> — Show this help</li>
        </ul>
      </Modal>
    </>
  )
}
