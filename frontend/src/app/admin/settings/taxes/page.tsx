"use client"

import { useState } from "react"
import { Percent, ShieldAlert, CheckCircle2, Plus } from "lucide-react"

export default function AdminTaxesSettingsPage() {
  const [taxes, setTaxes] = useState([
    { region: "United Kingdom (VAT)", rate: "20.0%", type: "Included in listed prices", status: "Active" },
    { region: "European Union (OSS VAT)", rate: "19.0% - 22.0%", type: "Destination VAT Calculation", status: "Active" },
    { region: "United States Sales Tax", rate: "8.0%", type: "Calculated at Checkout (Nexus)", status: "Active" },
    { region: "United Arab Emirates (VAT)", rate: "5.0%", type: "Standard VAT", status: "Active" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Taxes & Duties Configuration</h1>
          <p className="text-sm text-[#6d7175]">Manage VAT, international customs duty calculation, and regional tax overrides</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Tax Jurisdiction / Region</th>
              <th className="py-3.5 px-4">Tax Rate</th>
              <th className="py-3.5 px-4">Calculation Mode</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {taxes.map((t, i) => (
              <tr key={i} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">{t.region}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{t.rate}</td>
                <td className="py-3.5 px-4 text-xs text-gray-700">{t.type}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {t.status}
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
