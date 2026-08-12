"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col text-black">
      <SpatialNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1000px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-6">About Aura</h1>
            <p className="text-sm tracking-widest text-black/60 font-medium uppercase max-w-2xl mx-auto">
              Redefining modest fashion through spatial commerce and uncompromised luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/50 border border-black/10 rounded-2xl aspect-[3/4] flex items-center justify-center p-8 relative overflow-hidden">
                <img src="/images/modest_fashion_1_1785929187741.png" alt="Aura Modest Fashion" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold uppercase tracking-[0.1em]">Our Vision</h2>
              <p className="text-sm leading-relaxed text-black/70 font-medium">
                At Aura, we believe that modest fashion is the pinnacle of elegance. Our mission is to seamlessly blend the rich heritage of Islamic wear with the forefront of digital innovation.
              </p>
              <p className="text-sm leading-relaxed text-black/70 font-medium">
                Every piece is meticulously crafted using premium materials, ensuring that our abayas, hijabs, and dresses offer both profound comfort and striking silhouettes. We are not just a brand; we are a movement towards a more inclusive, luxurious future of apparel.
              </p>
              <Link href="/shop" className="inline-block mt-4 border-b border-black pb-1 text-xs uppercase tracking-widest font-bold hover:text-black/60 transition-colors">
                Explore The Collection
              </Link>
            </div>
          </div>
          
          <div className="pt-24 space-y-6 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold uppercase tracking-[0.1em] mb-8">The Spatial Experience</h2>
              <p className="text-sm leading-relaxed text-black/70 font-medium">
                We have pioneered a spatial commerce platform to give you unprecedented insight into our garments before you buy. Using advanced 3D web technologies, you can inspect the drape, texture, and fit of our modest wear from any angle, directly in your browser.
              </p>
          </div>
        </motion.div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
