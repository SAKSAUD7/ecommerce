"use client"

import { useState } from "react"
import { 
  Search, Filter, Download, ArrowUpRight, ArrowDownRight, 
  Calendar, FileText, Sparkles, X, ChevronLeft, ChevronRight, RefreshCw,
  PieChart as PieIcon, BarChart2, LineChart as LineIcon, Table as TableIcon, Plus, SlidersHorizontal
} from "lucide-react"
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts"

interface ReportItem {
  id: string
  name: string
  category: "Acquisition" | "Behavior" | "Customers" | "Finances" | "Inventory" | "Orders" | "Sales"
  created: "Shopify" | "DE'NOURA OS"
  lastViewed: string
  metricValue: string
  trend: string
  donutData: { name: string; value: number; displayVal: string; color: string }[]
  tableRows: { country: string; orders: number; reversals: string; netSales: string; shipping: string; taxes: string; totalSales: string }[]
}

const DONUT_COLORS = [
  "#0091FF", "#6E25F4", "#4B5563", "#D946EF", "#06B6D4", "#EC4899", "#8B5CF6", "#F59E0B", "#10B981"
]

const MASTER_REPORTS_REGISTRY: ReportItem[] = [
  {
    id: "sales-billing-loc",
    name: "Total sales by billing location",
    category: "Sales",
    created: "Shopify",
    lastViewed: "Aug 12, 2026",
    metricValue: "£29.2K Total Sales",
    trend: "+24.2%",
    donutData: [
      { name: "United Kingdom", value: 6100, displayVal: "£6.1K", color: "#0091FF" },
      { name: "Netherlands", value: 3600, displayVal: "£3.6K", color: "#6E25F4" },
      { name: "Germany", value: 3200, displayVal: "£3.2K", color: "#4B5563" },
      { name: "Sweden", value: 2900, displayVal: "£2.9K", color: "#D946EF" },
      { name: "Switzerland", value: 2300, displayVal: "£2.3K", color: "#06B6D4" },
      { name: "France", value: 1800, displayVal: "£1.8K", color: "#EC4899" },
      { name: "Belgium", value: 1200, displayVal: "£1.2K", color: "#8B5CF6" },
      { name: "Norway", value: 1100, displayVal: "£1.1K", color: "#F59E0B" },
      { name: "Austria", value: 844, displayVal: "£844", color: "#10B981" },
    ],
    tableRows: [
      { country: "United Kingdom (Denoura.co.uk)", orders: 184, reversals: "-£92.43", netSales: "£27,082.24", shipping: "£2,182.02", taxes: "£0.00", totalSales: "£29,264.26" },
      { country: "Netherlands", orders: 62, reversals: "£0.00", netSales: "£3,410.00", shipping: "£190.00", taxes: "£0.00", totalSales: "£3,600.00" },
      { country: "Germany", orders: 58, reversals: "-£45.00", netSales: "£3,050.00", shipping: "£195.00", taxes: "£0.00", totalSales: "£3,200.00" },
      { country: "Sweden", orders: 49, reversals: "£0.00", netSales: "£2,750.00", shipping: "£150.00", taxes: "£0.00", totalSales: "£2,900.00" },
      { country: "Switzerland", orders: 38, reversals: "£0.00", netSales: "£2,150.00", shipping: "£150.00", taxes: "£0.00", totalSales: "£2,300.00" },
      { country: "France (Paris)", orders: 31, reversals: "£0.00", netSales: "£1,680.00", shipping: "£120.00", taxes: "£0.00", totalSales: "£1,800.00" },
    ]
  },
  {
    id: "acq-referrers",
    name: "Sessions by referrer",
    category: "Acquisition",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "42.8K Sessions",
    trend: "+18.4%",
    donutData: [
      { name: "Instagram (@Denoura.co)", value: 18400, displayVal: "18.4K", color: "#EC4899" },
      { name: "Direct Browser", value: 12200, displayVal: "12.2K", color: "#0091FF" },
      { name: "Google Search", value: 8100, displayVal: "8.1K", color: "#10B981" },
      { name: "TikTok (@Denoura.co)", value: 4150, displayVal: "4.15K", color: "#8B5CF6" }
    ],
    tableRows: [
      { country: "Instagram (@Denoura.co)", orders: 420, reversals: "-$120.00", netSales: "$68,400.00", shipping: "$4,200.00", taxes: "$0.00", totalSales: "$72,600.00" },
      { country: "Direct (Denoura.co & .co.uk)", orders: 280, reversals: "-$80.00", netSales: "$45,100.00", shipping: "$2,800.00", taxes: "$0.00", totalSales: "$47,900.00" },
      { country: "Google Search", orders: 190, reversals: "$0.00", netSales: "$28,900.00", shipping: "$1,900.00", taxes: "$0.00", totalSales: "$30,800.00" }
    ]
  },
  {
    id: "fin-cogs",
    name: "Cost of goods sold by order (COGS)",
    category: "Finances",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "$54.2K COGS",
    trend: "-3.1%",
    donutData: [
      { name: "Italian Silk", value: 24000, displayVal: "$24.0K", color: "#0091FF" },
      { name: "Velvet Embroidery", value: 18200, displayVal: "$18.2K", color: "#6E25F4" },
      { name: "Artisan Tailoring", value: 8000, displayVal: "$8.0K", color: "#F59E0B" },
      { name: "Embossed Packaging", value: 4000, displayVal: "$4.0K", color: "#10B981" }
    ],
    tableRows: [
      { country: "Silk & Fabrics Supplier", orders: 450, reversals: "$0.00", netSales: "$24,000.00", shipping: "$1,200.00", taxes: "$0.00", totalSales: "$25,200.00" },
      { country: "Embroidery Workshop", orders: 320, reversals: "$0.00", netSales: "$18,200.00", shipping: "$900.00", taxes: "$0.00", totalSales: "$19,100.00" }
    ]
  }
]

