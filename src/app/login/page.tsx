"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { BanyanLogoColor } from "@/components/ui/BanyanLogo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <BanyanLogoColor size={52} />
            <span style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--blue)", letterSpacing: "-0.5px" }}>rooty</span>
          </Link>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>New College of Florida</p>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
          <h2 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--text)", marginBottom: 24, marginTop: 0 }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                Email
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@ncf.edu"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" as const }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                Password
              </label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" as const }}
              />
            </div>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#991B1B", fontFamily: "DM Sans, sans-serif" }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: "100%", background: "var(--blue)", color: "#fff", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "13px", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 20, fontFamily: "DM Sans, sans-serif" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
