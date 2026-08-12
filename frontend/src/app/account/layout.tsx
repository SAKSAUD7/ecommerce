"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { User, ShoppingBag, MapPin, CreditCard, Bell, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!isAuthenticated) return null; // Prevent flicker

  const navItems = [
    { name: "Profile", href: "/account", icon: User },
    { name: "Orders", href: "/account/orders", icon: ShoppingBag },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Payment Methods", href: "/account/payments", icon: CreditCard },
    { name: "Notifications", href: "/account/notifications", icon: Bell },
  ]

  return (
    <div className="min-h-screen bg-transparent flex flex-col text-black">
      <SpatialNav />
      
      <div className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-black mb-2">My Account</h1>
          <p className="text-black/50 text-xs tracking-widest uppercase mb-10 font-bold">Welcome back, John</p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-md transition-all text-xs tracking-widest uppercase font-bold ${isActive ? 'bg-black text-white' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 w-full mt-8 text-xs tracking-widest uppercase text-black/50 hover:text-black hover:bg-black/5 rounded-md transition-all text-left font-bold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

      </div>
      
      <LuxuryFooter />
    </div>
  )
}
