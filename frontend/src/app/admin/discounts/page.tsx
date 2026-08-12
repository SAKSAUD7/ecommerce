"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Search, Filter, Plus, Tag } from "lucide-react"

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // New Discount State
  const [code, setCode] = useState("")
  const [discountType, setDiscountType] = useState("percentage")
  const [value, setValue] = useState(10)
  const [maxUses, setMaxUses] = useState(100)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const data = await apiFetch('/orders/admin-coupons/')
      setDiscounts(data.results || data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiFetch('/orders/admin-coupons/', {
        method: 'POST',
        body: JSON.stringify({
          code,
          discount_type: discountType,
          value,
          max_uses: maxUses,
          active: true,
          valid_from: new Date().toISOString(),
          // Default to valid for 1 year
          valid_to: new Date(Date.now() + 31536000000).toISOString()
        })
      })
      setShowModal(false)
      fetchDiscounts()
    } catch (err: any) {
      alert(err.message || "Failed to create discount.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Discounts</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#008060] hover:bg-[#006e52] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create discount
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-3 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between bg-[#F9FAFB]">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search discounts" 
              className="w-full border border-gray-300 rounded pl-9 pr-4 py-1.5 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-2 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">Loading discounts...</td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Tag className="w-8 h-8 text-gray-300 mb-2" />
                      <p>No discounts found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-3 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {discount.code}
                    </td>
                    <td className="px-4 py-3">
                      {discount.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {discount.discount_type} ({discount.value}{discount.discount_type === 'percentage' ? '%' : '$'})
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {discount.used_count || 0} / {discount.max_uses} used
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Create discount code</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER2026"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Uses</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={maxUses}
                  onChange={e => setMaxUses(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
