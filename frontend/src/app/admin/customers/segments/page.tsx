"use client"

import { useState } from "react"
import { Users, Plus, Search, Filter, Sparkles, Tag, ShieldCheck, Mail } from "lucide-react"

export default function AdminCustomerSegmentsPage() {
  const [segments, setSegments] = useState([
    { id: 1, name: "VIP High-Spenders", description: "Customers with total lifetime spend over $2,500", count: 48, rule: "Spend > $2,500" },
    { id: 2, name: "Repeat Buyers", description: "Purchased 3 or more times in past 90 days", count: 142, rule: "Orders >= 3" },
    { id: 3, name: "At-Risk Customers", description: "No purchases made in past 180 days", count: 89, rule: "Inactive > 180d" },
    { id: 4, name: "First-Time Buyers", description: "New accounts with exactly 1 completed purchase", count: 310, rule: "Orders == 1" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rule, setRule] = useState("Spend > $1,000")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setSegments(prev => [
      { id: prev.length + 1, name, description, count: 0, rule },
      ...prev
    ])
    setIsModalOpen(false)
    setName("")
    setDescription("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Customer Segments</h1>
          <p className="text-sm text-[#6d7175]">Group customers dynamically using RFM analysis, purchase behavior, and lifetime value</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Segment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {segments.map(seg => (
          <div key={seg.id} className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {seg.rule}
                </span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-[#1a1a1a]">{seg.name}</h3>
              <p className="text-xs text-[#6d7175] mt-1 line-clamp-2">{seg.description}</p>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-lg font-bold text-[#1a1a1a]">{seg.count} Customers</span>
              <button className="text-xs font-semibold text-black hover:underline flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Campaign
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">Create Customer Segment</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Segment Name</label>
              <input type="text" placeholder="e.g. Modest Couture Enthusiasts" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Rule Criteria</label>
              <select value={rule} onChange={e => setRule(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="Spend > $1,000">Lifetime Spend &gt; $1,000</option>
                <option value="Orders >= 3">Order Count &gt;= 3</option>
                <option value="Inactive > 90d">Inactive for &gt; 90 Days</option>
                <option value="Loyalty VIP">Loyalty Tier == Gold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Description</label>
              <textarea rows={3} placeholder="Purpose of this segment..." value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg">Save Segment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
