"use client"

import React from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail, MapPin } from "lucide-react"

export default function OrderSuccessPage() {
  const orderId = "DN-884102"

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-2xl mx-auto px-6 w-full flex-1 text-center">
        
        <div className="bg-white p-10 md:p-14 rounded-3xl border border-black/10 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059] block mb-2">Order Confirmed</span>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-medium">Order Confirmation <strong>#{orderId}</strong></p>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed max-w-lg mx-auto">
            We have received your payment and our artisan team in Florence is preparing your luxury shipment. A confirmation email has been sent to <strong>Denoura.co@gmail.com</strong>.
          </p>

          {/* Delivery Timeline Summary */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold border-b border-gray-200 pb-2">
              <span className="text-gray-700">Estimated Delivery:</span>
              <span className="text-emerald-700">August 15, 2026 (Express DHL)</span>
            </div>
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>Carrier:</span>
              <span className="font-bold text-black">DHL Express Global</span>
            </div>
            <div className="flex justify-between text-gray-600 text-[11px]">
              <span>Official Support:</span>
              <span className="font-bold text-black">Denoura.co@gmail.com</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/track"
              className="flex-1 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Track Order Status <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/shop"
              className="px-6 py-4 border border-black/20 text-black text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gray-100 transition-colors"
            >
              Return to Atelier Shop
            </Link>
          </div>
        </div>

      </main>

      <LuxuryFooter />
    </div>
  )
}
