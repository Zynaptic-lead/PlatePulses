'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingGlassUIProps {
  isMobile?: boolean
}

export function FloatingGlassUI({ isMobile = false }: FloatingGlassUIProps) {
  const panel1Ref = useRef<THREE.Group>(null)
  const panel2Ref = useRef<THREE.Group>(null)
  const panel3Ref = useRef<THREE.Group>(null)

  // Subtle 3D floating animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (panel1Ref.current) {
      panel1Ref.current.position.y = 1.0 + Math.sin(t * 1.1) * 0.05
      panel1Ref.current.rotation.y = Math.sin(t * 0.5) * 0.05
    }
    if (panel2Ref.current) {
      panel2Ref.current.position.y = -0.4 + Math.sin(t * 1.3 + 1) * 0.04
      panel2Ref.current.rotation.y = -Math.cos(t * 0.4) * 0.04
    }
    if (panel3Ref.current) {
      panel3Ref.current.position.y = 0.6 + Math.cos(t * 0.9 + 2) * 0.05
      panel3Ref.current.rotation.z = Math.sin(t * 0.3) * 0.03
    }
  })

  if (isMobile) {
    // Render concise overlay cards for mobile
    return (
      <group position={[0, 0.9, 0]} ref={panel1Ref}>
        <Html transform position={[0, 0, 0]} distanceFactor={6} zIndexRange={[100, 0]}>
          <div className="bg-gray-950/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl text-white select-none w-56">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600/90 text-[10px] font-black tracking-wider rounded-full text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
              </span>
              <span className="text-[10px] text-gray-400 font-mono">#PP-9821</span>
            </div>
            <p className="text-xs font-bold text-gray-100">Order in Preparation</p>
            <p className="text-[11px] text-amber-400 font-medium">Chef baking in wood oven</p>
          </div>
        </Html>
      </group>
    )
  }

  return (
    <group>
      {/* Panel 1: Top Left Live Status */}
      <group ref={panel1Ref} position={[-2.4, 1.2, 0.5]}>
        <Html transform position={[0, 0, 0]} distanceFactor={5.5} zIndexRange={[100, 0]}>
          <div className="bg-gray-950/80 backdrop-blur-xl border border-white/15 p-4 rounded-3xl shadow-2xl text-white select-none w-64 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-[10px] font-black tracking-widest rounded-full uppercase shadow-md shadow-red-600/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE STREAM
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-400 font-bold">1,420 Viewers</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Kitchen Order #PP-9821</p>
              <h4 className="text-sm font-bold text-white tracking-tight">Your Order Is Being Prepared</h4>
              <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                <span>🔥</span> Chef stretching artisan sourdough
              </p>
            </div>
          </div>
        </Html>
      </group>

      {/* Panel 2: Bottom Right ETA & Wallet status */}
      <group ref={panel2Ref} position={[2.2, -0.3, 0.8]}>
        <Html transform position={[0, 0, 0]} distanceFactor={5.5} zIndexRange={[100, 0]}>
          <div className="bg-gray-950/80 backdrop-blur-xl border border-white/15 p-4 rounded-3xl shadow-2xl text-white select-none w-60 ring-1 ring-white/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400 font-medium">Estimated Delivery</span>
              <span className="text-emerald-400 font-extrabold font-mono text-sm">22 min</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-3/4 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-300 font-medium pt-1 border-t border-white/10">
              <span>Payment Status:</span>
              <span className="text-emerald-400 font-bold">PlatePulse Wallet (Paid)</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Panel 3: Top Right Kitchen Spec */}
      <group ref={panel3Ref} position={[2.3, 1.5, -0.4]}>
        <Html transform position={[0, 0, 0]} distanceFactor={5.5} zIndexRange={[100, 0]}>
          <div className="bg-gray-950/75 backdrop-blur-md border border-white/10 px-3.5 py-2.5 rounded-2xl shadow-xl text-white select-none flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xs">
              450°
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-200">Wood-Fired Stone Oven</p>
              <p className="text-[10px] text-gray-400">San Marzano & Buffalo Mozzarella</p>
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
