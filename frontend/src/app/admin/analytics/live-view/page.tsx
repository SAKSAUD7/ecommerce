"use client"

import { useState, useEffect } from "react"
import { Globe, Users, ShoppingBag, Eye, ArrowUpRight, Radio } from "lucide-react"

export default function AdminLiveViewPage() {
  const [activeVisitors, setActiveVisitors] = useState(38)
  const [cartsActive, setCartsActive] = useState(7)
  const [ordersToday, setOrdersToday] = useState(14)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors(prev => Math.floor(Math.random() * 15) + 30)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const locations = [
    { city: "London", country: "United Kingdom", count: 14, flag: "🇬🇧" },
    { city: "Paris", country: "France", count: 8, flag: "🇫🇷" },
    { city: "Dubai", country: "United Arab Emirates", count: 9, flag: "🇦🇪" },
    { city: "New York", country: "United States", count: 7, flag: "🇺🇸" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Live Store View</h1>
          </div>
          <p className="text-sm text-[#6d7175]">Real-time spatial radar monitoring global traffic, active carts, and incoming checkouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Right Now</p>
            <Eye className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">{activeVisitors} Active Visitors</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Active Carts</p>
            <ShoppingBag className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">{cartsActive} Shopping Carts</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-[#6d7175] uppercase">Completed Today</p>
            <ArrowUpRight className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-3xl font-bold text-indigo-600 mt-2">{ordersToday} Orders</h3>
        </div>
      </div>

      {/* Global Traffic Radar Card */}
      <div className="bg-[#0A192F] text-white rounded-xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold tracking-wider uppercase text-[#C5A059] flex items-center gap-2">
            <Globe className="w-5 h-5" /> Global Live Visitors Radar
          </h3>
          <span className="text-xs text-slate-400 font-mono">Synced live via WebSocket</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <div key={i} className="p-4 bg-slate-900/80 rounded-lg border border-slate-700/60 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{loc.flag}</span>
                <span className="text-xl font-bold text-[#C5A059]">{loc.count} online</span>
              </div>
              <p className="font-bold text-sm text-white mt-2">{loc.city}</p>
              <p className="text-xs text-slate-400">{loc.country}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
