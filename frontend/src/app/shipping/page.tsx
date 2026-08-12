"use client"

import React from "react"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { Truck, ShieldCheck, Clock, Globe } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full flex-1 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Global Logistics</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
            Worldwide Shipping Policy
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">Complimentary express shipping on orders over $150. Tracked courier delivery via DHL Express &amp; FedEx.</p>
        </div>

        {/* Shipping Rates Table */}
        <div className="bg-white rounded-3xl border border-black/10 shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-black font-serif border-b pb-3">Delivery Destinations &amp; Estimates</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 uppercase text-gray-500 font-bold border-b">
                <tr>
                  <th className="py-3 px-4">Region / Country</th>
                  <th className="py-3 px-4">Carrier</th>
                  <th className="py-3 px-4">Estimated Transit</th>
                  <th className="py-3 px-4 text-right">Express Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900">United Kingdom (Denoura.co.uk)</td>
                  <td className="py-3.5 px-4">DPD / DHL Next Day</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">1 - 2 Business Days</td>
                  <td className="py-3.5 px-4 text-right font-bold">FREE over $150 ($15 below)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900">United States (Denoura.co)</td>
                  <td className="py-3.5 px-4">DHL Express International</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">2 - 4 Business Days</td>
                  <td className="py-3.5 px-4 text-right font-bold">FREE over $150 ($25 below)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900">United Arab Emirates &amp; GCC</td>
                  <td className="py-3.5 px-4">FedEx Priority Courier</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">2 - 3 Business Days</td>
                  <td className="py-3.5 px-4 text-right font-bold">FREE over $150 ($25 below)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900">European Union &amp; Rest of World</td>
                  <td className="py-3.5 px-4">DHL Express Worldwide</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">3 - 5 Business Days</td>
                  <td className="py-3.5 px-4 text-right font-bold">FREE over $150 ($30 below)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Value Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-2">
            <Truck className="w-8 h-8 text-[#C5A059] mx-auto" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Signature Delivery</h3>
            <p className="text-[11px] text-gray-500">All shipments require adult signature confirmation upon arrival.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#C5A059] mx-auto" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Fully Insured Transit</h3>
            <p className="text-[11px] text-gray-500">Every shipment is 100% insured against loss or damage in transit.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm space-y-2">
            <Clock className="w-8 h-8 text-[#C5A059] mx-auto" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Same-Day Dispatch</h3>
            <p className="text-[11px] text-gray-500">Orders placed before 2 PM GMT are dispatched same business day.</p>
          </div>
        </div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
