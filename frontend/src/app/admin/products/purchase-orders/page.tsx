"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, fetchInventoryMovements } from "@/lib/api"
import { 
  FileText, Plus, Search, Truck, CheckCircle2, Clock, 
  DollarSign, PackageCheck, History, ArrowDownUp 
} from "lucide-react"

export default function AdminPurchaseOrdersPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"orders" | "movements">("orders")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // PO Form State
  const [supplierId, setSupplierId] = useState("1")
  const [expectedDelivery, setExpectedDelivery] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [totalCost, setTotalCost] = useState("")
  const [notes, setNotes] = useState("")

  const { data: purchaseOrders = [], isLoading: isLoadingPO } = useQuery({
    queryKey: ['admin-purchase-orders'],
    queryFn: fetchPurchaseOrders,
  })

  const { data: movements = [], isLoading: isLoadingMovements } = useQuery({
    queryKey: ['admin-movements'],
    queryFn: fetchInventoryMovements,
  })

  const createPOMutation = useMutation({
    mutationFn: (data: any) => createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-purchase-orders'] })
      setIsModalOpen(false)
      setNotes("")
      setTotalCost("")
    }
  })

  const updatePOMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-movements'] })
    }
  })

  const openPOCount = purchaseOrders.filter((p: any) => p.status === 'draft' || p.status === 'sent').length
  const receivedPOCount = purchaseOrders.filter((p: any) => p.status === 'received').length
  const totalSpend = purchaseOrders
    .filter((p: any) => p.status === 'received' || p.status === 'sent')
    .reduce((sum: number, p: any) => sum + parseFloat(p.total_cost || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Purchase Orders & Stock Movements</h1>
          <p className="text-sm text-[#6d7175]">Create supplier purchase orders, receive inventory, and audit stock history</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Purchase Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Open Purchase Orders</p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{openPOCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Received & Stocked</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{receivedPOCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total PO Volume</p>
            <DollarSign className="w-5 h-5 text-[#0e6245]" />
          </div>
          <h3 className="text-2xl font-bold text-[#0e6245] mt-2">${totalSpend.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Stock Movements</p>
            <History className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">{movements.length}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e1e3e5] gap-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "orders" ? "border-black text-black" : "border-transparent text-[#6d7175] hover:text-black"
          }`}
        >
          <FileText className="w-4 h-4" /> Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "movements" ? "border-black text-black" : "border-transparent text-[#6d7175] hover:text-black"
          }`}
        >
          <ArrowDownUp className="w-4 h-4" /> Inventory Audit Log
        </button>
      </div>

      {/* Content */}
      {activeTab === "orders" ? (
        <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
          {isLoadingPO ? (
            <div className="p-12 text-center text-[#6d7175] text-sm">Loading purchase orders...</div>
          ) : purchaseOrders.length === 0 ? (
            <div className="p-12 text-center text-[#6d7175]">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-base text-[#1a1a1a]">No purchase orders yet</p>
              <p className="text-sm text-[#6d7175] mt-1">Issue purchase orders to suppliers to track replenishment and restock inventory.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1a1a1a]">
                <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
                  <tr>
                    <th className="py-3.5 px-4">PO Number</th>
                    <th className="py-3.5 px-4">Supplier</th>
                    <th className="py-3.5 px-4">Total Cost</th>
                    <th className="py-3.5 px-4">Expected Delivery</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5]">
                  {purchaseOrders.map((po: any) => (
                    <tr key={po.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#1a1a1a]">PO-#{po.id}</td>
                      <td className="py-3.5 px-4 font-medium text-[#1a1a1a]">{po.supplier_details?.name || `Supplier #${po.supplier}`}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#1a1a1a]">${parseFloat(po.total_cost || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6d7175]">{po.expected_delivery || 'Not set'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          po.status === 'received' ? 'bg-emerald-100 text-emerald-800' :
                          po.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          po.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {po.status !== 'received' && (
                          <button
                            onClick={() => updatePOMutation.mutate({ id: po.id, data: { status: 'received' } })}
                            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                          >
                            <PackageCheck className="w-3.5 h-3.5" /> Receive Inventory
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
          {isLoadingMovements ? (
            <div className="p-12 text-center text-[#6d7175] text-sm">Loading stock movements...</div>
          ) : movements.length === 0 ? (
            <div className="p-12 text-center text-[#6d7175]">
              <History className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-base text-[#1a1a1a]">No stock movements logged yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1a1a1a]">
                <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
                  <tr>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Variant / Product</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Reference</th>
                    <th className="py-3.5 px-4">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5]">
                  {movements.map((m: any) => (
                    <tr key={m.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="py-3.5 px-4 text-xs text-[#6d7175]">{new Date(m.created_at).toLocaleString()}</td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          m.movement_type === 'purchase' ? 'bg-emerald-100 text-emerald-800' :
                          m.movement_type === 'sale' ? 'bg-blue-100 text-blue-800' :
                          m.movement_type === 'return' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {m.movement_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{m.variant_name || `Variant #${m.variant}`}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-600">{m.reference || '—'}</td>
                      <td className="py-3.5 px-4 text-xs text-[#6d7175]">{m.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create PO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createPOMutation.mutate({
                supplier: parseInt(supplierId),
                expected_delivery: expectedDelivery || null,
                tracking_number: trackingNumber,
                total_cost: parseFloat(totalCost || '0'),
                notes,
                status: 'sent'
              })
            }}
            className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#e1e3e5] pb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Issue Purchase Order</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Supplier ID</label>
              <input
                type="number"
                required
                placeholder="1"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Total Cost ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="500.00"
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. TRACK-99812"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Notes / Terms</label>
              <textarea
                rows={3}
                placeholder="Additional instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[#e1e3e5] pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Issue Purchase Order
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
