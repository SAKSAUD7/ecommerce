"use client"

import React, { useState } from "react"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { HelpCircle, ChevronDown, Mail, Phone, MessageSquare } from "lucide-react"

const FAQ_ITEMS = [
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "What are your shipping destinations & delivery times?",
        a: "DE'NOURA ships worldwide via DHL Express and FedEx. Standard delivery takes 2-4 business days for Europe and North America, and 3-5 business days for Middle East and Asia Pacific."
      },
      {
        q: "How can I track my shipment?",
        a: "Once your order is dispatched from our atelier, you will receive an email notification containing your DHL/FedEx tracking ID. You can also track your shipment live on our /track page."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer complimentary express worldwide shipping on all orders over $150 USD."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Items must be unworn, unused, and in their original packaging with all security tags intact."
      },
      {
        q: "How do I request a return or size exchange?",
        a: "You can initiate a return by visiting our Client Care center or emailing Denoura.co@gmail.com with your order number."
      }
    ]
  },
  {
    category: "Craftsmanship & Materials",
    questions: [
      {
        q: "Where are DE'NOURA handbags handcrafted?",
        a: "All DE'NOURA leather goods are hand-stitched in Florence, Italy using 100% full-grain Italian calfskin and 24k gold-plated solid metal hardware."
      },
      {
        q: "How should I care for my leather handbag?",
        a: "Store your bag in the provided microfibre dust bag when not in use. Avoid direct exposure to prolonged sunlight and water. Clean gently with a soft dry cloth."
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string>("0-0")

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? "" : id)
  }

  return (
    <div className="bg-[#FAF8F5] text-black min-h-screen flex flex-col justify-between font-sans">
      <SpatialNav />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 w-full flex-1">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C5A059]">Client Assistance</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#0A192F] font-serif">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mx-auto">Everything you need to know about DE'NOURA ordering, shipping, leather craftsmanship, and returns.</p>
        </div>

        <div className="space-y-10">
          {FAQ_ITEMS.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059] border-b border-[#C5A059]/30 pb-2">
                {cat.category}
              </h2>

              <div className="space-y-3">
                {cat.questions.map((item, qIdx) => {
                  const itemId = `${catIdx}-${qIdx}`
                  const isOpen = openIndex === itemId
                  return (
                    <div key={qIdx} className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden transition-all">
                      <button
                        onClick={() => toggleAccordion(itemId)}
                        className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-bold text-gray-900 font-serif">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180 text-black" : ""}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support Banner */}
        <div className="mt-16 bg-[#0A192F] text-white p-8 rounded-3xl border border-[#C5A059]/30 text-center space-y-4 shadow-xl">
          <h3 className="text-xl font-bold uppercase tracking-wider text-[#C5A059] font-serif">Still Need Assistance?</h3>
          <p className="text-xs text-white/80 max-w-md mx-auto">Our Client Concierge team is available 24/7 to assist with bespoke orders, styling guidance, and shipment inquiries.</p>
          <a href="mailto:Denoura.co@gmail.com" className="inline-block px-8 py-3.5 bg-[#C5A059] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#d5b069]">
            Email Client Concierge: Denoura.co@gmail.com
          </a>
        </div>
      </main>

      <LuxuryFooter />
    </div>
  )
}
