"use client"

import { useState } from "react"
import { Megaphone, Plus, Search, Send, BarChart2, CheckCircle2, Clock } from "lucide-react"

export default function AdminMarketingCampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Autumn Modest Runway Launch", channel: "Email & SMS", audience: "VIP High-Spenders", status: "Active", opens: "68%", conversions: "14.2%" },
    { id: 2, name: "Ramadan Early Access Preview", channel: "Email Broadcast", audience: "All Subscribers", status: "Scheduled", opens: "—", conversions: "—" },
    { id: 3, name: "Summer Silk Clearance 20%", channel: "Instagram Ads", audience: "First-Time Buyers", status: "Completed", opens: "82%", conversions: "22.5%" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [channel, setChannel] = useState("Email & SMS")
  const [audience, setAudience] = useState("VIP High-Spenders")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setCampaigns(prev => [
      { id: prev.length + 1, name, channel, audience, status: "Active", opens: "0%", conversions: "0%" },
      ...prev
    ])
    setIsModalOpen(false)
    setName("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Marketing Campaigns</h1>
          <p className="text-sm text-[#6d7175]">Design and launch multi-channel promotional broadcasts and tracking campaigns</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Campaigns</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{campaigns.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Active & Live</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{campaigns.filter(c => c.status === 'Active').length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Avg Conversion Rate</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">18.35%</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Campaign Name</th>
              <th className="py-3.5 px-4">Channel</th>
              <th className="py-3.5 px-4">Audience</th>
              <th className="py-3.5 px-4">Open Rate</th>
              <th className="py-3.5 px-4">Conversion Rate</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {campaigns.map(c => (
              <tr key={c.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">{c.name}</td>
                <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{c.channel}</td>
                <td className="py-3.5 px-4 text-xs text-gray-700">{c.audience}</td>
                <td className="py-3.5 px-4 font-semibold">{c.opens}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700">{c.conversions}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {c.status}
                  </span>
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
              <h3 className="text-lg font-bold">Launch Campaign</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Campaign Title</label>
              <input type="text" placeholder="e.g. VIP Velvet Abaya Pre-Order" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="Email & SMS">Email & SMS Dual Broadcast</option>
                <option value="Email Broadcast">Email Broadcast</option>
                <option value="Push Notifications">App Push Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Target Segment</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                <option value="VIP High-Spenders">VIP High-Spenders</option>
                <option value="All Subscribers">All Subscribers</option>
                <option value="First-Time Buyers">First-Time Buyers</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg">Launch Campaign</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
