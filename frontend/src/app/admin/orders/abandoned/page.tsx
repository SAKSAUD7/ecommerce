"use client"

import { useState } from "react"
import { ShoppingBag, Mail, RefreshCw, AlertCircle, DollarSign, Send } from "lucide-react"

export default function AdminAbandonedCheckoutsPage() {
  const [checkouts, setCheckouts] = useState([
    { id: "CHK-881", customer: "Zara Mahmood", email: "zara@example.com", itemsCount: 3, cartTotal: 490.00, abandonedAt: "2 Hours ago", emailSent: false },
    { id: "CHK-882", customer: "Camille Dubois", email: "camille@example.com", itemsCount: 1, cartTotal: 850.00, abandonedAt: "5 Hours ago", emailSent: true },
    { id: "CHK-883", customer: "Fatima Al-Hassan", email: "fatima@example.com", itemsCount: 2, cartTotal: 1250.00, abandonedAt: "1 Day ago", emailSent: true },
  ])

  const sendRecoveryEmail = (id: string) => {
    setCheckouts(prev => prev.map(c => c.id === id ? { ...c, emailSent: true } : c))
    alert(`Recovery email with 10% discount checkout link sent to customer!`)
  }

  const totalAbandonedValue = checkouts.reduce((s, c) => s + c.cartTotal, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Abandoned Checkouts</h1>
          <p className="text-sm text-[#6d7175]">Recover lost sales by triggering automated recovery emails with special incentives</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Abandoned Checkouts</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{checkouts.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Recoverable Revenue</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">${totalAbandonedValue.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Recovery Emails Sent</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{checkouts.filter(c => c.emailSent).length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Checkout ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Cart Value</th>
              <th className="py-3.5 px-4">Time Abandoned</th>
              <th className="py-3.5 px-4">Recovery Email</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {checkouts.map(c => (
              <tr key={c.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-mono font-bold">{c.id}</td>
                <td className="py-3.5 px-4">
                  <p className="font-medium">{c.customer}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-700">${c.cartTotal.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">{c.abandonedAt}</td>
                <td className="py-3.5 px-4">
                  {c.emailSent ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Sent
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      Not Sent
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => sendRecoveryEmail(c.id)}
                    className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800 inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" /> Send Recovery Link
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
