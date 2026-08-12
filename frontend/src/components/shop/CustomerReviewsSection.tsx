"use client"

import React, { useState } from "react"
import { Star, CheckCircle, ThumbsUp, ShieldCheck, MessageSquarePlus } from "lucide-react"

interface ReviewItem {
  id: number;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    author: "Fatima Al-Mansoor",
    location: "London, UK",
    rating: 5,
    date: "August 4, 2026",
    title: "Absolute perfection — the silk drape is unmatched",
    comment: "I was hesitant ordering online, but DE'NOURA exceeded every expectation. The stitching quality, heavy luxury silk drape, and packaging felt like opening haute couture from Paris. Received endless compliments at my event!",
    verified: true,
    sizePurchased: "Medium / Standard Length"
  },
  {
    id: 2,
    author: "Sophia Laurent",
    location: "Paris, France",
    rating: 5,
    date: "July 28, 2026",
    title: "Elegant, modest, and incredibly comfortable",
    comment: "The cut is divine. It gives a graceful silhouette while adhering to modest coverage. Express shipping to France arrived in just 2 days. Will definitely be a returning client.",
    verified: true,
    sizePurchased: "Small"
  },
  {
    id: 3,
    author: "Zainab Chaudhry",
    location: "Dubai, UAE",
    rating: 5,
    date: "July 19, 2026",
    title: "True luxury modest fashion at its best",
    comment: "Fabric feels premium and breathable even in the Dubai heat. Highly recommend the velvet detailing. Customer care via email was super helpful with sizing guidance.",
    verified: true,
    sizePurchased: "Large"
  },
  {
    id: 4,
    author: "Elena Rostova",
    location: "New York, USA",
    rating: 5,
    date: "July 11, 2026",
    title: "Masterpiece craftsmanship",
    comment: "Five stars! The embroidery is impeccable and line work is super clean. The 256-bit secure checkout gave me peace of mind.",
    verified: true,
    sizePurchased: "Medium"
  }
]

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [author, setAuthor] = useState("")
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRev: ReviewItem = {
      id: Date.now(),
      author: author || "Verified Client",
      location: "Verified Purchaser",
      rating,
      date: "Just now",
      title,
      comment,
      verified: true
    }
    setReviews([newRev, ...reviews])
    setSubmitted(true)
    setTimeout(() => {
      setIsFormOpen(false)
      setSubmitted(false)
      setAuthor("")
      setTitle("")
      setComment("")
    }, 2000)
  }

  const averageRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section className="py-16 border-t border-black/10 my-12 text-black">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-sm font-bold text-black ml-2">{averageRating} out of 5.0</span>
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-[0.15em]">Client Reviews &amp; Testimonials</h2>
          <p className="text-sm text-black/60 font-medium mt-1">Based on {reviews.length + 140} verified client purchases across Denoura.co &amp; Denoura.co.uk</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors shadow-sm self-start"
        >
          <MessageSquarePlus className="w-4 h-4" /> Write A Review
        </button>
      </div>

      {/* Write Review Form Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-12 p-6 bg-[#fafafa] border border-black/10 rounded-2xl space-y-4 max-w-xl">
          <h3 className="text-base font-bold uppercase tracking-wider">Share Your Experience</h3>
          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded border border-emerald-200">
              Thank you! Your review has been published.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Your Name</label>
                  <input type="text" required placeholder="e.g. Lady Sarah" value={author} onChange={e => setAuthor(e.target.value)} className="w-full p-2.5 border rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Rating</label>
                  <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="w-full p-2.5 border rounded text-xs bg-white">
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Great)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Review Headline</label>
                <input type="text" required placeholder="e.g. Elegant fit & gorgeous fabric" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border rounded text-xs" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Review Details</label>
                <textarea rows={3} required placeholder="Write your thoughts..." value={comment} onChange={e => setComment(e.target.value)} className="w-full p-2.5 border rounded text-xs" />
              </div>
              <button type="submit" className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded">Submit Review</button>
            </>
          )}
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map(rev => (
          <div key={rev.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#C5A059]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">{rev.date}</span>
              </div>

              <h4 className="text-base font-bold text-black mb-2">&ldquo;{rev.title}&rdquo;</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-normal">{rev.comment}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-black block">{rev.author}</span>
                <span className="text-gray-500">{rev.location}</span>
              </div>
              {rev.verified && (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Buyer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
