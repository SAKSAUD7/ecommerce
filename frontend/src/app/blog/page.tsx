"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { apiFetch } from "@/lib/api"
import { ArrowRight, Calendar, User } from "lucide-react"

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: "The Art of Italian Leather Tanning: Inside Our Florence Atelier",
    slug: "art-of-italian-leather-tanning",
    summary: "Discover how our master artisans hand-select full-grain calfskin and apply vegetable tanning methods passed down through generations.",
    cover_image_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
    author_name: "Antigravity Editorial",
    created_at: "2026-08-10"
  },
  {
    id: 2,
    title: "Spring '26 Haute Modest Style Guide: Elevating Eveningwear",
    slug: "spring-26-haute-modest-style-guide",
    summary: "Explore the delicate balance between modest tailoring and architectural leather silhouettes in our modern luxury collection.",
    cover_image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    author_name: "DE'NOURA Atelier",
    created_at: "2026-08-05"
  }
]

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<any[]>(FALLBACK_BLOGS)

  useEffect(() => {
    apiFetch('/cms/blogs/')
      .then(data => {
        if (data && data.length > 0) setBlogs(data)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex-1 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Atelier Stories</span>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
            The DE&apos;NOURA Gazette
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">Editorial journal exploring Florentine leather craftsmanship, modest couture, and luxury design principles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogs.map(post => (
            <article key={post.id} className="bg-white rounded-3xl overflow-hidden border border-black/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img 
                    src={post.cover_image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-[#C5A059] text-[10px] font-bold uppercase rounded-full backdrop-blur-md">
                    Editorial
                  </span>
                </div>

                <div className="p-8 space-y-3">
                  <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#C5A059]" /> {post.created_at?.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#C5A059]" /> {post.author_name}</span>
                  </div>

                  <h2 className="text-2xl font-bold uppercase tracking-tight text-black font-serif group-hover:text-[#C5A059] transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-2">
                <Link 
                  href={`/blog/${post.slug || post.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0A192F] hover:text-[#C5A059] transition-colors border-b border-black/20 pb-1"
                >
                  Read Journal Entry <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
