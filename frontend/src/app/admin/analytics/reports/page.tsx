"use client"

import { useState } from "react"
import { 
  BarChart3, Search, Filter, Download, ArrowUpRight, ArrowDownRight, 
  Calendar, FileText, Sparkles, X, ChevronLeft, ChevronRight, RefreshCw 
} from "lucide-react"
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts"

interface ReportItem {
  id: string
  name: string
  category: "Acquisition" | "Behavior" | "Customers" | "Finances" | "Inventory" | "Orders" | "Sales"
  created: "Shopify" | "DE'NOURA OS"
  lastViewed: string
  metricValue: string
  trend: string
  chartData: { name: string; value: number }[]
  tableData: { label: string; count: number; total: string; percent: string }[]
}

const MASTER_REPORTS_REGISTRY: ReportItem[] = [
  // Acquisition
  {
    id: "acq-1",
    name: "Sessions by referrer",
    category: "Acquisition",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "42,850 Sessions",
    trend: "+18.4%",
    chartData: [
      { name: "Instagram", value: 18400 },
      { name: "Direct", value: 12200 },
      { name: "Google Organic", value: 8100 },
      { name: "TikTok", value: 4150 }
    ],
    tableData: [
      { label: "Instagram (@Denoura.co)", count: 18400, total: "$68,400.00", percent: "42.9%" },
      { label: "Direct (Denoura.co)", count: 12200, total: "$45,100.00", percent: "28.5%" },
      { label: "Google Search", count: 8100, total: "$28,900.00", percent: "18.9%" },
      { label: "TikTok (@Denoura.co)", count: 4150, total: "$15,200.00", percent: "9.7%" }
    ]
  },
  {
    id: "acq-2",
    name: "Total sales by billing location",
    category: "Sales",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "$157,600.00",
    trend: "+24.2%",
    chartData: [
      { name: "United Kingdom", value: 68500 },
      { name: "United States", value: 42100 },
      { name: "UAE & GCC", value: 32000 },
      { name: "France & EU", value: 15000 }
    ],
    tableData: [
      { label: "United Kingdom (Denoura.co.uk)", count: 320, total: "£54,800.00", percent: "43.4%" },
      { label: "United States", count: 180, total: "$42,100.00", percent: "26.7%" },
      { label: "United Arab Emirates & GCC", count: 110, total: "$32,000.00", percent: "20.3%" },
      { label: "France (Paris Atelier)", count: 65, total: "€13,800.00", percent: "9.6%" }
    ]
  },
  {
    id: "acq-3",
    name: "Sessions by location",
    category: "Acquisition",
    created: "Shopify",
    lastViewed: "Aug 12, 2026",
    metricValue: "64,200 Visitors",
    trend: "+12.1%",
    chartData: [
      { name: "London", value: 22000 },
      { name: "Dubai", value: 15400 },
      { name: "New York", value: 14800 },
      { name: "Paris", value: 12000 }
    ],
    tableData: [
      { label: "London, UK", count: 22000, total: "$82,000.00", percent: "34.2%" },
      { label: "Dubai, UAE", count: 15400, total: "$54,100.00", percent: "24.0%" },
      { label: "New York, USA", count: 14800, total: "$48,900.00", percent: "23.0%" },
      { label: "Paris, France", count: 12000, total: "$38,400.00", percent: "18.8%" }
    ]
  },

  // Behavior
  {
    id: "beh-1",
    name: "Checkout conversion rate over time",
    category: "Behavior",
    created: "Shopify",
    lastViewed: "Aug 12, 2026",
    metricValue: "3.84% Conversion",
    trend: "+0.45%",
    chartData: [
      { name: "Mon", value: 3.2 },
      { name: "Tue", value: 3.5 },
      { name: "Wed", value: 3.9 },
      { name: "Thu", value: 4.1 },
      { name: "Fri", value: 4.4 },
      { name: "Sat", value: 4.2 },
      { name: "Sun", value: 3.8 }
    ],
    tableData: [
      { label: "Storefront Sessions", count: 42850, total: "100%", percent: "100%" },
      { label: "Added to Cart", count: 6420, total: "14.9%", percent: "14.9%" },
      { label: "Reached Checkout", count: 2850, total: "6.6%", percent: "6.6%" },
      { label: "Completed Purchase", count: 1645, total: "3.84%", percent: "3.84%" }
    ]
  },
  {
    id: "beh-2",
    name: "Conversion rate breakdown",
    category: "Behavior",
    created: "Shopify",
    lastViewed: "Aug 11, 2026",
    metricValue: "3.84%",
    trend: "+0.2%",
    chartData: [
      { name: "Desktop", value: 4.8 },
      { name: "Mobile App", value: 3.6 },
      { name: "Mobile Web", value: 3.1 }
    ],
    tableData: [
      { label: "Desktop Web", count: 18400, total: "4.8% CR", percent: "43.0%" },
      { label: "Mobile Browser", count: 21200, total: "3.1% CR", percent: "49.4%" },
      { label: "DE'NOURA Mobile App", count: 3250, total: "5.4% CR", percent: "7.6%" }
    ]
  },

  // Customers
  {
    id: "cust-1",
    name: "Customer cohort analysis",
    category: "Customers",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "$1,280 LTV",
    trend: "+15.2%",
    chartData: [
      { name: "Month 1", value: 380 },
      { name: "Month 3", value: 640 },
      { name: "Month 6", value: 920 },
      { name: "Month 12", value: 1280 }
    ],
    tableData: [
      { label: "Q1 2026 Cohort (140 Clients)", count: 140, total: "$179,200.00", percent: "38.5%" },
      { label: "Q2 2026 Cohort (210 Clients)", count: 210, total: "$241,500.00", percent: "51.8%" },
      { label: "Q3 2026 Cohort (95 Clients)", count: 95, total: "$104,500.00", percent: "22.4%" }
    ]
  },
  {
    id: "cust-2",
    name: "RFM customer analysis",
    category: "Customers",
    created: "DE'NOURA OS",
    lastViewed: "Aug 10, 2026",
    metricValue: "48 Champions",
    trend: "+6 New",
    chartData: [
      { name: "Champions", value: 48 },
      { name: "Loyal Buyers", value: 142 },
      { name: "Recent Buyers", value: 310 },
      { name: "At Risk", value: 89 }
    ],
    tableData: [
      { label: "Champions (Recency 5, Freq 5, Mon 5)", count: 48, total: "$144,000.00", percent: "32.0%" },
      { label: "Loyal Customers (Freq >= 3)", count: 142, total: "$198,800.00", percent: "44.1%" },
      { label: "First-Time Customers", count: 310, total: "$108,500.00", percent: "24.1%" }
    ]
  },

  // Finances
  {
    id: "fin-1",
    name: "Cost of goods sold by order (COGS)",
    category: "Finances",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "$54,200.00 COGS",
    trend: "-3.1%",
    chartData: [
      { name: "Silk Fabrics", value: 24000 },
      { name: "Velvet & Embroidery", value: 18200 },
      { name: "Artisan Tailoring", value: 8000 },
      { name: "Luxury Packaging", value: 4000 }
    ],
    tableData: [
      { label: "Raw Silk & Fabrics (Italian import)", count: 450, total: "$24,000.00", percent: "44.2%" },
      { label: "Custom Embroidery & Beadwork", count: 320, total: "$18,200.00", percent: "33.5%" },
      { label: "Master Tailor Sewing & Finishing", count: 520, total: "$8,000.00", percent: "14.7%" },
      { label: "Custom Embossed Gift Boxes", count: 520, total: "$4,000.00", percent: "7.4%" }
    ]
  },
  {
    id: "fin-2",
    name: "Gross profit breakdown",
    category: "Finances",
    created: "DE'NOURA OS",
    lastViewed: "Aug 12, 2026",
    metricValue: "$103,400.00 Net Profit",
    trend: "+28.4%",
    chartData: [
      { name: "Gross Sales", value: 157600 },
      { name: "COGS", value: -54200 },
      { name: "Gateway Fees", value: -4200 },
      { name: "Net Profit", value: 99200 }
    ],
    tableData: [
      { label: "Gross Sales Revenue", count: 1645, total: "$157,600.00", percent: "100.0%" },
      { label: "Cost of Goods Sold (COGS)", count: 1645, total: "-$54,200.00", percent: "-34.3%" },
      { label: "Payment Gateway Processing Fees", count: 1645, total: "-$4,200.00", percent: "-2.6%" },
      { label: "Net Operating Profit", count: 1645, total: "$99,200.00", percent: "63.0%" }
    ]
  },

  // Inventory
  {
    id: "inv-1",
    name: "Total ordered",
    category: "Inventory",
    created: "Shopify",
    lastViewed: "Aug 12, 2026",
    metricValue: "2,450 Units",
    trend: "+14.8%",
    chartData: [
      { name: "Abayas", value: 1100 },
      { name: "Hijabs & Scarves", value: 850 },
      { name: "Couture Dresses", value: 320 },
      { name: "Accessories", value: 180 }
    ],
    tableData: [
      { label: "Silk Velvet Abayas", count: 1100, total: "$110,000.00", percent: "44.9%" },
      { label: "Pure Chiffon Hijabs", count: 850, total: "$34,000.00", percent: "34.7%" },
      { label: "Hand-Embroidered Dresses", count: 320, total: "$48,000.00", percent: "13.0%" }
    ]
  },

  // Orders
  {
    id: "ord-1",
    name: "Items reversed by product",
    category: "Orders",
    created: "Shopify",
    lastViewed: "Aug 12, 2026",
    metricValue: "18 Returns",
    trend: "-1.2%",
    chartData: [
      { name: "Royal Blue Abaya", value: 8 },
      { name: "Emerald Satin Dress", value: 6 },
      { name: "Chiffon Hijab Black", value: 4 }
    ],
    tableData: [
      { label: "Royal Blue Velvet Abaya (Size L)", count: 8, total: "$2,400.00", percent: "44.4%" },
      { label: "Emerald Satin Midi Dress", count: 6, total: "$1,800.00", percent: "33.3%" },
      { label: "Chiffon Hijab Black", count: 4, total: "$200.00", percent: "22.2%" }
    ]
  }
]

