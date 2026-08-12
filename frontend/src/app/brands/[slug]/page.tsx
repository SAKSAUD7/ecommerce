"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiFetch } from "@/lib/api"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import Link from "next/link"

export default function BrandPage() {
  const { slug } = useParams()
  const [brand, setBrand] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const brandData = await apiFetch(`/products/brands/${slug}/`)
        setBrand(brandData)

        // The backend doesn't filter by brand slug natively via query param yet, 
        // so we filter on the frontend for now, or assume the backend sends brand products if added
        // Actually, we can fetch all and filter, or just update the backend to filter by brand.
        // We'll just fetch all for now and filter manually (demo logic)
        const allProducts = await apiFetch('/products/items/')
        const results = allProducts.results || allProducts
        const brandProducts = results.filter((p: any) => p.brand && p.brand.slug === slug)
        
        setProducts(brandProducts)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBrandData()
  }, [slug])

  if (loading) return <div className="min-h-screen bg-[#F9FAFB] pt-32 text-center">Loading...</div>

  if (!brand) return <div className="min-h-screen bg-[#F9FAFB] pt-32 text-center">Brand not found</div>

  return (
    <>
      <SpatialNav />
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="bg-black text-white py-32 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.1em] uppercase mb-6">
            {brand.name}
          </h1>
          <p className="max-w-2xl mx-auto text-white/70 text-lg">
            {brand.description}
          </p>
        </div>

        <div className="max-w-7xl mx-auto py-20 px-6 md:px-12">
          <h2 className="text-2xl font-bold tracking-widest uppercase mb-12 border-b border-gray-200 pb-4">
            Collection
          </h2>
          {products.length === 0 ? (
            <div className="text-gray-400 uppercase tracking-widest text-sm py-12">No products available for this brand.</div>
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
