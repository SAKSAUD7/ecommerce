"use client"

import React, { useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { Sparkles, ShoppingBag, Eye } from "lucide-react"

const LOOKBOOK_SLIDES = [
  {
    id: 1,
    title: "Spring '26 Collection: The Florentine Atelier",
    season: "Spring / Summer 2026",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
    hotspots: [
      { id: 101, top: "45%", left: "55%", title: "DE'NOURA Master Tote", price: "$450", slug: "denoura-master-tote" },
      { id: 102, top: "70%", left: "30%", title: "Italian Silk Scarf", price: "$120", slug: "italian-silk-scarf" }
    ]
  },
  {
    id: 2,
    title: "Nocturne Velvet & Gold Accessories",
    season: "Autonomus Couture",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    hotspots: [
      { id: 201, top: "50%", left: "48%", title: "Royal Velvet Clutch", price: "$299", slug: "royal-velvet-clutch" }
    ]
  }
]

export default function LookbookPage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const current = LOOKBOOK_SLIDES[activeSlide]

  return (
    <div className="bg-[#0A192F] text-white min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block mb-1">Visual Exhibition</span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider text-[#C5A059] font-serif">
              The DE&apos;NOURA Lookbook
            </h1>
          </div>
          <p className="text-xs text-white/70 max-w-md mt-4 md:mt-0 font-medium">
            Explore interactive hotspot compositions. Tap any gold tag to inspect handcrafted leather details and view product specifications.
          </p>
        </div>

        {/* Main Interactive Lookbook Container */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-black/40 border border-[#C5A059]/30 shadow-2xl group">
          <img src={current.image} alt={current.title} className="w-full h-full object-cover opacity-85" />
          
          {/* Slide Info Overlay */}
          <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-[#C5A059]/40 p-4 rounded-2xl max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">{current.season}</span>
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-serif">{current.title}</h3>
          </div>

          {/* Interactive Hotspot Buttons */}
          {current.hotspots.map(h => (
            <div key={h.id} className="absolute" style={{ top: h.top, left: h.left }}>
              <Link href={`/shop/${h.slug}`} className="relative group/tag block">
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black flex items-center justify-center animate-ping absolute inset-0 opacity-75" />
                <div className="w-6 h-6 rounded-full bg-[#C5A059] text-black font-bold text-[10px] flex items-center justify-center relative shadow-lg cursor-pointer">
                  +
                </div>

                <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#0A192F]/95 backdrop-blur-md border border-[#C5A059] p-3 rounded-xl shadow-2xl whitespace-nowrap hidden group-hover/tag:block transition-all z-30">
                  <h4 className="text-xs font-bold uppercase text-white font-serif">{h.title}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{h.price} USD</p>
                  <span className="text-[9px] uppercase font-bold text-white/70 mt-1 block">View Details →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Slide Controls */}
        <div className="flex justify-center gap-4 pt-4">
          {LOOKBOOK_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(idx)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeSlide === idx ? "bg-[#C5A059] text-black shadow-lg" : "border border-white/20 text-white hover:bg-white/10"
              }`}
            >
              Look 0{idx + 1}
            </button>
          ))}
        </div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
