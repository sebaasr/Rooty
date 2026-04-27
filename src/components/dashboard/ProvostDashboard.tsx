"use client"

import { useState } from "react"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Avatar, Badge, Card, StatCard } from "@/components/ui/index"
import { BarChart, DonutChart } from "@/components/ui/charts"
import { ADMIN_STATS, WEEKLY_DATA, SUBJECT_DATA } from "@/lib/data"

const PERIODS = ["This Week","This Month","This Semester","Academic Year"]

const DONUT_SEGMENTS = [
  { label: "Mathematics", value: 28, color: "var(--blue)" },
  { label: "Writing",     value: 22, color: "var(--gold)" },
  { label: "Biology",     value: 18, color: "#059669"     },
  { label: "Chemistry",   value: 16, color: "#7C3AED"     },
  { label: "Other",       value: 36, color: "#D1D5DB"     },
]

export default function ProvostDashboard() {
  const [period, setPeriod] = useState("This Month")

  const weekBarData = WEEKLY_DATA.map(d => ({ label: d.week.slice(4), value: d.sessions }))

  const kpis = [
    { label: "Students Served",    value: ADMIN_STATS.studentsServed,  icon: "graduation-cap", color: "blue"   as const, trend: "+8 vs last month",  sub: "of ~800 enrolled"    },
    { label: "Active Tutors",      value: ADMIN_STATS.activeTutors,    icon: "users",           color: "gold"   as const, trend: "+2 this month",     sub: "across 12 subjects"  },
    { label: "Sessions Delivered", value: "186",                        icon: "calendar",        color: "green"  as const, trend: "+18%",              sub: "this semester"       },
    { label: "Avg Session Rating", value: `${ADMIN_STATS.avgRating}★`, icon: "star",            color: "purple" as const, trend: "↑ 0.2 pts",        sub: "out of 5.0"          },
  ]

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "DM Sans, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "var(--blue)", display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px 32px" }}>
          <RootyWordmark inverted />
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Provost&apos;s Office
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { icon: "chart",  label: "Analytics", active: true  },
            { icon: "folder", label: "Reports",   active: false },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 24px",
              background: item.active ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: item.active ? "3px solid var(--gold)" : "3px solid transparent",
              color: item.active ? "#fff" : "rgba(255,255,255,0.6)",
              fontFamily: "DM Sans, sans-serif", fontWeight: item.active ? 600 : 400, fontSize: 14,
              cursor: "pointer",
            }}>
              <Icon name={item.icon} size={16} color={item.active ? "#fff" : "rgba(255,255,255,0.5)"} strokeWidth={item.active ? 2 : 1.5} />
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="PO" size={32} bg="rgba(255,255,255,0.2)" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Provost&apos;s Office</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Read-only access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)", padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>
              Peer Tutoring Analytics
            </h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              New College of Florida · Spring 2026 · Read-only view
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 12,
                background: period === p ? "var(--blue)" : "white",
                color: period === p ? "white" : "var(--muted)",
                border: `1.5px solid ${period === p ? "var(--blue)" : "#E0E4EF"}`,
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Read-only notice */}
        <div style={{ padding: "10px 16px", borderRadius: 10, background: "var(--gold-light)", border: "1.5px solid var(--gold)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#92660A", fontWeight: 500 }}>
          <Icon name="info" size={16} color="#92660A" />
          You have read-only access. Contact the Director of Tutoring Services for schedule modifications or tutor management.
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {kpis.map(k => <StatCard key={k.label} {...k} />)}
        </div>

        {/* Charts row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
          <Card style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Session Volume Trend</div>
              <Badge label="+18% this semester" color="green" />
            </div>
            <BarChart data={weekBarData} height={150} color="var(--blue)" />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--muted)" }}>
              <span>📈 Trend: Increasing</span>
              <span>Peak: 52 sessions (Apr 21)</span>
            </div>
          </Card>
          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Sessions by Subject</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <DonutChart segments={DONUT_SEGMENTS} size={110} />
              <div style={{ flex: 1 }}>
                {DONUT_SEGMENTS.map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 12, color: "var(--text)" }}>{s.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Cost savings */}
          <Card style={{ padding: "24px", background: "linear-gradient(135deg, var(--blue) 0%, #1a4a9e 100%)" }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Estimated Annual Savings</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 36, color: "white", lineHeight: 1, marginBottom: 4 }}>$35K</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>vs. Knack licensing cost</div>
            <div style={{ marginTop: 16, padding: "8px 12px", background: "rgba(255,255,255,0.12)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Rooty operating cost</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)" }}>~$2,232/yr</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Tutor pay only, no licensing</div>
            </div>
          </Card>

          {/* Reliability */}
          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Platform Reliability</div>
            {[
              { label: "On-Time Rate",      value: "96.8%", color: "green" as const, bar: 0.968 },
              { label: "No-Show Rate",      value: "3.2%",  color: "red"   as const, bar: 0.032 },
              { label: "Cancellation Rate", value: "7.1%",  color: "gold"  as const, bar: 0.071 },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontWeight: 500 }}>
                  <span style={{ color: "var(--text)" }}>{m.label}</span>
                  <Badge label={m.value} color={m.color} />
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "#EEF1F8" }}>
                  <div style={{ height: 6, borderRadius: 99, width: `${m.bar * 100}%`, background: m.color === "green" ? "#059669" : m.color === "red" ? "#DC2626" : "var(--gold)" }} />
                </div>
              </div>
            ))}
          </Card>

          {/* NCF coverage */}
          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 12 }}>NCF Coverage</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Subjects Covered",  value: "12 / 14",   pct: 86 },
                { label: "Students Reached",  value: "98 / 800",  pct: 12 },
                { label: "Tutor Capacity",    value: "186h / 240h", pct: 78 },
              ].map(c => (
                <div key={c.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: "var(--text)", fontWeight: 500 }}>{c.label}</span>
                    <span style={{ color: "var(--blue)", fontWeight: 700 }}>{c.value}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "#EEF1F8" }}>
                    <div style={{ height: 6, borderRadius: 99, width: `${c.pct}%`, background: "var(--blue)" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Automated reports */}
        <Card style={{ padding: "22px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="mail" size={24} color="var(--blue)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Automated Reports</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              Weekly summaries are emailed to the Provost&apos;s Office every Monday at 8am. Last sent: <strong>Apr 21, 2026</strong>
            </div>
          </div>
          <Badge label="Scheduled: Mon 8am" color="green" />
        </Card>
      </div>
    </div>
  )
}
