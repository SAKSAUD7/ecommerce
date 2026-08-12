"use client"

import { useState } from "react"
import { BarChart3, Download, Calendar, DollarSign, ArrowUpRight, Filter, TrendingUp } from "lucide-react"

export default function AdminReportsPage() {
  const reports = [
    { title: "Sales & Profit Ledger", category: "Finance", period: "Last 30 Days", size: "PDF / CSV", updated: "Today at 08:00 AM" },
    { title: "Supplier Payouts & COGS Breakdown", category: "Dropshipping", period: "This Month", size: "CSV", updated: "Yesterday" },
    { title: "Customer Lifetime Value (LTV) & Churn", category: "CRM", period: "Lifetime", size: "Excel", updated: "Aug 10, 2026" },
    { title: "Taxes & Regional VAT Liability", category: "Compliance", period: "Q3 2026", size: "PDF", updated: "Aug 01, 2026" },
  ]

  const downloadReport = (title: string) => {
    alert(`Downloading ${title}...`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Analytics Reports & Financial Audits</h1>
          <p className="text-sm text-[#6d7175]">Generate detailed financial statements, tax ledgers, and supplier profit reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Gross Profit Margin</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">64.8%</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Average Order Value (AOV)</p>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">$485.50</h3>
        </div>
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <p className="text-xs font-semibold text-[#6d7175] uppercase">Repeat Customer Rate</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">38.2%</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Report Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date Range</th>
              <th className="py-3.5 px-4">Last Generated</th>
              <th className="py-3.5 px-4 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {reports.map((r, i) => (
              <tr key={i} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">{r.title}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">{r.category}</td>
                <td className="py-3.5 px-4 text-xs text-gray-700">{r.period}</td>
                <td className="py-3.5 px-4 text-xs text-gray-500">{r.updated}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => downloadReport(r.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded hover:bg-gray-800"
                  >
                    <Download className="w-3.5 h-3.5" /> Export {r.size}
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
