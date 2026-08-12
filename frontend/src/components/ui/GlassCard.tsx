"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  title: string
  price: string
  imageUrl?: string
  className?: string
}

export default function GlassCard({ title, price, imageUrl, className }: GlassCardProps) {
  return (
    <div className={cn("group relative aspect-[3/4] overflow-hidden rounded-xl glass-card p-6 flex flex-col justify-end interactive", className)}>
      {/* Light gradient overlay for readability at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
      
      <div className="absolute inset-0 bg-white/30 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
        ) : (
          <span className="text-black/30 tracking-widest text-sm uppercase font-bold">3D MODEL</span>
        )}
      </div>
      
      <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <h3 className="text-lg font-bold tracking-widest uppercase mb-2 text-white drop-shadow-md">{title}</h3>
        <p className="text-white/90 text-sm mb-4 font-medium drop-shadow-md">{price}</p>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-full py-3 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-black/80">
          Quick Add
        </button>
      </div>
    </div>
  )
}
