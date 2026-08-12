"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { createOrder } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ShieldCheck, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "USA",
    phone: "1234567890", // placeholder
    payment_method: "stripe",
    payment_token: "mock_token"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please log in to complete checkout.")
      router.push("/auth/login")
      return
    }

    setIsSubmitting(true)
    try {
      // Map Zustand cart items to backend format (needs variant_id)
      // Since we didn't store variant_id in CartStore previously, we'll mock it or use ID.
      // Assuming item.id is the variant_id for now.
      const orderItems = items.map(item => ({
        variant_id: item.variantId || 1, // Fallback to 1 if missing for testing
        quantity: item.quantity
      }))

      const payload = {
        ...formData,
        items: orderItems
      }

      await createOrder(payload)
      
      router.push("/checkout/success")
    } catch (error: any) {
      alert(error.message || "Failed to place order.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const subtotal = cartTotal()
  const shipping = 25
  const total = subtotal + (subtotal > 0 ? shipping : 0)

  return (
    <div className="min-h-screen bg-transparent text-black flex flex-col lg:flex-row">
      
      {/* Left: Form */}
      <div className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors mb-12 font-bold">
          <ChevronLeft className="w-4 h-4" /> Return to Shop
        </Link>
        
        <h1 className="text-3xl font-bold uppercase tracking-[0.1em] mb-12">Aura Secure Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest mb-16 border-b border-black/10 pb-8 font-bold">
          <span className={step >= 1 ? "text-black" : "text-black/30"}>1. Shipping</span>
          <span className="text-black/30">/</span>
          <span className={step >= 2 ? "text-black" : "text-black/30"}>2. Payment</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 max-w-xl"
            >
              <div>
                <h2 className="text-lg uppercase tracking-widest mb-6 font-bold">Contact Information</h2>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <h2 className="text-lg uppercase tracking-widest mb-6 font-bold">Shipping Address</h2>
                <div className="space-y-4 font-medium">
                  <div className="flex gap-4">
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                  </div>
                  <input type="text" name="street_address" value={formData.street_address} onChange={handleChange} placeholder="Address" className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                  <div className="flex gap-4">
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Postal Code" className="w-full bg-white/50 border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-5 mt-8 hover:bg-black/80 transition-colors"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 max-w-xl"
            >
              <div className="border border-black/20 p-6 space-y-4 text-sm text-black/70 font-medium">
                <div className="flex justify-between border-b border-black/10 pb-4">
                  <span>Contact</span>
                  <span className="text-black">{formData.email || "user@example.com"}</span>
                  <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest hover:text-black font-bold">Change</button>
                </div>
                <div className="flex justify-between pt-4">
                  <span>Ship to</span>
                  <span className="text-black truncate max-w-[200px]">{formData.street_address || "123 Luxury Ave, NY"}</span>
                  <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest hover:text-black font-bold">Change</button>
                </div>
              </div>

              <div>
                <h2 className="text-lg uppercase tracking-widest mb-6 mt-12 flex items-center gap-3 font-bold">
                  <CreditCard className="w-5 h-5" /> Payment
                </h2>
                <p className="text-xs text-black/50 mb-6 font-bold">All transactions are secure and encrypted.</p>
                
                <div className="border border-black/20 p-6 glass-panel relative bg-white/50">
                  <div className="absolute top-0 right-0 p-4">
                    <ShieldCheck className="w-6 h-6 text-black/30" />
                  </div>
                  <div className="space-y-4 font-medium">
                    <input type="text" placeholder="Card Number" className="w-full bg-transparent border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="Name on Card" className="w-full bg-transparent border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                    <div className="flex gap-4">
                      <input type="text" placeholder="Expiration (MM/YY)" className="w-full bg-transparent border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                      <input type="text" placeholder="Security Code" className="w-full bg-transparent border border-black/20 p-4 outline-none focus:border-black transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-5 mt-8 hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Pay Now"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full lg:w-[450px] xl:w-[500px] bg-transparent border-l border-black/10 p-8 md:p-16">
        <h2 className="text-lg uppercase tracking-widest mb-12 font-bold">Order Summary</h2>
        
        <div className="space-y-6 mb-12">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-black/5 border border-black/10 rounded">
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-black/10 rounded-full flex items-center justify-center text-[10px] backdrop-blur-md shadow-sm">
                  {item.quantity}
                </span>
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded opacity-90" />}
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black">{item.title}</h3>
                <p className="text-[10px] text-black/50 tracking-widest uppercase mt-1 font-bold">{item.color} / EU {item.size}</p>
              </div>
              <span className="text-sm tracking-widest text-black font-medium">${item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 pt-8 space-y-4 text-sm tracking-widest font-medium">
          <div className="flex justify-between text-black/60">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-black/60">
            <span>Shipping</span>
            <span>${subtotal > 0 ? shipping : 0}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-black pt-6 border-t border-black/10 mt-6">
            <span>Total</span>
            <span>${total} <span className="text-[10px] text-black/40 ml-1">USD</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
