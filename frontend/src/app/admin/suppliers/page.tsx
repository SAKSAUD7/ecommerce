"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Factory, ShieldAlert, Star, Search, Plus } from "lucide-react"

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const data = await apiFetch('/suppliers/admin-suppliers/')
      setSuppliers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading suppliers...</div>

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Factory className="w-6 h-6 text-gray-400" />
            Supplier Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage dropshipping suppliers, performance scores, and SLAs.</p>
        </div>
        <button className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add supplier
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Total Suppliers</h3>
          <p className="text-3xl font-bold text-gray-900">{suppliers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Avg SLA</h3>
          <p className="text-3xl font-bold text-gray-900">48 hrs</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">SLA Breaches</h3>
            <p className="text-xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Score</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((supplier: any) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/suppliers/${supplier.id}`} className="block">
                      <p className="text-sm font-bold text-blue-600 hover:underline">{supplier.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{supplier.email || 'No email provided'}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{supplier.country || 'Global'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                      <Star className="w-3 h-3 fill-current" /> {supplier.score}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-medium text-gray-900">{supplier.products_count}</p>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    No suppliers found. Start adding your dropshipping network.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
