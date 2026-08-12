"use client"

import { useState } from "react"
import { 
  CreditCard, Plus, Search, Gift, CheckCircle2, XCircle, 
  Send, Sparkles, DollarSign, Calendar 
} from "lucide-react"

export default function AdminGiftCardsPage() {
  const [giftCards, setGiftCards] = useState([
    { id: 1, code: "DENOURA-GOLD-100", customer: "Sophia Laurent", email: "sophia@example.com", initialAmount: 100, balance: 100, expiresAt: "2027-12-31", status: "Active" },
    { id: 2, code: "DENOURA-[#9821]-500", customer: "Amira Al-Mansoor", email: "amira@example.com", initialAmount: 500, balance: 320, expiresAt: "2027-06-30", status: "Active" },
    { id: 3, code: "DENOURA-VIP-250", customer: "Elena Rostova", email: "elena@example.com", initialAmount: 250, balance: 0, expiresAt: "2026-05-15", status: "Redeemed" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customer, setCustomer] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("100")
  const [expiry, setExpiry] = useState("2027-12-31")

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault()
    const randomCode = `DENOURA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${amount}`
    setGiftCards(prev => [
      {
        id: Date.now(),
        code: randomCode,
        customer: customer || "Guest Customer",
        email,
        initialAmount: parseFloat(amount),
        balance: parseFloat(amount),
        expiresAt: expiry,
        status: "Active"
      },
      ...prev
    ])
    setIsModalOpen(false)
    setCustomer("")
    setEmail("")
  }

  const activeCount = giftCards.filter(g => g.status === 'Active').length
  const totalBalance = giftCards.reduce((sum, g) => sum + g.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Gift Cards & Store Credit</h1>
          <p className="text-sm text-[#6d7175]">Issue digital luxury gift vouchers and manage store credit balances</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Gift Card
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Total Issued</p>
            <CreditCard className="w-5 h-5 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{giftCards.length} Cards</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Active Vouchers</p>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{activeCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Outstanding Credit</p>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">${totalBalance.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Card Code</th>
              <th className="py-3.5 px-4">Recipient</th>
              <th className="py-3.5 px-4">Original Value</th>
              <th className="py-3.5 px-4">Current Balance</th>
              <th className="py-3.5 px-4">Expires</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {giftCards.map(c => (
              <tr key={c.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">{c.code}</td>
                <td className="py-3.5 px-4">
                  <p className="font-medium">{c.customer}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </td>
                <td className="py-3.5 px-4 font-semibold">${c.initialAmount.toFixed(2)}</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700">${c.balance.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">{c.expiresAt}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="p-1.5 text-gray-400 hover:text-black" title="Resend Gift Card Email">
                    <Send className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleIssue} className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">Issue DE&apos;NOURA Gift Card</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Recipient Name</label>
              <input type="text" placeholder="e.g. Lady Sarah" value={customer} onChange={e => setCustomer(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Recipient Email</label>
              <input type="email" placeholder="sarah@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Gift Amount ($)</label>
              <input type="number" step="10" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Expiry Date</label>
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg">Issue & Send Card</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
