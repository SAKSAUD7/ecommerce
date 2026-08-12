"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Search, Plus, Store } from "lucide-react"
import Link from "next/link"

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/products/admin-brands/')
      .then(data => setBrands(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Brands</h1>
        <Link 
          href="/admin/brands/new"
          className="bg-[#008060] hover:bg-[#006e52] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add brand
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-[#F9FAFB]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter brands" 
              className="w-full border border-gray-300 rounded pl-9 pr-4 py-1.5 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3">Brand Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No brands found.</td></tr>
            ) : (
              brands.map(brand => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/brands/${brand.id}`} className="hover:underline">
                      {brand.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{brand.country || '-'}</td>
                  <td className="px-4 py-3">
                    {brand.is_featured ? (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">Featured</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">-</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
