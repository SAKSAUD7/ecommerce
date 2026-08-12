"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { ChevronLeft, Package, Truck, User, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Fulfillment state
  const [status, setStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shippingProvider, setShippingProvider] = useState("")
  
  const router = useRouter()

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder = async () => {
    try {
      const data = await apiFetch(`/orders/admin-orders/${params.id}/`)
      setOrder(data)
      setStatus(data.status)
      setTrackingNumber(data.tracking_number || "")
      setShippingProvider(data.shipping_provider || "")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateFulfillment = async () => {
    setSaving(true)
    try {
      await apiFetch(`/orders/admin-orders/${params.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          tracking_number: trackingNumber,
          shipping_provider: shippingProvider
        })
      })
      alert("Order updated successfully!")
      fetchOrder()
    } catch (err: any) {
      alert(err.message || "Failed to update order.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading order details...</div>
  if (!order) return <div className="p-12 text-center text-red-500">Order not found.</div>

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
              #ORD-{order.id}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment_status || 'Paid'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                order.status === 'shipped' || order.status === 'delivered' ? 'bg-gray-200 text-gray-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4" /> Unfulfilled ({order.items?.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100 p-6">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Img</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">{item.product_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.variant_details?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.variant_details?.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <button 
                onClick={handleUpdateFulfillment}
                disabled={saving}
                className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Fulfill items"}
              </button>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Status
            </h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>-${parseFloat(order.discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-4 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Fulfillment Status Update */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Fulfillment
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number</label>
                <input 
                  type="text" 
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z999999999"
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shipping Provider</label>
                <input 
                  type="text" 
                  value={shippingProvider}
                  onChange={e => setShippingProvider(e.target.value)}
                  placeholder="e.g. UPS, FedEx, DHL"
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer
            </h2>
            <Link href={`/admin/customers/${order.user}`} className="text-sm text-blue-600 hover:underline font-medium block mb-1">
              {order.full_name}
            </Link>
            <a href={`mailto:${order.email}`} className="text-sm text-gray-600 block hover:underline">
              {order.email}
            </a>
            <p className="text-sm text-gray-600 mt-1">{order.phone}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p>{order.full_name}</p>
                <p>{order.shipping_address_line}</p>
                <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
