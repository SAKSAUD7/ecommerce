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
  Mail, Sparkles, Lock, CheckCircle2, Leaf
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"

const FALLBACK_NEW_ARRIVALS = [
  { id: 101, name: "Aurelia Quilted Shoulder Bag", slug: "aurelia-quilted-shoulder", price: "520.00", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" },
  { id: 102, name: "Luxe Leather Tote", slug: "luxe-leather-tote", price: "680.00", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
  { id: 103, name: "Monogram Mini Bag", slug: "monogram-mini-bag", price: "450.00", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" },
  { id: 104, name: "Classic Top Handle Bag", slug: "classic-top-handle-bag", price: "740.00", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" },
  { id: 105, name: "Chain Crossbody Bag", slug: "chain-crossbody-bag", price: "490.00", img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" }
]

const FALLBACK_BEST_SELLERS = [
  { id: 201, name: "Aurelia Signature Bag", slug: "aurelia-signature-bag", price: "680.00", rating: "4.9", reviewsCount: 128, img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" },
  { id: 202, name: "Elegant Hobo Bag", slug: "elegant-hobo-bag", price: "560.00", rating: "4.9", reviewsCount: 98, img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
  { id: 203, name: "Luxe Mini Crossbody", slug: "luxe-mini-crossbody", price: "420.00", rating: "4.9", reviewsCount: 56, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" },
  { id: 204, name: "Structured Satchel Bag", slug: "structured-satchel-bag", price: "410.00", rating: "4.9", reviewsCount: 88, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" },
  { id: 205, name: "Classic Chain Bag", slug: "classic-chain-bag", price: "480.00", rating: "4.9", reviewsCount: 105, img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" }
]

export default function Home() {
  const [heroContent, setHeroContent] = useState<any>(null)
  const [newArrivals, setNewArrivals] = useState<any[]>(FALLBACK_NEW_ARRIVALS)
  const [bestSellers, setBestSellers] = useState<any[]>(FALLBACK_BEST_SELLERS)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [emailSub, setEmailSub] = useState("")
  const [subSuccess, setSubSuccess] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)

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
            reviewsCount: 112
          }))
          setNewArrivals(mapped.slice(0, 5))
          setBestSellers(mapped.slice(5, 10).length > 0 ? mapped.slice(5, 10) : mapped.slice(0, 5))
        }
      })
      .catch(console.error)

    // Fetch live Hero settings from backend CMS
    apiFetch('/cms/sliders/')
      .then(data => {
        if (data && data.length > 0) setHeroContent(data[0])
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
    <div className="bg-[#FAF8F5] text-black min-h-screen font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Top Announcement Bar & Sticky Header */}
      <SpatialNav />

      {/* SECTION 1: SPATIAL 3D STUDIO HERO STAGE (#0A192F Dark Luxury) */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#0A192F] text-white">
        {heroContent?.image_url && (
          <img src={heroContent.image_url} className="absolute inset-0 w-full h-full object-cover opacity-15" alt="" />
        )}
        
        <HeroScene />
        
        <div className="z-10 text-center pointer-events-none mt-16 relative px-4 max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#C5A059] mb-4 block drop-shadow">
            HAUTE FASHION &amp; SPATIAL 3D ATELIER
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-6 drop-shadow-2xl font-serif">
            {heroContent?.title || "DE'NOURA"}
          </h1>
          <p className="text-white/80 tracking-[0.2em] uppercase text-xs md:text-sm max-w-xl mx-auto font-medium drop-shadow-sm leading-relaxed">
            {heroContent?.subtitle || "Timeless luxury bags, meticulously crafted for the modern connoisseur."}
          </p>
          
          <div className="mt-10 pointer-events-auto flex flex-wrap items-center justify-center gap-4">
            <Link 
              href={heroContent?.cta_link || "/shop"} 
              className="px-8 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#d5b069] transition-all duration-300 rounded-full shadow-2xl hover:scale-105"
            >
              {heroContent?.cta_text || "EXPLORE COLLECTION"}
            </Link>
            <Link 
              href={heroContent?.secondary_cta_link || "/lookbook"} 
              className="px-8 py-4 border border-white/30 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all duration-300 rounded-full backdrop-blur-md"
            >
              {heroContent?.secondary_cta_text || "VIEW LOOKBOOK"}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: CRAFTED FOR ELEGANCE (Light Warm Beige #FAF8F5) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-[0.15em] uppercase text-black font-serif">
            CRAFTED FOR ELEGANCE.
          </h2>
          <p className="text-black/60 text-sm md:text-base uppercase tracking-widest font-medium">
            Timeless luxury bags, meticulously crafted for the modern connoisseur.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop" 
              className="inline-block px-8 py-4 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-all shadow-md"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>

        {/* 4 Feature Pillars matching reference design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-black/10">
          <div className="space-y-2 p-4">
            <Sparkles className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">FINEST MATERIALS</h4>
            <p className="text-xs text-black/60">Premium quality leathers and hardware</p>
          </div>
          <div className="space-y-2 p-4">
            <Award className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">EXPERT CRAFTSMANSHIP</h4>
            <p className="text-xs text-black/60">Handcrafted by skilled Florentine artisans</p>
          </div>
          <div className="space-y-2 p-4">
            <Truck className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">WORLDWIDE SHIPPING</h4>
            <p className="text-xs text-black/60">Secure, fast &amp; reliable express delivery</p>
          </div>
          <div className="space-y-2 p-4">
            <RotateCcw className="w-6 h-6 text-[#C5A059] mx-auto" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">EASY RETURNS</h4>
            <p className="text-xs text-black/60">Hassle-free returns within 30 days</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: NEW ARRIVALS CAROUSEL (Dark #06152D) */}
      <section className="py-24 bg-[#06152D] text-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">New Season Releases</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
                NEW ARRIVALS
              </h2>
            </div>
            <Link href="/shop?category=new-in" className="text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5 Product Horizontal Carousel Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {newArrivals.map(product => (
              <div key={product.id} className="bg-[#0A192F] p-4 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-[#C5A059]/50 transition-all duration-300">
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black/20 mb-4">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
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

      {/* SECTION 4: INTERACTIVE BAG ANATOMY & CRAFTSMANSHIP ("THE DETAILS MATTER") */}
      <BagAnatomySection />

      {/* SECTION 5: CINEMATIC PRODUCT SPOTLIGHT ("PRODUCT OF THE SEASON" matching Reference Images 4 & 5) */}
      <ProductSpotlightSection />

      {/* SECTION 6: SHOP BY CATEGORY (Warm Beige #FAF8F5) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Curated Categories</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-black font-serif">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* 5 Category Grid Cards matching reference image */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <Link href="/shop?category=tote-bags" className="group bg-white p-4 rounded-2xl border border-black/10 text-center shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" alt="Totes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-black font-serif">TOTES</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">12 Items</span>
          </Link>

          <Link href="/shop?category=shoulder-bags" className="group bg-white p-4 rounded-2xl border border-black/10 text-center shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" alt="Shoulder Bags" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-black font-serif">SHOULDER BAGS</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">18 Items</span>
          </Link>

          <Link href="/shop?category=crossbody-bags" className="group bg-white p-4 rounded-2xl border border-black/10 text-center shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b" alt="Crossbody Bags" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-black font-serif">CROSSBODY BAGS</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">24 Items</span>
          </Link>

          <Link href="/shop?category=top-handle-bags" className="group bg-white p-4 rounded-2xl border border-black/10 text-center shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" alt="Top Handle Bags" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-black font-serif">TOP HANDLE BAGS</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">15 Items</span>
          </Link>

          <Link href="/shop?category=evening-clutches" className="group bg-white p-4 rounded-2xl border border-black/10 text-center shadow-sm hover:shadow-xl transition-all">
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" alt="Clutches" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-black font-serif">CLUTCHES</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase">10 Items</span>
          </Link>
        </div>
      </section>

      {/* SECTION 7: ICONIC COLLECTIONS (Dark Editorial #0A192F) */}
      <section className="py-24 bg-[#0A192F] text-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C5A059]">Bespoke Editions</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-white font-serif">
              ICONIC COLLECTIONS
            </h2>
          </div>

          {/* 4 Large Editorial Cards matching reference layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <Link href="/collections" className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl block">
              <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="font-bold text-lg uppercase tracking-wider text-[#C5A059] font-serif">AURELIA COLLECTION</h3>
                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Timeless Sophistication</p>
              </div>
            </Link>

            <Link href="/collections" className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl block">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="font-bold text-lg uppercase tracking-wider text-[#C5A059] font-serif">MONOGRAM COLLECTION</h3>
                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Signature. Elevated.</p>
              </div>
            </Link>

            <Link href="/collections" className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl block">
              <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="font-bold text-lg uppercase tracking-wider text-[#C5A059] font-serif">PRESTIGE EDITION</h3>
                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Luxury Redefined</p>
              </div>
            </Link>

            <Link href="/collections" className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl block">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="font-bold text-lg uppercase tracking-wider text-[#C5A059] font-serif">LIMITED EDITION</h3>
                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Exclusively Yours</p>
              </div>
            </Link>
          </div>

          <div className="pt-6">
            <Link href="/collections" className="inline-block px-8 py-4 border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#C5A059] hover:text-black transition-all">
              VIEW ALL COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: INTERACTIVE EDITORIAL LOOKBOOK & SHOP THE LOOK (matching Reference Images 1 & 3) */}
      <InteractiveLookbookSection />

      {/* SECTION 9: TRUST & SECURITY BAR (Light Background) */}
      <section className="py-12 bg-white border-y border-black/10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Lock className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">SECURE PAYMENTS</h4>
            <p className="text-xs text-gray-500 font-medium">100% encrypted bank checkout</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Star className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">5 STAR CUSTOMER CARE</h4>
            <p className="text-xs text-gray-500 font-medium">Concierge available for you</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">QUALITY GUARANTEED</h4>
            <p className="text-xs text-gray-500 font-medium">Premium luxury promise</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Leaf className="w-6 h-6 text-[#C5A059]" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-black">SUSTAINABLE LUXURY</h4>
            <p className="text-xs text-gray-500 font-medium">Ethical &amp; responsible sourcing</p>
          </div>
        </div>
      </section>

      {/* SECTION 10: AS SEEN IN PRESS LOGOS BAR matching reference image */}
      <section className="py-10 bg-[#FAF8F5] border-b border-black/10 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">AS SEEN IN</span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 text-lg md:text-xl font-bold font-serif uppercase tracking-[0.25em] text-black">
            <span>VOGUE</span>
            <span>ELLE</span>
            <span>BAZAAR</span>
            <span>FORBES</span>
            <span>InStyle</span>
            <span>HARPER&apos;S BAZAAR</span>
          </div>
        </div>
      </section>

      {/* SECTION 11: BEST SELLERS (Warm Light Background) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-end border-b border-black/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">Most Coveted Pieces</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.15em] uppercase text-black font-serif">
              BEST SELLERS
            </h2>
          </div>
          <Link href="/shop?filter=best-sellers" className="text-xs font-bold uppercase tracking-widest text-black hover:text-[#C5A059] flex items-center gap-2">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Best Seller Product Cards with Rating Stars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {bestSellers.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-black/10 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
              <div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 mb-4 border">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-md hover:bg-[#C5A059] text-black transition-colors shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-[#C5A059] text-[#C5A059]" : "text-black"}`} />
                  </button>
                </div>

                <h3 className="font-bold text-xs uppercase tracking-wider text-black font-serif mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm font-bold text-[#0A192F] mb-2">${product.price}</p>
                
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#C5A059]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-gray-900">{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 mt-4 flex items-center justify-between">
                <Link href={`/shop/${product.slug}`} className="text-[10px] uppercase font-bold text-black/70 hover:text-black">
                  View Piece →
                </Link>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="px-3 py-1.5 bg-[#0A192F] text-white text-[10px] font-bold uppercase rounded hover:bg-black transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 12: VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 my-12">
        <CustomerReviewsSection />
      </section>

      {/* SECTION 13: NEWSLETTER & FOOTER (Dark #06152D Background matching reference image) */}
      <footer className="bg-[#06152D] text-white pt-20 pb-12 px-6 md:px-12 border-t border-[#C5A059]/20">
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

    </div>
  )
}
