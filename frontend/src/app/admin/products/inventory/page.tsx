"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchProducts, updateProductVariant } from "@/lib/api"
import { 
  Package, Search, Filter, AlertTriangle, CheckCircle2, ArrowUpDown, 
  RefreshCw, Plus, Minus, Save 
} from "lucide-react"

export default function AdminInventoryPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [stockEdits, setStockEdits] = useState<Record<number, number>>({})

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products-inventory'],
    queryFn: fetchProducts,
  })

  // Flatten variants across all products
  const variantsList = products.flatMap((product: any) =>
    (product.variants || []).map((v: any) => ({
      ...v,
      productName: product.name,
      productSlug: product.slug,
      categoryName: product.category?.name || "General",
      image: product.images?.[0]?.image_url
    }))
  )

  const filteredVariants = variantsList.filter((v: any) => {
    const matchesSearch = 
      v.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (filterStatus === 'low') matchesStatus = v.stock > 0 && v.stock <= 5
    if (filterStatus === 'out') matchesStatus = v.stock <= 0
    if (filterStatus === 'in') matchesStatus = v.stock > 5

    return matchesSearch && matchesStatus
  })

  const lowStockCount = variantsList.filter((v: any) => v.stock > 0 && v.stock <= 5).length
  const outOfStockCount = variantsList.filter((v: any) => v.stock <= 0).length
  const totalStockCount = variantsList.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)

  const handleStockChange = (variantId: number, currentStock: number, delta: number) => {
    const newVal = Math.max(0, (stockEdits[variantId] ?? currentStock) + delta)
    setStockEdits(prev => ({ ...prev, [variantId]: newVal }))
  }

  const updateMutation = useMutation({
    mutationFn: ({ variantId, newStock }: { variantId: number; newStock: number }) => 
      updateProductVariant(variantId, { stock: newStock }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products-inventory'] })
      setStockEdits(prev => {
        const copy = { ...prev }
        delete copy[variables.variantId]
        return copy
      })
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Inventory Management</h1>
          <p className="text-sm text-[#6d7175]">Monitor stock levels, set thresholds, and record physical inventory counts</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total On-Hand Stock</p>
            <Package className="w-5 h-5 text-[#6d7175]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{totalStockCount.toLocaleString()} units</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Low Stock Warnings</p>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{lowStockCount} SKUs</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Out of Stock</p>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-red-600 mt-2">{outOfStockCount} SKUs</h3>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e1e3e5] shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" />
          <input
            type="text"
            placeholder="Search by SKU, product name, or variant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-[#6d7175]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#c9cccf] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-black bg-white"
          >
            <option value="all">All Inventory Statuses</option>
            <option value="in">In Stock (&gt;5)</option>
            <option value="low">Low Stock (1-5)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[#6d7175] text-sm">Loading inventory items...</div>
        ) : filteredVariants.length === 0 ? (
          <div className="p-12 text-center text-[#6d7175]">
            <Package className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-base text-[#1a1a1a]">No variants match filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1a1a1a]">
              <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
                <tr>
                  <th className="py-3.5 px-4">Item & Variant</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Unit Price</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Quick Adjust</th>
                  <th className="py-3.5 px-4 text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {filteredVariants.map((item: any) => {
                  const currentEdit = stockEdits[item.id] ?? item.stock
                  const isModified = stockEdits[item.id] !== undefined && stockEdits[item.id] !== item.stock

                  return (
                    <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-9 h-9 rounded object-cover border border-gray-200" />
                          ) : (
                            <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#1a1a1a]">{item.productName}</p>
                            <p className="text-xs text-[#6d7175]">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-700">{item.sku || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6d7175]">{item.categoryName}</td>
                      <td className="py-3.5 px-4 font-semibold">${parseFloat(item.price || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.stock <= 0 ? 'bg-red-100 text-red-800' :
                          item.stock <= 5 ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.stock} available
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockChange(item.id, item.stock, -1)}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={currentEdit}
                            onChange={(e) => setStockEdits(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
                            className="w-16 text-center font-bold py-1 border border-[#c9cccf] rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                          />
                          <button
                            onClick={() => handleStockChange(item.id, item.stock, 1)}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isModified && (
                          <button
                            onClick={() => updateMutation.mutate({ variantId: item.id, newStock: currentEdit })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800 transition-colors shadow-sm"
                          >
                            <Save className="w-3 h-3" /> Apply
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
