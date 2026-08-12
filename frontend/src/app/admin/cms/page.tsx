"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAdminPages } from "@/lib/api"
import { Plus, LayoutTemplate, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function CMSPages() {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: fetchAdminPages,
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">Online Store Pages</h1>
          <p className="text-[#6d7175] text-sm mt-1">Manage storefront pages, layouts, and theme sections.</p>
        </div>
        <button className="bg-[#1a1a1a] hover:bg-black text-white px-4 py-2 rounded-md text-[13px] font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Add Page
        </button>
      </div>

      <div className="bg-white border border-[#e1e3e5] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e1e3e5]">
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a] w-[50px]">ID</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a]">Page Title</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a]">URL Slug</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a]">Status</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a]">Sections</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-[#1a1a1a] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6d7175] text-sm">Loading pages...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6d7175] text-sm border-b border-[#e1e3e5]">
                    No pages found. Create one to start building your storefront.
                  </td>
                </tr>
              ) : (
                pages.map((page: any) => (
                  <tr key={page.id} className="border-b border-[#e1e3e5] hover:bg-[#f6f6f7] transition-colors group cursor-pointer">
                    <td className="py-3 px-4 text-[13px] text-[#6d7175]">#{page.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 text-[#6d7175]" />
                        <span className="text-[14px] font-medium text-[#1a1a1a]">{page.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[13px] text-[#202223]">/{page.slug}</td>
                    <td className="py-3 px-4">
                      {page.is_published ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#e3f1df] text-[#0e6245]">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ffebd8] text-[#935210]">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[13px] text-[#6d7175]">
                      {page.sections?.length || 0} Blocks
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-[#1a1a1a] hover:text-blue-600 font-medium text-[13px]">Edit Theme</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
