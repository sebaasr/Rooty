"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import Chatbot from "@/components/ui/Chatbot"
import AiTutor from "@/components/ui/AiTutor"

const StudentDashboard = dynamic(() => import("@/components/dashboard/StudentDashboard"), { ssr: false })
const TutorDashboard   = dynamic(() => import("@/components/dashboard/TutorDashboard"),   { ssr: false })
const AdminDashboard   = dynamic(() => import("@/components/dashboard/AdminDashboard"),   { ssr: false })
const ProvostDashboard = dynamic(() => import("@/components/dashboard/ProvostDashboard"), { ssr: false })

type Role = "student" | "tutor" | "admin" | "provost"

const ROLES: { key: Role; label: string; icon: string }[] = [
  { key: "student", label: "Student",          icon: "🎓" },
  { key: "tutor",   label: "Tutor",            icon: "✏️" },
  { key: "admin",   label: "Director",         icon: "🛡" },
  { key: "provost", label: "Provost's Office", icon: "📊" },
]

function DashboardContent() {
  const params = useSearchParams()
  const initialRole = (params.get("role") as Role | null) ?? "student"
  const [role, setRole] = useState<Role>(
    ROLES.some(r => r.key === initialRole) ? initialRole : "student"
  )

  const apps: Record<Role, React.ReactNode> = {
    student: <StudentDashboard />,
    tutor:   <TutorDashboard />,
    admin:   <AdminDashboard />,
    provost: <ProvostDashboard />,
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0f1e" }}>
      {/* Role switcher bar */}
      <div style={{
        background: "#0a0f1e",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 17, color: "#fff", display: "flex", alignItems: "center", gap: 8, letterSpacing: "-0.3px" }}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <rect x="18" y="24" width="4" height="12" rx="2" fill="white"/>
              <ellipse cx="20" cy="18" rx="12" ry="10" fill="white"/>
              <path d="M10 22 Q6 28 8 36" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M30 22 Q34 28 32 36" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <ellipse cx="14" cy="13" rx="5" ry="4" fill="rgba(0,48,135,0.3)"/>
            </svg>
            rooty
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)} style={{
                padding: "6px 14px",
                borderRadius: 99,
                border: `1.5px solid ${role === r.key ? "var(--blue)" : "rgba(255,255,255,0.15)"}`,
                background: role === r.key ? "var(--blue)" : "transparent",
                color: role === r.key ? "#fff" : "rgba(255,255,255,0.55)",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all .15s",
              }}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
          Demo — viewing as {ROLES.find(r => r.key === role)?.label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: "hidden", background: "var(--bg)" }}>
        {apps[role]}
      </div>

      <Chatbot />
      <AiTutor />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", background: "#0a0f1e" }} />}>
      <DashboardContent />
    </Suspense>
  )
}
