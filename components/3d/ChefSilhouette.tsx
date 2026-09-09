'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ChefSilhouetteProps {
  position?: [number, number, number]
}

function GLTFChefModel({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} />
}

export function ChefSilhouette({ position = [2.2, 0.2, -3.2] }: ChefSilhouetteProps) {
  const chefGroupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Group>(null)
  const [hasGLTFModel, setHasGLTFModel] = useState(false)
  const gltfUrl = '/models/platepulse/chef.glb'

  useEffect(() => {
    fetch(gltfUrl, { method: 'HEAD' })
      .then(res => setHasGLTFModel(res.ok))
      .catch(() => setHasGLTFModel(false))
  }, [])

  // Subtle natural preparation movement
  useFrame((state) => {
    if (!chefGroupRef.current) return
    const t = state.clock.getElapsedTime()
    // Subtle body posture shift
    chefGroupRef.current.position.x = position[0] + Math.sin(t * 0.8) * 0.08
    chefGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.06

    // Arm plating motion
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(t * 3.5) * 0.12
      armRef.current.rotation.z = Math.cos(t * 2.5) * 0.08
    }
  })

  if (hasGLTFModel) {
    return (
      <group ref={chefGroupRef}>
        <React.Suspense fallback={<ProceduralChefSilhouette position={position} armRef={armRef} />}>
          <GLTFChefModel url={gltfUrl} position={position} />
        </React.Suspense>
      </group>
    )
  }

  return (
    <group ref={chefGroupRef}>
      <ProceduralChefSilhouette position={position} armRef={armRef} />
    </group>
  )
}

function ProceduralChefSilhouette({
  position,
  armRef,
}: {
  position: [number, number, number]
  armRef: React.RefObject<THREE.Group | null>
}) {
  return (
    <group position={position} scale={[0.85, 0.85, 0.85]}>
      {/* Backlighting Spot for Chef Silhouette */}
      <pointLight position={[0, 1.8, -0.5]} intensity={3.5} color="#ea580c" distance={4} />

      {/* Chef Body - Dark Silhouette Jacket */}
      <mesh position={[0, 1.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.2, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Apron Layer */}
      <mesh position={[0, 0.8, 0.16]}>
        <boxGeometry args={[0.42, 0.9, 0.06]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>

      {/* Chef Head / Toque Silhouette */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>

      {/* Chef Hat (Toque Blanche) */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.45, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>

      {/* Animated Plating Arm */}
      <group ref={armRef} position={[-0.28, 1.3, 0.2]}>
        <mesh position={[0, -0.3, 0.2]} rotation={[0.6, -0.2, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.6, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        {/* Chef Hand */}
        <mesh position={[0, -0.55, 0.45]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
