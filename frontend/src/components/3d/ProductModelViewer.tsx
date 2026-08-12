"use client"

import React, { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Bounds, ContactShadows, Float } from "@react-three/drei"
import * as THREE from "three"

// Placeholder mesh if no model URL is provided or if loading fails
function FallbackModel() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.9}
          ior={1.5}
          thickness={0.5}
        />
      </mesh>
    </Float>
  )
}

// Actual GLTF Model Loader
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} castShadow receiveShadow />
}

export default function ProductModelViewer({ modelUrl }: { modelUrl?: string }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment for realistic reflections */}
        <Environment preset="studio" />
        
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            {modelUrl ? <Model url={modelUrl} /> : <FallbackModel />}
          </Bounds>
        </Suspense>

        {/* Soft shadow plane below the object */}
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />

        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={1}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}
