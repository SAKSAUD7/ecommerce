"use client"

import { useState } from "react"
import { FileEdit, Plus, Search, Send, CheckCircle, Trash2, DollarSign } from "lucide-react"

export default function AdminDraftOrdersPage() {
  const [drafts, setDrafts] = useState([
    { id: 901, customer: "Bespoke Boutique Paris", email: "orders@boutiqueparis.fr", itemsCount: 12, total: 3450.00, status: "Open Invoice", createdAt: "2026-08-12" },
    { id: 902, customer: "VIP Client - Royal Suite", email: "vip@denoura.com", itemsCount: 4, total: 1200.00, status: "Pending Payment", createdAt: "2026-08-11" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customer, setCustomer] = useState("")
  const [email, setEmail] = useState("")
  const [total, setTotal] = useState("500")

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setDrafts(prev => [
      { id: prev.length + 901, customer, email, itemsCount: 2, total: parseFloat(total), status: "Pending Payment", createdAt: new Date().toISOString().split('T')[0] },
      ...prev
    ])
    setIsModalOpen(false)
    setCustomer("")
    setEmail("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Draft Orders & Custom Invoices</h1>
          <p className="text-sm text-[#6d7175]">Create phone orders, custom quotes, and send payment checkout links to buyers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Draft Order
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Drafts</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{drafts.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Open Invoices</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{drafts.filter(d => d.status === 'Open Invoice').length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Value</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">${drafts.reduce((s, d) => s + d.total, 0).toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Draft #</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {drafts.map(d => (
              <tr key={d.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold">DRAFT-#{d.id}</td>
                <td className="py-3.5 px-4">
                  <p className="font-medium">{d.customer}</p>
                  <p className="text-xs text-gray-500">{d.email}</p>
                </td>
                <td className="py-3.5 px-4 font-semibold">{d.itemsCount} items</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700">${d.total.toFixed(2)}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    {d.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button className="px-3 py-1 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800">
                    Send Invoice
                  </button>
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
              <h3 className="text-lg font-bold">Create Custom Order Draft</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Customer / Organization</label>
              <input type="text" value={customer} onChange={e => setCustomer(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Total Value ($)</label>
              <input type="number" step="0.01" value={total} onChange={e => setTotal(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg">Save Draft</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
