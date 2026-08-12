"use client"

import { useState } from "react"
import { Image, Upload, Trash2, Link as LinkIcon, Search, FileText } from "lucide-react"

export default function AdminFilesPage() {
  const [files, setFiles] = useState([
    { id: 1, name: "denoura_hero_silk_banner.png", size: "2.4 MB", type: "Image", url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2", uploadedAt: "2026-08-10" },
    { id: 2, name: "velvet_abaya_lookbook_2026.pdf", size: "14.8 MB", type: "PDF Document", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f", uploadedAt: "2026-08-08" },
    { id: 3, name: "embroidery_craftsmanship.jpg", size: "1.8 MB", type: "Image", url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b", uploadedAt: "2026-08-05" },
  ])

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("CDN File URL copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Files & Media Asset Manager</h1>
          <p className="text-sm text-[#6d7175]">Manage high-resolution photography, lookbooks, 3D models, and digital brand assets</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Upload className="w-4 h-4" /> Upload Files
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Asset Preview</th>
              <th className="py-3.5 px-4">Filename</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">File Size</th>
              <th className="py-3.5 px-4">Uploaded</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {files.map(f => (
              <tr key={f.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4">
                  <img src={f.url} alt="" className="w-12 h-12 object-cover rounded border" />
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-xs">{f.name}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">{f.type}</td>
                <td className="py-3.5 px-4 text-xs text-gray-500">{f.size}</td>
                <td className="py-3.5 px-4 text-xs text-gray-500">{f.uploadedAt}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button onClick={() => copyUrl(f.url)} className="p-1.5 text-gray-500 hover:text-black" title="Copy URL">
                    <LinkIcon className="w-4 h-4" />
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
