"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { ArrowLeft, Edit, Star, Package, MapPin, Clock, Phone, Mail, ExternalLink } from "lucide-react"

export default function AdminSupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [supplier, setSupplier] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupplier()
  }, [params.id])

  const fetchSupplier = async () => {
    try {
      const data = await apiFetch(`/suppliers/admin-suppliers/${params.id}/`)
      setSupplier(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading supplier details...</div>
  if (!supplier) return <div className="p-12 text-center text-red-500">Supplier not found.</div>

  return (
    <div className="max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{supplier.name}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {supplier.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <button className="text-gray-600 hover:text-black flex items-center gap-2 text-sm font-medium">
          <Edit className="w-4 h-4" /> Edit Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Performance */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Performance Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider mb-4">Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Quality Score</span>
                <span className="font-bold text-gray-900">{supplier.score} / 100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Fulfillment SLA</span>
                <span className="font-bold text-gray-900">{supplier.fulfillment_sla_hours} hrs</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider mb-4">Contact Info</h2>
            <div className="space-y-3">
              {supplier.company_name && (
                <div className="text-sm text-gray-900 font-medium">{supplier.company_name}</div>
              )}
              {supplier.contact_name && (
                <div className="text-sm text-gray-600">Attn: {supplier.contact_name}</div>
              )}
              {supplier.email && (
                <a href={`mailto:${supplier.email}`} className="text-sm text-blue-600 flex items-center gap-2 hover:underline">
                  <Mail className="w-4 h-4" /> {supplier.email}
                </a>
              )}
              {supplier.phone && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {supplier.phone}
                </div>
              )}
              {supplier.country && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {supplier.country}
                </div>
              )}
              {supplier.website && (
                <a href={supplier.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 flex items-center gap-2 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Products & Routing */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4" />
                Sourced Products
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Add Product Map</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Product / Variant</th>
                    <th className="px-5 py-3">Supplier SKU</th>
                    <th className="px-5 py-3 text-right">Cost</th>
                    <th className="px-5 py-3 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supplier.products?.map((sp: any) => (
                    <tr key={sp.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded object-cover overflow-hidden">
                            {sp.variant_details?.images?.[0] ? (
                              <img src={sp.variant_details.images[0].image_url} alt="" className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{sp.variant_details?.product_name || 'Unknown Product'}</p>
                            <p className="text-xs text-gray-500">{sp.variant_details?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 font-mono">
                        {sp.supplier_sku || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">
                        ${sp.cost_price}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${sp.stock_available > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {sp.stock_available}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!supplier.products || supplier.products.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-500">
                        No products mapped to this supplier.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
