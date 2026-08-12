"use client"

import React, { useState } from "react"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import CustomerReviewsSection from "@/components/shop/CustomerReviewsSection"
import { motion } from "framer-motion"
import { Plus, Minus, ChevronRight, ShieldCheck, Truck, RotateCcw, Heart, Check, Star } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchProductBySlug, apiFetch } from "@/lib/api"
import { useCartStore } from "@/store/cartStore"
import ProductModelViewer from "@/components/3d/ProductModelViewer"
import { useRouter } from "next/navigation"

const FALLBACK_HANDBAG = {
  id: 1,
  name: "DE'NOURA Master Leather Tote",
  title: "DE'NOURA Master Leather Tote",
  price: 450,
  base_price: "450.00",
  description: "Handcrafted in Florence using full-grain Italian calfskin leather. Featuring custom 24k gold-plated monogram lock hardware, dual reinforced leather straps, and an opulent plush suede lining.",
  sizes: ["Standard", "Grande", "Mini"],
  colors: ["Noir Black", "Monogram Gold", "Royal Blue"],
  images: [
    { image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" },
    { image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
    { image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" }
  ],
  details: [
    "Full-grain Italian calfskin leather construction",
    "24k gold-plated brass lock hardware",
    "Internal zipped security compartment & phone pouch",
    "Hand-stitched in Florence, Italy",
    "Comes with dust bag and authenticity card"
  ]
}

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Standard")
  const [selectedColor, setSelectedColor] = useState("Noir Black")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  const { data, isLoading } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: () => fetchProductBySlug(params.slug),
    retry: 1,
  })

  const product = data || FALLBACK_HANDBAG
  const productImages = product.images && product.images.length > 0 
    ? product.images.map((img: any) => img.image_url)
    : FALLBACK_HANDBAG.images.map(img => img.image_url)

  const handleAddToCart = () => {
    const variant = product.variants?.find((v: any) => v.size === selectedSize && (v.color === selectedColor || v.color_hex === selectedColor))
    const variantId = variant?.id || 1

    addItem({
      title: product.name || product.title,
      variantId: variantId,
      price: parseFloat(variant?.price || product.price || product.base_price || 450),
      quantity,
      size: selectedSize,
      color: selectedColor,
      imageUrl: productImages[0]
    })
    alert(`Added ${quantity}x "${product.name || product.title}" to cart!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen">
      <SpatialNav />
      
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/50 mb-8 font-bold">
          <span onClick={() => router.push('/shop')} className="hover:text-black cursor-pointer">Shop</span>
          <ChevronRight className="w-3.5 h-3.5 text-black/30" />
          <span className="text-black">{product.name || product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Image Gallery & 3D Interactive Viewer */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-black/10 shadow-lg relative group">
              <img 
                src={productImages[selectedImageIndex] || productImages[0]} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-[#C5A059] text-[10px] font-bold uppercase rounded-full backdrop-blur-md">
                Haute Luxury Piece
              </span>
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? "border-black scale-105" : "border-black/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-black/10 shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-2">DE&apos;NOURA Atelier</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-black font-serif">
                {product.name || product.title}
              </h1>
              
              <div className="flex items-center gap-4 mt-3">
                <p className="text-2xl font-bold text-[#0A192F]">
                  ${product.price || product.base_price || 450} USD
                </p>
                <div className="flex items-center gap-1 text-[#C5A059] text-xs font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>5.0 (Verified Reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-black/70 leading-relaxed font-normal border-y border-black/10 py-6">
              {product.description || FALLBACK_HANDBAG.description}
            </p>

            {/* Option Selectors */}
            <div className="space-y-6">
              {/* Color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black/60 mb-2">Color Selection</label>
                <div className="flex gap-3">
                  {(product.colors || FALLBACK_HANDBAG.colors).map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                        selectedColor === color 
                          ? "bg-black text-white border-black shadow-md" 
                          : "bg-white text-black border-black/20 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black/60 mb-2">Size Specification</label>
                <div className="flex gap-3">
                  {(product.sizes || FALLBACK_HANDBAG.sizes).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                        selectedSize === size 
                          ? "bg-black text-white border-black shadow-md" 
                          : "bg-white text-black border-black/20 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-4 pt-4 border-t border-black/10">
              <div className="flex gap-4">
                <div className="flex items-center justify-between border border-black/20 rounded-xl px-4 py-3 w-32 bg-gray-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-black/60 hover:text-black font-bold">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-black/60 hover:text-black font-bold">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-black transition-all shadow-lg"
                >
                  Add To Cart
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#C5A059] text-black text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-[#d5b069] transition-all shadow-lg"
              >
                Express Checkout Now
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-black/10 text-center text-[11px] font-semibold text-black/70">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Truck className="w-4 h-4 mx-auto text-[#C5A059] mb-1" />
                <span>Express Global Delivery</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 mx-auto text-[#C5A059] mb-1" />
                <span>Authentic Leather</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <RotateCcw className="w-4 h-4 mx-auto text-[#C5A059] mb-1" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-16">
          <CustomerReviewsSection />
        </section>
      </div>

      <LuxuryFooter />
    </div>
  )
}
