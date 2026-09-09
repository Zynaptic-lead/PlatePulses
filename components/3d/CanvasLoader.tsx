'use client'

import React from 'react'

export function CanvasLoader() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950 text-white transition-opacity duration-700 pointer-events-none">
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Ring */}
        <div className="w-16 h-16 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
        <div className="absolute w-10 h-10 bg-red-600/20 rounded-full animate-pulse" />
        <span className="absolute font-black text-sm text-red-500">P</span>
      </div>
      <div className="mt-4 space-y-1 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Loading 3D Live Kitchen</p>
        <p className="text-[10px] text-gray-500 font-medium">Preparing real-time cinematic environment...</p>
      </div>
    </div>
  )
}
