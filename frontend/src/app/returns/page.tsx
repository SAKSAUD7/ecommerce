"use client"

import React, { useState } from "react"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"

export default function ReturnsPage() {
  const [formData, setFormData] = useState({ orderId: "", email: "", reason: "Size Swap", details: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full flex-1 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Client Concierge</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
            30-Day Hassle-Free Returns
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">We want you to adore your DE'NOURA handbag. If you are not 100% satisfied, returns and size exchanges are complimentary within 30 days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Return Guidelines */}
          <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-sm space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-black font-serif border-b pb-3">Return Eligibility Guidelines</h2>
            
            <ul className="space-y-4 text-xs text-gray-700 font-medium">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Items must be requested within 30 days of delivery receipt.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Handbags and silk garments must be unworn, undamaged, with original security tags attached.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Must be returned in original DE'NOURA dust bag and protective box.</span>
              </li>
            </ul>

            <div className="p-4 bg-[#0A192F] text-white rounded-2xl space-y-1 text-xs">
              <span className="text-[#C5A059] font-bold">Complimentary Return Shipping</span>
              <p className="text-white/80 text-[11px]">We provide pre-paid DHL return shipping labels for all domestic and international returns.</p>
            </div>
          </div>

          {/* Right Column: Interactive Return Request Form */}
          <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-md space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-black font-serif border-b pb-3">Submit Return Request</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold uppercase">Return Request Received!</h3>
                <p className="text-xs text-emerald-700">Pre-paid DHL return label has been emailed to <strong>{formData.email || "Denoura.co@gmail.com"}</strong>.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs font-bold text-black underline uppercase">Request Another Return</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Order Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.orderId}
                    onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g. #DN-884102"
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs font-mono outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="The email used at checkout"
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs font-medium outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Reason for Return</label>
                  <select 
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs font-medium bg-white"
                  >
                    <option value="Size Swap">Size Swap / Color Exchange</option>
                    <option value="Changed Mind">Changed Mind</option>
                    <option value="Defective">Defective / Damaged in Transit</option>
                    <option value="Wrong Item">Received Incorrect Item</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0A192F] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-black transition-all shadow-lg"
                >
                  Generate Pre-Paid Return Label →
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
