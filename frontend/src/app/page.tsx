"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import HeroScene from "@/components/3d/HeroScene"
import BagAnatomySection from "@/components/shop/BagAnatomySection"
import ProductSpotlightSection from "@/components/shop/ProductSpotlightSection"
import InteractiveLookbookSection from "@/components/shop/InteractiveLookbookSection"
import CustomerReviewsSection from "@/components/shop/CustomerReviewsSection"
import { apiFetch } from "@/lib/api"
import { 
  ArrowRight, ShieldCheck, Truck, RotateCcw, Award, Heart, Star, 
  Sparkles, Lock, CheckCircle2, Leaf, Play, X, Headphones, Globe, ArrowLeft, ChevronRight
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"

const HERO_SLIDES = [
  {
    id: "01",
    eyebrow: "TIMELESS. ICONIC. UNMISTAKABLY DENOURA.",
    title: "CRAFTED FOR A LEGACY.",
    subtitle: "Iconic designs that transcend trends and define generations of quiet luxury.",
    ctaText: "EXPLORE COLLECTIONS →",
    ctaLink: "/collections"
  },
  {
    id: "02",
    eyebrow: "EXCEPTIONAL MATERIALS. MASTERFUL CRAFTSMANSHIP.",
    title: "CRAFTED FOR ETERNITY.",
    subtitle: "Designed to be cherished forever. Hand-carved Florentine calfskin tailored with 24k gold locks.",
    ctaText: "DISCOVER AURELIA →",
    ctaLink: "/shop?category=tote-bags"
  },
  {
    id: "03",
    eyebrow: "BESPOKE EDITIONS & LIMITED RUNS.",
    title: "CRAFTED FOR ICONS.",
    subtitle: "Unique designs that celebrate individuality. Exclusively curated for the modern connoisseur.",
    ctaText: "VIEW LIMITED EDITION →",
    ctaLink: "/collections?filter=limited-edition"
  }
]

const FALLBACK_NEW_ARRIVALS = [
  { id: 101, name: "Aurelia Quilted Tote", slug: "aurelia-structured-tote-demo", price: "580.00", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2", tag: "NEW" },
  { id: 102, name: "Noelle Top Handle Bag", slug: "elan-mini-top-handle-demo", price: "620.00", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", tag: "NEW" },
  { id: 103, name: "Elise Chain Shoulder Bag", slug: "celeste-quilted-shoulder-demo", price: "490.00", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b", tag: "NEW" },
  { id: 104, name: "Maison Crossbody Bag", slug: "maison-leather-crossbody-demo", price: "450.00", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f", tag: "NEW" },
  { id: 105, name: "Solenne Mini Bag", slug: "camille-quilted-mini-demo", price: "360.00", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3", tag: "NEW" }
]

const FALLBACK_BEST_SELLERS = [
  { id: 201, name: "Aurelia Signature Tote", slug: "aurelia-structured-tote-demo", price: "580.00", rating: "4.9", reviewsCount: 128, img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" },
  { id: 202, name: "Classic Top Handle Bag", slug: "elan-mini-top-handle-demo", price: "680.00", rating: "4.9", reviewsCount: 98, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
  { id: 203, name: "Noelle Chain Shoulder", slug: "celeste-quilted-shoulder-demo", price: "490.00", rating: "4.9", reviewsCount: 76, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" },
  { id: 204, name: "Elegance Hobo Bag", slug: "maison-leather-crossbody-demo", price: "470.00", rating: "4.8", reviewsCount: 64, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" },
  { id: 205, name: "Maison Crossbody Bag", slug: "camille-quilted-mini-demo", price: "450.00", rating: "4.9", reviewsCount: 87, img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" }
]

export default function Home() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [newArrivals, setNewArrivals] = useState<any[]>(FALLBACK_NEW_ARRIVALS)
  const [bestSellers, setBestSellers] = useState<any[]>(FALLBACK_BEST_SELLERS)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [campaignModalOpen, setCampaignModalOpen] = useState(false)
  const [emailSub, setEmailSub] = useState("")
  const [subSuccess, setSubSuccess] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)
  const slide = HERO_SLIDES[currentSlideIndex]

  useEffect(() => {
    // Auto-rotate hero slide every 7 seconds
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % HERO_SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Fetch live catalog from Django REST backend API
    apiFetch('/products/items/')
      .then(data => {
        const items = data.results || data || []
        if (items.length > 0) {
          const mapped = items.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug || p.id,
            price: p.base_price,
            img: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
            rating: "4.9",
            reviewsCount: 128,
            tag: "NEW"
          }))
          setNewArrivals(mapped.slice(0, 5))
          setBestSellers(mapped.slice(5, 10).length > 0 ? mapped.slice(5, 10) : mapped.slice(0, 5))
        }
      })
      .catch(console.error)
  }, [])

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const handleAddToCart = (item: any) => {
    addItem({
      title: item.name,
      variantId: item.id,
      price: parseFloat(item.price),
      quantity: 1,
      size: "Standard",
      color: "Noir",
      imageUrl: item.img
    })
    alert(`Added "${item.name}" to Shopping Bag!`)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailSub.trim()) {
      setSubSuccess(true)
      setEmailSub("")
      setTimeout(() => setSubSuccess(false), 4000)
    }
  }

  return (
    <div className="bg-[#05080E] text-white min-h-screen font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Top Announcement Bar & Header */}
      <SpatialNav />

      {/* SECTION 1: SPATIAL 3D HERO STAGE (#05080E Dark Luxury matching Reference Screenshots) */}
      <section className="relative w-full h-screen flex items-center justify-between overflow-hidden bg-[#05080E] text-white px-6 md:px-16">
        
        {/* 3D Canvas Scene */}
        <HeroScene />
        
        {/* Left Side Content Overlay matching Reference Screenshots */}
        <div className="z-10 max-w-xl space-y-6 pt-12">
          
          {/* Slide Indicator Dots (01 / 02 / 03) */}
          <div className="flex items-center gap-4 text-xs font-mono font-bold tracking-widest text-[#C5A059]">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all duration-300 ${
                  currentSlideIndex === idx ? "text-[#C5A059] font-extrabold scale-110 border-b-2 border-[#C5A059] pb-0.5" : "text-white/40 hover:text-white"
                }`}
              >
                {s.id}
              </button>
            ))}
          </div>

          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] text-[#C5A059] block drop-shadow">
            {slide.eyebrow}
          </span>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-[0.1em] text-white uppercase font-serif leading-tight drop-shadow-2xl">
            {slide.title}
          </h1>

          <p className="text-white/70 text-xs md:text-sm uppercase tracking-widest font-medium leading-relaxed max-w-md">
            {slide.subtitle}
          </p>

          <div className="pt-4 flex items-center gap-6">
            <Link 
              href={slide.ctaLink} 
              className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d5b069] transition-all duration-300 rounded-full shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              {slide.ctaText}
            </Link>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pt-12 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-white/50 animate-bounce">
            SCROLL TO DISCOVER ↓
          </div>
        </div>

        {/* Right Side: Play Campaign Button matching Reference Screenshot */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-3 z-10">
          <button 
            onClick={() => setCampaignModalOpen(true)}
            className="w-16 h-16 rounded-full border-2 border-[#C5A059]/40 bg-black/60 backdrop-blur-md flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all duration-500 shadow-2xl group"
            title="Play Campaign Film"
          >
            <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">PLAY CAMPAIGN</span>
        </div>
      </section>

      {/* SECTION 2: 5-PILLAR OFF-WHITE TRUST BAR directly under Hero matching Reference Screenshots */}
      <section className="py-6 bg-[#FAF8F5] text-black border-y border-black/10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1">
            <Globe className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">WORLDWIDE SHIPPING</h4>
            <p className="text-[10px] text-gray-500 font-medium">Fast, secure &amp; tracked delivery</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">FINEST MATERIALS</h4>
            <p className="text-[10px] text-gray-500 font-medium">Premium leathers &amp; hardware</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <RotateCcw className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">EASY RETURNS</h4>
            <p className="text-[10px] text-gray-500 font-medium">Hassle-free returns within 30 days</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Lock className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">SECURE PAYMENTS</h4>
            <p className="text-[10px] text-gray-500 font-medium">100% secure checkout</p>
          </div>
          <div className="flex flex-col items-center space-y-1 col-span-2 md:col-span-1">
            <Headphones className="w-5 h-5 text-[#C5A059]" />
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">24/7 CUSTOMER CARE</h4>
            <p className="text-[10px] text-gray-500 font-medium">We&apos;re here for you</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: NEW ARRIVALS CAROUSEL (#060B12 Dark Section) */}
      <section className="py-24 bg-[#060B12] text-white px-6 md:px-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">New Season Releases</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
                NEW ARRIVALS
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/shop?category=new-in" className="text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-2">
                VIEW ALL <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 5 Product Horizontal Cards matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {newArrivals.map(product => (
              <div key={product.id} className="bg-[#0B1220] p-4 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-[#C5A059]/50 transition-all duration-300 relative shadow-xl">
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black/40 mb-4 border border-white/5">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    <span className="absolute top-3 left-3 bg-black/80 text-[#C5A059] border border-[#C5A059]/40 text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                      NEW
                    </span>

                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-black/60 rounded-full backdrop-blur-md hover:bg-[#C5A059] hover:text-black transition-colors"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-[#C5A059] text-[#C5A059]" : "text-white"}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-xs uppercase tracking-wider text-white font-serif mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm font-bold text-[#C5A059]">${product.price}</p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                  <Link href={`/shop/${product.slug}`} className="text-[10px] uppercase font-bold text-white/70 hover:text-[#C5A059] transition-colors">
                    Inspect Piece →
                  </Link>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="px-3 py-1.5 bg-[#C5A059] text-black text-[10px] font-bold uppercase rounded hover:bg-[#d5b069]"
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE SIGNATURE COLLECTION FEATURE SECTION matching Reference Screenshots */}
      <section className="py-24 bg-[#05080E] text-white px-6 md:px-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Copy (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">The Iconic Edit</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase text-white font-serif leading-tight">
              THE SIGNATURE COLLECTION
            </h2>
            <p className="text-xs text-white/70 uppercase tracking-widest font-medium leading-relaxed">
              Where heritage techniques meet contemporary elegance. Hand-stitched full-grain calfskin tailored with signature 24k gold monogram locks.
            </p>
            <div className="pt-4">
              <Link 
                href="/collections" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C5A059] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#d5b069] transition-all shadow-xl"
              >
                DISCOVER COLLECTION <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Center/Right Showcase Stage & Vertical Tabs (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Center Showcase Bag */}
            <div className="sm:col-span-2 relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/60 border border-[#C5A059]/30 shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" 
                alt="Signature Collection Bag" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase text-[#C5A059]">
                THE ART OF CRAFTSMANSHIP
              </div>
            </div>

            {/* Vertical Collection Tabs matching screenshot */}
            <div className="space-y-4">
              <Link href="/collections?name=aurelia" className="block p-4 rounded-2xl bg-[#0B1220] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all group">
                <h4 className="font-bold text-xs uppercase text-[#C5A059] font-serif group-hover:underline">Aurelia Collection</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Timeless elegance</p>
              </Link>

              <Link href="/collections?name=monogram" className="block p-4 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-[#C5A059] transition-all group">
                <h4 className="font-bold text-xs uppercase text-white font-serif group-hover:underline">Monogram Collection</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Heritage reimagined</p>
              </Link>

              <Link href="/collections?name=prestige" className="block p-4 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-[#C5A059] transition-all group">
                <h4 className="font-bold text-xs uppercase text-white font-serif group-hover:underline">Prestige Edition</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Exclusively curated</p>
              </Link>

              <Link href="/collections?name=limited" className="block p-4 rounded-2xl bg-[#0B1220] border border-white/10 hover:border-[#C5A059] transition-all group">
                <h4 className="font-bold text-xs uppercase text-white font-serif group-hover:underline">Limited Edition</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Only a few exist</p>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: INTERACTIVE BAG ANATOMY & CRAFTSMANSHIP ("THE DETAILS MATTER") */}
      <BagAnatomySection />

      {/* SECTION 6: CINEMATIC PRODUCT SPOTLIGHT ("PRODUCT OF THE SEASON" matching Reference Screenshots) */}
      <ProductSpotlightSection />

      {/* SECTION 7: BRAND HERITAGE & CRAFTSMANSHIP ("Rooted in Heritage. Driven by Passion.") */}
      <section className="py-24 bg-[#0A121E] text-white px-6 md:px-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black">
              <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" alt="Artisan Craftsmanship" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-black mt-8">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" alt="Florentine Leatherwork" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">Our Legacy</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase text-white font-serif leading-tight">
              Rooted in heritage.<br />Driven by passion.
            </h2>
            <p className="text-xs text-white/70 leading-relaxed font-normal">
              Denoura was born from a belief that true luxury lies in the details. Each piece is a tribute to master artisans, traditions, and shapes that shape us.
            </p>

            {/* Statistics Counter matching screenshot */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div>
                <span className="text-2xl font-bold text-[#C5A059] font-serif block">2018</span>
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Established</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#C5A059] font-serif block">50+</span>
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Artisans</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#C5A059] font-serif block">23</span>
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Countries</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#C5A059] font-serif block">100K+</span>
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Clients</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] hover:underline">
                READ OUR STORY <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: INTERACTIVE EDITORIAL LOOKBOOK & SHOP THE LOOK */}
      <InteractiveLookbookSection />

      {/* SECTION 9: PRESS LOGOS BAR ("AS SEEN IN") matching Reference Screenshots */}
      <section className="py-10 bg-[#05080E] border-y border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">AS SEEN IN</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 text-lg md:text-xl font-bold font-serif uppercase tracking-[0.25em] text-white">
            <span>VOGUE</span>
            <span>ELLE</span>
            <span>BAZAAR</span>
            <span>FORBES</span>
            <span>InStyle</span>
            <span>HARPER&apos;S BAZAAR</span>
          </div>
          <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline">
            OUR STORY →
          </Link>
        </div>
      </section>

      {/* SECTION 10: BEST SELLERS (Dark #060B12 Background matching screenshots) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">Most Coveted Pieces</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
              BEST SELLERS
            </h2>
          </div>
          <Link href="/shop?filter=best-sellers" className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#C5A059] flex items-center gap-2">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Best Seller Cards with Rating Stars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {bestSellers.map(product => (
            <div key={product.id} className="bg-[#0B1220] p-4 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-[#C5A059]/50 transition-all duration-300 shadow-xl">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black/40 mb-4 border border-white/5">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full backdrop-blur-md hover:bg-[#C5A059] hover:text-black transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-[#C5A059] text-[#C5A059]" : "text-white"}`} />
                  </button>
                </div>

                <h3 className="font-bold text-xs uppercase tracking-wider text-white font-serif mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm font-bold text-[#C5A059] mb-2">${product.price}</p>
                
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#C5A059]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-white">{product.rating}</span>
                  <span className="text-white/40 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <Link href={`/shop/${product.slug}`} className="text-[10px] uppercase font-bold text-white/70 hover:text-white">
                  Inspect Piece →
                </Link>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-1.5 bg-[#C5A059] text-black text-[10px] font-bold uppercase rounded hover:bg-[#d5b069]"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 my-12">
        <CustomerReviewsSection />
      </section>

      {/* SECTION 12: NEWSLETTER & MULTI-COLUMN FOOTER matching Reference Screenshots */}
      <footer className="bg-[#03060A] text-white pt-20 pb-12 px-6 md:px-12 border-t border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Newsletter Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">DE&apos;NOURA Club</span>
            <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-serif">Join the Denoura Society</h3>
            <p className="text-xs text-white/70 leading-relaxed font-medium">Be the first to access new collections, private atelier exhibitions, and exclusive invitations.</p>

            {subSuccess ? (
              <div className="p-3 bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Welcome to the Denoura Society! Check your inbox for confirmation.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                <input 
                  type="email" 
                  required
                  value={emailSub}
                  onChange={e => setEmailSub(e.target.value)}
                  placeholder="Enter your email address" 
                  className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder:text-white/40 outline-none focus:border-[#C5A059]"
                />
                <button type="submit" className="px-5 py-3 bg-[#C5A059] text-black font-bold uppercase text-xs rounded-xl hover:bg-[#d5b069]">
                  →
                </button>
              </form>
            )}
          </div>

          {/* Links Columns (7 Cols) matching screenshot */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-medium">
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-widest text-[#C5A059]">SHOP</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/shop" className="hover:text-white">Bags</Link></li>
                <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
                <li><Link href="/shop?category=new-in" className="hover:text-white">New In</Link></li>
                <li><Link href="/shop?sale=true" className="hover:text-white">Sale</Link></li>
                <li><Link href="/shop?category=silk-accessories" className="hover:text-white">Accessories</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-widest text-[#C5A059]">CUSTOMER CARE</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/track" className="hover:text-white">Track Order</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-widest text-[#C5A059]">ABOUT US</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
                <li><Link href="/lookbook" className="hover:text-white">Lookbook</Link></li>
                <li><Link href="/blog" className="hover:text-white">Journal</Link></li>
                <li><Link href="/about" className="hover:text-white">Craftsmanship</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-widest text-[#C5A059]">FOLLOW US</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="https://instagram.com/Denoura.co" target="_blank" rel="noreferrer" className="hover:text-white">Instagram @Denoura.co</a></li>
                <li><a href="https://tiktok.com/@Denoura.co" target="_blank" rel="noreferrer" className="hover:text-white">TikTok @Denoura.co</a></li>
                <li><a href="mailto:Denoura.co@gmail.com" className="hover:text-white">Denoura.co@gmail.com</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Legal Footer Bottom */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 space-y-4 sm:space-y-0">
          <p>© 2026 DE'NOURA. All rights reserved. Official Domains: Denoura.co &amp; Denoura.co.uk</p>
          <div className="flex gap-6 font-medium">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-white">Global Shipping</Link>
          </div>
        </div>
      </footer>

      {/* CAMPAIGN VIDEO MODAL */}
      {campaignModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl p-6 text-center space-y-4">
            <button 
              onClick={() => setCampaignModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059] block">DE'NOURA ATELIER FILM</span>
            <h3 className="text-2xl font-bold uppercase text-white font-serif">CRAFTED FOR A LEGACY</h3>
            
            <div className="aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center">
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="DE'NOURA Campaign" 
                className="w-full h-full"
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
