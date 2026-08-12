"use client"

import React from "react"
import Link from "next/link"
import DeNouraLogo from "../common/DeNouraLogo"

export default function LuxuryFooter() {
  return (
    <footer className="w-full bg-transparent text-black/70 border-t border-black/10 pt-20 pb-10 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="block mb-6">
            <DeNouraLogo size="lg" variant="dark" />
          </Link>
          <p className="max-w-md text-sm leading-relaxed mb-8 font-medium">
            DE&apos;NOURA — Experience the pinnacle of haute modest fashion. Blending timeless elegance with immersive digital craftsmanship.
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
            <li><a href="mailto:Denoura.co@gmail.com" className="hover:text-black transition-colors">Denoura.co@gmail.com</a></li>
            <li><Link href="/track" className="hover:text-black transition-colors">Track Your Order</Link></li>
            <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      {/* Trust Guarantee Badges */}
      <div className="max-w-7xl mx-auto mt-12 py-6 border-y border-black/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">Worldwide Express Shipping</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Tracked Delivery via DHL/FedEx</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">Authentic Modest Luxury</p>
          <p className="text-[11px] text-gray-500 mt-0.5">100% Premium Fabrics & Silk</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">Secure Checkout</p>
          <p className="text-[11px] text-gray-500 mt-0.5">256-Bit SSL Bank-Grade Security</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-black">30-Day Easy Returns</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Hassle-Free Refunds & Exchanges</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row items-center justify-between text-xs tracking-widest font-bold">
        <p>&copy; {new Date().getFullYear()} DE&apos;NOURA (Denoura.co & Denoura.co.uk). ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a href="https://instagram.com/denoura.co" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">INSTAGRAM @DENOURA.CO</a>
          <a href="https://tiktok.com/@denoura.co" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">TIKTOK @DENOURA.CO</a>
        </div>
      </div>
    </footer>
  )
}
