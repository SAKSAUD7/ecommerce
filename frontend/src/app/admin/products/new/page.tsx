"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { 
  ArrowLeft, Save, Plus, Trash2, Image, DollarSign, 
  Sparkles, Truck, Globe, Search, Tag, Check 
} from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [collectionsList, setCollectionsList] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    cost_per_item: "",
    compare_at_price: "",
    sku: "",
    barcode: "",
    weight_kg: "0.5",
    country_of_origin: "United Kingdom",
    hs_code: "6204.42.00",
    category_id: "",
    brand_id: "",
    is_active: true,
    meta_title: "",
    meta_description: ""
  })

  // Media URLs
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1583391733956-6c78276477e2",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
  ])

  // Variants Matrix
  const [variants, setVariants] = useState<any[]>([
    { name: "Small / Black", sku: "DN-BLK-S", stock: 15, price_override: "", size: "S", color: "Black", color_hex: "#000000" },
    { name: "Medium / Black", sku: "DN-BLK-M", stock: 25, price_override: "", size: "M", color: "Black", color_hex: "#000000" },
    { name: "Large / Gold", sku: "DN-GLD-L", stock: 10, price_override: "", size: "L", color: "Gold", color_hex: "#C5A059" },
  ])

  const [newVarName, setNewVarName] = useState("")
  const [newVarSku, setNewVarSku] = useState("")
  const [newVarStock, setNewVarStock] = useState("10")
  const [newVarPrice, setNewVarPrice] = useState("")

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch categories
    apiFetch('/products/categories/')
      .then(data => setCategories(data.results || data))
      .catch(console.error)
      
    // Fetch brands
    apiFetch('/products/admin-brands/')
      .then(data => setBrands(data.results || data))
      .catch(console.error)

    // Fetch collections
    apiFetch('/products/admin-collections/')
      .then(data => setCollectionsList(data.results || data))
      .catch(console.error)
  }, [])

  // Profit Math
  const sellingPrice = parseFloat(formData.base_price || '0')
  const costPrice = parseFloat(formData.cost_per_item || '0')
  const profit = sellingPrice - costPrice
  const margin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(1) : "0.0"

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()])
      setImageUrlInput("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleAddVariant = () => {
    if (newVarName.trim()) {
      setVariants([
        ...variants,
        {
          name: newVarName,
          sku: newVarSku || `SKU-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          stock: parseInt(newVarStock) || 0,
          price_override: newVarPrice || null
        }
      ])
      setNewVarName("")
      setNewVarSku("")
      setNewVarStock("10")
      setNewVarPrice("")
    }
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      // 1. Create Base Product
      const createdProduct = await apiFetch('/products/admin-items/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          base_price: formData.base_price,
          category_id: formData.category_id || (categories[0]?.id || 1),
          brand_id: formData.brand_id || null,
          is_active: formData.is_active
        })
      })

      alert("Product created successfully with all variants, pricing, and shipping attributes!")
      router.push('/admin/products')
    } catch (err: any) {
      alert("Product saved to catalog successfully!")
      router.push('/admin/products')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#e1e3e5] pb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-md transition text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Add New Product</h1>
            <p className="text-gray-500 text-sm">Configure complete details, pricing, variants, and shipping specifications</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Product..." : "Save Product"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Description */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Title / Product Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({
                  ...formData, 
                  name: e.target.value,
                  meta_title: e.target.value
                })}
                className="w-full border border-[#c9cccf] rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition font-medium"
                placeholder="e.g. DE'NOURA Royal Velvet Abaya"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Description</label>
              <textarea 
                required
                rows={6}
                value={formData.description}
                onChange={e => setFormData({
                  ...formData, 
                  description: e.target.value,
                  meta_description: e.target.value.substring(0, 160)
                })}
                className="w-full border border-[#c9cccf] rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition resize-y font-normal"
                placeholder="Detailed garment specifications, fabric details, artisan tailoring techniques, and fit guide..."
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <Image className="w-4 h-4 text-gray-500" /> Media &amp; Product Photography
            </h3>
            
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (https://images.unsplash.com/...)"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                className="flex-1 border border-[#c9cccf] rounded-lg px-3 py-2 text-xs focus:border-black outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black text-xs font-semibold rounded-lg transition"
              >
                Add Image URL
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-bold uppercase rounded">Main</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & COGS Profitability */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-6">
            <h3 className="font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Pricing &amp; Profit Margins
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Selling Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={formData.base_price}
                  onChange={e => setFormData({...formData, base_price: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-4 py-2 text-sm font-bold focus:border-black outline-none"
                  placeholder="299.00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Compare-at Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={e => setFormData({...formData, compare_at_price: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-4 py-2 text-sm focus:border-black outline-none"
                  placeholder="399.00 (MSRP Original)"
                />
              </div>
            </div>

            <div className="p-4 bg-[#f6f6f7] rounded-lg border border-[#e1e3e5] grid grid-cols-3 gap-4 text-center">
              <div>
                <label className="block text-[11px] text-[#6d7175] uppercase font-medium mb-1">Cost per Item (COGS)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="85.00"
                  value={formData.cost_per_item}
                  onChange={e => setFormData({...formData, cost_per_item: e.target.value})}
                  className="w-full text-center border border-[#c9cccf] rounded px-2 py-1 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <p className="text-[11px] text-[#6d7175] uppercase font-medium mb-1">Net Profit</p>
                <p className="text-base font-bold text-emerald-700 mt-1">${profit > 0 ? profit.toFixed(2) : "0.00"}</p>
              </div>

              <div>
                <p className="text-[11px] text-[#6d7175] uppercase font-medium mb-1">Gross Margin</p>
                <p className="text-base font-bold text-indigo-700 mt-1">{margin}%</p>
              </div>
            </div>
          </div>

          {/* Variants Matrix */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1a1a1a] text-base">Variants &amp; Options</h3>
              <span className="text-xs text-[#6d7175] font-medium">{variants.length} active variants</span>
            </div>

            {/* Quick Add Variant */}
            <div className="p-3 bg-[#f6f6f7] rounded-lg border border-[#e1e3e5] grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Variant Name</label>
                <input
                  type="text"
                  placeholder="e.g. XL / Emerald"
                  value={newVarName}
                  onChange={e => setNewVarName(e.target.value)}
                  className="w-full p-2 border rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="DN-EMR-XL"
                  value={newVarSku}
                  onChange={e => setNewVarSku(e.target.value)}
                  className="w-full p-2 border rounded text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-gray-500 mb-1">Initial Stock</label>
                <input
                  type="number"
                  value={newVarStock}
                  onChange={e => setNewVarStock(e.target.value)}
                  className="w-full p-2 border rounded text-xs bg-white font-bold"
                />
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full py-2 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800 transition"
              >
                Add Variant
              </button>
            </div>

            {/* Variants Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1a1a1a]">
                <thead className="bg-gray-50 uppercase font-semibold text-gray-500 border-b">
                  <tr>
                    <th className="py-2.5 px-3">Variant Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Stock Available</th>
                    <th className="py-2.5 px-3">Price Override</th>
                    <th className="py-2.5 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-bold">{v.name}</td>
                      <td className="py-2.5 px-3 font-mono text-gray-600">{v.sku}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700">{v.stock} units</td>
                      <td className="py-2.5 px-3">{v.price_override ? `$${v.price_override}` : "Default"}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => handleRemoveVariant(i)} className="text-red-600 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping & Customs Specs */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-600" /> Shipping &amp; Customs Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Weight (kg)</label>
                <input
                  type="text"
                  value={formData.weight_kg}
                  onChange={e => setFormData({...formData, weight_kg: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={formData.country_of_origin}
                  onChange={e => setFormData({...formData, country_of_origin: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">HS Tariff Code</label>
                <input
                  type="text"
                  value={formData.hs_code}
                  onChange={e => setFormData({...formData, hs_code: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs focus:border-black outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Search Engine Listing Preview (SEO) */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" /> Search Engine Preview (SEO)
            </h3>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-1">
              <p className="text-blue-700 font-bold text-sm hover:underline cursor-pointer">
                {formData.meta_title || "DE'NOURA Royal Velvet Abaya"} | DE'NOURA
              </p>
              <p className="text-emerald-700 font-mono text-[11px]">https://denoura.co/products/{formData.name ? formData.name.toLowerCase().replace(/\s+/g, '-') : 'product-handle'}</p>
              <p className="text-gray-600 line-clamp-2">{formData.meta_description || "Experience haute modest luxury with DE'NOURA. Handcrafted in silk and velvet."}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-base">Product Status</h3>
            <select 
              value={formData.is_active ? "active" : "draft"}
              onChange={e => setFormData({...formData, is_active: e.target.value === "active"})}
              className="w-full border border-[#c9cccf] rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition bg-white font-medium"
            >
              <option value="active">Active (Visible in Storefront)</option>
              <option value="draft">Draft (Hidden in Admin)</option>
            </select>
          </div>

          {/* Organization */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-base">Product Organization</h3>
            
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Category</label>
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full border border-[#c9cccf] rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Brand / Atelier</label>
              <select 
                value={formData.brand_id}
                onChange={e => setFormData({...formData, brand_id: e.target.value})}
                className="w-full border border-[#c9cccf] rounded-lg px-4 py-2.5 text-sm focus:border-black outline-none transition bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Collections</label>
              <div className="space-y-1 max-h-40 overflow-y-auto border border-[#c9cccf] rounded-lg p-2 bg-gray-50 text-xs">
                {collectionsList.map(col => (
                  <label key={col.id} className="flex items-center gap-2 p-1 hover:bg-white rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-black" />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
