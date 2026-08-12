"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/products/admin-categories/')
      .then(data => setCategories(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Categories</h1>
        <Link 
          href="/admin/categories/new"
          className="bg-[#008060] hover:bg-[#006e52] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add category
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-[#F9FAFB]">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter categories" 
              className="w-full border border-gray-300 rounded pl-9 pr-4 py-1.5 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3">Category Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Products</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500">No categories found.</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
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
