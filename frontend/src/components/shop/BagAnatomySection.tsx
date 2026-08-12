"use client"

import React, { useState } from "react"
import { Sparkles, ShieldCheck, Award, CheckCircle2, ChevronRight } from "lucide-react"

const ANATOMY_HOTSPOTS = [
  {
    id: 1,
    top: "35%",
    left: "28%",
    title: "100% Full-Grain Florentine Calfskin",
    category: "Material Excellence",
    description: "Sourced from premier tanneries in Tuscany, Italy. Tanned using natural vegetable extracts to develop an opulent patina over time while preserving water-resistant resilience."
  },
  {
    id: 2,
    top: "52%",
    left: "50%",
    title: "24k Gold-Plated Brass Lock Hardware",
    category: "Jewellery-Grade Hardware",
    description: "Custom forged brass lock clasp double-plated in 24k gold. Featuring anti-tarnish protective coating and precision turn-key mechanism."
  },
  {
    id: 3,
    top: "18%",
    left: "62%",
    title: "Saddle Hand-Stitched Leather Handles",
    category: "Artisan Craftsmanship",
    description: "Hand-stitched by master leather artisans using wax-coated linen thread. Dual reinforced core ensures comfortable shoulder and hand carrying."
  },
  {
    id: 4,
    top: "72%",
    left: "38%",
    title: "Plush Micro-Suede Interior & Security Pocket",
    category: "Atelier Interior",
    description: "Lined with plush Italian micro-suede. Features a zipped security compartment, smartphone pouch, and gold-embossed RFID authenticity card holder."
  }
]

export default function BagAnatomySection() {
  const [selectedHotspot, setSelectedHotspot] = useState(ANATOMY_HOTSPOTS[1])

  return (
    <section className="py-24 bg-[#0A192F] text-white px-6 md:px-12 my-12 border-y border-[#C5A059]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">Anatomy Of Excellence</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
            THE DETAILS MATTER
          </h2>
          <p className="text-xs text-white/70 font-medium">Explore the intricate Italian craftsmanship and jewellery-grade hardware behind the DE'NOURA Master Leather Tote.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Product Hotspot Stage (7 Cols) */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/40 border border-[#C5A059]/30 shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" 
              alt="DE'NOURA Master Leather Tote Anatomy" 
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Hotspot Pulse Dots matching Reference Image 4 */}
            {ANATOMY_HOTSPOTS.map((h) => {
              const isSelected = selectedHotspot.id === h.id
              return (
                <div key={h.id} className="absolute" style={{ top: h.top, left: h.left }}>
                  <button
                    onClick={() => setSelectedHotspot(h)}
                    className="relative group/btn focus:outline-none"
                  >
                    <span className={`w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center absolute inset-0 opacity-75 animate-ping ${isSelected ? "scale-125" : ""}`} />
                    <span className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative font-bold text-xs shadow-2xl transition-all ${
                      isSelected ? "bg-[#C5A059] text-black scale-110" : "bg-black/80 text-white hover:bg-[#C5A059] hover:text-black"
                    }`}>
                      {h.id}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Right Column: Hotspot Details Display Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#06152D] p-8 rounded-3xl border border-[#C5A059]/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {selectedHotspot.category}
              </span>
              <span className="text-xs font-mono font-bold text-white/50">Feature 0{selectedHotspot.id} / 04</span>
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-wide text-white font-serif">
              {selectedHotspot.title}
            </h3>

            <p className="text-xs text-white/80 leading-relaxed font-normal">
              {selectedHotspot.description}
            </p>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                <ShieldCheck className="w-4 h-4" /> Lifetime Florentine Craftsmanship Warranty
              </div>
              <p className="text-white/60 text-[11px]">Every piece is stamped with a unique serial number and issued a physical RFID ownership certificate.</p>
            </div>

            <div className="pt-2">
              <a 
                href="/shop/denoura-master-tote" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black bg-[#C5A059] px-6 py-3.5 rounded-xl hover:bg-[#d5b069] transition-colors"
              >
                Inspect Master Tote ($450) <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
