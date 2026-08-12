"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, Shield, Award, Heart, ShoppingBag, Check } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function ProductSpotlightSection() {
  const [selectedColor, setSelectedColor] = useState("Noir Black")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      title: "DE'NOURA Master Leather Tote",
      variantId: 1,
      price: 450.0,
      quantity: 1,
      size: "Standard",
      color: selectedColor,
      imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <section className="py-24 bg-[#0A192F] text-white px-6 md:px-12 my-16 border-y border-[#C5A059]/20 relative overflow-hidden">
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: High-Fashion Product Spotlight Stage (7 Cols) matching Reference Image 4 */}
        <div className="lg:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/60 border border-[#C5A059]/40 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" 
            alt="DE'NOURA Master Leather Tote Spotlight" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/40 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> FLAGSHIP PIECE OF THE SEASON
          </div>

          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">Crafted In</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Florence, Italy</span>
          </div>
        </div>

        {/* Right Column: Campaign Story & Purchasing Panel (5 Cols) matching Reference Image 5 */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">The Atelier Highlight</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase text-white font-serif leading-tight">
              AURELIA MASTER TOTE
            </h2>
            <p className="text-xs text-white/70 leading-relaxed font-normal">
              Hand-carved Florentine calfskin tailored with 24k gold-plated monogram closure. Sculpted to seamlessly transition from business boardroom to evening gala.
            </p>
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 block">
              Color Finish: <span className="text-[#C5A059]">{selectedColor}</span>
            </span>
            <div className="flex gap-3">
              {["Noir Black", "Monogram Gold", "Caramel Tan", "Emerald Green"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
                    selectedColor === c 
                      ? "bg-[#C5A059] text-black border-[#C5A059]" 
                      : "bg-white/5 text-white/70 border-white/20 hover:border-[#C5A059]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex items-baseline gap-4 pt-2 border-t border-white/10">
            <span className="text-3xl font-bold text-[#C5A059] font-serif">$450.00</span>
            <span className="text-sm text-white/40 line-through font-serif">$650.00</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
              In Stock (35 Available)
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#d5b069] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added To Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Express Purchase ($450)
                </>
              )}
            </button>

            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-4 bg-white/10 rounded-xl border border-white/20 hover:border-[#C5A059] transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#C5A059] text-[#C5A059]" : "text-white"}`} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 text-[11px] text-white/60 font-medium pt-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C5A059]" /> 2-Year International Warranty
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C5A059]" /> Certified RFID Authenticity Card
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
