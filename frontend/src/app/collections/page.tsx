"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { apiFetch } from "@/lib/api"
import { ArrowRight } from "lucide-react"

export default function CollectionsPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/products/categories/')
      .then(data => {
        setCategories(data.results || data)
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <SpatialNav />
      <div className="pt-32 pb-20 min-h-screen bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.1em] uppercase text-black mb-4">
              Curated <span className="font-bold">Collections</span>
            </h1>
            <p className="text-black/60 tracking-widest text-sm uppercase max-w-xl">
              Explore our meticulously crafted categories, designed for the modern luxury lifestyle.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((cat, i) => (
                <Link href={`/shop?category=${cat.slug}`} key={cat.id}>
                  <div className="group relative overflow-hidden bg-white rounded-2xl aspect-[4/3] flex items-center justify-center border border-black/5 hover:border-black/20 transition-all duration-700 cursor-pointer shadow-sm hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                    
                    <div className="absolute inset-0 bg-[#EAE6DB] transition-transform duration-1000 group-hover:scale-105 flex items-center justify-center">
                      <span className="text-9xl font-bold text-black/5 uppercase tracking-tighter">
                        {cat.name.substring(0, 2)}
                      </span>
                    </div>

                    <div className="relative z-20 flex flex-col items-center text-center mt-auto pb-12 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                      <h2 className="text-3xl font-bold tracking-[0.15em] text-white uppercase mb-4 drop-shadow-md">
                        {cat.name}
                      </h2>
                      <div className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <LuxuryFooter />
    </>
  )
}
