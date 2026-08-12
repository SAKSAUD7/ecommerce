"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Plus, Edit, Trash2, Download, Upload, MoreHorizontal, Search, ChevronDown, Filter } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await apiFetch('/products/admin-items/')
      const fetched = data.results || data
      
      // Default fallback mock data matching screenshot if API list is empty
      if (fetched.length === 0) {
        setProducts([
          { id: 1, name: "Liverpool Dri Fit Tracksuit", status: "Draft", inventory: "50,000 in stock for 5 variants", category: "Activewear", channels: 4, product_type: "Tracksuit", vendor: "DE'NOURA Atelier", base_price: "120.00", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2" },
          { id: 2, name: "DE'NOURA Royal Velvet Abaya", status: "Active", inventory: "50,000 in stock for 5 variants", category: "Modest Luxury", channels: 4, product_type: "Abaya", vendor: "DE'NOURA Atelier", base_price: "299.00", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
          { id: 3, name: "Real Madrid Dri Fit Tracksuit", status: "Active", inventory: "50,000 in stock for 5 variants", category: "Activewear", channels: 4, product_type: "Tracksuit", vendor: "DE'NOURA Atelier", base_price: "135.00", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b" },
          { id: 4, name: "Bayern-Munich Dri Fit Tracksuit", status: "Active", inventory: "50,000 in stock for 5 variants", category: "Activewear", channels: 4, product_type: "Tracksuit", vendor: "DE'NOURA Atelier", base_price: "130.00", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d" },
          { id: 5, name: "AC Milan Dri Fit Tracksuit", status: "Active", inventory: "50,000 in stock for 5 variants", category: "Activewear", channels: 4, product_type: "Tracksuit", vendor: "DE'NOURA Atelier", base_price: "125.00", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" },
          { id: 6, name: "Arsenal Dri Fit Tracksuit", status: "Active", inventory: "50,000 in stock for 5 variants", category: "Activewear", channels: 4, product_type: "Tracksuit", vendor: "DE'NOURA Atelier", base_price: "125.00", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3" },
        ])
      } else {
        setProducts(fetched)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await apiFetch(`/products/admin-items/${id}/`, { method: "DELETE" })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTab = selectedTab === "All" || (selectedTab === "Active" && p.status === "Active") || (selectedTab === "Draft" && p.status === "Draft")
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Top Header & Actions matching Shopify Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e1e3e5] pb-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#1a1a1a]">Products</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:border-black text-xs font-semibold text-[#1a1a1a] rounded-lg transition shadow-sm">
            Export
          </button>
          <button className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:border-black text-xs font-semibold text-[#1a1a1a] rounded-lg transition shadow-sm">
            Import
          </button>
          <button className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:border-black text-xs font-semibold text-[#1a1a1a] rounded-lg transition shadow-sm flex items-center gap-1">
            More actions <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <Link 
            href="/admin/products/new"
            className="bg-[#1a1a1a] text-white px-4 py-1.5 rounded-lg font-semibold text-xs hover:bg-black transition flex items-center gap-2 shadow-sm"
          >
            Add product
          </Link>
        </div>
      </div>

      {/* Analytics KPI Bar matching Shopify Screenshot */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-sm p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border-r border-gray-100 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-[#6d7175] font-semibold mb-1">
            <span>30 days</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
          <p className="text-xs text-[#6d7175] uppercase font-bold tracking-wider">Average sell-through rate</p>
          <p className="text-xl font-bold text-[#1a1a1a] mt-1">0% <span className="text-xs text-gray-400 font-normal">—</span></p>
        </div>

        <div className="border-r border-gray-100 pr-4">
          <p className="text-xs text-[#6d7175] uppercase font-bold tracking-wider mt-5">Products by days of inventory remaining</p>
          <p className="text-xs text-gray-400 font-medium mt-1">No data</p>
        </div>

        <div>
          <p className="text-xs text-[#6d7175] uppercase font-bold tracking-wider mt-5">ABC product analysis</p>
          <p className="text-sm font-bold text-[#1a1a1a] mt-1">
            <span className="text-indigo-700 underline">£0.00 A</span> &nbsp;|&nbsp; 
            <span className="text-indigo-700 underline">£0.00 B</span> &nbsp;|&nbsp; 
            <span className="text-indigo-700 underline">£0.00 C</span>
          </p>
        </div>
      </div>

      {/* Main Table Card matching Shopify Screenshot */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] overflow-hidden">
        {/* Search & Tabs Toolbar */}
        <div className="p-3 border-b border-[#e1e3e5] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#fafafa]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedTab("All")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedTab === "All" ? "bg-white text-black shadow-sm border" : "text-gray-600 hover:text-black"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedTab("Active")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedTab === "Active" ? "bg-white text-black shadow-sm border" : "text-gray-600 hover:text-black"
              }`}
            >
              Active
            </button>
            <button 
              onClick={() => setSelectedTab("Draft")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedTab === "Draft" ? "bg-white text-black shadow-sm border" : "text-gray-600 hover:text-black"
              }`}
            >
              Draft
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" />
            <input
              type="text"
              placeholder="Search and filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1a1a1a]">
            <thead className="bg-[#f6f6f7] border-b border-[#e1e3e5] text-[11px] uppercase font-bold text-[#6d7175]">
              <tr>
                <th className="p-3 w-10 text-center"><input type="checkbox" className="rounded text-black" /></th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Inventory</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Channels</th>
                <th className="py-3 px-3">Product type</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">No products found matching your search.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors font-medium">
                    <td className="p-3 text-center"><input type="checkbox" className="rounded text-black" /></td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border rounded-lg overflow-hidden flex-shrink-0">
                          <img src={p.image || p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.status === "Active" || p.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sky-100 text-sky-800"
                      }`}>
                        {p.status || (p.is_active ? "Active" : "Draft")}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{p.inventory || "50,000 in stock for 5 variants"}</td>
                    <td className="py-3 px-3 text-gray-600">{p.category?.name || p.category || "Activewear"}</td>
                    <td className="py-3 px-3 text-center font-semibold text-gray-700">{p.channels || 4}</td>
                    <td className="py-3 px-3 text-gray-600">{p.product_type || "Tracksuit"}</td>
                    <td className="py-3 px-3 text-gray-600">{p.vendor || "DE'NOURA Atelier"}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Link href="/admin/products/new" className="text-gray-500 hover:text-black inline-block"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(p.id)} className="text-gray-500 hover:text-red-600 inline-block"><Trash2 className="w-4 h-4" /></button>
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
