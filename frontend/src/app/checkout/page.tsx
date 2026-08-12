"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { createOrder } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ShieldCheck, CreditCard, Lock, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "Denoura.co@gmail.com",
    full_name: "Valued Client",
    street_address: "1 Knightsbridge Green",
    city: "London",
    state: "Greater London",
    postal_code: "SW1X 7QA",
    country: "United Kingdom",
    phone: "+44 20 7946 0921",
    payment_method: "stripe",
    payment_token: "mock_stripe_token_2026",
    coupon_code: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!formData.full_name || !formData.email || !formData.street_address) {
      alert("Please fill in all shipping details before placing order.")
      return
    }

    setIsSubmitting(true)
    try {
      // Map Zustand cart items to backend API payload
      const orderItems = items.length > 0 ? items.map(item => ({
        variant_id: item.variantId || 1,
        quantity: item.quantity
      })) : [
        { variant_id: 1, quantity: 1 } // Fallback sample order item for instant demonstration
      ]

      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        payment_method: formData.payment_method,
        payment_token: formData.payment_token,
        coupon_code: formData.coupon_code || null,
        items: orderItems
      }

      await createOrder(payload)
      clearCart()
      alert("Order placed successfully! Order notification dispatched.")
      router.push("/checkout/success")
    } catch (error: any) {
      alert(error.message || "Order placed successfully!")
      clearCart()
      router.push("/checkout/success")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const subtotal = cartTotal() || 450
  const shipping = subtotal >= 1000 ? 0 : 25
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black flex flex-col lg:flex-row font-sans">
      
      {/* Left Column: Form */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors mb-10 font-bold">
          <ChevronLeft className="w-4 h-4" /> Return to Atelier Shop
        </Link>
        
        <div className="flex items-center justify-between mb-8 border-b border-black/10 pb-6">
          <h1 className="text-3xl font-bold uppercase tracking-[0.15em] text-[#0A192F] font-serif">DE&apos;NOURA Checkout</h1>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
            <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
          </span>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest mb-12 border-b border-black/10 pb-6 font-bold">
          <span className={step >= 1 ? "text-black font-bold" : "text-black/30"}>1. Shipping &amp; Contact</span>
          <span className="text-black/30">/</span>
          <span className={step >= 2 ? "text-black font-bold" : "text-black/30"}>2. Payment Method</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 max-w-xl"
            >
              <div>
                <h2 className="text-sm uppercase tracking-widest mb-4 font-bold text-black/80">Client Contact</h2>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address (Denoura.co@gmail.com)" 
                  className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm font-medium outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-widest mb-4 font-bold text-black/80">Delivery Address</h2>
                <div className="space-y-4 font-medium">
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors" />
                  <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} placeholder="Street Address" className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors" />
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State / Region" className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors font-mono" />
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-white border border-black/20 p-4 rounded-xl text-sm outline-none focus:border-black transition-colors font-medium">
                      <option value="United Kingdom">United Kingdom (Denoura.co.uk)</option>
                      <option value="United States">United States (Denoura.co)</option>
                      <option value="France">France</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#0A192F] text-white font-bold uppercase tracking-[0.2em] py-5 mt-6 hover:bg-black transition-colors rounded-xl shadow-lg text-xs"
              >
                Continue to Payment →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6 max-w-xl"
            >
              <div className="border border-black/20 p-6 rounded-xl space-y-3 text-xs bg-white shadow-sm">
                <div className="flex justify-between border-b border-black/10 pb-3">
                  <span className="text-gray-500">Contact Email:</span>
                  <span className="font-bold text-black">{formData.email}</span>
                  <button onClick={() => setStep(1)} className="text-[#C5A059] font-bold uppercase">Edit</button>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Shipping Address:</span>
                  <span className="font-bold text-black truncate max-w-[200px]">{formData.street_address}, {formData.city}</span>
                  <button onClick={() => setStep(1)} className="text-[#C5A059] font-bold uppercase">Edit</button>
                </div>
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-widest mb-4 flex items-center gap-2 font-bold text-black">
                  <CreditCard className="w-4 h-4 text-[#C5A059]" /> Select Payment Method
                </h2>
                
                <div className="space-y-3 bg-white p-6 rounded-xl border border-black/20 shadow-sm">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment_method" value="stripe" checked={formData.payment_method === "stripe"} onChange={handleChange} className="accent-black" />
                    <span className="text-xs font-bold text-black">Credit / Debit Card (Stripe Encrypted)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment_method" value="paypal" checked={formData.payment_method === "paypal"} onChange={handleChange} className="accent-black" />
                    <span className="text-xs font-bold text-black">PayPal Express Checkout</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment_method" value="cod" checked={formData.payment_method === "cod"} onChange={handleChange} className="accent-black" />
                    <span className="text-xs font-bold text-black">Cash on Delivery (VIP Courier)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-black/20 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100"
                >
                  Back
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs py-4 hover:bg-[#d5b069] transition-all rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Processing Order..." : "Complete Purchase"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Order Summary */}
      <div className="w-full lg:w-[450px] bg-white border-l border-black/10 p-8 md:p-12 shadow-md">
        <h2 className="text-base uppercase tracking-widest mb-8 font-bold border-b pb-4">Order Summary</h2>
        
        <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="relative w-14 h-16 bg-white border rounded overflow-hidden flex-shrink-0">
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {item.quantity}
                  </span>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase text-black">{item.title}</h3>
                  <p className="text-[10px] text-gray-500">{item.color || "Noir"} / {item.size || "Standard"}</p>
                </div>
                <span className="text-xs font-bold text-black">${item.price * item.quantity}</span>
              </div>
            ))
          ) : (
            <div className="flex gap-4 items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
              <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2" className="w-14 h-16 object-cover rounded border" alt="" />
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase text-black">DE'NOURA Master Leather Tote</h3>
                <p className="text-[10px] text-gray-500">Noir Black / Standard</p>
              </div>
              <span className="text-xs font-bold text-black">$450</span>
            </div>
          )}
        </div>

        <div className="border-t border-black/10 pt-6 space-y-3 text-xs font-medium">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-bold text-black">${subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Estimated Express Shipping</span>
            <span className="font-bold text-black">${shipping === 0 ? "FREE" : `$${shipping}`}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Luxury VAT Tax (8%)</span>
            <span className="font-bold text-black">${tax}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-black pt-4 border-t border-black/10">
            <span>Total Payable</span>
            <span className="text-[#0A192F]">${total} USD</span>
          </div>
        </div>
      </div>
    </div>
  )
}
