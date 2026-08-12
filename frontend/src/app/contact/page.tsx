"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col text-black">
      <SpatialNav />
      
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.2em] mb-6">Client Care</h1>
              <p className="text-sm tracking-widest text-black/60 font-medium uppercase max-w-md">
                Our concierges are available to assist you with styling advice, orders, and spatial technical support.
              </p>
            </div>

            <div className="space-y-8 font-medium text-sm">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-bold tracking-widest uppercase mb-1">Email Us</h3>
                  <p className="text-black/90 font-semibold">Denoura.co@gmail.com</p>
                  <p className="text-black/60 text-xs mt-1">Official domains: Denoura.co &amp; Denoura.co.uk</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-bold tracking-widest uppercase mb-1">Social Concierge</h3>
                  <p className="text-black/80">Instagram: @Denoura.co</p>
                  <p className="text-black/80">TikTok: @Denoura.co</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1" />
                <div>
                  <h3 className="font-bold tracking-widest uppercase mb-1">Global Atelier</h3>
                  <p className="text-black/60">London &amp; International Distribution</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/50 border border-black/10 rounded-2xl p-8 md:p-12 glass-panel shadow-xl">
            <h2 className="text-2xl font-bold uppercase tracking-[0.1em] mb-8">Send a Message</h2>
            
            {success ? (
              <div className="bg-black text-white p-8 rounded-lg text-center">
                <h3 className="font-bold uppercase tracking-widest mb-2">Message Sent</h3>
                <p className="text-xs text-white/70">A concierge will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 font-bold">First Name</label>
                    <input required type="text" className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 font-bold">Last Name</label>
                    <input required type="text" className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 font-bold">Email Address</label>
                  <input required type="email" className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 font-bold">Message</label>
                  <textarea required rows={4} className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium resize-none"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-4 mt-4 hover:bg-black/80 transition-colors rounded-md disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
