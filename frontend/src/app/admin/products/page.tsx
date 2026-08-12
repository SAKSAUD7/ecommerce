"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await apiFetch('/products/admin-items/')
      setProducts(data.results || data)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await apiFetch(`/products/admin-items/${id}/`, { method: "DELETE" })
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert("Failed to delete product")
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">Products</h1>
          <p className="text-[#6d7175] text-[13px] mt-1">Manage your store's inventory and categories.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-md font-medium text-[13px] hover:bg-[#303030] transition flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#e1e3e5] overflow-hidden">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#f6f6f7] border-b border-[#e1e3e5] text-[#6d7175]">
            <tr>
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold text-right">Price</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e3e5]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#6d7175]">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#6d7175]">No products found. Create one!</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-[#f6f6f7] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#f1f2f3] border border-[#e1e3e5] rounded overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0].image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full bg-[#f1f2f3]" />
                        )}
                      </div>
                      <div className="font-semibold text-[#1a1a1a]">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#6d7175]">
                    {product.category?.name || "None"}
                  </td>
                  <td className="px-5 py-3 text-[#1a1a1a] font-medium text-right">
                    ${product.base_price}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium ${product.is_active ? 'bg-[#e3f1df] text-[#0e6245]' : 'bg-[#f1f2f3] text-[#6d7175]'}`}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-[#6d7175] hover:text-[#1a1a1a] mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-[#6d7175] hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
