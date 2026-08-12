"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Package, ChevronRight } from "lucide-react"

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyOrders()
  }, [])

  const fetchMyOrders = async () => {
    try {
      // Assuming GET /orders/ returns the authenticated user's orders
      const data = await apiFetch('/orders/')
      setOrders(data.results || data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-2xl font-bold uppercase tracking-widest mb-8">Order History</h1>

      {loading ? (
        <p className="text-sm tracking-widest text-black/50 uppercase">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-white/50 border border-black/10 rounded-xl">
          <Package className="w-12 h-12 text-black/20 mx-auto mb-4" />
          <p className="text-sm tracking-widest text-black/50 uppercase font-bold">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/80 border border-black/10 p-6 rounded-xl hover:border-black/30 transition-colors group cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black uppercase tracking-widest">Order #{1000 + order.id}</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${
                      order.status === 'paid' ? 'bg-black text-white' : 
                      order.status === 'shipped' ? 'bg-green-500 text-white' : 
                      'bg-black/10 text-black/70'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs tracking-widest text-black/50 font-medium">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs tracking-widest text-black/50 uppercase font-bold mb-1">Total</p>
                    <p className="text-lg font-bold text-black">${parseFloat(order.total).toFixed(2)}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Order Items Preview */}
              <div className="mt-6 pt-6 border-t border-black/10 flex gap-4 overflow-x-auto">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex-shrink-0 w-16 h-20 bg-black/5 rounded flex items-center justify-center border border-black/10 overflow-hidden relative">
                     {item.product_image ? (
                       <img src={item.product_image} alt="product" className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-[10px] text-black/30 font-bold">ITEM</span>
                     )}
                     <span className="absolute top-0 right-0 bg-white/80 backdrop-blur text-[8px] font-bold px-1 m-1 rounded shadow-sm">
                       x{item.quantity}
                     </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
