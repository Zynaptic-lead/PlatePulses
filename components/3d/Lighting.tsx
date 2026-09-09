'use client'

import React from 'react'

interface LightingProps {
  isMobile?: boolean
}

export function Lighting({ isMobile = false }: LightingProps) {
  return (
    <>
      {/* Ambient background illuminate */}
      <ambientLight intensity={0.4} color="#18181b" />

      {/* Key Warm Food Spotlight */}
      <spotLight
        position={[2, 6, 4]}
        angle={0.45}
        penumbra={0.7}
        intensity={isMobile ? 3.0 : 4.5}
        color="#ffaa44"
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-bias={-0.0001}
      />

      {/* Cool Rim Light for Depth */}
      <spotLight
        position={[-4, 4, -3]}
        angle={0.6}
        penumbra={0.8}
        intensity={2.0}
        color="#38bdf8"
      />

      {/* Kitchen Background Warm Glow Lights */}
      <pointLight position={[-3, 2, -6]} intensity={2.5} color="#f97316" distance={10} />
      <pointLight position={[4, 2.5, -5]} intensity={2.0} color="#fbbf24" distance={10} />
      <pointLight position={[0, 4, -8]} intensity={1.5} color="#ef4444" distance={12} />

      {/* Soft Fill Light */}
      <directionalLight position={[0, 3, 5]} intensity={0.6} color="#ffffff" />
    </>
  )
}
