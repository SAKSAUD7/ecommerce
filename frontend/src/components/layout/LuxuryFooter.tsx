"use client"

import React from "react"
import Link from "next/link"

export default function LuxuryFooter() {
  return (
    <footer className="w-full bg-transparent text-black/70 border-t border-black/10 pt-20 pb-10 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-3xl font-bold tracking-[0.2em] uppercase text-black block mb-6">
            Aura
          </Link>
          <p className="max-w-md text-sm leading-relaxed mb-8 font-medium">
            Experience the future of online shopping. A spatial luxury modest fashion platform blending premium physical garments with immersive digital realities.
          </p>
          <form className="relative max-w-sm">
            <input 
              type="email" 
              placeholder="JOIN THE LIST" 
              className="w-full bg-transparent border-b border-black/20 pb-2 text-sm uppercase tracking-widest outline-none focus:border-black transition-colors placeholder:text-black/30 text-black font-bold"
            />
            <button type="submit" className="absolute right-0 bottom-2 text-xs uppercase tracking-widest font-bold hover:text-black transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <h4 className="text-black text-xs font-bold uppercase tracking-widest mb-6">Explore</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/shop" className="hover:text-black transition-colors">Shop All</Link></li>
            <li><Link href="/collections" className="hover:text-black transition-colors">Collections</Link></li>
            <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-black text-xs font-bold uppercase tracking-widest mb-6">Client Care</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between text-xs tracking-widest font-bold">
        <p>&copy; {new Date().getFullYear()} AURA LUXURY. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-black transition-colors">INSTAGRAM</Link>
          <Link href="#" className="hover:text-black transition-colors">TWITTER</Link>
          <Link href="#" className="hover:text-black transition-colors">PINTEREST</Link>
        </div>
      </div>
    </footer>
  )
}
