"use client"

import { useState } from "react"
import { Store, Monitor, ShoppingBag, CreditCard, Plus, CheckCircle2 } from "lucide-react"

export default function AdminPOSPage() {
  const [terminals, setTerminals] = useState([
    { id: 1, name: "London Knightsbridge Flagship POS 1", status: "Online", registerBalance: "$1,450.00", location: "London UK" },
    { id: 2, name: "Paris Rue du Faubourg Terminal", status: "Online", registerBalance: "€2,100.00", location: "Paris FR" },
    { id: 3, name: "Dubai Mall Pop-Up Counter", status: "Offline", registerBalance: "AED 0.00", location: "Dubai UAE" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Point of Sale (POS) Terminals</h1>
          <p className="text-sm text-[#6d7175]">Manage in-person retail registers, staff barcode scanners, and physical checkout terminals</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Register New Terminal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terminals.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                t.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {t.status}
              </span>
              <Monitor className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1a1a] text-base">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{t.location}</p>
            </div>
            <div className="pt-3 border-t flex justify-between items-center text-xs">
              <span className="text-gray-500">Register Drawer</span>
              <span className="font-bold text-black text-sm">{t.registerBalance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
