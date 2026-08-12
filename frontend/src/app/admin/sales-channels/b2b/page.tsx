"use client"

import { useState } from "react"
import { Building2, Plus, Users, DollarSign, Percent, ShieldCheck } from "lucide-react"

export default function AdminB2BPage() {
  const [b2bAccounts, setB2bAccounts] = useState([
    { id: 1, company: "Boutique Elegance Paris", taxId: "FR-9988123", creditLimit: "$25,000", customDiscount: "35% Wholesale Margin", status: "Approved" },
    { id: 2, name: "Al-Majid Luxury Retail UAE", taxId: "AE-441029", creditLimit: "$100,000", customDiscount: "40% Master Distributor", status: "Approved" },
    { id: 3, name: "Velvet House London", taxId: "GB-881203", creditLimit: "$10,000", customDiscount: "25% Tier 1", status: "Pending Review" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">B2B Wholesale & Custom Pricing</h1>
          <p className="text-sm text-[#6d7175]">Manage wholesale client accounts, custom price lists, net 30 payment terms, and credit lines</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Wholesale Account
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Wholesale Company</th>
              <th className="py-3.5 px-4">Tax ID / VAT</th>
              <th className="py-3.5 px-4">Credit Limit</th>
              <th className="py-3.5 px-4">Contract Price Tier</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {b2bAccounts.map(b => (
              <tr key={b.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold">{b.company || b.name}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-gray-700">{b.taxId}</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-700">{b.creditLimit}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-indigo-700">{b.customDiscount}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    b.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
