"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, cartTotal } = useCartStore()

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white border-l border-black/10 z-[200] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <h2 className="text-xl font-bold uppercase tracking-[0.1em] text-black">Cart</h2>
              <button 
                onClick={onClose}
                className="p-2 text-black/50 hover:text-black transition-colors rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-black/50 tracking-widest uppercase mb-4 font-bold">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="border border-black/20 px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-black hover:bg-black hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Item Image Placeholder */}
                    <div className="w-24 h-32 bg-black/5 rounded-md flex items-center justify-center border border-black/10 shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-md opacity-90" />
                      ) : (
                        <span className="text-black/30 text-[8px] uppercase tracking-widest font-bold">Image</span>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-black">{item.title}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-black/40 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-black/60 text-xs tracking-widest uppercase mb-4 font-bold">
                        {item.color} / EU {item.size}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-black/20 px-2 py-1 w-24 justify-between">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-black/50 hover:text-black"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-black/50 hover:text-black"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <p className="text-sm tracking-widest text-black font-medium">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-black/10 bg-transparent">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs tracking-widest uppercase text-black/60 font-bold">Subtotal</span>
                  <span className="text-xl tracking-widest text-black font-bold">${cartTotal()}</span>
                </div>
                <p className="text-[10px] text-black/50 uppercase tracking-widest mb-6 font-bold">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={onClose} className="block w-full text-center py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-black/90 transition-colors">
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
