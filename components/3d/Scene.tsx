'use client'

import React from 'react'
import { Lighting } from './Lighting'
import { KitchenEnvironment } from './KitchenEnvironment'
import { ChefSilhouette } from './ChefSilhouette'
import { FoodHero } from './FoodHero'
import { SteamParticles } from './SteamParticles'
import { FloatingGlassUI } from './FloatingGlassUI'
import { CameraController } from './CameraController'

interface SceneProps {
  scrollProgressRef: React.RefObject<number>
  isMobile?: boolean
}

export function Scene({ scrollProgressRef, isMobile = false }: SceneProps) {
  return (
    <>
      {/* Camera Controller driven by Mouse & ScrollTrigger */}
      <CameraController scrollProgressRef={scrollProgressRef} isMobile={isMobile} />

      {/* Atmospheric Fog for Depth */}
      <fog attach="fog" args={['#09090b', 4, 16]} />

      {/* Lighting Setup */}
      <Lighting isMobile={isMobile} />

      {/* Background Open Kitchen Architecture */}
      <KitchenEnvironment position={[0, -1.2, -4]} />

      {/* Chef Activity Station */}
      <ChefSilhouette position={[2.4, -0.4, -3.5]} />

      {/* Plated Food Hero Object */}
      <FoodHero position={[0, -0.2, 0]} scale={1.1} />

      {/* Rising Steam Effect */}
      <SteamParticles position={[0, 0.25, 0]} isMobile={isMobile} />

      {/* Floating 3D Glass Interface Panels */}
      <FloatingGlassUI isMobile={isMobile} />

      {/* Shadow Receiver Floor */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </>
  )
}
