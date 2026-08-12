"use client"

import { useState } from "react"
import { Database, Plus, Code, Layers, FileJson } from "lucide-react"

export default function AdminMetaobjectsPage() {
  const [metaobjects, setMetaobjects] = useState([
    { id: 1, type: "Garment Fabric Care", entriesCount: 12, fields: "Fabric composition, Washing instructions, Silk weight (g/m2)" },
    { id: 2, name: "Model Size Specs", entriesCount: 8, fields: "Height, Bust, Waist, Wearing Size" },
    { id: 3, name: "Artisan Certificate", entriesCount: 24, fields: "Master Tailor Name, Origin City, Craftsmanship Hours" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Metaobjects & Custom Schemas</h1>
          <p className="text-sm text-[#6d7175]">Define custom data structures for couture specifications, fabric care, and artisan metadata</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Metaobject Definition
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Metaobject Definition</th>
              <th className="py-3.5 px-4">Fields Schema</th>
              <th className="py-3.5 px-4">Entries Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {metaobjects.map(m => (
              <tr key={m.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold">{m.type || m.name}</td>
                <td className="py-3.5 px-4 text-xs font-mono text-gray-700">{m.fields}</td>
                <td className="py-3.5 px-4 font-semibold">{m.entriesCount} entries</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
