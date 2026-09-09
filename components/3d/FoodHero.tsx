'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface FoodHeroProps {
  position?: [number, number, number]
  scale?: number
}

function GLTFFoodModel({ url, position, scale }: { url: string; position: [number, number, number]; scale: number }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} scale={scale} />
}

export function FoodHero({ position = [0, 0, 0], scale = 1.0 }: FoodHeroProps) {
  const foodGroupRef = useRef<THREE.Group>(null)
  const [hasGLTFModel, setHasGLTFModel] = useState(false)
  const gltfUrl = '/models/platepulse/food.glb'

  useEffect(() => {
    fetch(gltfUrl, { method: 'HEAD' })
      .then(res => setHasGLTFModel(res.ok))
      .catch(() => setHasGLTFModel(false))
  }, [])

  // Micro-levitation & subtle tilt in frame loop
  useFrame((state) => {
    if (!foodGroupRef.current) return
    const t = state.clock.getElapsedTime()
    // Subtle breathing float
    foodGroupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.04
    // Subtle rotation offset (keep food stable, not spinning like a toy)
    foodGroupRef.current.rotation.y = Math.sin(t * 0.4) * 0.1
    foodGroupRef.current.rotation.x = Math.cos(t * 0.3) * 0.02
  })

  if (hasGLTFModel) {
    return (
      <group ref={foodGroupRef}>
        <React.Suspense fallback={<ProceduralFoodDish />}>
          <GLTFFoodModel url={gltfUrl} position={position} scale={scale} />
        </React.Suspense>
      </group>
    )
  }

  return (
    <group ref={foodGroupRef} position={position} scale={scale}>
      <ProceduralFoodDish />
    </group>
  )
}

// High-detail procedural PBR gourmet dish representation
function ProceduralFoodDish() {
  return (
    <group>
      {/* Premium Ceramic Dish Base */}
      {/* Outer Ceramic Plate Rim */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.2, 1.8, 0.16, 64]} />
        <meshPhysicalMaterial
          color="#0f0f11"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          reflectivity={0.9}
        />
      </mesh>

      {/* Inner White Porcelain Basin */}
      <mesh position={[0, -0.07, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.85, 1.6, 0.08, 64]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.1}
          metalness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Gourmet Artisanal Food Base - Wood Fired Crust / Sear */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.45, 1.4, 0.18, 48]} />
        <meshStandardMaterial
          color="#c2410c"
          roughness={0.7}
          metalness={0.1}
          bumpScale={0.05}
        />
      </mesh>

      {/* Melted Artisanal Cheese / Creamy Layer */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.3, 1.35, 0.08, 48]} />
        <meshPhysicalMaterial
          color="#fef08a"
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
        />
      </mesh>

      {/* Toppings / Pepperoni Slices & Charred Accents */}
      {[
        [-0.45, 0.20, 0.35],
        [0.4, 0.20, -0.3],
        [-0.2, 0.20, -0.5],
        [0.5, 0.20, 0.3],
        [0.0, 0.21, 0.1],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh receiveShadow castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.05, 32]} />
            <meshStandardMaterial
              color="#991b1b"
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
          {/* Charred rim border */}
          <mesh position={[0, 0.03, 0]}>
            <torusGeometry args={[0.25, 0.02, 16, 32]} />
            <meshStandardMaterial color="#450a0a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Fresh Organic Basil Leaves / Micro Herb Garnishes */}
      {[
        [-0.2, 0.24, 0.1, 0.4],
        [0.25, 0.24, 0.4, -0.6],
        [0.1, 0.24, -0.35, 0.8],
        [-0.4, 0.23, -0.2, -0.3],
      ].map(([x, y, z, rot], idx) => (
        <group key={idx} position={[x, y, z]} rotation={[0.1, rot, 0.15]}>
          <mesh receiveShadow castShadow>
            <sphereGeometry args={[0.12, 16, 16]} scale={[1, 0.15, 1.8]} />
            <meshStandardMaterial
              color="#15803d"
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>
        </group>
      ))}

      {/* Extra Virgin Olive Oil Drizzle Highlights */}
      <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0.5]}>
        <torusGeometry args={[0.65, 0.03, 16, 64]} />
        <meshPhysicalMaterial
          color="#ca8a04"
          roughness={0.05}
          transmission={0.8}
          thickness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Micro Steam Glow Mesh Base */}
      <pointLight position={[0, 0.3, 0]} intensity={1.2} color="#f97316" distance={2.5} />
    </group>
  )
}
