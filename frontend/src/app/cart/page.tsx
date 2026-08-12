"use client"

import React from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { useCartStore } from "@/store/cartStore"
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCartStore()
  
  const subtotal = cartTotal()
  const freeShippingThreshold = 150
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1">
        <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-black/10 pb-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">DE&apos;NOURA Shopping Bag</span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
              Your Atelier Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
            </h1>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-black/60 hover:text-black flex items-center gap-2 mt-4 md:mt-0">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-black/10 shadow-sm mb-10 space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            {missingForFreeShipping > 0 ? (
              <span className="text-gray-700">Add <strong className="text-[#C5A059]">${missingForFreeShipping.toFixed(2)}</strong> more for FREE Worldwide Express Shipping!</span>
            ) : (
              <span className="text-emerald-700 font-bold">🎉 Congratulations! You have unlocked FREE Express Worldwide Shipping!</span>
            )}
            <span className="text-gray-400 font-mono">{freeShippingPercent.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#C5A059] transition-all duration-500 rounded-full" style={{ width: `${freeShippingPercent}%` }} />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-black/10 text-center space-y-6 max-w-xl mx-auto my-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
            <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 font-serif">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">Explore our haute couture collection of Italian leather totes, luxury abayas, and artisan evening clutches.</p>
            <Link 
              href="/shop" 
              className="inline-block px-8 py-4 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-black transition-all shadow-lg"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Cart Items List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex gap-6 items-center">
                  <div className="relative w-24 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.imageUrl || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">Atelier Piece</span>
                    <h3 className="text-base font-bold uppercase text-black font-serif">{item.title}</h3>
                    <p className="text-xs text-gray-500">Color: <strong>{item.color || "Noir"}</strong> | Size: <strong>{item.size || "Standard"}</strong></p>
                    <p className="text-sm font-bold text-[#0A192F] pt-1">${item.price}</p>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center justify-between border border-black/20 rounded-lg px-3 py-1.5 w-24 bg-gray-50">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="text-black/60 hover:text-black font-bold">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="text-black/60 hover:text-black font-bold">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.variantId)} 
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button onClick={clearCart} className="text-xs text-gray-500 hover:text-black underline font-bold uppercase">Clear Shopping Bag</button>
              </div>
            </div>

            {/* Order Summary & Checkout (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-black/10 shadow-md space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-wider text-black border-b border-black/10 pb-4 font-serif">Order Summary</h2>

              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Express Shipping</span>
                  <span className="font-bold text-black">{missingForFreeShipping === 0 ? "FREE" : "$25.00"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Luxury VAT Tax (8%)</span>
                  <span className="font-bold text-black">${(subtotal * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-black pt-4 border-t border-black/10">
                  <span>Total Payable</span>
                  <span className="text-[#0A192F]">${(subtotal + (missingForFreeShipping === 0 ? 0 : 25) + subtotal * 0.08).toFixed(2)} USD</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Proceed To Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-4 border-t border-black/10 grid grid-cols-2 gap-2 text-center text-[10px] font-semibold text-gray-500">
                <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> 256-Bit SSL Encrypted
                </div>
                <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C5A059]" /> Express Global Shipping
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <LuxuryFooter />
    </div>
  )
}
