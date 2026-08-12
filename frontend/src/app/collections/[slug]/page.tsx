"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiFetch } from "@/lib/api"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import Link from "next/link"

export default function CollectionPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products belonging to this category slug
    apiFetch(`/products/items/?category=${slug}`)
      .then(data => setProducts(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <>
      <SpatialNav />
      <main className="min-h-screen bg-[#F9FAFB] pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-[0.1em] uppercase text-gray-900 mb-4">
              {slug?.toString().replace(/-/g, " ")}
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm">
              Explore our curated selection.
            </p>
          </div>

          {loading ? (
            <div className="text-gray-400 uppercase tracking-widest text-sm">Loading collection...</div>
          ) : products.length === 0 ? (
            <div className="text-gray-400 uppercase tracking-widest text-sm py-12">No products found in this collection.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <Link href={`/shop/${product.slug}`} key={product.id}>
                  <GlassCard 
                    title={product.name || product.title} 
                    price={`$${product.base_price}`} 
                    imageUrl={product.images?.[0]?.image_url} 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <LuxuryFooter />
    </>
  )
}
