'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SteamParticlesProps {
  position?: [number, number, number]
  isMobile?: boolean
}

export function SteamParticles({ position = [0, 0.4, 0], isMobile = false }: SteamParticlesProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Reduce particle count on mobile for max FPS
  const particleCount = isMobile ? 12 : 32

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 0.4,
        y: Math.random() * 1.5,
        z: (Math.random() - 0.5) * 0.4,
        scale: 0.15 + Math.random() * 0.25,
        opacity: 0.15 + Math.random() * 0.25,
        speed: 0.3 + Math.random() * 0.4,
        wobbleSpeed: 1 + Math.random() * 2,
        seed: Math.random() * Math.PI * 2,
      })
    }
    return temp
  }, [particleCount])

  // Custom transparent soft particle texture created procedurally
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(255, 245, 235, 0.6)')
      gradient.addColorStop(0.4, 'rgba(240, 230, 220, 0.25)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const p = particles[i]
      if (!p || !(child instanceof THREE.Sprite)) return

      // Move particle upward
      p.y += delta * p.speed
      if (p.y > 1.8) {
        p.y = 0
        p.x = (Math.random() - 0.5) * 0.3
        p.z = (Math.random() - 0.5) * 0.3
      }

      // Lateral drift
      const currentX = p.x + Math.sin(time * p.wobbleSpeed + p.seed) * 0.08
      const currentZ = p.z + Math.cos(time * p.wobbleSpeed + p.seed) * 0.08

      child.position.set(currentX, p.y, currentZ)

      // Fade opacity as it rises
      const progress = p.y / 1.8
      const fadeOpacity = Math.sin(progress * Math.PI) * p.opacity
      if (child.material) {
        child.material.opacity = fadeOpacity
      }

      // Expand size gently
      const currentScale = p.scale * (1 + progress * 0.8)
      child.scale.set(currentScale, currentScale, 1)
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {particles.map((_, i) => (
        <sprite key={i}>
          <spriteMaterial
            map={particleTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  )
}
