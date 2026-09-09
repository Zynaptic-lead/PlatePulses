'use client'

import React, { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

interface KitchenEnvironmentProps {
  position?: [number, number, number]
}

function GLTFKitchenModel({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} />
}

export function KitchenEnvironment({ position = [0, -1.2, -4] }: KitchenEnvironmentProps) {
  const [hasGLTFModel, setHasGLTFModel] = useState(false)
  const gltfUrl = '/models/platepulse/kitchen.glb'

  useEffect(() => {
    fetch(gltfUrl, { method: 'HEAD' })
      .then(res => setHasGLTFModel(res.ok))
      .catch(() => setHasGLTFModel(false))
  }, [])

  if (hasGLTFModel) {
    return (
      <React.Suspense fallback={<ProceduralKitchenEnvironment position={position} />}>
        <GLTFKitchenModel url={gltfUrl} position={position} />
      </React.Suspense>
    )
  }

  return <ProceduralKitchenEnvironment position={position} />
}

// Procedural Dark Luxury Restaurant & Open Kitchen Architecture
function ProceduralKitchenEnvironment({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main Chef Workstation Counter - Black Quartz / Dark Marble Surface */}
      <mesh position={[0, 0, 1.5]} receiveShadow>
        <boxGeometry args={[14, 0.8, 4]} />
        <meshPhysicalMaterial
          color="#0c0c0e"
          roughness={0.15}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Counter Edge Copper Trim Detail */}
      <mesh position={[0, 0.39, 3.48]}>
        <boxGeometry args={[14.1, 0.05, 0.08]} />
        <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Back Wall - Charcoal Matte Tiles / Architectural Slats */}
      <mesh position={[0, 4, -5]} receiveShadow>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#09090b" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Architectural Warm LED Light Strips on Back Wall */}
      <mesh position={[0, 4.5, -4.9]}>
        <boxGeometry args={[18, 0.08, 0.04]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0, 2.5, -4.9]}>
        <boxGeometry args={[18, 0.08, 0.04]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
      </mesh>

      {/* Open Kitchen Stainless Steel Appliances & Pass-Through Shelving */}
      <group position={[0, 2, -3]}>
        {/* Upper Stainless Shelf */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[10, 0.08, 1.2]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Copper & Brass Sauce Pans Hanging */}
        {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((x, i) => (
          <group key={i} position={[x, 0.7, 0.2]}>
            {/* Hanging Cable */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
              <meshStandardMaterial color="#27272a" />
            </mesh>
            {/* Pan Body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#b45309' : '#52525b'}
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Glass Partition Wall dividing Dining & Kitchen */}
      <mesh position={[0, 2.5, -1]} receiveShadow>
        <planeGeometry args={[16, 5]} />
        <meshPhysicalMaterial
          color="#000000"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>

      {/* Brass Glass Frame Posts */}
      {[-6, -2, 2, 6].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -0.98]}>
          <cylinderGeometry args={[0.04, 0.04, 5, 16]} />
          <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}

      {/* Overhead Copper Pendant Lights over Kitchen Counter */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={i} position={[x, 4.8, 1.5]}>
          {/* Cord */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 2, 8]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          {/* Copper Shade */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[0.35, 0.4, 32]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Glowing Bulb */}
          <mesh position={[0, -0.1, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffedd5" emissive="#f97316" emissiveIntensity={5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
