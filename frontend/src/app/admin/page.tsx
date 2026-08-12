"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAnalytics } from "@/lib/api"
import { DollarSign, Users, ShoppingBag, ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 30000 // refresh every 30s
  })

  const metrics = data?.metrics || {}
  const recentOrders = data?.recentOrders || []
  
  const stats = [
    { label: "Total Revenue", value: `$${metrics.totalSales?.toLocaleString() || '0'}`, trend: "Lifetime", icon: DollarSign },
    { label: "Total Orders", value: metrics.totalOrders || '0', trend: "Lifetime", icon: ShoppingBag },
    { label: "Total Products", value: metrics.totalProducts || '0', trend: "Active", icon: TrendingUp },
    { label: "Low/Out of Stock", value: (metrics.outOfStockCount || 0) + (metrics.lowStockCount || 0), trend: "Needs Attention", icon: AlertTriangle },
  ]

  return (
    <div>
      <h1 className="text-[20px] font-bold tracking-tight mb-2 text-[#1a1a1a]">Dashboard Overview</h1>
      <p className="text-[#6d7175] text-sm mb-6">Welcome back, Super Admin</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            key={stat.label} 
            className="p-5 bg-white border border-[#e1e3e5] rounded-lg shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-10 h-10 text-gray-900" />
            </div>
            <p className="text-[13px] font-medium text-[#6d7175] mb-2">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{stat.value}</h3>
            <p className="text-xs text-[#0e6245] flex items-center gap-1 font-medium mt-3">
              <ArrowUpRight className="w-3 h-3" /> {stat.trend} from last month
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart & Profit Breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Chart */}
          <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-lg p-5 flex-1 min-h-[350px] flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Revenue Overview</h3>
              <select className="bg-white border border-[#c9cccf] text-[13px] text-[#202223] px-3 py-1.5 rounded-md outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a]">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="flex-1 w-full h-full min-h-[250px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[#6d7175] text-sm">Loading chart data...</p>
                </div>
              ) : data?.salesOverTime && data.salesOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.05}/>
                        <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e3e5" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6d7175', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6d7175', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e1e3e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`$${value}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#1a1a1a" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed border-[#e1e3e5] bg-[#f6f6f7] rounded-lg">
                  <p className="text-[#6d7175] text-sm font-medium">No sales data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Real Profit Dashboard */}
          <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-lg p-5">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5">Real Profit Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#f6f6f7] rounded border border-[#e1e3e5]">
                <p className="text-[12px] text-[#6d7175] font-medium mb-1 uppercase tracking-wide">Gross Sales</p>
                <p className="text-[18px] font-bold text-[#1a1a1a]">${metrics.totalSales?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</p>
              </div>
              <div className="p-4 bg-[#f6f6f7] rounded border border-[#e1e3e5]">
                <p className="text-[12px] text-[#6d7175] font-medium mb-1 uppercase tracking-wide">Supplier COGS</p>
                <p className="text-[18px] font-bold text-red-600">-${metrics.supplierCosts?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</p>
              </div>
              <div className="p-4 bg-[#f6f6f7] rounded border border-[#e1e3e5]">
                <p className="text-[12px] text-[#6d7175] font-medium mb-1 uppercase tracking-wide">Gateway Fees</p>
                <p className="text-[18px] font-bold text-red-600">-${metrics.gatewayFees?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</p>
              </div>
              <div className="p-4 bg-[#e3f1df] rounded border border-[#bbe5b3]">
                <p className="text-[12px] text-[#0e6245] font-medium mb-1 uppercase tracking-wide">Net Profit</p>
                <p className="text-[18px] font-bold text-[#0e6245]">${metrics.netProfit?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-[#e1e3e5] shadow-sm rounded-lg p-5">
          <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5">Recent Orders</h3>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-[#6d7175] text-sm">Loading orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-[#6d7175] text-sm">No recent orders.</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center border-b border-[#f1f2f3] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[14px] font-bold text-[#1a1a1a]">ORD-{order.id}</p>
                    <p className="text-[13px] text-[#6d7175]">{order.full_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-[#1a1a1a]">${order.total}</p>
                    <p className="text-[11px] text-[#6d7175] uppercase tracking-wide mt-0.5">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
