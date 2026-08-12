"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Search, Filter, ArrowUpDown, MoreHorizontal, Download } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("All")
  const tabs = ["All", "Unfulfilled", "Unpaid", "Open", "Closed", "Local Delivery"]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await apiFetch('/orders/admin-orders/')
      setOrders(data.results || data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'bg-gray-200 text-gray-800' // Shopify uses gray for paid
      case 'payment pending': 
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'refunded': return 'bg-gray-200 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFulfillmentStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'fulfilled':
      case 'shipped':
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'unfulfilled':
      case 'pending':
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">Orders</h1>
        <div className="flex items-center gap-3">
          <button className="text-[#6d7175] text-[13px] font-medium hover:text-[#1a1a1a]">Export</button>
          <button className="text-[#6d7175] text-[13px] font-medium flex items-center hover:text-[#1a1a1a]">More actions <span className="text-[10px] ml-1">▼</span></button>
          <button className="bg-[#1a1a1a] hover:bg-[#303030] text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors shadow-sm">
            Create order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e1e3e5] overflow-hidden">
        
        {/* Tabs */}
        <div className="flex px-2 pt-2 border-b border-[#e1e3e5] overflow-x-auto">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#6d7175] hover:text-[#1a1a1a]'}`}
            >
              {tab}
            </button>
          ))}
          <div className="ml-auto px-4 py-2 text-[14px] text-[#6d7175] flex items-center gap-1 cursor-pointer hover:text-[#1a1a1a]">
            <span className="w-4 h-4 bg-[#f1f2f3] rounded-full flex items-center justify-center text-[10px] text-[#1a1a1a]">📍</span>
            All locations <span className="text-[10px] ml-1">▼</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-[#e1e3e5] flex flex-wrap gap-3 items-center justify-between bg-white">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-[18px] h-[18px] text-[#6d7175] absolute left-3 top-2" />
            <input 
              type="text" 
              placeholder="Filter orders" 
              className="w-full border border-[#c9cccf] rounded-md pl-9 pr-4 py-1.5 text-[14px] focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-[#c9cccf] bg-white px-3 py-1.5 rounded-md text-[13px] font-medium text-[#202223] hover:bg-[#f6f6f7] shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 border border-[#c9cccf] bg-white px-3 py-1.5 rounded-md text-[13px] font-medium text-[#202223] hover:bg-[#f6f6f7] shadow-sm">
              <span className="font-mono text-xs">|||</span> Columns
            </button>
            <button className="flex items-center gap-2 border border-[#c9cccf] bg-white px-3 py-1.5 rounded-md text-[13px] font-medium text-[#202223] hover:bg-[#f6f6f7] shadow-sm">
              <ArrowUpDown className="w-4 h-4" /> Sort
            </button>
            <button className="flex items-center justify-center border border-[#c9cccf] bg-white w-8 py-1.5 rounded-md text-[13px] font-medium text-[#202223] hover:bg-[#f6f6f7] shadow-sm">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] whitespace-nowrap">
            <thead className="bg-[#f6f6f7] border-b border-[#e1e3e5] text-[#6d7175] font-medium">
              <tr>
                <th className="px-4 py-2 w-8"><input type="checkbox" className="rounded border-[#c9cccf]" /></th>
                <th className="px-4 py-2 font-semibold">Order</th>
                <th className="px-4 py-2 font-semibold">Date</th>
                <th className="px-4 py-2 font-semibold">Customer</th>
                <th className="px-4 py-2 font-semibold">Channel</th>
                <th className="px-4 py-2 font-semibold text-right">Total</th>
                <th className="px-4 py-2 font-semibold">Payment status</th>
                <th className="px-4 py-2 font-semibold">Fulfillment status</th>
                <th className="px-4 py-2 font-semibold text-right">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5] bg-white">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#6d7175]">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#6d7175]">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#f6f6f7] transition-colors group cursor-pointer">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-[#c9cccf]" /></td>
                    <td className="px-4 py-3 font-semibold text-[#1a1a1a]">
                      #{1000 + order.id}
                    </td>
                    <td className="px-4 py-3 text-[#6d7175]">
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a1a] font-medium">
                      {order.full_name}
                    </td>
                    <td className="px-4 py-3 text-[#6d7175]">
                      Online Store
                    </td>
                    <td className="px-4 py-3 text-[#1a1a1a] font-medium text-right">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status || order.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'paid' ? 'bg-gray-500' : 'bg-yellow-500'}`}></span>
                        {order.status === 'paid' ? 'Paid' : 'Payment pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getFulfillmentStatusColor(order.status)}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'pending' || order.status === 'paid' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        {order.status === 'pending' || order.status === 'paid' ? 'Unfulfilled' : 'Fulfilled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6d7175] text-right">
                      {order.items?.length || 1} items
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
