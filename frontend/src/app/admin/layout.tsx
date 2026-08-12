"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, 
  BarChart, FolderTree, Store, BarChart3, Tag, Factory, Search, Bell,
  ChevronDown, ChevronRight, Inbox, Mail, HelpCircle, Shield, Globe, Monitor
} from "lucide-react"
import { useAuthStore } from "@/store/authStore"

type SubItem = { name: string; href: string }
type NavItem = { name: string; href: string; icon: any; subItems?: SubItem[] }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
  
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else if (user && !user.is_staff) {
      router.push("/account")
    }
  }, [isAuthenticated, user, router])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({ ...prev, [name]: !prev[name] }))
  }

  if (!isAuthenticated) return null; // Prevent flicker

  const navItems: NavItem[] = [
    { name: "Home", href: "/admin", icon: LayoutDashboard },
    { 
      name: "Orders", href: "/admin/orders", icon: ShoppingCart,
      subItems: [
        { name: "Drafts", href: "/admin/orders/drafts" },
        { name: "Abandoned Checkouts", href: "/admin/orders/abandoned" },
      ]
    },
    { 
      name: "Products", href: "/admin/products", icon: Package,
      subItems: [
        { name: "Collections", href: "/admin/products/collections" },
        { name: "Inventory", href: "/admin/products/inventory" },
        { name: "Purchase Orders", href: "/admin/products/purchase-orders" },
        { name: "Transfers", href: "/admin/products/transfers" },
        { name: "Gift Cards", href: "/admin/products/gift-cards" },
      ]
    },
    { 
      name: "Customers", href: "/admin/customers", icon: Users,
      subItems: [
        { name: "Segments", href: "/admin/customers/segments" }
      ]
    },
    { 
      name: "Content", href: "/admin/content", icon: FolderTree,
      subItems: [
        { name: "Metaobjects", href: "/admin/content/metaobjects" },
        { name: "Files", href: "/admin/content/files" },
      ]
    },
    { 
      name: "Analytics", href: "/admin/analytics", icon: BarChart3,
      subItems: [
        { name: "Reports", href: "/admin/analytics/reports" },
        { name: "Live View", href: "/admin/analytics/live-view" },
      ]
    },
    { 
      name: "Marketing", href: "/admin/marketing", icon: Mail,
      subItems: [
        { name: "Campaigns", href: "/admin/marketing/campaigns" },
        { name: "Automations", href: "/admin/marketing/automations" },
      ]
    },
    { name: "Discounts", href: "/admin/discounts", icon: Tag },
    { 
      name: "Sales Channels", href: "/admin/sales-channels", icon: Store,
      subItems: [
        { name: "Online Store", href: "/admin/cms" },
        { name: "Point of Sale", href: "/admin/sales-channels/pos" },
        { name: "B2B", href: "/admin/sales-channels/b2b" },
      ]
    },
    { name: "Suppliers", href: "/admin/suppliers", icon: Factory },
    { 
      name: "Settings", href: "/admin/settings", icon: Settings,
      subItems: [
        { name: "Taxes", href: "/admin/settings/taxes" },
        { name: "Shipping", href: "/admin/settings/shipping" },
        { name: "Users & Permissions", href: "/admin/settings/users" },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-[#f6f6f7] flex text-gray-900 font-sans">
      
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-[100] p-2 bg-white rounded-md shadow-sm border border-gray-200 text-gray-700"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-[90] w-[240px] bg-[#efeef1] border-r border-[#e1e3e5] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 custom-scrollbar">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-6 px-2 mt-2 shrink-0">
              <Link href="/admin" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <span className="bg-black text-white px-2 py-1 rounded text-sm">A</span> Aura Admin
              </Link>
              <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href)))
                const isExpanded = expandedMenus[item.name] || isActive

                return (
                  <div key={item.name}>
                    <div className={`flex items-center justify-between rounded-md transition-colors ${isActive ? 'bg-[#ebebeb]' : 'hover:bg-[#e4e5e7]'}`}>
                      <Link 
                        href={item.href}
                        className={`flex-1 flex items-center gap-3 px-3 py-1.5 text-[14px] ${isActive ? 'text-black font-semibold' : 'text-[#4a4a4a] font-medium hover:text-black'}`}
                      >
                        <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-black' : 'text-[#6d7175]'}`} />
                        {item.name}
                      </Link>
                      
                      {item.subItems && (
                        <button 
                          onClick={() => toggleMenu(item.name)}
                          className="p-2 text-gray-500 hover:text-black hover:bg-[#d4d5d8] rounded-md mr-1"
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {item.subItems && isExpanded && (
                      <div className="ml-9 mt-0.5 mb-1 space-y-0.5 border-l-2 border-[#e1e3e5] pl-2">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-3 py-1.5 rounded-md text-[13px] ${isSubActive ? 'bg-[#ebebeb] text-black font-semibold' : 'text-[#6d7175] font-medium hover:bg-[#e4e5e7] hover:text-black'}`}
                            >
                              {sub.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 bg-[#efeef1] border-t border-[#e1e3e5] absolute bottom-0 left-0 w-full z-10 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-[14px] font-medium text-[#4a4a4a] hover:text-black hover:bg-[#e4e5e7] rounded-md transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] text-[#6d7175]" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        
        {/* Top Bar */}
        <header className="h-[56px] bg-[#1a1a1a] flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#303030] border border-[#424242] text-white text-[14px] rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block border border-[#525252] bg-[#424242] rounded px-1.5 text-[10px] text-gray-300 font-sans">⌘</kbd>
                <kbd className="hidden sm:inline-block border border-[#525252] bg-[#424242] rounded px-1.5 text-[10px] text-gray-300 font-sans">K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="text-gray-300 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#1a1a1a]"></span>
            </button>
            <div className="w-8 h-8 bg-[#303030] rounded-full border border-[#424242] flex items-center justify-center text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-[#424242] transition-colors">
              {user?.first_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  )
}
