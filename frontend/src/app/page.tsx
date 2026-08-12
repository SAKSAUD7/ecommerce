"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import HeroScene from "@/components/3d/HeroScene"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import { apiFetch } from "@/lib/api"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [heroContent, setHeroContent] = useState<any>(null)
  const [manifesto, setManifesto] = useState<any>(null)

  useEffect(() => {
    // Fetch top 3 featured products (latest)
    apiFetch('/products/items/')
      .then(data => setFeaturedProducts(data.results ? data.results.slice(0, 3) : []))
      .catch(console.error)

    // Fetch the active hero slider
    apiFetch('/cms/sliders/')
      .then(data => {
        if (data && data.length > 0) {
          setHeroContent(data[0]) // Get the first active slider
        }
      })
      .catch(console.error)
      
    // Fetch the active manifesto/blog
    apiFetch('/cms/blogs/')
      .then(data => {
        if (data && data.length > 0) {
          setManifesto(data[0])
        }
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <SpatialNav />
      
      {/* 3D Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#EAE6DB]">
        {heroContent?.image_url && (
          <img src={heroContent.image_url} className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />
        )}
        
        <HeroScene />
        
        <div className="z-10 text-center pointer-events-none mt-20 relative">
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.15em] text-black uppercase mb-6 drop-shadow-sm">
            {heroContent?.title || "Aura"}
          </h1>
          <p className="text-black/70 tracking-[0.2em] uppercase text-sm md:text-base max-w-xl mx-auto px-4 font-medium drop-shadow-sm">
            {heroContent?.subtitle || "The Future of Luxury Fashion. A Spatial Computing Experience."}
          </p>
          
          <div className="mt-10 pointer-events-auto">
            <Link href={heroContent?.cta_link || "/shop"} className="px-8 py-4 bg-black text-white text-xs tracking-widest uppercase rounded-full hover:bg-black/80 transition-all duration-500 font-bold shadow-xl">
              {heroContent?.cta_text || "Shop Collection"}
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
          <span className="text-[10px] tracking-widest text-black/50 uppercase font-bold">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="relative w-full min-h-screen bg-transparent py-32 px-6 md:px-12 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase text-black">
              Featured<br/><span className="text-black/40">Collection</span>
            </h2>
            <Link href="/shop" className="text-xs uppercase tracking-widest border-b border-black/30 pb-1 hover:border-black font-bold transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <Link href={`/shop/${product.slug}`} key={product.id}>
                <GlassCard 
                  title={product.name || product.title} 
                  price={`$${product.base_price}`} 
                  imageUrl={product.images?.[0]?.image_url} 
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#EAE6DB] to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase leading-relaxed mb-8 text-black">
            "{manifesto?.summary || 'Redefining the boundary between physical craftsmanship and digital artistry.'}"
          </h2>
          <button className="px-8 py-4 bg-black text-white text-xs tracking-widest uppercase rounded-full hover:bg-black/80 transition-all duration-500 interactive font-bold">
            {manifesto?.title || 'Read the Manifesto'}
          </button>
        </div>
      </section>

      <LuxuryFooter />
    </>
  )
}
