"use client"

import { useState } from "react"
import { Users, UserCheck, Shield, Plus, Mail } from "lucide-react"

export default function AdminUsersSettingsPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Sak (Super Admin)", email: "Denoura.co@gmail.com", role: "Owner / Full Access", lastLogin: "Active Now" },
    { id: 2, name: "Head of Logistics", email: "logistics@denoura.co", role: "Fulfillment & Inventory Specialist", lastLogin: "Today at 02:15 PM" },
    { id: 3, name: "Client Concierge Manager", email: "concierge@denoura.co", role: "Orders & Support Manager", lastLogin: "Yesterday" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Users & Staff Permissions</h1>
          <p className="text-sm text-[#6d7175]">Grant role-based access for store managers, fulfillment staff, and support teams</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Invite Staff Member
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Staff Member</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Assigned Role</th>
              <th className="py-3.5 px-4">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-[#fafafa]">
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">{u.name}</td>
                <td className="py-3.5 px-4 text-xs font-mono text-gray-700">{u.email}</td>
                <td className="py-3.5 px-4 text-xs font-semibold text-indigo-700">{u.role}</td>
                <td className="py-3.5 px-4 text-xs text-gray-500">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
