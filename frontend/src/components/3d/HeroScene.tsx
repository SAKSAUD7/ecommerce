"use client"

import React, { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, PresentationControls, MeshTransmissionMaterial, Sparkles } from "@react-three/drei"
import * as THREE from "three"

import { Html } from "@react-three/drei"

function SpatialProduct() {
  const group = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    if (group.current) {
      time.current += delta
      group.current.rotation.y = Math.sin(time.current * 0.2) * 0.2
    }
  })

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Placeholder for the Bag 3D Model */}
        <mesh position={[0, -0.5, 0]} scale={1.2}>
          <boxGeometry args={[2, 1.8, 1]} />
          <MeshTransmissionMaterial
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#111111"
          />
        </mesh>
        
        {/* Spatial UI Elements */}
        <Html position={[1.5, 1, 0]} center className="pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md border border-black/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white transition-colors group">
            <div className="w-2 h-2 rounded-full bg-black group-hover:bg-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Premium Leather</span>
          </div>
        </Html>
        
        <Html position={[-1.8, -0.5, 1]} center className="pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md border border-black/10 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-black hover:text-white transition-colors group">
            <div className="w-2 h-2 rounded-full bg-black group-hover:bg-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Titanium Hardware</span>
          </div>
        </Html>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={["#F5F2EB", 8, 20]} />
        
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#e5dcd3" />

        <PresentationControls
          global
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <SpatialProduct />
        </PresentationControls>

        {/* Ambient Particles - Darker for beige bg */}
        <Sparkles count={150} scale={12} size={1.5} speed={0.4} opacity={0.15} color="#000000" />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
