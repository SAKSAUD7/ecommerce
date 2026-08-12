"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { Settings, Globe, DollarSign, Truck, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/cms/settings/')
      setSettings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiFetch('/cms/settings/', {
        method: 'PUT',
        body: JSON.stringify(settings)
      })
      alert("Settings saved successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading settings...</div>

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store's global configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Store Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-900">Store Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input 
                type="text" 
                value={settings?.store_name || ''}
                onChange={e => setSettings({...settings, store_name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input 
                type="email" 
                value={settings?.support_email || ''}
                onChange={e => setSettings({...settings, support_email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
              <input 
                type="text" 
                value={settings?.support_phone || ''}
                onChange={e => setSettings({...settings, support_phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-900">Currency & Taxes</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
              <select 
                value={settings?.currency || 'USD'}
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-1 focus:ring-black outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Global Tax Rate (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={settings?.tax_rate || 0}
                onChange={e => setSettings({...settings, tax_rate: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-900">Shipping Configurations</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flat Shipping Rate ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={settings?.flat_shipping_rate || 0}
                onChange={e => setSettings({...settings, flat_shipping_rate: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={settings?.free_shipping_threshold || 0}
                onChange={e => setSettings({...settings, free_shipping_threshold: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 bg-[#008060] hover:bg-[#006e52] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save settings"}
          </button>
        </div>

      </form>
    </div>
  )
}
