"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import HeroScene from "@/components/3d/HeroScene"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import CustomerReviewsSection from "@/components/shop/CustomerReviewsSection"
import { apiFetch } from "@/lib/api"
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [heroContent, setHeroContent] = useState<any>(null)
  const [manifesto, setManifesto] = useState<any>(null)

  useEffect(() => {
    // Fetch live products
    apiFetch('/products/items/')
      .then(data => {
        const items = data.results || data || []
        if (items.length > 0) {
          setFeaturedProducts(items.slice(0, 6))
        } else {
          // Dynamic initial fallback products if API returns empty database
          setFeaturedProducts([
            { id: 1, name: "DE'NOURA Master Leather Tote", slug: "denoura-master-tote", base_price: "450.00", description: "Italian calfskin leather tote bag with titanium gold lock hardware.", images: [{ image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" }] },
            { id: 2, name: "Royal Velvet Evening Clutch", slug: "royal-velvet-clutch", base_price: "299.00", description: "Plush velvet clutch with gold monogram embroidery.", images: [{ image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" }] },
            { id: 3, name: "Italian Silk Crossbody Bag", slug: "italian-silk-crossbody", base_price: "320.00", description: "Pure silk lined luxury handbag crafted in Florence.", images: [{ image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" }] }
          ])
        }
      })
      .catch(() => {
        setFeaturedProducts([
          { id: 1, name: "DE'NOURA Master Leather Tote", slug: "denoura-master-tote", base_price: "450.00", description: "Italian calfskin leather tote bag with titanium gold lock hardware.", images: [{ image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" }] },
          { id: 2, name: "Royal Velvet Evening Clutch", slug: "royal-velvet-clutch", base_price: "299.00", description: "Plush velvet clutch with gold monogram embroidery.", images: [{ image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" }] },
          { id: 3, name: "Italian Silk Crossbody Bag", slug: "italian-silk-crossbody", base_price: "320.00", description: "Pure silk lined luxury handbag crafted in Florence.", images: [{ image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" }] }
        ])
      })

    // Fetch categories
    apiFetch('/products/categories/')
      .then(data => setCategories(data.results || data || []))
      .catch(console.error)

    // Fetch CMS sliders
    apiFetch('/cms/sliders/')
      .then(data => {
        if (data && data.length > 0) setHeroContent(data[0])
      })
      .catch(console.error)

    // Fetch CMS blog/manifesto
    apiFetch('/cms/blogs/')
      .then(data => {
        if (data && data.length > 0) setManifesto(data[0])
      })
      .catch(console.error)
  }, [])

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen">
      {/* Top Announcement Bar */}
      <div className="bg-[#06152D] text-[#C5A059] py-2 px-4 text-center text-xs font-bold uppercase tracking-widest border-b border-[#C5A059]/20">
        ✨ Free Worldwide Express Shipping on Orders Over $150 &nbsp;|&nbsp; Official Domains: Denoura.co &amp; Denoura.co.uk
      </div>

      <SpatialNav />
      
      {/* 3D Spatial Luxury Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0A192F] text-white">
        {heroContent?.image_url && (
          <img src={heroContent.image_url} className="absolute inset-0 w-full h-full object-cover opacity-15" alt="" />
        )}
        
        <HeroScene />
        
        <div className="z-10 text-center pointer-events-none mt-16 relative px-4 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4 block">
            Bespoke Leather Goods &amp; Modest Couture
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-6 drop-shadow-xl font-serif">
            {heroContent?.title || "DE'NOURA"}
          </h1>
          <p className="text-white/80 tracking-[0.2em] uppercase text-xs md:text-sm max-w-xl mx-auto font-medium drop-shadow-sm leading-relaxed">
            {heroContent?.subtitle || "Haute Modest Fashion & Spatial Luxury Handbag Collection"}
          </p>
          
          <div className="mt-10 pointer-events-auto flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/shop" 
              className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d5b069] transition-all duration-300 rounded-full shadow-xl hover:scale-105"
            >
              Explore Catalog
            </Link>
            <Link 
              href="/collections" 
              className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all duration-300 rounded-full backdrop-blur-md"
            >
              Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="py-12 bg-[#06152D] text-white border-y border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <Truck className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Express Global Shipping</h4>
            <p className="text-xs text-white/70">Tracked delivery via DHL &amp; FedEx</p>
          </div>
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Authentic Craftsmanship</h4>
            <p className="text-xs text-white/70">100% Italian Leather &amp; Pure Silk</p>
          </div>
          <div className="space-y-2">
            <Star className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">256-Bit SSL Checkout</h4>
            <p className="text-xs text-white/70">Encrypted bank-grade security</p>
          </div>
          <div className="space-y-2">
            <RefreshCw className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">30-Day Client Guarantee</h4>
            <p className="text-xs text-white/70">Hassle-free returns &amp; exchanges</p>
          </div>
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-black/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-2">Curated Selection</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-black font-serif">
              Featured Haute Couture
            </h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-[#C5A059] font-bold transition-colors flex items-center gap-2">
            View Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-white p-6 rounded-2xl border border-black/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-6 bg-black/5">
                  <img 
                    src={product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-[#C5A059] text-[10px] font-bold uppercase rounded-full backdrop-blur-md">
                    Haute Luxury
                  </span>
                </div>
                
                <h3 className="font-bold text-lg uppercase tracking-wider mb-2 text-black font-serif">{product.name}</h3>
                <p className="text-black/60 text-xs line-clamp-2 mb-4 font-normal">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="font-bold text-lg text-[#0A192F]">${product.base_price}</span>
                <Link 
                  href={`/shop/${product.slug || product.id}`} 
                  className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#C5A059] hover:text-black transition-colors"
                >
                  View Piece →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <CustomerReviewsSection />
      </section>

      {/* Editorial / Manifesto Banner */}
      <section className="py-24 bg-[#0A192F] text-white relative overflow-hidden my-12">
        <div className="max-w-4xl mx-auto text-center px-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">The DE&apos;NOURA Heritage</span>
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase leading-relaxed text-white font-serif">
            &ldquo;{manifesto?.summary || 'Redefining the boundary between physical craftsmanship and digital luxury artistry.'}&rdquo;
          </h2>
          <Link href="/about" className="inline-block px-8 py-4 bg-[#C5A059] text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#d5b069] transition-all">
            Read The Atelier Manifesto
          </Link>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  )
}
