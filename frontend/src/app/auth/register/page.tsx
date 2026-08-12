"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { UserPlus, Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to login on successful registration
        router.push("/auth/login")
      } else {
        // Handle DRF validation errors (usually object with arrays of strings)
        const errorMessage = Object.values(data).flat().join(" ")
        setError(errorMessage || "Failed to register. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col text-black">
      <SpatialNav />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white/50 border border-black/10 rounded-2xl p-8 md:p-12 glass-panel shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 text-black">
            <UserPlus className="w-24 h-24" />
          </div>

          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] mb-2 relative z-10 text-black">Create Account</h1>
          <p className="text-xs text-black/50 tracking-widest uppercase mb-10 relative z-10 font-bold">Join the Aura Spatial Experience</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs tracking-widest uppercase mb-6 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 flex items-center gap-2 font-bold">
                  <User className="w-3 h-3" /> First Name
                </label>
                <input 
                  type="text" 
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 flex items-center gap-2 font-bold">
                  Last Name
                </label>
                <input 
                  type="text" 
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 flex items-center gap-2 font-bold">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 flex items-center gap-2 font-bold">
                <Lock className="w-3 h-3" /> Password
              </label>
              <input 
                type="password" 
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-4 mt-4 hover:bg-black/80 transition-colors rounded-md disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-xs text-black/50 tracking-widest uppercase mt-8 relative z-10 font-bold">
            Already have an account? <Link href="/auth/login" className="text-black hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>

      <LuxuryFooter />
    </div>
  )
}