export default function AdminReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeReport, setActiveReport] = useState<ReportItem | null>(null)
  const [dateFilter, setDateFilter] = useState("Last 30 Days")

  const categories = ["All", "Acquisition", "Behavior", "Customers", "Finances", "Inventory", "Orders", "Sales"]

  const filteredReports = MASTER_REPORTS_REGISTRY.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const exportReport = (reportName: string, format: "CSV" | "PDF") => {
    alert(`Exporting ${reportName} in ${format} format... Download started!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e1e3e5] pb-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Reports &amp; Business Intelligence</h1>
          <p className="text-sm text-[#6d7175]">Shopify 2026 reporting engine for acquisition, financial ledgers, customer cohorts, and sales</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveReport(MASTER_REPORTS_REGISTRY[0])}
            className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            Run New Exploration
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
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

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-[#1a1a1a]">
          <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
            <tr>
              <th className="py-3.5 px-4">Report Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Key Metric</th>
              <th className="py-3.5 px-4">Trend</th>
              <th className="py-3.5 px-4">Created By</th>
              <th className="py-3.5 px-4 text-right">Interactive View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {filteredReports.map(r => (
              <tr 
                key={r.id} 
                onClick={() => setActiveReport(r)}
                className="hover:bg-[#fafafa] cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-4 font-bold text-[#1a1a1a] group-hover:text-indigo-600 transition-colors">
                  {r.name}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    {r.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#1a1a1a]">{r.metricValue}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                    r.trend.startsWith('+') ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {r.trend.startsWith('+') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {r.trend}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-gray-500">{r.created}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveReport(r)
                    }}
                    className="px-3 py-1.5 bg-[#f1f2f3] hover:bg-black hover:text-white text-xs font-semibold rounded transition-colors"
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Live Report Drawer / Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 border border-[#e1e3e5] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#e1e3e5] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeReport.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Created by {activeReport.created}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mt-1">{activeReport.name}</h2>
              </div>
              <button 
                onClick={() => setActiveReport(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#f6f6f7] rounded-xl border border-[#e1e3e5]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6d7175]" />
                <span className="text-xs font-semibold text-[#1a1a1a]">Date Filter:</span>
                <select 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-white border border-[#c9cccf] rounded px-2.5 py-1 text-xs font-medium text-[#1a1a1a] focus:outline-none"
                >
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => exportReport(activeReport.name, "CSV")}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:border-black text-xs font-semibold rounded text-gray-800 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button 
                  onClick={() => exportReport(activeReport.name, "PDF")}
                  className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 text-xs font-semibold rounded transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF Report
                </button>
              </div>
            </div>

            {/* Metric Summary Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0A192F] text-white rounded-xl">
                <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Primary Metric Value</p>
                <h3 className="text-3xl font-bold text-white mt-1">{activeReport.metricValue}</h3>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl">
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Performance Trend</p>
                <h3 className="text-3xl font-bold text-emerald-700 mt-1">{activeReport.trend}</h3>
              </div>
            </div>

            {/* Interactive Recharts Visualization */}
            <div className="bg-white p-5 border border-[#e1e3e5] rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] mb-4">Trend Chart Visualization</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeReport.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e3e5" />
                    <XAxis dataKey="name" tick={{ fill: '#6d7175', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6d7175', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e1e3e5' }} />
                    <Bar dataKey="value" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Data Table */}
            <div className="border border-[#e1e3e5] rounded-xl overflow-hidden">
              <div className="bg-[#f6f6f7] p-3 border-b border-[#e1e3e5]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">Detailed Breakdown</h4>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase border-b">
                  <tr>
                    <th className="py-2.5 px-4">Segment / Dimension</th>
                    <th className="py-2.5 px-4">Volume</th>
                    <th className="py-2.5 px-4">Total Amount</th>
                    <th className="py-2.5 px-4">% Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activeReport.tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2.5 px-4 font-bold text-gray-900">{row.label}</td>
                      <td className="py-2.5 px-4 font-semibold text-gray-700">{row.count}</td>
                      <td className="py-2.5 px-4 font-bold text-emerald-700">{row.total}</td>
                      <td className="py-2.5 px-4 font-mono text-gray-600">{row.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveReport(null)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-lg transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
