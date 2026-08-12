"use client"

import React from "react"
import { Package, ShieldCheck, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function AccountProfilePage() {
  return (
    <div className="space-y-12">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 md:p-10 glass-panel">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-8">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">First Name</label>
            <input type="text" defaultValue="John" className="w-full bg-transparent border-b border-white/20 p-2 text-sm text-white focus:border-white outline-none transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Last Name</label>
            <input type="text" defaultValue="Doe" className="w-full bg-transparent border-b border-white/20 p-2 text-sm text-white focus:border-white outline-none transition-colors" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Email Address</label>
            <input type="email" defaultValue="john.doe@example.com" className="w-full bg-transparent border-b border-white/20 p-2 text-sm text-white focus:border-white outline-none transition-colors" />
          </div>
        </div>

        <button className="mt-8 bg-white text-black text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white/90 transition-colors">
          Save Changes
        </button>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer">
          <Package className="w-6 h-6 text-white/50 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">Recent Orders</h3>
          <p className="text-[10px] text-white/50 tracking-widest uppercase">Track and manage your purchases</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer">
          <ShieldCheck className="w-6 h-6 text-white/50 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">Security</h3>
          <p className="text-[10px] text-white/50 tracking-widest uppercase">Update password and authentication</p>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer">
          <Clock className="w-6 h-6 text-white/50 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">Order History</h3>
          <p className="text-[10px] text-white/50 tracking-widest uppercase">View all past transactions</p>
        </div>
      </div>
    </div>
  )
}
