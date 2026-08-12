"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <>
      <SpatialNav />
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center pt-20 px-6">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-black/5 max-w-lg w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold tracking-[0.1em] uppercase text-black mb-4">
            Order Confirmed
          </h1>
          
          <p className="text-black/60 mb-8 font-medium">
            Thank you for your purchase. We have received your order and are preparing it for shipment. 
            You will receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xs uppercase tracking-widest text-black/50 font-bold mb-2">Order Tracking</h3>
            <p className="text-sm font-medium text-gray-900">
              You can track your order status in your account dashboard.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/account/orders"
              className="w-full bg-black text-white px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-colors"
            >
              View My Orders
            </Link>
            <Link 
              href="/shop"
              className="w-full bg-transparent text-black border border-black/20 px-6 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:border-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <LuxuryFooter />
    </>
  )
}
