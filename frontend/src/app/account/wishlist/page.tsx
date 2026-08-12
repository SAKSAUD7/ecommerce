"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Heart, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cartStore"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const data = await apiFetch('/products/wishlist/')
      setWishlist(data)
    } catch (err) {
      console.error("Failed to fetch wishlist:", err)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    try {
      await apiFetch('/products/wishlist/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId })
      })
      fetchWishlist() // Refresh
    } catch (err) {
      console.error(err)
    }
  }

  const moveToCart = (product: any) => {
    // Basic variant logic: pick first variant or default
    const variantId = product.variants?.[0]?.id || 1
    const size = product.variants?.[0]?.size || "42"
    const color = product.variants?.[0]?.color || "Obsidian"

    addItem({
      title: product.name,
      variantId,
      price: product.base_price,
      quantity: 1,
      size,
      color,
      imageUrl: product.images?.[0]?.image_url
    })
    removeFromWishlist(product.id)
    alert("Moved to Cart!")
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6" /> My Wishlist
      </h1>

      {loading ? (
        <p className="text-sm tracking-widest text-black/50 uppercase">Loading wishlist...</p>
      ) : !wishlist || !wishlist.products || wishlist.products.length === 0 ? (
        <div className="text-center py-24 bg-white/50 border border-black/10 rounded-xl">
          <Heart className="w-12 h-12 text-black/20 mx-auto mb-4" />
          <p className="text-sm tracking-widest text-black/50 uppercase font-bold mb-6">Your wishlist is empty.</p>
          <Link href="/shop" className="bg-black text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black/80 transition-colors">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.products.map((product: any) => (
            <div key={product.id} className="bg-white border border-black/10 rounded-xl overflow-hidden flex">
              <div className="w-1/3 bg-gray-100 flex-shrink-0">
                {product.images?.[0]?.image_url ? (
                  <img src={product.images[0].image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Image</div>
                )}
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <Link href={`/shop/${product.slug}`} className="hover:underline">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-2">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-black/50 font-bold">${parseFloat(product.base_price).toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <button 
                    onClick={() => moveToCart(product)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-black text-white px-4 py-2 rounded hover:bg-black/80 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" /> Move to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
