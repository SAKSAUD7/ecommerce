"use client"

import React, { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, PresentationControls, Sparkles, Html } from "@react-three/drei"
import * as THREE from "three"

function LuxuryBagStage({ position, scale = 1, rotationSpeed = 0.2, tagText = "Italian Calfskin Leather", isMain = false, slug = "denoura-master-tote" }: { position: [number, number, number]; scale?: number; rotationSpeed?: number; tagText?: string; isMain?: boolean; slug?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      time.current += delta * rotationSpeed
      groupRef.current.rotation.y = Math.sin(time.current) * 0.28
      groupRef.current.rotation.x = Math.cos(time.current * 0.45) * 0.07
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.95}>
        {/* Main Sculpted Leather Tote Body */}
        <mesh position={[0, -0.1, 0]} scale={scale}>
          <boxGeometry args={[2.5, 2.0, 1.05]} />
          <meshStandardMaterial 
            color={isMain ? "#121212" : "#1F1F1F"} 
            roughness={0.12} 
            metalness={0.25}
          />
        </mesh>
        
        {/* Gold Clasp & Monogram Lock Details matching reference */}
        <mesh position={[0, 0.48, 0.54]} scale={scale * 0.88}>
          <boxGeometry args={[0.52, 0.32, 0.12]} />
          <meshStandardMaterial color="#C5A059" roughness={0.08} metalness={0.96} />
        </mesh>

        {/* Gold Cylinder Lock Accent */}
        <mesh position={[0, 0.48, 0.62]} rotation={[0, 0, Math.PI / 2]} scale={scale * 0.75}>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 32]} />
          <meshStandardMaterial color="#D5B069" roughness={0.05} metalness={0.98} />
        </mesh>

        {/* Leather Handles */}
        <mesh position={[0, 1.25, 0]} scale={scale * 0.98}>
          <torusGeometry args={[0.78, 0.075, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.22} />
        </mesh>

        {/* Interactive Spatial Tag */}
        {tagText && (
          <Html position={[1.5, 0.9, 0.3]} center className="pointer-events-auto">
            <a 
              href={`/shop/${slug}`}
              className="bg-[#0A192F]/95 backdrop-blur-md border border-[#C5A059] px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-[#C5A059] hover:text-black transition-all group duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-[#C5A059] group-hover:bg-black animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] group-hover:text-black whitespace-nowrap">
                {tagText} →
              </span>
            </a>
          </Html>
        )}
      </Float>
    </group>
  )
}

function StudioSculptures() {
  return (
    <group>
      {/* Stone Pedestal for centerpiece matching Reference Image 4 */}
      <mesh position={[0, -2.2, 0]} scale={[2.7, 0.65, 1.9]}>
        <cylinderGeometry args={[1.5, 1.65, 1, 32]} />
        <meshStandardMaterial color="#172234" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Floating Metallic Spheres matching Reference Images 1 & 4 */}
      <Float speed={1.8} floatIntensity={0.6}>
        <mesh position={[-3.2, -1.2, 0.5]} scale={0.28}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#C5A059" roughness={0.05} metalness={0.98} />
        </mesh>
      </Float>

      <Float speed={2.0} floatIntensity={0.7}>
        <mesh position={[3.2, 1.5, -0.5]} scale={0.22}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#D5B069" roughness={0.05} metalness={0.98} />
        </mesh>
      </Float>

      {/* Outer Floating Gold Accent Rings */}
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh position={[0, 0.2, -1]} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[3.3, 0.035, 16, 100]} />
          <meshStandardMaterial color="#C5A059" roughness={0.08} metalness={0.92} />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[0, -0.4, -0.5]} rotation={[-Math.PI / 4, -Math.PI / 4, 0]}>
          <torusGeometry args={[2.6, 0.025, 16, 100]} />
          <meshStandardMaterial color="#D5B069" roughness={0.08} metalness={0.92} />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[8, 12, 10]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[-10, -8, -5]} intensity={1.6} color="#C5A059" />
        <pointLight position={[0, 2, 4]} intensity={2.2} color="#D5B069" />

        <PresentationControls
          global
          rotation={[0, 0.1, 0]}
          polar={[-Math.PI / 5, Math.PI / 5]}
          azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
        >
          {/* Architectural Studio Stage Pedestal & Rings */}
          <StudioSculptures />

          {/* Main Flagship Master Tote (Center Foreground) */}
          <LuxuryBagStage 
            position={[0, -0.1, 0]} 
            scale={1.25} 
            rotationSpeed={0.25} 
            tagText="DE'NOURA Master Tote ($580)" 
            isMain={true}
            slug="aurelia-structured-tote" 
          />

          {/* Upper Left Floating Bag */}
          <LuxuryBagStage 
            position={[-2.6, 1.1, -1.8]} 
            scale={0.75} 
            rotationSpeed={0.18} 
            tagText="Royal Velvet Clutch ($299)" 
            slug="elise-evening-velvet-clutch"
          />

          {/* Lower Right Floating Bag */}
          <LuxuryBagStage 
            position={[2.6, -0.6, -1.4]} 
            scale={0.8} 
            rotationSpeed={0.22} 
            tagText="Italian Silk Crossbody ($320)" 
            slug="maison-leather-crossbody"
          />

          {/* Background Left Mini Bag */}
          <LuxuryBagStage 
            position={[-1.8, -1.2, -2.2]} 
            scale={0.65} 
            rotationSpeed={0.15} 
            tagText="Aurelia Quilted Mini ($310)" 
            slug="camille-quilted-mini"
          />

          {/* Background Right Top Handle Bag */}
          <LuxuryBagStage 
            position={[1.8, 1.3, -2.0]} 
            scale={0.7} 
            rotationSpeed={0.2} 
            tagText="Noelle Top Handle Bag ($620)" 
            slug="elan-mini-top-handle"
          />
        </PresentationControls>

        {/* Ambient Floating Gold Particles */}
        <Sparkles count={160} scale={11} size={2.2} speed={0.65} opacity={0.42} color="#C5A059" />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
