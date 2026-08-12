"use client"

import React from "react"
import { motion } from "framer-motion"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col text-black">
      <SpatialNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[800px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="border-b border-black/10 pb-8">
            <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-4">Terms of Service</h1>
            <p className="text-sm tracking-widest text-black/50 font-bold uppercase">Last Updated: August 2026</p>
          </div>

          <div className="space-y-8 font-medium text-sm text-black/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Aura Luxury platform, you agree to be bound by these Terms of Service. Our platform bridges physical modest fashion with digital spatial experiences. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">2. Spatial Commerce & 3D Models</h2>
              <p>
                Aura provides 3D spatial representations of physical garments (abayas, hijabs, etc.). While we strive for extreme accuracy, digital rendering colors and textures may vary slightly from the physical item depending on your device's display capabilities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">3. Intellectual Property</h2>
              <p>
                All content, including 3D models, photography, garment designs, and website code, are the exclusive property of Aura Luxury. Unauthorized reproduction or use of our intellectual property is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">4. Returns & Exchanges</h2>
              <p>
                We accept returns on unworn, unaltered physical garments within 14 days of delivery. Custom-tailored items are non-refundable. Please refer to our Shipping & Returns policy for detailed instructions.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
