'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface CameraControllerProps {
  scrollProgressRef: React.RefObject<number>
  isMobile?: boolean
}

export function CameraController({ scrollProgressRef, isMobile = false }: CameraControllerProps) {
  const { camera } = useThree()

  // Track mouse coordinates normalized from -1 to 1
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const reducedMotionRef = useRef(false)

  // Camera trajectory keyframe positions for scroll progression
  const cameraPath = useRef([
    { pos: new THREE.Vector3(0, 1.2, 4.2), lookAt: new THREE.Vector3(0, 0.2, 0) },     // Section 1: Close-up food
    { pos: new THREE.Vector3(1.2, 2.0, 5.8), lookAt: new THREE.Vector3(0, 0.4, 0) },    // Section 2: Pull back, reveal marble counter
    { pos: new THREE.Vector3(2.6, 2.4, 4.5), lookAt: new THREE.Vector3(1.0, 0.5, -1.0) },// Section 3: Pan toward chef station
    { pos: new THREE.Vector3(0.0, 3.8, 6.5), lookAt: new THREE.Vector3(0, 0.5, -2.0) }, // Section 4: Wide overhead kitchen shot
    { pos: new THREE.Vector3(-1.2, 2.2, 5.0), lookAt: new THREE.Vector3(0, 0.3, 0) },   // Section 5: Transition into content
  ])

  useEffect(() => {
    // Check reduced motion setting
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mediaQuery.matches

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }
    mediaQuery.addEventListener('change', handleMotionChange)

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotionRef.current) return
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame((_, delta) => {
    if (reducedMotionRef.current) {
      camera.position.set(0, 1.5, 4.8)
      camera.lookAt(0, 0.2, 0)
      return
    }

    // Smoothly lerp mouse target values
    const lerpFactor = isMobile ? 0.02 : 0.04
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, lerpFactor)
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, lerpFactor)

    // Get current scroll progress [0..1]
    const p = Math.max(0, Math.min(1, scrollProgressRef.current || 0))

    // Calculate position along multi-segment spline path
    const path = cameraPath.current
    const totalSegments = path.length - 1
    const scaledProgress = p * totalSegments
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1)
    const segmentT = scaledProgress - segmentIndex

    const currentKey = path[segmentIndex]
    const nextKey = path[segmentIndex + 1] || currentKey

    // Interpolate camera position and target lookAt
    const basePos = new THREE.Vector3().lerpVectors(currentKey.pos, nextKey.pos, segmentT)
    const baseLookAt = new THREE.Vector3().lerpVectors(currentKey.lookAt, nextKey.lookAt, segmentT)

    // Add subtle mouse offset parallax
    const mouseOffsetX = mouseRef.current.x * (isMobile ? 0.15 : 0.45)
    const mouseOffsetY = -mouseRef.current.y * (isMobile ? 0.1 : 0.3)

    const targetCameraPos = new THREE.Vector3(
      basePos.x + mouseOffsetX,
      basePos.y + mouseOffsetY,
      basePos.z
    )

    // Smooth lerp camera to position
    camera.position.lerp(targetCameraPos, Math.min(1, delta * 4))

    // Smooth lerp camera lookAt
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    const targetLookDir = baseLookAt.clone().sub(camera.position).normalize()
    
    camera.lookAt(baseLookAt.x + mouseOffsetX * 0.2, baseLookAt.y + mouseOffsetY * 0.2, baseLookAt.z)
  })

  return null
}
