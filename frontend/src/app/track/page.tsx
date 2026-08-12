"use client"

import React, { useState } from "react"
import { apiFetch } from "@/lib/api"
import { PackageSearch, MapPin, Package, CheckCircle2, ChevronRight } from "lucide-react"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [trackingData, setTrackingData] = useState<any>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setTrackingData(null)

    try {
      // Allow for unauthenticated requests, but we'll use standard fetch if we have an API_BASE_URL locally
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/api"
      const res = await fetch(`${API_BASE_URL}/orders/track/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, email: email })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to find order.")
      }

      const data = await res.json()
      setTrackingData(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col pt-24 pb-12">
      <div className="max-w-xl mx-auto w-full px-6">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <PackageSearch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Track Your Order</h1>
          <p className="text-gray-500 text-sm">Enter your order number and email address to see your latest tracking updates.</p>
        </div>

        {!trackingData ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <form onSubmit={handleTrack} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. #1042" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used at checkout" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  required
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Locating Order..." : (
                  <>
                    Track Order
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{trackingData.id}</h2>
                <p className="text-sm text-gray-500">Placed {new Date(trackingData.created_at).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setTrackingData(null)}
                className="text-sm text-gray-500 hover:text-black font-medium underline"
              >
                Track Another
              </button>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-gray-50">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Order Confirmed</h3>
                  <p className="text-xs text-gray-500">We received your order and payment.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${['processing', 'shipped', 'delivered'].includes(trackingData.status) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Processing</h3>
                  <p className="text-xs text-gray-500">Your order is being picked and packed.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${['shipped', 'delivered'].includes(trackingData.status) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Shipped</h3>
                  <p className="text-xs text-gray-500">In transit to {trackingData.shipping_address}.</p>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}
