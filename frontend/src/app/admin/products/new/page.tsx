"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { ArrowLeft, Save } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    category_id: "",
    brand_id: "",
    is_active: true
  })
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch categories for the dropdown
    apiFetch('/products/categories/')
      .then(data => setCategories(data.results || data))
      .catch(console.error)
      
    // Fetch brands
    apiFetch('/products/admin-brands/')
      .then(data => setBrands(data.results || data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await apiFetch('/products/admin-items/', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      alert("Product created successfully!")
      router.push('/admin/products')
    } catch (err: any) {
      alert("Failed to create product: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-md transition text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Product</h1>
          <p className="text-gray-500 text-sm">Create a new item in your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition"
              placeholder="e.g. Silk Chiffon Hijab"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition resize-none"
              placeholder="Detailed product description..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="font-bold text-gray-900">Pricing</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.base_price}
                    onChange={e => setFormData({...formData, base_price: e.target.value})}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-2 focus:border-black outline-none transition"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="font-bold text-gray-900">Media</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 transition cursor-pointer">
                <p className="text-sm text-gray-500 font-medium">Add files or drop files to upload</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="font-bold text-gray-900">Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU (Stock Keeping Unit)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barcode (ISBN, UPC, GTIN)</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="track" className="w-4 h-4 accent-black" defaultChecked />
                <label htmlFor="track" className="text-sm font-medium text-gray-700">Track quantity</label>
              </div>
            </div>
          </div>

          {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="font-bold text-gray-900">Status</h3>
            <select 
              value={formData.is_active ? "active" : "draft"}
              onChange={e => setFormData({...formData, is_active: e.target.value === "active"})}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition bg-white"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="font-bold text-gray-900">Organization</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                required
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition bg-white"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select 
                value={formData.brand_id}
                onChange={e => setFormData({...formData, brand_id: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-black outline-none transition bg-white"
              >
                <option value="" disabled>Select a brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
        <button 
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition mr-4"
        >
          Discard
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50 shadow-md shadow-black/10"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
      </form>
    </div>
  )
}
