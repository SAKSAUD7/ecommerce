"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search } from "lucide-react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function SearchDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await apiFetch(`/products/items/?search=${query}`)
        setResults(data.results || data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 500) // Debounce

    return () => clearTimeout(timer)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-white text-black flex flex-col"
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between p-6 md:px-12 border-b border-gray-100">
            <div className="flex-1 flex items-center gap-4">
              <Search className="w-6 h-6 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products, brands, categories..."
                className="w-full text-2xl md:text-4xl outline-none placeholder:text-gray-300 font-light"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <button onClick={onClose} className="p-4 text-black hover:opacity-50 transition-opacity">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:px-12 py-12">
            <div className="max-w-7xl mx-auto">
              {!query && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Searches</h3>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => setQuery("Totes")} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">Totes</button>
                      <button onClick={() => setQuery("Maison Aurelia")} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">Maison Aurelia</button>
                      <button onClick={() => setQuery("Crossbody")} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">Crossbody</button>
                    </div>
                  </div>
                </div>
              )}

              {loading && <div className="text-gray-400 uppercase tracking-widest">Searching...</div>}
              
              {!loading && query && results.length === 0 && (
                <div className="text-gray-400 text-xl font-light">No results found for "{query}".</div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-4">
                    Products ({results.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {results.map((product) => (
                      <Link href={`/shop/${product.slug}`} key={product.id} onClick={onClose} className="group">
                        <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4 relative">
                          <img 
                            src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400'} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <h4 className="text-sm font-bold truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">${product.base_price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
