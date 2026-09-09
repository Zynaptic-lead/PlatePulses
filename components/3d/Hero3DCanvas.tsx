'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { CanvasLoader } from './CanvasLoader'
import * as THREE from 'three'

interface Hero3DCanvasProps {
  scrollProgressRef: React.RefObject<number>
}

export function Hero3DCanvas({ scrollProgressRef }: Hero3DCanvasProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasWebGLError, setHasWebGLError] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted) {
    return <CanvasLoader />
  }

  if (hasWebGLError) {
    // Graceful dark cinematic fallback
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-6 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-md">
          <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
            P
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Kitchen Broadcast</h3>
          <p className="text-xs text-gray-400 mt-1">Experiencing high real-time order volume. Browse live streaming kitchens below!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          camera={{
            position: [0, 1.2, 4.2],
            fov: isMobile ? 55 : 45,
            near: 0.1,
            far: 30,
          }}
          onError={() => setHasWebGLError(true)}
          className="w-full h-full"
        >
          <color attach="background" args={['#09090b']} />
          <Scene scrollProgressRef={scrollProgressRef} isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  )
}
