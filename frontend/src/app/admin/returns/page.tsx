"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchReturns, updateReturnStatus, createReturnRequest } from "@/lib/api"
import { 
  RotateCcw, DollarSign, CheckCircle2, XCircle, Clock, 
  Search, Filter, Plus, ArrowUpRight, ShieldAlert, PackageCheck 
} from "lucide-react"

export default function AdminReturnsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedReturn, setSelectedReturn] = useState<any>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // New Return Form State
  const [orderId, setOrderId] = useState("")
  const [reason, setReason] = useState("defective")
  const [explanation, setExplanation] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [restockInventory, setRestockInventory] = useState(true)

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ['admin-returns'],
    queryFn: fetchReturns,
    refetchInterval: 15000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateReturnStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-returns'] })
      setSelectedReturn(null)
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createReturnRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-returns'] })
      setIsCreateOpen(false)
      setOrderId("")
      setExplanation("")
      setRefundAmount("")
    }
  })

  const filteredReturns = returns.filter((r: any) => {
    const matchesSearch = 
      r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.order_id?.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRefunded = returns
    .filter((r: any) => r.status === 'refunded' || r.status === 'approved')
    .reduce((sum: number, r: any) => sum + parseFloat(r.refund_amount || 0), 0)

  const pendingCount = returns.filter((r: any) => r.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Returns & Refunds</h1>
          <p className="text-sm text-[#6d7175]">Manage return requests, approval workflows, and inventory restocking</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Issue Return
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total Returns</p>
            <RotateCcw className="w-5 h-5 text-[#6d7175]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{returns.length}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Pending Review</p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Approved / Processed</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">
            {returns.filter((r: any) => r.status === 'approved' || r.status === 'refunded').length}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total Refunded</p>
            <DollarSign className="w-5 h-5 text-[#0e6245]" />
          </div>
          <h3 className="text-2xl font-bold text-[#0e6245] mt-2">${totalRefunded.toFixed(2)}</h3>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#e1e3e5] shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-[#6d7175]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#c9cccf] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-black bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="refunded">Refunded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[#6d7175] text-sm">Loading return requests...</div>
        ) : filteredReturns.length === 0 ? (
          <div className="p-12 text-center text-[#6d7175]">
            <RotateCcw className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-base text-[#1a1a1a]">No return requests found</p>
            <p className="text-sm text-[#6d7175] mt-1">Return requests submitted by customers or admins will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1a1a1a]">
              <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
                <tr>
                  <th className="py-3.5 px-4">Return ID</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Refund Amount</th>
                  <th className="py-3.5 px-4">Restock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {filteredReturns.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1a1a1a]">RET-{item.id}</td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-700">ORD-#{item.order_id || item.order}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1a1a1a]">{item.customer_name || 'Guest'}</p>
                      <p className="text-xs text-[#6d7175]">{item.customer_email}</p>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#4a4a4a]">
                      {item.reason?.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1a1a1a]">
                      ${parseFloat(item.refund_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.restock_inventory ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <PackageCheck className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReturn(item)}
                        className="text-xs font-semibold text-black hover:underline bg-[#f1f2f3] hover:bg-[#e4e5e7] px-3 py-1.5 rounded transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage Return Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-[#e1e3e5] shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#e1e3e5] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">Manage Return RET-{selectedReturn.id}</h3>
                <p className="text-xs text-[#6d7175]">Order ORD-#{selectedReturn.order_id || selectedReturn.order}</p>
              </div>
              <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-xs text-[#6d7175]">
                <span>Customer: <strong className="text-[#1a1a1a]">{selectedReturn.customer_name}</strong></span>
                <span>Email: <strong className="text-[#1a1a1a]">{selectedReturn.customer_email}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Reason & Notes</label>
                <div className="p-3 bg-[#f6f6f7] rounded-lg border border-[#e1e3e5] text-xs space-y-1">
                  <p><strong>Reason:</strong> {selectedReturn.reason}</p>
                  {selectedReturn.explanation && <p><strong>Explanation:</strong> {selectedReturn.explanation}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Refund Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={selectedReturn.refund_amount}
                  id="modal-refund-amount"
                  className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-restock"
                  defaultChecked={selectedReturn.restock_inventory}
                  className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="modal-restock" className="text-xs font-medium text-[#1a1a1a]">
                  Restock product inventory on approval/refund
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end border-t border-[#e1e3e5] pt-4">
              <button
                onClick={() => {
                  const amt = (document.getElementById('modal-refund-amount') as HTMLInputElement).value
                  const rst = (document.getElementById('modal-restock') as HTMLInputElement).checked
                  updateMutation.mutate({ id: selectedReturn.id, data: { status: 'rejected', refund_amount: amt, restock_inventory: rst } })
                }}
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors border border-red-200"
              >
                Reject Request
              </button>

              <button
                onClick={() => {
                  const amt = (document.getElementById('modal-refund-amount') as HTMLInputElement).value
                  const rst = (document.getElementById('modal-restock') as HTMLInputElement).checked
                  updateMutation.mutate({ id: selectedReturn.id, data: { status: 'approved', refund_amount: amt, restock_inventory: rst } })
                }}
                className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Approve Return
              </button>

              <button
                onClick={() => {
                  const amt = (document.getElementById('modal-refund-amount') as HTMLInputElement).value
                  const rst = (document.getElementById('modal-restock') as HTMLInputElement).checked
                  updateMutation.mutate({ id: selectedReturn.id, data: { status: 'refunded', refund_amount: amt, restock_inventory: rst } })
                }}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Return Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate({
                order: parseInt(orderId),
                reason,
                explanation,
                refund_amount: parseFloat(refundAmount || '0'),
                restock_inventory: restockInventory,
                status: 'pending'
              })
            }}
            className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#e1e3e5] pb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Issue New Return</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Order ID</label>
              <input
                type="number"
                required
                placeholder="e.g. 1"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
              >
                <option value="defective">Defective / Damaged</option>
                <option value="wrong_item">Wrong Item Received</option>
                <option value="not_as_described">Item Not as Described</option>
                <option value="changed_mind">Changed Mind</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Refund Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Explanation / Notes</label>
              <textarea
                rows={3}
                placeholder="Describe reason for return..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-restock"
                checked={restockInventory}
                onChange={(e) => setRestockInventory(e.target.checked)}
                className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
              />
              <label htmlFor="create-restock" className="text-xs font-medium text-[#1a1a1a]">
                Restock inventory automatically on approval
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#e1e3e5] pt-4">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Submit Return
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
