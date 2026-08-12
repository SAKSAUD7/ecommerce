"use client"

import React, { useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import { motion } from "framer-motion"
import { SlidersHorizontal, Loader2, Filter, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/lib/api"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const FALLBACK_LUXURY_PRODUCTS = [
  { id: 1, name: "DE'NOURA Master Leather Tote", slug: "denoura-master-tote", base_price: "450.00", category: { name: "Handbags", slug: "handbags" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" }] },
  { id: 2, name: "Royal Velvet Evening Clutch", slug: "royal-velvet-clutch", base_price: "299.00", category: { name: "Clutches", slug: "clutches" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" }] },
  { id: 3, name: "Italian Silk Crossbody Bag", slug: "italian-silk-crossbody", base_price: "320.00", category: { name: "Crossbody", slug: "crossbody" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" }] },
  { id: 4, name: "Monogrammed Silk Abaya", slug: "monogrammed-silk-abaya", base_price: "480.00", category: { name: "Modest Luxury", slug: "modest-luxury" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d" }] },
  { id: 5, name: "Embossed Leather Shoulder Satchel", slug: "embossed-leather-satchel", base_price: "390.00", category: { name: "Shoulder Bags", slug: "shoulder-bags" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" }] },
  { id: 6, name: "Chiffon Silk Hijab Set", slug: "chiffon-silk-hijab-set", base_price: "120.00", category: { name: "Accessories", slug: "accessories" }, brand: { name: "DE'NOURA Atelier", slug: "denoura" }, images: [{ image_url: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" }] },
]

function ShopContent() {
  const [filterOpen, setFilterOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("all")
  
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const brandFilter = searchParams.get("brand")
  
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 1,
  })

  let rawProducts = data?.results || data || []
  if (!rawProducts || rawProducts.length === 0) {
    rawProducts = FALLBACK_LUXURY_PRODUCTS
  }

  let products = [...rawProducts]

  if (categoryFilter) {
    products = products.filter((p: any) => p.category?.slug === categoryFilter || p.category?.name?.toLowerCase() === categoryFilter.toLowerCase())
  }
  if (brandFilter) {
    products = products.filter((p: any) => p.brand?.slug === brandFilter || p.brand?.name?.toLowerCase() === brandFilter.toLowerCase())
  }
  if (searchTerm.trim()) {
    products = products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  }
  if (priceRange === "under-300") {
    products = products.filter((p: any) => parseFloat(p.base_price) < 300)
  } else if (priceRange === "300-400") {
    products = products.filter((p: any) => parseFloat(p.base_price) >= 300 && parseFloat(p.base_price) <= 400)
  } else if (priceRange === "over-400") {
    products = products.filter((p: any) => parseFloat(p.base_price) > 400)
  }

  return (
    <>
      <SpatialNav />
      
      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen bg-[#FAF8F5] text-black">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-black/10 pb-8 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-2">DE&apos;NOURA Catalog</span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-[0.1em] uppercase text-black font-serif">
                Shop<br/><span className="text-black/40">The Atelier Collection</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-full text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/80 hover:text-black font-bold transition-colors border border-black/20 px-5 py-2.5 rounded-full bg-white shadow-sm whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters ({products.length})
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Filter Sidebar */}
            {filterOpen && (
              <aside className="w-full lg:w-[280px] space-y-8 flex-shrink-0 bg-white p-6 rounded-2xl border border-black/10 shadow-sm h-fit">
                <div>
                  <h3 className="text-black text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">Categories</h3>
                  <ul className="space-y-3 text-xs text-black/70 font-medium">
                    <li><Link href="/shop" className="hover:text-black font-bold block">All Categories</Link></li>
                    <li><Link href="/shop?category=handbags" className="hover:text-black block">Handbags &amp; Totes</Link></li>
                    <li><Link href="/shop?category=clutches" className="hover:text-black block">Evening Clutches</Link></li>
                    <li><Link href="/shop?category=crossbody" className="hover:text-black block">Crossbody Bags</Link></li>
                    <li><Link href="/shop?category=modest-luxury" className="hover:text-black block">Modest Luxury Abayas</Link></li>
                    <li><Link href="/shop?category=accessories" className="hover:text-black block">Silk Accessories</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-black text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">Price Filter</h3>
                  <div className="space-y-2 text-xs text-black/70 font-medium">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="radio" name="price" checked={priceRange === "all"} onChange={() => setPriceRange("all")} className="accent-black" />
                      All Prices
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="radio" name="price" checked={priceRange === "under-300"} onChange={() => setPriceRange("under-300")} className="accent-black" />
                      Under $300
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="radio" name="price" checked={priceRange === "300-400"} onChange={() => setPriceRange("300-400")} className="accent-black" />
                      $300 - $400
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                      <input type="radio" name="price" checked={priceRange === "over-400"} onChange={() => setPriceRange("over-400")} className="accent-black" />
                      Over $400
                    </label>
                  </div>
                </div>
              </aside>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="py-20 text-center text-xs font-bold uppercase tracking-widest text-black/50">
                  Loading Atelier Collection...
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <p className="text-sm font-semibold text-gray-500">No luxury pieces match your search criteria.</p>
                  <button onClick={() => { setSearchTerm(""); setPriceRange("all"); }} className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full">Reset Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product: any) => (
                    <Link href={`/shop/${product.slug || product.id}`} key={product.id || product.slug} className="group">
                      <GlassCard 
                        title={product.name || product.title} 
                        price={`$${product.base_price}`} 
                        imageUrl={product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <LuxuryFooter />
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-black/50">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  )
}
