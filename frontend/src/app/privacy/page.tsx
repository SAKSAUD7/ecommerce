"use client"

import React from "react"
import { motion } from "framer-motion"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-4">Privacy Policy</h1>
            <p className="text-sm tracking-widest text-black/50 font-bold uppercase">Last Updated: August 2026</p>
          </div>

          <div className="space-y-8 font-medium text-sm text-black/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">1. Information Collection</h2>
              <p>
                Aura Luxury collects information to provide a personalized, high-end shopping experience. This includes data provided during account creation (name, email), shipping details, and browsing behavior on our spatial platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">2. Use of Information</h2>
              <p>
                We use your information to process orders, deliver your modest wear garments, and improve our 3D digital experiences. We may also send curated editorial content and exclusive collection drops if you opt into our newsletter.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">3. Data Security</h2>
              <p>
                The security of your personal information is paramount. We implement industry-standard encryption protocols to protect your data during transmission and secure server storage. We do not store raw credit card details on our servers.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-widest text-black">4. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data. Please contact our Client Care team at care@auraluxury.com to exercise these rights or for any privacy-related inquiries.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
