"use client"

import React, { useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import { motion } from "framer-motion"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/lib/api"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ShopContent() {
  const [filterOpen, setFilterOpen] = useState(false)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const brandFilter = searchParams.get("brand")
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 1,
  })

  let products = data?.results || [];

  if (categoryFilter) {
    products = products.filter((p: any) => p.category?.slug === categoryFilter)
  }
  if (brandFilter) {
    products = products.filter((p: any) => p.brand?.slug === brandFilter)
  }

  return (
    <>
      <SpatialNav />
      
      <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen bg-transparent">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-[0.1em] uppercase text-black mb-4">
                Shop<br/><span className="text-black/40">The Collection</span>
              </h1>
              <p className="text-black/60 text-sm tracking-widest uppercase font-bold">
                Showing {products.length} Results
              </p>
            </div>
            
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-3 text-xs uppercase tracking-widest text-black/70 hover:text-black font-bold transition-colors border border-black/20 px-6 py-3 rounded-full mt-6 md:mt-0 glass-panel"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Filter Sidebar - Sticky */}
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: filterOpen ? 300 : 0, 
                opacity: filterOpen ? 1 : 0 
              }}
              className="hidden lg:block overflow-hidden sticky top-32 h-[calc(100vh-160px)]"
            >
              <div className="w-[300px] pr-8 border-r border-black/10 h-full overflow-y-auto pb-20">
                <div className="mb-10">
                  <h3 className="text-black text-sm font-bold uppercase tracking-widest mb-6 border-b border-black/10 pb-4">Categories</h3>
                  <ul className="space-y-4 text-sm text-black/60 font-medium">
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop">All Categories</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?category=handbags">Handbags</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?category=totes">Totes</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?category=shoulder-bags">Shoulder Bags</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?category=crossbody">Crossbody</Link>
                    </li>
                  </ul>
                </div>

                <div className="mb-10">
                  <h3 className="text-black text-sm font-bold uppercase tracking-widest mb-6 border-b border-black/10 pb-4">Brands</h3>
                  <ul className="space-y-4 text-sm text-black/60 font-medium">
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?brand=maison-aurelia">Maison Aurelia</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?brand=maison-elan">Maison Élan</Link>
                    </li>
                    <li className="hover:text-black cursor-pointer transition-colors flex justify-between">
                      <Link href="/shop?brand=valere-paris">Valère Paris</Link>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-black text-sm font-bold uppercase tracking-widest mb-6 border-b border-black/10 pb-4">Price</h3>
                  <div className="space-y-4 text-sm text-black/60 font-medium">
                    <label className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
                      <input type="checkbox" className="accent-black bg-transparent border-black/30" />
                      Under $1,000
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
                      <input type="checkbox" className="accent-black" />
                      $1,000 - $2,000
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer hover:text-black transition-colors">
                      <input type="checkbox" className="accent-black" />
                      Over $2,000
                    </label>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <Link href={`/shop/${product.slug}`} key={product.id || product.slug}>
                    <GlassCard 
                      title={product.name || product.title} 
                      price={`$${product.base_price}`} 
                      imageUrl={product.images?.[0]?.image_url}
                    />
                  </Link>
                ))}
              </div>
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
