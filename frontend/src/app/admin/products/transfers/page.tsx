"use client"

import { useState } from "react"
import { 
  ArrowLeftRight, Plus, Search, Truck, CheckCircle2, Clock, 
  MapPin, PackageCheck 
} from "lucide-react"

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState([
    { id: 101, origin: "Main Warehouse (LA)", destination: "NYC Retail Hub", items: 45, status: "In Transit", eta: "2026-08-15" },
    { id: 102, origin: "EU Logistics (Amsterdam)", destination: "Main Warehouse (LA)", items: 120, status: "Received", eta: "2026-08-10" },
    { id: 103, origin: "Supplier Direct", destination: "London Distribution", items: 200, status: "Draft", eta: "2026-08-20" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [origin, setOrigin] = useState("Main Warehouse (LA)")
  const [destination, setDestination] = useState("NYC Retail Hub")
  const [itemsCount, setItemsCount] = useState("50")
  const [eta, setEta] = useState("")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setTransfers(prev => [
      { id: prev.length + 101, origin, destination, items: parseInt(itemsCount), status: "In Transit", eta: eta || "2026-08-18" },
      ...prev
    ])
    setIsModalOpen(false)
  }

  const markReceived = (id: number) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: "Received" } : t))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Inventory Transfers</h1>
          <p className="text-sm text-[#6d7175]">Move inventory between retail locations, fulfillment hubs, and regional warehouses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Transfer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Transfers</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{transfers.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">In Transit</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{transfers.filter(t => t.status === 'In Transit').length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Completed</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{transfers.filter(t => t.status === 'Received').length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Transfer ID</th>
              <th className="py-3.5 px-4">Origin</th>
              <th className="py-3.5 px-4">Destination</th>
              <th className="py-3.5 px-4">Item Qty</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {transfers.map(t => (
              <tr key={t.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold">TRN-#{t.id}</td>
                <td className="py-3.5 px-4">{t.origin}</td>
                <td className="py-3.5 px-4">{t.destination}</td>
                <td className="py-3.5 px-4 font-semibold">{t.items} units</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    t.status === 'Received' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'In Transit' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {t.status === 'In Transit' && (
                    <button
                      onClick={() => markReceived(t.id)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded"
                    >
                      Receive Stock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">Create Stock Transfer</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Origin Location</label>
              <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Destination Location</label>
              <input type="text" value={destination} onChange={e => setDestination(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Items Quantity</label>
              <input type="number" value={itemsCount} onChange={e => setItemsCount(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg">Dispatch Transfer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
