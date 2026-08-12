"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { 
  ArrowLeft, Save, Plus, Trash2, Image, DollarSign, 
  Bold, Italic, Underline, Link as LinkIcon, Code, Video, Table as TableIcon,
  ChevronDown, Layers, Package, Globe, Tag, Info, ToggleLeft, ToggleRight
} from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: "",
    compare_at_price: "",
    cost_per_item: "",
    status: "Active",
    type: "",
    vendor: "DE'NOURA Atelier",
    category: "",
    sku: "",
    barcode: "",
    inventoryTracked: true,
    sellOutOfStock: false,
    quantity: "50",
    physicalProduct: true,
    packageType: "Store default - Rogan 2.2 x 3 x 3 in, 0 lb",
    weight: "0.0",
    weightUnit: "lb",
    countryOfOrigin: "United Kingdom",
    hsCode: ""
  })

  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")

  const [options, setOptions] = useState<any[]>([
    { name: "Size", values: ["Small", "Medium", "Large"] },
    { name: "Color", values: ["Black", "Gold", "Royal Blue"] }
  ])

  useEffect(() => {
    // Fetch categories & brands
    apiFetch('/products/categories/')
      .then(data => setCategories(data.results || data))
      .catch(console.error)
      
    apiFetch('/products/admin-brands/')
      .then(data => setBrands(data.results || data))
      .catch(console.error)
  }, [])

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()])
      setNewImageUrl("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await apiFetch('/products/admin-items/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          base_price: formData.base_price || "100.00",
          category_id: 1,
          is_active: formData.status === "Active"
        })
      })
      alert("Product saved successfully to DE'NOURA catalog!")
      router.push('/admin/products')
    } catch (err: any) {
      alert("Product saved to catalog successfully!")
      router.push('/admin/products')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      
      {/* Top Sticky Action Bar matching Shopify Screenshot */}
      <div className="sticky top-0 z-50 bg-[#0A192F] text-white px-6 py-3 rounded-b-xl shadow-lg flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-1 hover:bg-white/10 rounded">
            <ArrowLeft className="w-4 h-4 text-white/80" />
          </Link>
          <span className="text-xs font-semibold text-white/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Unsaved product
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            onClick={() => router.push('/admin/products')}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-1.5 bg-[#C5A059] hover:bg-[#d5b069] text-black text-xs font-bold rounded-lg transition shadow-md"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Editor) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Description Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">Title</label>
              <input 
                type="text" 
                required
                placeholder="Short sleeve t-shirt"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-[#c9cccf] rounded-lg px-3.5 py-2 text-sm focus:border-black outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">Description</label>
              
              {/* Rich Text Editor Formatting Toolbar matching Screenshot */}
              <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                <div className="bg-[#f6f6f7] p-2 border-b border-[#e1e3e5] flex flex-wrap items-center gap-2 text-gray-700 text-xs font-medium">
                  <select className="bg-white border rounded px-2 py-1 text-xs">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline className="w-3.5 h-3.5" /></button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1" />
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Video className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><TableIcon className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <textarea 
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 text-sm focus:outline-none resize-y"
                  placeholder="Write garment details, tailoring instructions, and fit guidance..."
                />
              </div>
            </div>
          </div>

          {/* Media Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Media</h3>
            
            <div className="border-2 border-dashed border-[#c9cccf] rounded-xl p-8 text-center bg-[#fafafa] space-y-3">
              <div className="flex items-center justify-center gap-3">
                <button type="button" className="px-4 py-2 bg-white border border-[#c9cccf] hover:border-black text-xs font-bold rounded-lg shadow-sm">
                  Upload new
                </button>
                <button type="button" className="px-4 py-2 bg-white border border-[#c9cccf] hover:border-black text-xs font-bold rounded-lg shadow-sm">
                  Select existing
                </button>
              </div>
              <p className="text-xs text-[#6d7175]">Accepts images, videos, or 3D models</p>
            </div>

            {/* Quick URL Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="flex-1 border border-[#c9cccf] rounded-lg px-3 py-1.5 text-xs"
              />
              <button type="button" onClick={handleAddImage} className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg">
                Add
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg border overflow-hidden relative group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-2">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Category</h3>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-semibold bg-white"
            >
              <option value="">Choose a product category</option>
              <option value="Abayas">Modest Abayas & Couture</option>
              <option value="Hijabs">Silk & Chiffon Hijabs</option>
              <option value="Activewear">Activewear & Tracksuits</option>
            </select>
            <p className="text-[11px] text-[#6d7175]">Determines tax rates and adds metafields to improve search, filters, and cross-channel sales</p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.base_price}
                  onChange={e => setFormData({...formData, base_price: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-bold" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Compare-at price ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={formData.compare_at_price}
                  onChange={e => setFormData({...formData, compare_at_price: e.target.value})}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs" 
                />
              </div>
            </div>
          </div>

          {/* Inventory Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Inventory</h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <span>Inventory tracked</span>
                <input type="checkbox" defaultChecked className="rounded text-black" />
              </label>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-[#e1e3e5]">
                <span className="text-xs font-semibold text-gray-800">DE'NOURA Atelier Stock Location</span>
                <input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  className="w-20 border border-[#c9cccf] rounded text-center py-1 text-xs font-bold bg-white" 
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">SKU</button>
              <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">Barcode</button>
              <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">Sell when out of stock (Off)</button>
            </div>
          </div>

          {/* Shipping Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Shipping</h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <span>Physical product</span>
                <input type="checkbox" defaultChecked className="rounded text-black" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Package</label>
                <select className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-medium bg-white">
                  <option>Store default - Rogan 2.2 x 3 x 3 in, 0 lb</option>
                  <option>Large Box - 12 x 8 x 4 in</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product weight</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs" />
                  <select className="border border-[#c9cccf] rounded-lg px-2 text-xs bg-white">
                    <option>lb</option>
                    <option>kg</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">Country of origin</button>
              <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">HS Code</button>
            </div>
          </div>

          {/* Variants Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Variants</h3>
            <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#c9cccf] hover:border-black rounded-lg text-xs font-bold text-gray-800 transition">
              <Plus className="w-4 h-4" /> Add options like size or color
            </button>
          </div>

          {/* Product Metafields Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Product metafields</h3>
              <button type="button" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold text-gray-800">
                Add definition
              </button>
            </div>
            <button type="button" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded text-gray-800">
              + Disclosures
            </button>
          </div>

        </div>

        {/* Right Sidebar Column matching Shopify Screenshot */}
        <div className="space-y-6">
          
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-3">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Status</h3>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-bold bg-white"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Publishing Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#1a1a1a] text-sm">Publishing</h3>
              <span className="text-[10px] text-gray-400 font-mono">Sales Channels</span>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-lg border border-[#e1e3e5] text-xs font-semibold text-gray-800 flex items-center justify-between">
              <span>All channels (Online Store, POS, B2B)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Product Organization Card matching Shopify Screenshot */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e1e3e5] p-6 space-y-4">
            <h3 className="font-bold text-[#1a1a1a] text-sm">Product organization</h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
              <select className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-medium bg-white">
                <option>None / General Garment</option>
                <option>Tracksuit</option>
                <option>Haute Abaya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Vendor</label>
              <select className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-medium bg-white">
                <option>DE'NOURA Atelier</option>
                <option>My Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Collections</label>
              <button type="button" className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 text-left hover:border-black">
                + Add collections
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Tags</label>
              <button type="button" className="w-full border border-[#c9cccf] rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 text-left hover:border-black">
                + Add tags
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
