"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Search, User, Menu, X, Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import CartDrawer from "@/components/shop/CartDrawer"
import SearchDrawer from "@/components/ui/SearchDrawer"
import { useCartStore } from "@/store/cartStore"
import DeNouraLogo from "../common/DeNouraLogo"

export default function SpatialNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [bagsMenuOpen, setBagsMenuOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Top Announcement Bar matching reference image */}
      <div className="bg-[#06152D] text-[#C5A059] py-2 px-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] border-b border-[#C5A059]/20 relative z-[110]">
        ✨ FREE WORLDWIDE SHIPPING ON ORDERS OVER $150
      </div>

      <motion.nav
        className={cn(
          "sticky top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-3 flex items-center justify-between border-b",
          scrolled ? "bg-[#0A192F]/95 backdrop-blur-md text-white border-white/10 shadow-2xl py-3" : "bg-[#0A192F] text-white border-white/10"
        )}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side: Brand Logo & Links */}
        <div className="flex items-center gap-10">
          <Link href="/">
            <DeNouraLogo size="md" variant="gold" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-bold text-white/90">
            <Link href="/shop?category=new-in" className="hover:text-[#C5A059] transition-colors">NEW IN</Link>
            
            <div 
              className="relative group py-2 cursor-pointer"
              onMouseEnter={() => setBagsMenuOpen(true)}
              onMouseLeave={() => setBagsMenuOpen(false)}
            >
              <Link href="/shop" className="hover:text-[#C5A059] transition-colors flex items-center gap-1">
                BAGS <ChevronDown className="w-3 h-3 text-[#C5A059]" />
              </Link>

              {/* Mega Dropdown Menu */}
              <AnimatePresence>
                {bagsMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-64 bg-[#0A192F] border border-[#C5A059]/30 rounded-2xl p-4 shadow-2xl space-y-2 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <Link href="/shop?category=tote-bags" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Tote Bags</Link>
                    <Link href="/shop?category=shoulder-bags" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Shoulder Bags</Link>
                    <Link href="/shop?category=crossbody-bags" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Crossbody Bags</Link>
                    <Link href="/shop?category=top-handle-bags" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Top Handle Bags</Link>
                    <Link href="/shop?category=evening-clutches" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Evening Clutches</Link>
                    <Link href="/shop?category=mini-bags" className="block p-2 hover:bg-white/10 hover:text-[#C5A059] rounded-lg">Mini Bags</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/collections" className="hover:text-[#C5A059] transition-colors">COLLECTIONS</Link>
            <Link href="/shop?category=silk-accessories" className="hover:text-[#C5A059] transition-colors">ACCESSORIES</Link>
            <Link href="/shop?sale=true" className="hover:text-red-400 transition-colors">SALE</Link>
            <Link href="/about" className="hover:text-[#C5A059] transition-colors">ABOUT</Link>
          </div>
        </div>

        {/* Right Side: Currency & Icons */}
        <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider">
          <span className="hidden md:inline-block text-[#C5A059]">USD $</span>

          <button onClick={() => setSearchOpen(true)} className="hover:text-[#C5A059] transition-colors p-1" title="Search">
            <Search className="w-4 h-4" />
          </button>

          <Link href="/wishlist" className="hover:text-[#C5A059] transition-colors p-1 hidden sm:block" title="Wishlist">
            <Heart className="w-4 h-4" />
          </Link>

          <Link href="/account" className="hover:text-[#C5A059] transition-colors p-1 hidden sm:block" title="Account">
            <User className="w-4 h-4" />
          </Link>

          <button onClick={() => setCartOpen(true)} className="hover:text-[#C5A059] transition-colors relative p-1" title="Shopping Bag">
            <ShoppingBag className="w-4 h-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[#0A192F] text-white flex flex-col items-center justify-center p-6 space-y-6"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
          >
            <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-6 text-lg font-bold uppercase tracking-widest text-[#C5A059]">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop Bags</Link>
              <Link href="/collections" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
              <Link href="/lookbook" onClick={() => setMobileMenuOpen(false)}>Lookbook</Link>
              <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
              <Link href="/track" onClick={() => setMobileMenuOpen(false)}>Order Tracking</Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
