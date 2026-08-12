"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAdminCollections, createAdminCollection, deleteAdminCollection } from "@/lib/api"
import { 
  FolderTree, Plus, Search, Trash2, Edit, Sparkles, Layers, CheckCircle2, XCircle
} from "lucide-react"

export default function AdminCollectionsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [collectionType, setCollectionType] = useState<"manual" | "smart">("manual")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: fetchAdminCollections,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createAdminCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] })
      setIsModalOpen(false)
      resetForm()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdminCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] })
    }
  })

  const resetForm = () => {
    setName("")
    setDescription("")
    setImageUrl("")
    setCollectionType("manual")
    setMinPrice("")
    setMaxPrice("")
  }

  const filteredCollections = collections.filter((c: any) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const smartCount = collections.filter((c: any) => c.collection_type === 'smart').length
  const manualCount = collections.filter((c: any) => c.collection_type === 'manual').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">Collections</h1>
          <p className="text-sm text-[#6d7175]">Group products manually or automatically using smart rule engines</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Collection
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Total Collections</p>
            <FolderTree className="w-5 h-5 text-[#6d7175]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">{collections.length}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Smart Collections</p>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">{smartCount}</h3>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#e1e3e5] shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6d7175] uppercase tracking-wider">Manual Collections</p>
            <Layers className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{manualCount}</h3>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-[#e1e3e5] shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[#6d7175] text-sm">Loading collections...</div>
        ) : filteredCollections.length === 0 ? (
          <div className="p-12 text-center text-[#6d7175]">
            <FolderTree className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-base text-[#1a1a1a]">No collections found</p>
            <p className="text-sm text-[#6d7175] mt-1">Create your first manual or automated collection to organize catalog items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#1a1a1a]">
              <thead className="bg-[#f6f6f7] text-xs uppercase font-semibold text-[#6d7175] border-b border-[#e1e3e5]">
                <tr>
                  <th className="py-3.5 px-4">Collection</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {filteredCollections.map((col: any) => (
                  <tr key={col.id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {col.image_url ? (
                          <img src={col.image_url} alt={col.name} className="w-9 h-9 rounded object-cover border border-gray-200" />
                        ) : (
                          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                            <FolderTree className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#1a1a1a]">{col.name}</p>
                          {col.description && <p className="text-xs text-[#6d7175] line-clamp-1">{col.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600">/{col.slug}</td>
                    <td className="py-3.5 px-4">
                      {col.collection_type === 'smart' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          <Sparkles className="w-3 h-3" /> Smart
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          <Layers className="w-3 h-3" /> Manual
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1a1a1a]">
                      {col.products_count ?? 0} items
                    </td>
                    <td className="py-3.5 px-4">
                      {col.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <XCircle className="w-4 h-4" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete collection "${col.name}"?`)) {
                            deleteMutation.mutate(col.id)
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const rulesPayload: any = {}
              if (collectionType === 'smart') {
                if (minPrice) rulesPayload.min_price = parseFloat(minPrice)
                if (maxPrice) rulesPayload.max_price = parseFloat(maxPrice)
              }
              createMutation.mutate({
                name,
                description,
                image_url: imageUrl,
                collection_type: collectionType,
                rules: rulesPayload,
                is_active: true
              })
            }}
            className="bg-white rounded-xl max-w-md w-full p-6 border border-[#e1e3e5] shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-[#e1e3e5] pb-3">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Create Collection</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Collection Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Essentials"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCollectionType('manual')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    collectionType === 'manual' 
                      ? 'border-black bg-black text-white' 
                      : 'border-[#c9cccf] bg-white text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Manual
                </button>
                <button
                  type="button"
                  onClick={() => setCollectionType('smart')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    collectionType === 'smart' 
                      ? 'border-indigo-600 bg-indigo-600 text-white' 
                      : 'border-[#c9cccf] bg-white text-[#1a1a1a] hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Smart (Automated)
                </button>
              </div>
            </div>

            {collectionType === 'smart' && (
              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 space-y-3">
                <p className="text-xs font-bold text-indigo-900 uppercase">Smart Rule Filters</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-indigo-800 font-medium mb-1">Min Price ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-indigo-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-indigo-800 font-medium mb-1">Max Price ($)</label>
                    <input
                      type="number"
                      placeholder="999.00"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-indigo-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6d7175] uppercase mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Brief description of the collection..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
