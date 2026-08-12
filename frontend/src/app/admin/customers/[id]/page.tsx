"use client"

import React, { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { ChevronLeft, Mail, MapPin, Package, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCustomer()
  }, [])

  const fetchCustomer = async () => {
    try {
      // In a real app, you'd fetch the specific user details and their orders
      // For now we assume the list endpoint can be filtered or we fetch all and find
      const data = await apiFetch('/authentication/admin-users/')
      const user = (data.results || data).find((c: any) => c.id.toString() === params.id)
      
      // Let's also fetch orders for this user, assume there's an admin endpoint
      // We will mock orders for now since we don't have a direct user-order endpoint built yet
      setCustomer({
        ...user,
        orders: [
          { id: 1045, date: new Date().toISOString(), total: 450, status: 'paid', items: 2 },
          { id: 1022, date: new Date(Date.now() - 86400000 * 5).toISOString(), total: 1200, status: 'fulfilled', items: 1 }
        ]
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-gray-500">Loading customer profile...</div>
  if (!customer) return <div className="p-12 text-center text-red-500">Customer not found.</div>

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">{customer.username}</h1>
          <p className="text-sm text-gray-500">Customer since {new Date(customer.date_joined).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Last Order / Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Recent Orders
            </h2>
            
            {customer.orders && customer.orders.length > 0 ? (
              <div className="space-y-4">
                {customer.orders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                        #ORD-{order.id}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.date).toLocaleDateString()} • {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">This customer hasn't placed any orders yet.</p>
            )}
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Customer Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Overview</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Lifetime Amount Spent</p>
                <p className="text-xl font-bold text-gray-900">${parseFloat(customer.lifetime_spend || '0').toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{customer.total_orders || 0} orders</p>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Rewards Points</p>
                <p className="text-sm font-medium text-gray-900">{customer.rewards_points || 0} pts</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900">Contact Information</h2>
              <button className="text-blue-600 text-xs font-medium hover:underline">Edit</button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{customer.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Default Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-900">Default Address</h2>
              <button className="text-blue-600 text-xs font-medium hover:underline">Manage</button>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{customer.username}</p>
                <p>123 Commerce St.</p>
                <p>Suite 100</p>
                <p>New York, NY 10012</p>
                <p>United States</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
