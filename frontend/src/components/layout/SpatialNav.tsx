"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Search, User, Menu, X } from "lucide-react"
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
  const items = useCartStore((state) => state.items)
  
  // Calculate total number of items
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 flex items-center justify-between",
          scrolled ? "top-4 left-4 right-4 rounded-3xl glass-panel py-3" : "bg-transparent"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <DeNouraLogo size="md" variant="dark" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-black/70 font-bold">
            <Link href="/shop" className="hover:text-black transition-colors duration-300">Shop</Link>
            <Link href="/collections" className="hover:text-black transition-colors duration-300">Collections</Link>
            <Link href="/about" className="hover:text-black transition-colors duration-300">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSearchOpen(true)}
            className="text-black/70 hover:text-black transition-colors duration-300 hidden md:block"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link href="/account" className="text-black/70 hover:text-black transition-colors duration-300 hidden md:block">
            <User className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setCartOpen(true)}
            className="text-black/70 hover:text-black transition-colors duration-300 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden text-black"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[#F5F2EB]/90 backdrop-blur-3xl flex flex-col items-center justify-center text-black"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <button 
              className="absolute top-8 right-8 text-black/50 hover:text-black"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-10 text-2xl uppercase tracking-[0.2em] font-bold">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link href="/collections" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
