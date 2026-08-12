"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { API_BASE_URL } from "@/lib/api"
import SpatialNav from "@/components/layout/SpatialNav"
import LuxuryFooter from "@/components/layout/LuxuryFooter"
import { Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setTokens } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setTokens(data.access, data.refresh)
        
        try {
          const profileRes = await fetch(`${API_BASE_URL}/auth/profile/`, {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.access}`
            }
          })
          if (profileRes.ok) {
            const userProfile = await profileRes.json()
            useAuthStore.getState().setUser(userProfile)
            
            if (userProfile.is_staff || userProfile.is_superuser) {
              router.push("/admin")
              return
            }
          }
        } catch (e) {
          console.error("Failed to fetch profile", e)
        }
        
        router.push("/account")
      } else {
        setError(data.detail || "Invalid email or password")
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
          className="w-full max-w-md bg-white/50 border border-black/10 rounded-2xl p-8 md:p-12 glass-panel shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 text-black">
            <Lock className="w-24 h-24" />
          </div>

          <h1 className="text-2xl font-bold uppercase tracking-[0.1em] mb-2 relative z-10 text-black">Welcome Back</h1>
          <p className="text-xs text-black/50 tracking-widest uppercase mb-10 relative z-10 font-bold">Sign in to your Aura account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs tracking-widest uppercase mb-6 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/50 block mb-2 flex items-center gap-2 font-bold">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] uppercase tracking-widest text-black/50 flex items-center gap-2 font-bold">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <Link href="#" className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors font-bold">Forgot?</Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-black/20 p-4 text-sm focus:border-black outline-none transition-colors rounded-md font-medium" 
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold uppercase tracking-[0.2em] py-4 mt-4 hover:bg-black/80 transition-colors rounded-md disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-black/50 tracking-widest uppercase mt-8 relative z-10 font-bold">
            Don't have an account? <Link href="/auth/register" className="text-black hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>

      <LuxuryFooter />
    </div>
  )
}
