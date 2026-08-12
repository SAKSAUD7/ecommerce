"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Search, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const data = await apiFetch('/auth/admin-users/')
      setCustomers(data.results || data)
    } catch (err) {
      console.error("Failed to fetch customers:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Customers</h1>
        <div className="flex items-center gap-3">
          <button className="text-gray-600 text-sm font-medium hover:text-black">Export</button>
          <button className="bg-[#008060] hover:bg-[#006e52] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
            Add customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-3 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between bg-[#F9FAFB]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search customers" 
              className="w-full border border-gray-300 rounded pl-9 pr-4 py-1.5 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <span className="font-mono text-xs">|||</span> Columns
            </button>
            <button className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
              <ArrowUpDown className="w-4 h-4" /> Sort
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-2 font-medium">Customer name</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Orders</th>
                <th className="px-4 py-2 font-medium">Amount spent</th>
                <th className="px-4 py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {customer.username?.[0].toUpperCase() || customer.email[0].toUpperCase()}
                      </div>
                      {customer.username}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.total_orders || 0} orders
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      ${parseFloat(customer.lifetime_spend || '0').toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(customer.date_joined || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
