"use client"

import React, { useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import GlassCard from "@/components/ui/GlassCard"
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

const SAMPLE_WISHLIST = [
  { id: 1, name: "DE'NOURA Master Leather Tote", slug: "denoura-master-tote", base_price: "450.00", images: [{ image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" }] },
  { id: 2, name: "Royal Velvet Evening Clutch", slug: "royal-velvet-clutch", base_price: "299.00", images: [{ image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" }] }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(SAMPLE_WISHLIST)
  const addItem = useCartStore((state) => state.addItem)

  const handleMoveToCart = (item: any) => {
    addItem({
      title: item.name,
      variantId: item.id,
      price: parseFloat(item.base_price),
      quantity: 1,
      size: "Standard",
      color: "Noir",
      imageUrl: item.images?.[0]?.image_url
    })
    setWishlistItems(wishlistItems.filter(i => i.id !== item.id))
    alert(`Moved "${item.name}" to Shopping Bag!`)
  }

  const handleRemove = (id: number) => {
    setWishlistItems(wishlistItems.filter(i => i.id !== id))
  }

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 space-y-10">
        <div className="flex justify-between items-baseline border-b border-black/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Saved Curations</span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black">
            Explore More Pieces →
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-black/10 text-center space-y-6 max-w-xl mx-auto my-12 shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 font-serif">Your Wishlist is Empty</h2>
            <p className="text-xs text-gray-500">Tap the heart icon on any haute couture piece to save it to your wishlist for later.</p>
            <Link 
              href="/shop" 
              className="inline-block px-8 py-4 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-black/10 shadow-sm space-y-4 flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 mb-4 border">
                    <img src={item.images[0].image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-red-50 text-red-500 transition-colors shadow-sm"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-base uppercase text-black font-serif mb-1">{item.name}</h3>
                  <p className="text-sm font-bold text-[#0A192F]">${item.base_price} USD</p>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 rounded-xl hover:bg-black transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Move To Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <LuxuryFooter />
    </div>
  )
}
