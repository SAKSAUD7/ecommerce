"use client"

import { useState } from "react"
import { Zap, Plus, Play, Pause, RefreshCw, Mail, ShoppingCart, HeartHandshake } from "lucide-react"

export default function AdminMarketingAutomationsPage() {
  const [automations, setAutomations] = useState([
    { id: 1, name: "Abandoned Cart Recovery Sequence", trigger: "Cart abandoned for > 2 hours", action: "Send 3-part email workflow with 10% coupon", status: "Active", runsCount: 420 },
    { id: 2, name: "VIP Welcome Series", trigger: "New customer account registration", action: "Send brand story & 15% first order gift", status: "Active", runsCount: 890 },
    { id: 3, name: "Post-Purchase Thank You & Review Request", trigger: "Order status updated to Delivered", action: "Send review request after 7 days", status: "Active", runsCount: 650 },
    { id: 4, name: "Win-Back Inactive Buyers", trigger: "No purchase in 120 days", action: "Send $50 voucher email", status: "Paused", runsCount: 130 },
  ])

  const toggleStatus = (id: number) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Marketing Automations</h1>
          <p className="text-sm text-[#6d7175]">Trigger automated customer lifecycle workflows, emails, and recovery sequences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Automations</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{automations.length} Workflows</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Active Triggers</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{automations.filter(a => a.status === 'Active').length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Executions</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">2,090</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Workflow Name</th>
              <th className="py-3.5 px-4">Trigger Condition</th>
              <th className="py-3.5 px-4">Action Payload</th>
              <th className="py-3.5 px-4">Total Runs</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {automations.map(a => (
              <tr key={a.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">{a.name}</td>
                <td className="py-3.5 px-4 text-xs font-mono text-gray-700">{a.trigger}</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">{a.action}</td>
                <td className="py-3.5 px-4 font-bold">{a.runsCount}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    a.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toggleStatus(a.id)}
                    className="p-1.5 text-gray-500 hover:text-black rounded"
                    title={a.status === 'Active' ? 'Pause Workflow' : 'Activate Workflow'}
                  >
                    {a.status === 'Active' ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
