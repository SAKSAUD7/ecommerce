"use client"

import { useState } from "react"
import { Truck, Globe, MapPin, Plus, DollarSign, CheckCircle2 } from "lucide-react"

export default function AdminShippingSettingsPage() {
  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: "United Kingdom & Europe (Denoura.co.uk)", countries: "UK, France, Germany, Italy, Netherlands", rate: "Free Express over £150 / Standard £15.00", carrier: "DHL Express / DPD" },
    { id: 2, name: "North America & International (Denoura.co)", countries: "United States, Canada, Mexico", rate: "Free Express over $500 / Flat $25.00", carrier: "FedEx International Priority" },
    { id: 3, name: "GCC & Middle East", countries: "UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain", rate: "Free Express over $1,000 / Flat $50.00", carrier: "Aramex / DHL" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Shipping & Delivery Rates</h1>
          <p className="text-sm text-[#6d7175]">Configure global shipping zones, carrier integrations (DHL, FedEx, DPD), and free shipping thresholds</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Shipping Zone
        </button>
      </div>

      <div className="space-y-4">
        {shippingZones.map(z => (
          <div key={z.id} className="bg-white p-6 rounded-lg border border-[#e1e3e5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-bold text-[#1a1a1a] text-base">{z.name}</h3>
              </div>
              <p className="text-xs text-[#6d7175]"><strong>Regions:</strong> {z.countries}</p>
              <p className="text-xs text-gray-700"><strong>Carrier:</strong> {z.carrier}</p>
            </div>
            <div className="text-right border-t md:border-t-0 pt-3 md:pt-0">
              <p className="text-xs font-semibold text-[#6d7175] uppercase">Rate Structure</p>
              <p className="text-sm font-bold text-emerald-700 mt-1">{z.rate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
