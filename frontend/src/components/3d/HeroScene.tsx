"use client"

import React, { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, PresentationControls, MeshTransmissionMaterial, Sparkles, Html } from "@react-three/drei"
import * as THREE from "three"

function LuxuryBagModel({ position, scale = 1, rotationSpeed = 0.2, tagText = "Italian Calfskin Leather", isMain = false }: { position: [number, number, number]; scale?: number; rotationSpeed?: number; tagText?: string; isMain?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      time.current += delta * rotationSpeed
      groupRef.current.rotation.y = Math.sin(time.current) * 0.25
      groupRef.current.rotation.x = Math.cos(time.current * 0.5) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
        {/* Main Leather Tote Body */}
        <mesh position={[0, -0.2, 0]} scale={scale}>
          <boxGeometry args={[2.2, 1.8, 0.9]} />
          <meshStandardMaterial 
            color={isMain ? "#1A1A1A" : "#2A2A2A"} 
            roughness={0.2} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Gold Clasp & Hardware Details */}
        <mesh position={[0, 0.5, 0.46]} scale={scale * 0.8}>
          <boxGeometry args={[0.4, 0.25, 0.1]} />
          <meshStandardMaterial color="#C5A059" roughness={0.1} metalness={0.9} />
        </mesh>

        {/* Leather Handles */}
        <mesh position={[0, 1.1, 0]} scale={scale * 0.9}>
          <torusGeometry args={[0.7, 0.06, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.3} />
        </mesh>

        {/* Interactive Spatial Tag */}
        {tagText && (
          <Html position={[1.4, 0.8, 0.2]} center className="pointer-events-auto">
            <div className="bg-[#0A192F]/90 backdrop-blur-md border border-[#C5A059]/40 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-[#C5A059] hover:text-black transition-all group">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] group-hover:bg-black" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] group-hover:text-black whitespace-nowrap">
                {tagText}
              </span>
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 12, 8]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#C5A059" />

        <PresentationControls
          global
          rotation={[0, 0.15, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          {/* Main Centerpiece Bag */}
          <LuxuryBagModel 
            position={[0, -0.2, 0]} 
            scale={1.2} 
            rotationSpeed={0.3} 
            tagText="DE'NOURA Master Tote" 
            isMain={true} 
          />

          {/* Left Spatial Bag */}
          <LuxuryBagModel 
            position={[-2.4, 0.8, -1.5]} 
            scale={0.8} 
            rotationSpeed={0.2} 
            tagText="Royal Velvet Clutch" 
          />

          {/* Right Spatial Bag */}
          <LuxuryBagModel 
            position={[2.4, -0.6, -1.2]} 
            scale={0.85} 
            rotationSpeed={0.25} 
            tagText="Italian Silk Crossbody" 
          />
        </PresentationControls>

        {/* Ambient Gold Particles */}
        <Sparkles count={120} scale={10} size={1.8} speed={0.5} opacity={0.35} color="#C5A059" />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
