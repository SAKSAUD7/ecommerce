"use client"

import React, { useState } from "react"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { motion } from "framer-motion"
import { Plus, Minus, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { fetchProductBySlug } from "@/lib/api"
import { useCartStore } from "@/store/cartStore"

import ProductModelViewer from "@/components/3d/ProductModelViewer"

const MOCK_PRODUCT = {
  title: "Phantom Sneaker",
  price: 850,
  description: "Engineered for the spatial era. The Phantom Sneaker utilizes aerospace-grade materials paired with responsive nanotech cushioning. A seamless blend of physical luxury and digital expression.",
  sizes: ["40", "41", "42", "43", "44", "45"],
  colors: ["Obsidian", "Ghost White", "Void"],
  details: [
    "Aerospace-grade mesh upper",
    "Nanotech responsive cushioning",
    "Glassmorphic heel clip",
    "RFID authenticated for digital twin ownership"
  ],
  modelUrl: null // Optional GLB path
}

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("42")
  const [selectedColor, setSelectedColor] = useState("Obsidian")
  const addItem = useCartStore((state) => state.addItem)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', params.slug],
    queryFn: () => fetchProductBySlug(params.slug),
    retry: 1,
  })

  // Fallback to mock product if the backend doesn't have it yet
  const product = data || MOCK_PRODUCT;

  const handleAddToCart = () => {
    const variant = product.variants?.find((v: any) => v.size === selectedSize && (v.color === selectedColor || v.color_hex === selectedColor));
    const variantId = variant?.id || 1;

    addItem({
      title: product.title,
      variantId: variantId,
      price: variant?.price || product.price || product.base_price || 850,
      quantity,
      size: selectedSize,
      color: selectedColor,
      imageUrl: product.images?.[0]?.image_url
    });
    // Trigger a visual confirmation here (like a toast or opening a cart drawer)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)
    try {
      await apiFetch(`/products/items/${product.slug}/reviews/`, {
        method: 'POST',
        body: JSON.stringify(reviewForm)
      })
      alert("Review submitted successfully!")
      setReviewForm({ rating: 5, comment: "" })
      // Optionally refetch product data here if we had queryClient
    } catch (err: any) {
      alert(err.message || "Failed to submit review. Please log in.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      <SpatialNav />
      
      <div className="pt-24 pb-20 min-h-screen bg-transparent">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-96px)]">
          
          {/* Left: 360 Viewer / 3D Scene */}
          <div className="flex-1 relative bg-transparent min-h-[50vh] lg:min-h-full overflow-hidden flex items-center justify-center interactive">
            {/* Background lighting effect */}
            <div className="absolute inset-0 bg-radial-gradient from-black/5 to-transparent opacity-50 pointer-events-none" />
            
            {/* 3D Model Viewer */}
            <div className="absolute inset-0 z-10">
              <ProductModelViewer modelUrl={product.modelUrl || product.model_3d} />
            </div>
            
            <div className="absolute bottom-8 left-8 flex gap-4 z-20 pointer-events-none">
              <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-black/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-black uppercase tracking-widest font-bold">Live 3D Rendering</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-[500px] xl:w-[600px] p-8 md:p-16 flex flex-col justify-center relative z-20 bg-transparent border-l border-black/10">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black/40 mb-10 font-bold">
              <span className="hover:text-black cursor-pointer transition-colors">Shop</span>
              <ChevronRight className="w-3 h-3" />
              <span className="hover:text-black cursor-pointer transition-colors">Products</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-black">{product.title}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-[0.1em] text-black mb-4">
                {product.title}
              </h1>
              <p className="text-2xl text-black/80 tracking-widest mb-10 font-medium">
                ${product.price || product.base_price || 850} USD
              </p>
              
              <p className="text-sm text-black/60 leading-relaxed mb-12 font-medium">
                {product.description}
              </p>

              {/* Selectors */}
              <div className="space-y-8 mb-12 border-y border-black/10 py-8">
                
                {/* Color */}
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-black/50 font-bold">Color</span>
                    <span className="text-xs uppercase tracking-widest text-black font-bold">{selectedColor}</span>
                  </div>
                  <div className="flex gap-4">
                    {(product.colors || MOCK_PRODUCT.colors).map((color: string) => (
                      <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border transition-all duration-300 ${selectedColor === color ? 'border-black scale-110' : 'border-transparent hover:border-black/50 shadow-sm'}`}
                        style={{ 
                          backgroundColor: color === 'Obsidian' ? '#111' : color === 'Ghost White' ? '#eee' : '#A89F91' 
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-black/50 font-bold">Size (EU)</span>
                    <button className="text-[10px] uppercase tracking-widest text-black/50 hover:text-black border-b border-transparent hover:border-black transition-colors font-bold">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(product.sizes || MOCK_PRODUCT.sizes).map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-xs tracking-widest transition-colors duration-300 font-bold ${selectedSize === size ? 'bg-black text-white' : 'bg-transparent text-black border border-black/20 hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Add to Cart */}
              <div className="flex gap-4 mb-16">
                <div className="flex items-center justify-between border border-black/20 px-4 py-4 w-32 bg-white/50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-black/50 hover:text-black"><Minus className="w-4 h-4" /></button>
                  <span className="text-sm font-bold text-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-black/50 hover:text-black"><Plus className="w-4 h-4" /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-black/80 transition-colors"
                >
                  Add to Cart
                </button>
                
                <button 
                  className="w-14 h-[52px] border border-black/20 flex items-center justify-center bg-white/50 hover:bg-black/5 transition-colors"
                  title="Add to Wishlist"
                  onClick={async () => {
                    try {
                      const res = await apiFetch('/products/wishlist/', {
                        method: 'POST',
                        body: JSON.stringify({ product_id: product.id })
                      });
                      alert(`Product ${res.status} to wishlist!`);
                    } catch (e: any) {
                      alert(e.message || "Failed to update wishlist. Please log in.");
                    }
                  }}
                >
                  <span className="text-lg">♡</span>
                </button>
              </div>

              {/* Accordion Details & Reviews */}
              <div className="space-y-4">
                <div className="border-t border-black/10 pt-4 cursor-pointer group">
                  <h4 className="text-xs uppercase tracking-widest text-black/70 group-hover:text-black transition-colors flex justify-between font-bold">
                    Product Details
                    <Plus className="w-4 h-4" />
                  </h4>
                </div>
                <div className="border-t border-black/10 pt-4 cursor-pointer group">
                  <h4 className="text-xs uppercase tracking-widest text-black/70 group-hover:text-black transition-colors flex justify-between font-bold">
                    Shipping & Returns
                    <Plus className="w-4 h-4" />
                  </h4>
                </div>
                
                {/* Reviews Section */}
                <div className="border-t border-black/10 pt-8 mt-8">
                  <h3 className="text-sm uppercase tracking-widest text-black font-bold mb-6">Customer Reviews</h3>
                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review: any) => (
                        <div key={review.id} className="bg-white/50 p-4 border border-black/10 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-500 text-xs">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                            <span className="text-[10px] font-bold text-black uppercase">{review.user?.username || 'Verified Buyer'}</span>
                          </div>
                          <p className="text-xs text-black/70 font-medium">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-black/50 uppercase tracking-widest">No reviews yet.</p>
                    )}
                  </div>
                  
                  {/* Write a Review */}
                  <div className="mt-8 pt-8 border-t border-black/10">
                    <h4 className="text-xs uppercase tracking-widest text-black font-bold mb-4">Write a Review</h4>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-black/50 block mb-2">Rating</label>
                        <select 
                          value={reviewForm.rating}
                          onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                          className="w-full border border-black/10 p-2 text-sm bg-white"
                        >
                          <option value={5}>5 Stars - Excellent</option>
                          <option value={4}>4 Stars - Good</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Poor</option>
                          <option value={1}>1 Star - Terrible</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-black/50 block mb-2">Comment</label>
                        <textarea 
                          required
                          rows={3}
                          value={reviewForm.comment}
                          onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                          className="w-full border border-black/10 p-2 text-sm resize-none bg-white"
                          placeholder="What did you think about this product?"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-black text-white px-6 py-2 text-xs uppercase font-bold tracking-widest hover:bg-black/80 transition-colors disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      
      <LuxuryFooter />
    </>
  )
}
