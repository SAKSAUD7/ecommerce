"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Sparkles, Heart } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

const LOOKBOOK_TAGS = [
  {
    id: 1,
    top: "42%",
    left: "32%",
    name: "Aurelia Quilted Shoulder Bag",
    slug: "aurelia-quilted-shoulder",
    price: "520.00",
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
  },
  {
    id: 2,
    top: "58%",
    left: "58%",
    name: "Bespoke Florentine Leather Duffel",
    slug: "florentine-leather-duffel",
    price: "650.00",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
  },
  {
    id: 3,
    top: "35%",
    left: "82%",
    name: "Celeste Quilted Shoulder Bag",
    slug: "celeste-quilted-shoulder",
    price: "490.00",
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b"
  }
]

export default function InteractiveLookbookSection() {
  const [activeTag, setActiveTag] = useState<typeof LOOKBOOK_TAGS[0] | null>(LOOKBOOK_TAGS[0])
  const addItem = useCartStore((state) => state.addItem)

  const handleQuickAdd = (tag: typeof LOOKBOOK_TAGS[0]) => {
    addItem({
      title: tag.name,
      variantId: tag.id,
      price: parseFloat(tag.price),
      quantity: 1,
      size: "Standard",
      color: "Noir",
      imageUrl: tag.img
    })
    alert(`Added "${tag.name}" to Shopping Bag!`)
  }

  return (
    <section className="py-24 bg-[#06152D] text-white px-6 md:px-12 my-16 border-y border-[#C5A059]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block">High Fashion Exhibition</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
              EDITORIAL LOOKBOOK &amp; SHOP THE LOOK
            </h2>
          </div>
          <Link 
            href="/lookbook" 
            className="text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-2"
          >
            EXPLORE FULL LOOKBOOK <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* High-Fashion Photoshoot Stage with Interactive Hotspots matching Reference Images 1 & 3 */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-black border border-[#C5A059]/30 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" 
            alt="DE'NOURA High Fashion Lookbook" 
            className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-1000"
          />

          {/* Interactive Hotspot Badges on Models' Bags */}
          {LOOKBOOK_TAGS.map(tag => {
            const isActive = activeTag?.id === tag.id
            return (
              <div key={tag.id} className="absolute" style={{ top: tag.top, left: tag.left }}>
                <button
                  onClick={() => setActiveTag(tag)}
                  className="relative group/tag focus:outline-none"
                >
                  <span className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center absolute inset-0 opacity-75 animate-ping" />
                  <span className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative font-bold text-xs shadow-2xl transition-all ${
                    isActive ? "bg-[#C5A059] text-black scale-125" : "bg-black/90 text-white hover:bg-[#C5A059] hover:text-black"
                  }`}>
                    +
                  </span>
                </button>
              </div>
            )
          })}

          {/* Floating Product Popover Card when Hotspot is Clicked */}
          {activeTag && (
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-[#0A192F]/95 backdrop-blur-xl border border-[#C5A059]/40 p-4 rounded-2xl shadow-2xl max-w-sm flex gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <img src={activeTag.img} alt={activeTag.name} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
              
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#C5A059] block">Lookbook Tag</span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-white font-serif line-clamp-1">{activeTag.name}</h4>
                <p className="text-sm font-bold text-[#C5A059]">${activeTag.price}</p>
                
                <div className="flex items-center gap-3 pt-1">
                  <Link href={`/shop/${activeTag.slug}`} className="text-[10px] font-bold uppercase tracking-wider text-white/70 hover:text-[#C5A059]">
                    Inspect →
                  </Link>
                  <button 
                    onClick={() => handleQuickAdd(activeTag)}
                    className="px-3 py-1 bg-[#C5A059] text-black text-[10px] font-bold uppercase rounded hover:bg-[#d5b069]"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