export default function AdminReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeReport, setActiveReport] = useState<ReportItem | null>(MASTER_REPORTS_REGISTRY[0])
  const [vizType, setVizType] = useState<"Donut" | "Bar" | "Line">("Donut")
  const [activeTab, setActiveTab] = useState<"Freeform" | "Cohorts">("Freeform")

  const categories = ["All", "Acquisition", "Behavior", "Customers", "Finances", "Inventory", "Orders", "Sales"]

  const filteredReports = MASTER_REPORTS_REGISTRY.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e1e3e5] pb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Analytics Reports</h1>
          <p className="text-sm text-[#6d7175]">Shopify 2026 freeform exploration engine with interactive donut visualizations, metric selectors, and ledgers</p>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e1e3e5] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" />
            <input
              type="text"
              placeholder="Search reports by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Report Exploration Workspace matching Shopify Screenshot */}
      {activeReport && (
        <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* Main Chart & Table Workspace (Left Column) */}
          <div className="flex-1 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-[#e1e3e5]">
            
            {/* Query Bar */}
            <div className="flex items-center justify-between p-3 bg-[#f6f6f7] rounded-lg border border-[#e1e3e5]">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium w-full">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-gray-900">Refine query:</span>
                <input 
                  type="text" 
                  readOnly 
                  value={`SHOW orders, gross_sales, discounts, net_sales, total_sales FROM sales BY billing_location`}
                  className="bg-transparent text-gray-700 font-mono text-[11px] w-full focus:outline-none" 
                />
              </div>
            </div>

            {/* Report Title */}
            <div>
              <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">{activeReport.name}</h2>
            </div>

            {/* Interactive Chart Visualization */}
            <div className="relative py-8 flex flex-col items-center justify-center bg-[#fafafa] rounded-xl border border-[#e1e3e5]">
              {vizType === "Donut" ? (
                <div className="relative w-full h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activeReport.donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={130}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {activeReport.donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e1e3e5' }} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Central Overlay Text matching screenshot */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-[#1a1a1a] tracking-tight">{activeReport.metricValue.split(" ")[0]}</span>
                    <div className="w-6 h-0.5 bg-gray-400 my-1" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-72 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeReport.donutData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0091FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Chart Legend List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full px-6 pt-4 border-t border-gray-200 text-xs">
                {activeReport.donutData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 rounded hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                      <span className="font-semibold text-gray-800">{d.name}</span>
                    </div>
                    <span className="font-mono text-gray-600 font-bold">{d.displayVal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Summary Table matching Shopify Screenshot */}
            <div className="border border-[#e1e3e5] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-[#1a1a1a]">
                <thead className="bg-[#f6f6f7] text-[11px] uppercase font-bold text-[#6d7175] border-b border-[#e1e3e5]">
                  <tr>
                    <th className="py-3 px-4">Billing country</th>
                    <th className="py-3 px-4">Orders</th>
                    <th className="py-3 px-4">Sales reversals</th>
                    <th className="py-3 px-4">Net sales</th>
                    <th className="py-3 px-4">Shipping charges</th>
                    <th className="py-3 px-4">Taxes</th>
                    <th className="py-3 px-4 text-right">Total sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5]">
                  {activeReport.tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 font-medium">
                      <td className="py-3 px-4 font-bold text-gray-900">{row.country}</td>
                      <td className="py-3 px-4 font-bold">{row.orders}</td>
                      <td className="py-3 px-4 text-amber-700">{row.reversals}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{row.netSales}</td>
                      <td className="py-3 px-4 text-gray-600">{row.shipping}</td>
                      <td className="py-3 px-4 text-gray-600">{row.taxes}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">{row.totalSales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right Control Sidebar matching Shopify Screenshot */}
          <div className="w-full lg:w-80 bg-[#f6f6f7] p-5 border-t lg:border-t-0 border-[#e1e3e5] space-y-6">
            
            {/* Sidebar Tabs */}
            <div className="flex bg-white rounded-lg p-1 border border-[#e1e3e5]">
              <button 
                onClick={() => setActiveTab("Freeform")}
                className={`flex-1 py-1.5 text-xs font-bold rounded ${
                  activeTab === "Freeform" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                Freeform
              </button>
              <button 
                onClick={() => setActiveTab("Cohorts")}
                className={`flex-1 py-1.5 text-xs font-bold rounded ${
                  activeTab === "Cohorts" ? "bg-[#1a1a1a] text-white shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                Cohorts
              </button>
            </div>

            {/* Metrics Controls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Metrics</span>
                <button className="p-1 hover:bg-gray-200 rounded"><Plus className="w-4 h-4 text-gray-600" /></button>
              </div>

              <div className="bg-white rounded-lg border border-[#e1e3e5] divide-y divide-gray-100 text-xs font-medium">
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer">
                  <span>Orders</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer">
                  <span>Gross sales</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer">
                  <span>Discounts</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer">
                  <span>Sales reversals</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer">
                  <span>Net sales</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
                <label className="flex items-center justify-between p-2.5 hover:bg-gray-50 cursor-pointer font-bold text-black bg-gray-50">
                  <span>✓ Total sales</span>
                  <input type="checkbox" defaultChecked className="rounded text-black" />
                </label>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Dimensions</span>
                <button className="p-1 hover:bg-gray-200 rounded"><Plus className="w-4 h-4 text-gray-600" /></button>
              </div>
              <div className="bg-white rounded-lg border border-[#e1e3e5] p-2.5 text-xs font-semibold text-gray-900">
                Billing country
              </div>
            </div>

            {/* Visualization Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Visualization</span>
              <select 
                value={vizType}
                onChange={(e) => setVizType(e.target.value as any)}
                className="w-full bg-white border border-[#e1e3e5] rounded-lg p-2.5 text-xs font-semibold text-gray-900 focus:outline-none"
              >
                <option value="Donut">🍩 Donut Chart</option>
                <option value="Bar">📊 Bar Chart</option>
                <option value="Line">📈 Line Chart</option>
              </select>
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Filters</span>
                <button className="p-1 hover:bg-gray-200 rounded"><Plus className="w-4 h-4 text-gray-600" /></button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reports Catalog Table */}
      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <div className="p-4 bg-[#f6f6f7] border-b border-[#e1e3e5] flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">All Reports Directory</h3>
          <span className="text-xs text-gray-500">{filteredReports.length} reports available</span>
        </div>
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-white text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Last Viewed</th>
              <th className="py-3 px-4">Created By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {filteredReports.map(r => (
              <tr 
                key={r.id}
                onClick={() => setActiveReport(r)}
                className="hover:bg-[#fafafa] cursor-pointer"
              >
                <td className="py-3 px-4 font-bold text-[#1a1a1a]">{r.name}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    {r.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-500">{r.lastViewed}</td>
                <td className="py-3 px-4 text-xs font-semibold text-gray-500">{r.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
