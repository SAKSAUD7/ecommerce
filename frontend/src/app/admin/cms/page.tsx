"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { 
  Plus, LayoutTemplate, Eye, ChevronRight, Check, Image as ImageIcon, 
  Sparkles, Save, Layers, Sliders, Box, ShieldCheck, Tag, Lock, ArrowUpRight
} from "lucide-react"

interface SectionItem {
  id: string
  name: string
  key: string
  isActive: boolean
  countText?: string
}

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<"sections" | "hero" | "product">("sections")
  const [sections, setSections] = useState<SectionItem[]>([
    { id: "1", name: "Hero Section", key: "hero", isActive: true, countText: "Active 1" },
    { id: "2", name: "Category Section", key: "category", isActive: true, countText: "Active 5" },
    { id: "3", name: "Collection Slider", key: "collection_slider", isActive: true, countText: "Active 4" },
    { id: "4", name: "Banner Section", key: "banner", isActive: true, countText: "Active 2" },
    { id: "5", name: "Feature Section", key: "feature", isActive: true, countText: "Active 4" },
    { id: "6", name: "Best Sellers", key: "bestsellers", isActive: true, countText: "Active 6" },
    { id: "7", name: "Testimonials", key: "testimonials", isActive: true, countText: "Active 3" },
    { id: "8", name: "Newsletter", key: "newsletter", isActive: true, countText: "Active 1" }
  ])

  // Hero Section State matching screenshot
  const [heroForm, setHeroForm] = useState({
    id: 1,
    heading: "Crafted for Elegance",
    subheading: "Timeless luxury bags, meticulously crafted for the modern connoisseur.",
    primaryBtn: "Explore Collection",
    primaryLink: "/collections/all",
    secondaryBtn: "View Lookbook",
    secondaryLink: "/pages/lookbook",
    enable3D: true,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
  })

  // Product Manager Modal matching screenshot
  const [productForm, setProductForm] = useState({
    title: "Aurelia Quilted Shoulder Bag",
    status: "Active",
    description: "Elegant quilted leather shoulder bag with gold-tone chain strap and titanium lock.",
    price: "520.00",
    comparePrice: "660.00",
    category: "Shoulder Bags",
    collection: "Aurelia Collection",
    tags: "luxury, quilted, shoulder"
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Fetch live Hero Slider from DB
    apiFetch('/cms/sliders/')
      .then(data => {
        if (data && data.length > 0) {
          const s = data[0]
          setHeroForm({
            id: s.id || 1,
            heading: s.title || "Crafted for Elegance",
            subheading: s.subtitle || "Timeless luxury bags, meticulously crafted for the modern connoisseur.",
            primaryBtn: s.cta_text || "Explore Collection",
            primaryLink: s.cta_link || "/shop",
            secondaryBtn: s.secondary_cta_text || "View Lookbook",
            secondaryLink: s.secondary_cta_link || "/lookbook",
            enable3D: s.enable_3d_effect ?? true,
            imageUrl: s.image_url || "https://images.unsplash.com/photo-1583391733956-6c78276477e2"
          })
        }
      })
      .catch(console.error)
  }, [])

  const handleSaveHero = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await apiFetch(`/cms/admin-sliders/${heroForm.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: heroForm.heading,
          subtitle: heroForm.subheading,
          cta_text: heroForm.primaryBtn,
          cta_link: heroForm.primaryLink,
          secondary_cta_text: heroForm.secondaryBtn,
          secondary_cta_link: heroForm.secondaryLink,
          enable_3d_effect: heroForm.enable3D,
          image_url: heroForm.imageUrl
        })
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      // Create slider if doesn't exist
      try {
        await apiFetch('/cms/admin-sliders/', {
          method: 'POST',
          body: JSON.stringify({
            title: heroForm.heading,
            subtitle: heroForm.subheading,
            cta_text: heroForm.primaryBtn,
            cta_link: heroForm.primaryLink,
            secondary_cta_text: heroForm.secondaryBtn,
            secondary_cta_link: heroForm.secondaryLink,
            enable_3d_effect: heroForm.enable3D,
            image_url: heroForm.imageUrl,
            is_active: true
          })
        })
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } catch (e) {
        alert("Failed to save hero section settings.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s))
  }

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e1e3e5] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] block mb-1">DE'NOURA OS Engine</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">CMS / Admin Portal Manager</h1>
          <p className="text-xs text-[#6d7175]">Visual Theme Manager &amp; Dynamic Homepage Section Configurator</p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="http://localhost:9005" 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-gray-500" /> Preview Storefront <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button 
            onClick={handleSaveHero}
            disabled={isSaving}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-black text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" /> {isSaving ? "Publishing..." : "Publish Theme Updates"}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" /> Storefront CMS updated successfully! Storefront reflecting live changes.
        </div>
      )}

      {/* Main Grid: Left = Home Page Sections Manager, Right = Configurator Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Home Page Sections Manager (4 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#e1e3e5] shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" /> Home Page Sections
            </h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{sections.filter(s => s.isActive).length} Active</span>
          </div>

          <div className="space-y-2">
            {sections.map(sec => (
              <div 
                key={sec.id}
                onClick={() => setActiveTab(sec.key === 'hero' ? 'hero' : 'sections')}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  activeTab === sec.key ? "border-black bg-gray-50 shadow-sm" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={sec.isActive}
                    onChange={() => toggleSection(sec.id)}
                    className="accent-black rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-900">{sec.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {sec.countText}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hero Section Editor & Product Management (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hero Section Configurator Panel matching reference image */}
          <div className="bg-[#0A192F] text-white rounded-2xl border border-[#C5A059]/30 p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h2 className="text-base font-bold tracking-wider text-[#C5A059] uppercase font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Hero Section Configurator
              </h2>
              <span className="text-[10px] font-bold bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-1 rounded-full uppercase border border-[#C5A059]/30">
                Spatial 3D Active
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Heading</label>
                <input 
                  type="text"
                  value={heroForm.heading}
                  onChange={e => setHeroForm({ ...heroForm, heading: e.target.value })}
                  className="w-full bg-[#06152D] border border-white/20 rounded-lg p-3 text-xs text-white font-serif outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Subheading</label>
                <textarea 
                  rows={2}
                  value={heroForm.subheading}
                  onChange={e => setHeroForm({ ...heroForm, subheading: e.target.value })}
                  className="w-full bg-[#06152D] border border-white/20 rounded-lg p-3 text-xs text-white/90 outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Primary Button Label</label>
                  <input 
                    type="text"
                    value={heroForm.primaryBtn}
                    onChange={e => setHeroForm({ ...heroForm, primaryBtn: e.target.value })}
                    className="w-full bg-[#06152D] border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Primary Link</label>
                  <input 
                    type="text"
                    value={heroForm.primaryLink}
                    onChange={e => setHeroForm({ ...heroForm, primaryLink: e.target.value })}
                    className="w-full bg-[#06152D] border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Secondary Button Label</label>
                  <input 
                    type="text"
                    value={heroForm.secondaryBtn}
                    onChange={e => setHeroForm({ ...heroForm, secondaryBtn: e.target.value })}
                    className="w-full bg-[#06152D] border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Secondary Link</label>
                  <input 
                    type="text"
                    value={heroForm.secondaryLink}
                    onChange={e => setHeroForm({ ...heroForm, secondaryLink: e.target.value })}
                    className="w-full bg-[#06152D] border border-white/20 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 pt-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={heroForm.enable3D}
                  onChange={e => setHeroForm({ ...heroForm, enable3D: e.target.checked })}
                  className="accent-[#C5A059] rounded"
                />
                <span className="text-xs font-bold text-white">Enable Parallax / 3D Spatial Effect</span>
              </label>

              <button 
                onClick={handleSaveHero}
                disabled={isSaving}
                className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-xs py-3 rounded-lg hover:bg-[#d5b069] transition shadow-lg mt-4"
              >
                {isSaving ? "Saving Hero Section..." : "Save Hero Section"}
              </button>
            </div>
          </div>

          {/* Product Management Preview Drawer matching screenshot */}
          <div className="bg-white rounded-xl border border-[#e1e3e5] p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-black" /> Product Management Card Preview
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {productForm.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Title</label>
                <input 
                  type="text"
                  value={productForm.title}
                  onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-bold text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Price ($)</label>
                  <input 
                    type="text"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Compare-At Price ($)</label>
                  <input 
                    type="text"
                    value={productForm.comparePrice}
                    onChange={e => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono text-gray-500 line-through"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
