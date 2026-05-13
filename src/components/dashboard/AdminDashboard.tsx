"use client"

import { useState } from "react"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Avatar, Pill, Badge, Btn, Card, StatCard, SectionHeader } from "@/components/ui/index"
import { BarChart } from "@/components/ui/charts"
import { TUTORS, PENDING_TUTORS, SESSIONS, ADMIN_STATS, WEEKLY_DATA, SUBJECT_DATA, BUDGET_DATA, HIRING_PIPELINE, TUTOR_REQUIREMENTS, SESSION_POLICY, LIMITS_CONFIG, PENDING_REQUESTS, TUTOR_NOSHOWS, STUDENT_NOSHOWS, LOCATION_STATS, CHATBOT_STATS, DEMAND_BY_PERIOD, ANONYMOUS_FEEDBACK } from "@/lib/data"

type PendingTutor = typeof PENDING_TUTORS[0]

const PIPELINE_STAGES = ["Applied","Under Review","Interview Scheduled","Offer Extended"]
const STAGE_COLORS: Record<string, "gray"|"gold"|"blue"|"green"> = {
  "Applied":              "gray",
  "Under Review":         "gold",
  "Interview Scheduled":  "blue",
  "Offer Extended":       "green",
}

export default function AdminDashboard() {
  const [screen, setScreen]         = useState("dashboard")
  const [pendingList, setPendingList]= useState([...PENDING_TUTORS])
  const [actionModal, setActionModal]= useState<{ tutor: PendingTutor; type: "approve"|"reject" } | null>(null)
  const [feedback, setFeedback]      = useState("")
  const [toast, setToast]            = useState<{ msg: string; color: string } | null>(null)

  // Session limit controls (managed globally for demo)
  const [studentLimit, setStudentLimit] = useState(SESSION_POLICY.studentWeeklySessionLimit)
  const [tutorLimit, setTutorLimit]     = useState(SESSION_POLICY.tutorWeeklySessionLimit)

  const overdueCount = PENDING_REQUESTS.filter(r => r.hoursAgo >= 24).length + TUTOR_NOSHOWS.length

  const navItems = [
    { key:"dashboard",      icon:"chart",        label:"Dashboard"                               },
    { key:"approvals",      icon:"check-circle", label:`Approvals (${pendingList.length})`       },
    { key:"tutors",         icon:"users",        label:"Tutors"                                  },
    { key:"sessions",       icon:"calendar",     label:"Sessions"                                },
    { key:"accountability", icon:"warning",      label:overdueCount > 0 ? `Accountability (${overdueCount})` : "Accountability" },
    { key:"insights",       icon:"trending-up",  label:"Insights"                                },
    { key:"budget",         icon:"dollar",       label:"Budget"                                  },
    { key:"hiring",         icon:"briefcase",    label:"Hiring"                                  },
    { key:"reports",        icon:"folder",       label:"Reports"                                 },
    { key:"privacy",        icon:"lock",         label:"Privacy & Data"                          },
    { key:"settings",       icon:"sliders",      label:"Settings"                                },
  ]

  function showToast(msg: string, color = "green") {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3500)
  }
  function approveTutor(id: number) { setPendingList(p => p.filter(t => t.id !== id)); setActionModal(null); showToast("Tutor approved and notified via email ✓") }
  function rejectTutor(id: number)  { setPendingList(p => p.filter(t => t.id !== id)); setActionModal(null); showToast("Application rejected", "red") }

  // ── SIDEBAR ──────────────────────────────────────────────
  function Sidebar() {
    return (
      <div style={{ width: 220, background: "var(--blue)", display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px 32px" }}>
          <RootyWordmark inverted />
          <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Director of Tutoring</div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(item => {
            const active = screen === item.key
            return (
              <button key={item.key} onClick={() => setScreen(item.key)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 24px",
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent",
                border: "none", cursor: "pointer", textAlign: "left",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily: "DM Sans, sans-serif", fontWeight: active ? 600 : 400, fontSize: 13,
              }}>
                <Icon name={item.icon} size={15} color={active ? "#fff" : "rgba(255,255,255,0.5)"} strokeWidth={active ? 2 : 1.5} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="DL" size={32} bg="rgba(255,255,255,0.2)" />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Dr. Lin</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Director</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ────────────────────────────────────────────
  function DashboardScreen() {
    const weekData   = WEEKLY_DATA.map(d => ({ label: d.week.slice(4), value: d.sessions }))
    const maxSessions= SUBJECT_DATA[0].sessions
    const barColors  = ["var(--blue)","#1a4a9e","#2d5fce","#4674d4","#6089de","#8aa3e8"]
    const budgetPct  = Math.round((BUDGET_DATA.ytdSpent / BUDGET_DATA.total) * 100)
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Director Dashboard</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Week of Apr 21, 2026 · New College of Florida</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {pendingList.length > 0 && (
              <button onClick={() => setScreen("approvals")} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 99, background: "var(--gold-light)",
                border: "1.5px solid var(--gold)", cursor: "pointer",
                fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, color: "#92660A",
              }}>
                <Icon name="warning" size={14} color="#92660A" /> {pendingList.length} pending approval{pendingList.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          <StatCard label="Active Tutors"       value={ADMIN_STATS.activeTutors}     icon="users"    color="blue"   trend="+2 this month" />
          <StatCard label="Sessions This Week"  value={ADMIN_STATS.sessionsThisWeek} icon="calendar" color="gold"   trend="+12%" />
          <StatCard label="Avg Rating"          value={`${ADMIN_STATS.avgRating}★`}  icon="star"     color="green" />
          <StatCard label="Budget Used"         value={`${budgetPct}%`}              icon="dollar"   color="purple" sub={`$${BUDGET_DATA.ytdSpent.toLocaleString()} of $${(BUDGET_DATA.total/1000).toFixed(0)}K`} />
        </div>

        {/* Budget mini-bar */}
        <Card style={{ padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
              <span style={{ color: "var(--text)" }}>Semester Budget</span>
              <span style={{ color: budgetPct > 40 ? "#DC2626" : "#065F46" }}>{budgetPct}% used</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: "#EEF1F8" }}>
              <div style={{ height: 8, borderRadius: 99, width: `${budgetPct}%`, background: budgetPct > 60 ? "#DC2626" : budgetPct > 40 ? "var(--gold)" : "#059669", transition: "width .5s" }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Week {BUDGET_DATA.currentWeek} of {BUDGET_DATA.semesterWeeks} · Projected: ${BUDGET_DATA.projected.toLocaleString()} ({Math.round(BUDGET_DATA.projected/BUDGET_DATA.total*100)}% of budget)
            </div>
          </div>
          <Btn size="sm" variant="outline" onClick={() => setScreen("budget")}>View Budget</Btn>
        </Card>

        {/* Session limits badge */}
        <Card style={{ padding: "14px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, background: "var(--blue-light)" }}>
          <Icon name="sliders" size={18} color="var(--blue)" />
          <div style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>
            <strong>Session Limits Active:</strong> Students {studentLimit}/week · Tutors {tutorLimit}/week
          </div>
          <Btn size="sm" variant="primary" onClick={() => setScreen("budget")}>Adjust Limits</Btn>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 28 }}>
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Sessions Per Week</div>
            <BarChart data={weekData} height={150} color="var(--blue)" />
          </Card>
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Top Subjects</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SUBJECT_DATA.map((d, i) => (
                <div key={d.subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, fontWeight: 500, color: "var(--text)" }}>
                    <span>{d.subject}</span><span style={{ color: "var(--muted)" }}>{d.sessions}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "#EEF1F8" }}>
                    <div style={{ height: 6, borderRadius: 99, width: `${(d.sessions/maxSessions)*100}%`, background: ["var(--blue)","#1a4a9e","#2d5fce","#4674d4","#6089de","#8aa3e8"][i] }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card style={{ padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Recent Sessions</div>
            <Btn size="sm" variant="outline">Export CSV</Btn>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #EEF1F8" }}>
                {["Tutor","Student","Subject","Date","Mode","Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--text)" }}>{s.tutor}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)" }}>Riley T.</td>
                  <td style={{ padding: "10px 12px" }}><Pill label={s.subject} size="sm" /></td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{s.date}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)" }}>{s.mode === "Online" ? "💻" : "📍"} {s.mode}</td>
                  <td style={{ padding: "10px 12px" }}><Badge label={s.status} color={s.status === "upcoming" ? "blue" : "green"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    )
  }

  // ── APPROVALS ────────────────────────────────────────────
  function ApprovalsScreen() {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", marginBottom: 6 }}>Tutor Applications</h1>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>{pendingList.length} pending · Review and approve or reject each application</div>
        {pendingList.length === 0 ? (
          <Card style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 6 }}>All caught up!</div>
            <div style={{ fontSize: 14, color: "var(--muted)" }}>No pending tutor applications</div>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {pendingList.map(t => (
              <Card key={t.id} style={{ padding: "22px" }} hover>
                <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  <Avatar initials={t.avatar} size={52} bg="var(--blue)" />
                  <div>
                    <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.year} · Applied {t.appliedDate}</div>
                    <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {t.subjects.map(s => <Pill key={s} label={s} size="sm" />)}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 12, padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>{t.bio}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--blue-light)" }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" as const }}>GPA</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--blue)" }}>{t.gpa}</div>
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "var(--gold-light)" }}>
                    <div style={{ fontSize: 10, color: "#92660A", fontWeight: 600, textTransform: "uppercase" as const }}>Qualifications</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#92660A" }}>{t.qualifications}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn fullWidth variant="primary" onClick={() => setActionModal({ tutor: t, type: "approve" })}>
                    <Icon name="check" size={14} color="white" /> Approve
                  </Btn>
                  <Btn fullWidth variant="danger" onClick={() => setActionModal({ tutor: t, type: "reject" })}>
                    <Icon name="x" size={14} color="#991B1B" /> Reject
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── TUTORS ───────────────────────────────────────────────
  function TutorsScreen() {
    const [search, setSearch] = useState("")
    const filtered = TUTORS.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
    )
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Tutor Roster</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{TUTORS.length} active tutors</div>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tutors…"
            style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", width: 200 }} />
        </div>
        <Card>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
                {["Tutor","Subjects","Rating","Hours / Cap","Sessions/wk","CRLA","Status","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const pct = t.hours / t.hoursMax
                const sessAtLimit = t.weeklySessionsUsed >= t.weeklySessionLimit
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={t.avatar} size={32} bg="var(--blue)" />
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.reviews} reviews</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {t.subjects.slice(0, 2).map(s => <Pill key={s} label={s} size="sm" />)}
                        {t.subjects.length > 2 && <span style={{ fontSize: 11, color: "var(--muted)" }}>+{t.subjects.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{t.rating}★</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: pct >= 0.8 ? "#92660A" : "var(--text)" }}>{t.hours}h / {t.hoursMax}h</div>
                      <div style={{ height: 4, borderRadius: 99, background: "#EEF1F8", marginTop: 4, width: 80 }}>
                        <div style={{ height: 4, borderRadius: 99, width: `${pct*100}%`, background: pct >= 0.8 ? "var(--gold)" : "var(--blue)" }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge label={`${t.weeklySessionsUsed}/${tutorLimit}`} color={sessAtLimit ? "red" : t.weeklySessionsUsed >= tutorLimit - 1 ? "gold" : "green"} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <Badge
                        label={t.crla}
                        color={t.crla === "Level II" ? "green" : t.crla === "Level I" ? "blue" : t.crla === "In Progress" ? "gold" : "gray"}
                      />
                    </td>
                    <td style={{ padding: "12px 16px" }}><Badge label="Active" color="green" /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn size="sm" variant="outline">Edit</Btn>
                        <Btn size="sm" variant="ghost">View</Btn>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </div>
    )
  }

  // ── BUDGET ───────────────────────────────────────────────
  function BudgetScreen() {
    const spentPct   = Math.round((BUDGET_DATA.ytdSpent / BUDGET_DATA.total) * 100)
    const projPct    = Math.round((BUDGET_DATA.projected / BUDGET_DATA.total) * 100)
    const weeksLeft  = BUDGET_DATA.semesterWeeks - BUDGET_DATA.currentWeek
    const budgetLeft = BUDGET_DATA.total - BUDGET_DATA.ytdSpent
    const burnBarData= BUDGET_DATA.weeklyHistory.map(d => ({ label: d.week.slice(4), value: d.amount }))

    // Projected weekly spend given current limits
    const baseWeeklyBurn = BUDGET_DATA.weeklyBurn
    const limitRatio     = (studentLimit / SESSION_POLICY.studentWeeklySessionLimit) * (tutorLimit / SESSION_POLICY.tutorWeeklySessionLimit)
    const projWeeklyBurn = Math.round(baseWeeklyBurn * limitRatio)
    const projRemaining  = Math.round(projWeeklyBurn * weeksLeft)
    const projTotal      = BUDGET_DATA.ytdSpent + projRemaining
    const onTrack        = projTotal <= BUDGET_DATA.total

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Budget Tracking</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Spring 2026 · Week {BUDGET_DATA.currentWeek} of {BUDGET_DATA.semesterWeeks}</div>
          </div>
          <Btn size="sm" variant="outline"><Icon name="export" size={14} color="var(--blue)" /> Export Report</Btn>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          <Card style={{ padding: "20px 22px", background: "linear-gradient(135deg, var(--blue) 0%, #1a4a9e 100%)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Total Budget</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "white", lineHeight: 1 }}>${(BUDGET_DATA.total/1000).toFixed(0)}K</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Spring 2026 allocation</div>
          </Card>
          <Card style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 600 }}>YTD Spent</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", lineHeight: 1 }}>${BUDGET_DATA.ytdSpent.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "#065F46", marginTop: 4, fontWeight: 600 }}>{spentPct}% of budget</div>
          </Card>
          <Card style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 600 }}>Semester Projection</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: projTotal > BUDGET_DATA.total ? "#DC2626" : "var(--text)", lineHeight: 1 }}>${projTotal.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: projTotal > BUDGET_DATA.total ? "#DC2626" : "#065F46", marginTop: 4, fontWeight: 600 }}>
              {onTrack ? `$${(BUDGET_DATA.total - projTotal).toLocaleString()} under budget` : `$${(projTotal - BUDGET_DATA.total).toLocaleString()} over budget`}
            </div>
          </Card>
          <Card style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 600 }}>Avg Weekly Burn</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", lineHeight: 1 }}>${projWeeklyBurn.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{weeksLeft} weeks remaining</div>
          </Card>
        </div>

        {/* Budget bar */}
        <Card style={{ padding: "22px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Budget Utilization</div>
            <Badge label={onTrack ? "On Track" : "Over Budget Risk"} color={onTrack ? "green" : "red"} />
          </div>
          <div style={{ height: 16, borderRadius: 99, background: "#EEF1F8", position: "relative", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, width: `${spentPct}%`, background: "var(--blue)", transition: "width .5s" }} />
            {/* projection overlay */}
            <div style={{ position: "absolute", top: 0, left: `${spentPct}%`, height: "100%", width: `${projPct - spentPct}%`, background: "rgba(0,48,135,0.25)", borderRadius: "0 99px 99px 0" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            <span>$0</span>
            <span style={{ color: "var(--blue)", fontWeight: 600 }}>Spent: ${BUDGET_DATA.ytdSpent.toLocaleString()} ({spentPct}%)</span>
            <span style={{ color: "rgba(0,48,135,0.5)", fontWeight: 600 }}>Projected: ${projTotal.toLocaleString()} ({projPct}%)</span>
            <span>${BUDGET_DATA.total.toLocaleString()}</span>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
          {/* Weekly spend chart */}
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Weekly Spend</div>
            <BarChart data={burnBarData} height={140} color="var(--blue)" />
          </Card>

          {/* Breakdown */}
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Spend Breakdown</div>
            {BUDGET_DATA.breakdown.map(b => {
              const pct = Math.round((b.amount / BUDGET_DATA.ytdSpent) * 100)
              return (
                <div key={b.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, fontWeight: 500 }}>
                    <span style={{ color: "var(--text)" }}>{b.label}</span>
                    <span style={{ color: b.color, fontWeight: 700 }}>${b.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: "#EEF1F8" }}>
                    <div style={{ height: 6, borderRadius: 99, width: `${pct}%`, background: b.color }} />
                  </div>
                </div>
              )
            })}
          </Card>
        </div>

        {/* Session Limit Controls */}
        <Card style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Icon name="sliders" size={18} color="var(--blue)" />
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Session Limit Controls</div>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Tighten session limits as the semester progresses to stay within budget. Changes take effect immediately.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
            {/* Student limit */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Student Weekly Session Limit</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setStudentLimit(n)} style={{
                    width: 44, height: 44, borderRadius: 10, border: `2px solid ${studentLimit === n ? "var(--blue)" : "#E0E4EF"}`,
                    background: studentLimit === n ? "var(--blue)" : "white",
                    color: studentLimit === n ? "white" : "var(--text)",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
                  }}>{n}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                Currently: {studentLimit}/week per student · {ADMIN_STATS.studentsServed} active students
              </div>
            </div>
            {/* Tutor limit */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Tutor Weekly Session Limit</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[2,3,4,5,6].map(n => (
                  <button key={n} onClick={() => setTutorLimit(n)} style={{
                    width: 44, height: 44, borderRadius: 10, border: `2px solid ${tutorLimit === n ? "var(--blue)" : "#E0E4EF"}`,
                    background: tutorLimit === n ? "var(--blue)" : "white",
                    color: tutorLimit === n ? "white" : "var(--text)",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer",
                  }}>{n}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                Currently: {tutorLimit}/week per tutor · {ADMIN_STATS.activeTutors} active tutors
              </div>
            </div>
          </div>
          {/* Impact preview */}
          <div style={{ padding: "16px", borderRadius: 12, background: onTrack ? "#ECFDF5" : "#FEF2F2", border: `1.5px solid ${onTrack ? "#6EE7B7" : "#FCA5A5"}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: onTrack ? "#065F46" : "#991B1B", marginBottom: 4 }}>
              {onTrack ? "✓ Projected to stay within budget" : "⚠ Projected to exceed budget — consider tightening limits"}
            </div>
            <div style={{ fontSize: 12, color: onTrack ? "#065F46" : "#991B1B" }}>
              At current limits: ~${projWeeklyBurn.toLocaleString()}/week · ${projRemaining.toLocaleString()} remaining · Total projected: ${projTotal.toLocaleString()}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // ── HIRING ───────────────────────────────────────────────
  function HiringScreen() {
    const [showForm, setShowForm] = useState(false)
    const stageCounts = PIPELINE_STAGES.reduce((acc, s) => {
      acc[s] = HIRING_PIPELINE.filter(h => h.stage === s).length
      return acc
    }, {} as Record<string, number>)
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Tutor Hiring</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{HIRING_PIPELINE.length} applicants in pipeline · Spring 2026 cycle</div>
          </div>
          <Btn variant="primary" onClick={() => setShowForm(!showForm)}>
            <Icon name="plus" size={14} color="white" /> Post Open Position
          </Btn>
        </div>

        {/* Post form */}
        {showForm && (
          <Card style={{ padding: "22px", marginBottom: 24, border: "2px solid var(--blue)" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 14 }}>Post Tutor Opening</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {[
                { label:"Subject(s) Needed", placeholder:"e.g. Mathematics, Statistics" },
                { label:"Number of Openings", placeholder:"e.g. 2" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", boxSizing: "border-box" as const }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Notes for Applicants</label>
              <textarea placeholder="Describe specific needs, scheduling constraints, or preferences…" style={{ width: "100%", height: 80, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "none" as const, boxSizing: "border-box" as const }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="primary" onClick={() => { setShowForm(false); showToast("Opening posted to application portal ✓") }}>Post Opening</Btn>
              <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            </div>
          </Card>
        )}

        {/* Pipeline overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {PIPELINE_STAGES.map(stage => (
            <Card key={stage} style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>{stage}</div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", lineHeight: 1 }}>{stageCounts[stage] || 0}</div>
              <div style={{ marginTop: 6 }}><Badge label={stage} color={STAGE_COLORS[stage]} /></div>
            </Card>
          ))}
        </div>

        {/* Applicant list */}
        <Card style={{ marginBottom: 28 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
                {["Applicant","Subjects","GPA","Year","Applied","Stage","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HIRING_PIPELINE.map(h => (
                <tr key={h.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={h.avatar} size={32} bg="var(--blue)" />
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{h.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {h.subjects.slice(0,2).map(s => <Pill key={s} label={s} size="sm" />)}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: parseFloat(h.gpa) >= 3.8 ? "#065F46" : "var(--text)" }}>{h.gpa}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{h.year}</td>
                  <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{h.appliedDate}</td>
                  <td style={{ padding: "12px 16px" }}><Badge label={h.stage} color={STAGE_COLORS[h.stage]} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="outline">Advance</Btn>
                      <Btn size="sm" variant="ghost">View</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Requirements */}
        <Card style={{ padding: "24px" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 6 }}>Tutor Application Requirements</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            These requirements are displayed on the student-facing application portal at <strong>rooty.ncf.edu/apply</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TUTOR_REQUIREMENTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 12, background: "var(--bg)" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Icon name="check-circle" size={14} color="var(--blue)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  // ── REPORTS ──────────────────────────────────────────────
  function ReportsScreen() {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", marginBottom: 6 }}>Reports &amp; Export</h1>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Generate and export payroll-ready HR data</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {[
            { icon:"dollar",   title:"Weekly HR Export",   sub:"Tutor hours + pay summary for Payroll",  btn:"Export Excel", color:"green"  },
            { icon:"calendar", title:"Session Report",     sub:"All sessions by date range",             btn:"Export CSV",   color:"blue"   },
            { icon:"chart",    title:"Analytics Summary",  sub:"Usage stats and trends",                 btn:"Export PDF",   color:"purple" },
            { icon:"users",    title:"Tutor Roster",       sub:"Active tutors with subject + status",    btn:"Export Excel", color:"gold"   },
          ].map(r => (
            <Card key={r.title} style={{ padding: "22px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon name={r.icon} size={20} color="var(--blue)" />
              </div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{r.sub}</div>
              <Btn size="sm" variant="primary">{r.btn}</Btn>
            </Card>
          ))}
        </div>
        <Card style={{ padding: "22px" }}>
          <SectionHeader title="Weekly Payroll Preview" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "2px solid #EEF1F8" }}>
                {["Tutor","Hours","Rate","Total Owed","Sessions/wk","Cap Status"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TUTORS.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{t.name}</td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>{t.hours}h</td>
                  <td style={{ padding: "10px 14px", color: "var(--muted)" }}>${t.rate}/hr</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text)" }}>${t.hours * t.rate}</td>
                  <td style={{ padding: "10px 14px" }}><Badge label={`${t.weeklySessionsUsed}/${tutorLimit}`} color={t.weeklySessionsUsed >= tutorLimit ? "red" : "green"} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <Badge
                      label={t.hours >= t.hoursMax ? "Cap Reached" : t.hours / t.hoursMax >= 0.8 ? "Near Cap" : "OK"}
                      color={t.hours >= t.hoursMax ? "red" : t.hours / t.hoursMax >= 0.8 ? "gold" : "green"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    )
  }

  // ── PRIVACY & DATA ───────────────────────────────────────
  function PrivacyScreen() {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", marginBottom: 6 }}>Privacy &amp; Data Governance</h1>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>How Rooty handles student and tutor data at New College of Florida</div>

        {/* FERPA notice */}
        <div style={{ padding: "16px 20px", borderRadius: 12, background: "var(--blue-light)", border: "2px solid var(--blue)", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon name="shield" size={24} color="var(--blue)" />
          <div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>FERPA Compliance</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Rooty operates in full compliance with the Family Educational Rights and Privacy Act (FERPA). Student tutoring records are treated as educational records. Only authorized NCF staff and the student themselves may access identifiable records. Aggregated analytics shown to the Provost&apos;s Office contain no personally identifiable information.
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* What we collect */}
          <Card style={{ padding: "22px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="folder" size={16} color="var(--blue)" />
              </div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Data We Collect</div>
            </div>
            {[
              { label:"Name & NCF Email",       detail:"Used for account auth via NCF SSO only" },
              { label:"Session History",        detail:"Date, subject, duration, tutor name" },
              { label:"Session Notes",          detail:"Written by tutor; visible to Director only" },
              { label:"Ratings",                detail:"1–5 star ratings, anonymous to tutors" },
              { label:"Availability",           detail:"Tutor-set time slots only" },
            ].map(d => (
              <div key={d.label} style={{ padding: "10px 0", borderBottom: "1px solid #F5F6FA" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{d.label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.detail}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FCA5A5" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#991B1B" }}>Never collected: Grades, GPA, financial info, medical info, SSN</div>
            </div>
          </Card>

          {/* Access controls */}
          <Card style={{ padding: "22px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="lock" size={16} color="var(--blue)" />
              </div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Role-Based Access</div>
            </div>
            {[
              { role:"Student",          access:"Own session history, own profile only",       color:"blue"   as const },
              { role:"Tutor",            access:"Names of own students, own session notes",    color:"gold"   as const },
              { role:"Director",         access:"All sessions, tutor notes, payroll data",     color:"green"  as const },
              { role:"Provost&apos;s Office",  access:"Aggregated analytics only (no PII)",   color:"gray"   as const },
            ].map(r => (
              <div key={r.role} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #F5F6FA" }}>
                <Badge label={r.role.replace("&apos;", "'")} color={r.color} />
                <div style={{ fontSize: 12, color: "var(--muted)", paddingTop: 2 }}>{r.access.replace("&apos;", "'")}</div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {/* Retention */}
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 14 }}>Data Retention</div>
            {[
              { item:"Session records",         policy:"3 years (FERPA minimum requirement)" },
              { item:"Session notes",           policy:"3 years, then auto-deleted" },
              { item:"User profiles",           policy:"Deleted within 30 days of graduation/departure" },
              { item:"Analytics (aggregated)",  policy:"Kept indefinitely — no PII involved" },
              { item:"Exported reports",        policy:"Director responsibility; store per NCF IT policy" },
            ].map(r => (
              <div key={r.item} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #F5F6FA", fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>{r.item}</span>
                <span style={{ color: "var(--muted)" }}>{r.policy}</span>
              </div>
            ))}
          </Card>

          {/* Student rights */}
          <Card style={{ padding: "22px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 14 }}>Student Rights</div>
            {[
              { right:"Right to Access",         desc:"Students can view all their own records via My Profile → Export Data" },
              { right:"Right to Correct",        desc:"Students may request corrections via Director; corrections logged" },
              { right:"Right to Request Deletion",desc:"Except where FERPA retention applies; request via tutoring@ncf.edu" },
              { right:"Right to Opt-Out",        desc:"Students may opt out of non-essential data collection at any time" },
            ].map(r => (
              <div key={r.right} style={{ padding: "10px 0", borderBottom: "1px solid #F5F6FA" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{r.right}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            ))}
          </Card>
        </div>

        {/* Infrastructure security */}
        <Card style={{ padding: "22px" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 14 }}>Infrastructure &amp; Security</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { icon:"shield",    title:"Supabase RLS",        desc:"Row-Level Security enforced at database layer — users can only query their own records" },
              { icon:"lock",      title:"HTTPS / TLS",         desc:"All traffic encrypted in transit. NCF SSO handles authentication — no passwords stored in Rooty" },
              { icon:"users",     title:"No Third-Party Sharing", desc:"Data is not shared with advertisers, data brokers, or external entities. Supabase and Vercel are infrastructure providers only" },
            ].map(s => (
              <div key={s.title} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon name={s.icon} size={16} color="var(--blue)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "var(--gold-light)", border: "1px solid var(--gold)", fontSize: 13, color: "#92660A" }}>
            <strong>Questions?</strong> Contact NCF Privacy Officer or the Director of Tutoring at <strong>tutoring@ncf.edu</strong> · Full data policy available at the NCF IT Policy Portal.
          </div>
        </Card>
      </div>
    )
  }

  // ── ACCOUNTABILITY ───────────────────────────────────────
  function AccountabilityScreen() {
    const [dismissedReqs, setDismissedReqs]       = useState<number[]>([])
    const [dismissedTutorNS, setDismissedTutorNS] = useState<number[]>([])
    const [dismissedStudNS, setDismissedStudNS]   = useState<number[]>([])

    const activeReqs      = PENDING_REQUESTS.filter(r  => !dismissedReqs.includes(r.id))
    const overdue         = activeReqs.filter(r => r.hoursAgo >= 24)
    const pending         = activeReqs.filter(r => r.hoursAgo < 24)
    const activeTutorNS   = TUTOR_NOSHOWS.filter(n  => !dismissedTutorNS.includes(n.id))
    const activeStudentNS = STUDENT_NOSHOWS.filter(n => !dismissedStudNS.includes(n.id))
    const totalFlags      = overdue.length + activeTutorNS.length

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0, marginBottom: 6 }}>Accountability Tracking</h1>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Monitor response times, no-shows, and SLA compliance</div>

        {totalFlags > 0 && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#FEF2F2", border: "1.5px solid #FCA5A5", marginBottom: 24, display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#991B1B", fontWeight: 500 }}>
            <Icon name="warning" size={16} color="#991B1B" />
            {totalFlags} item{totalFlags !== 1 ? "s" : ""} require attention — {overdue.length} overdue response{overdue.length !== 1 ? "s" : ""}, {activeTutorNS.length} tutor no-show{activeTutorNS.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* 24-hour response SLA */}
        <Card style={{ padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Tutor Response Tracking</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Tutors must accept or decline booking requests within 24 hours</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {overdue.length > 0 && <Badge label={`${overdue.length} OVERDUE`} color="red" />}
              {pending.length > 0 && <Badge label={`${pending.length} pending`} color="gold" />}
            </div>
          </div>
          {activeReqs.length === 0
            ? <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>✓ All requests responded to within 24 hours</div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
                    {["Student","Subject","Assigned Tutor","Requested","Elapsed","Status","Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeReqs.map(r => {
                    const isOverdue = r.hoursAgo >= 24
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #F5F6FA", background: isOverdue ? "#FFF5F5" : "transparent" }}>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar initials={r.studentAvatar} size={28} bg="var(--blue)" />
                            <span style={{ fontWeight: 600 }}>{r.student}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px" }}><Pill label={r.subject} size="sm" /></td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar initials={r.tutorAvatar} size={28} bg="rgba(0,48,135,0.35)" />
                            <span style={{ color: "var(--muted)" }}>{r.tutor}</span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px", color: "var(--muted)", fontSize: 12 }}>{r.requestedAt}</td>
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontWeight: 700, color: isOverdue ? "#DC2626" : "#92660A" }}>{r.hoursAgo}h ago</span>
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <Badge label={isOverdue ? "OVERDUE" : "Pending"} color={isOverdue ? "red" : "gold"} />
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Btn size="sm" variant="outline" onClick={() => showToast(`Reminder sent to ${r.tutor} ✓`)}>Notify Tutor</Btn>
                            <Btn size="sm" variant="ghost" onClick={() => setDismissedReqs(d => [...d, r.id])}>Dismiss</Btn>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          }
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "var(--bg)", fontSize: 12, color: "var(--muted)" }}>
            <strong>Policy:</strong> If a tutor does not respond within 24 hours, the request is flagged here and can be manually reassigned. Repeated non-responses trigger a performance review.
          </div>
        </Card>

        {/* Tutor no-shows */}
        <Card style={{ padding: "24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Tutor No-Shows</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Tutors who missed a confirmed session without prior notice</div>
            </div>
            {activeTutorNS.length > 0 && <Badge label={`${activeTutorNS.length} recorded`} color="red" />}
          </div>
          {activeTutorNS.length === 0
            ? <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>✓ No tutor no-shows this period</div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
                    {["Tutor","Student Affected","Subject","Date & Time","Total No-Shows","Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTutorNS.map(ns => (
                    <tr key={ns.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar initials={ns.tutorAvatar} size={28} bg="var(--blue)" />
                          <span style={{ fontWeight: 600 }}>{ns.tutor}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", color: "var(--muted)" }}>{ns.student}</td>
                      <td style={{ padding: "11px 14px" }}><Pill label={ns.subject} size="sm" /></td>
                      <td style={{ padding: "11px 14px", color: "var(--muted)", fontSize: 12 }}>{ns.date} · {ns.time}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <Badge label={`${ns.totalNoShows} total`} color={ns.totalNoShows >= 2 ? "red" : "gold"} />
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn size="sm" variant="outline" onClick={() => showToast(`Warning sent to ${ns.tutor} ✓`)}>Send Warning</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => setDismissedTutorNS(d => [...d, ns.id])}>Dismiss</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </Card>

        {/* Student no-shows */}
        <Card style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Student No-Shows</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Students who missed a booked session without canceling in time</div>
            </div>
            {activeStudentNS.length > 0 && <Badge label={`${activeStudentNS.length} recorded`} color="gold" />}
          </div>
          {activeStudentNS.length === 0
            ? <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>✓ No student no-shows this period</div>
            : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
                    {["Student","Tutor","Subject","Date & Time","No-Shows","Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeStudentNS.map(ns => (
                    <tr key={ns.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar initials={ns.studentAvatar} size={28} bg="var(--gold)" />
                          <span style={{ fontWeight: 600 }}>{ns.student}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", color: "var(--muted)" }}>{ns.tutor}</td>
                      <td style={{ padding: "11px 14px" }}><Pill label={ns.subject} size="sm" /></td>
                      <td style={{ padding: "11px 14px", color: "var(--muted)", fontSize: 12 }}>{ns.date} · {ns.time}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <Badge label={`${ns.totalNoShows}×`} color={ns.totalNoShows >= 2 ? "red" : "gold"} />
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn size="sm" variant="outline" onClick={() => showToast(`Reminder sent to ${ns.student} ✓`)}>Send Reminder</Btn>
                          <Btn size="sm" variant="ghost" onClick={() => setDismissedStudNS(d => [...d, ns.id])}>Dismiss</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "var(--bg)", fontSize: 12, color: "var(--muted)" }}>
            <strong>Policy:</strong> Students with 3+ no-shows in a semester may have booking privileges suspended pending a meeting with the Director. Cancellations made more than {LIMITS_CONFIG.cancellationHours}h in advance are not counted as no-shows.
          </div>
        </Card>
      </div>
    )
  }

  // ── INSIGHTS ─────────────────────────────────────────────
  function InsightsScreen() {
    const [period, setPeriod] = useState<"week" | "month" | "semester" | "year">("month")
    const demandData = DEMAND_BY_PERIOD[period]
    const maxSessions = demandData[0].sessions

    const inPersonSessions = LOCATION_STATS.filter(l => l.mode === "In-Person").reduce((s, l) => s + l.sessions, 0)
    const onlineSessions   = LOCATION_STATS.find(l => l.mode === "Online")?.sessions ?? 0
    const totalSessions    = inPersonSessions + onlineSessions
    const inPersonPct      = Math.round((inPersonSessions / totalSessions) * 100)
    const onlinePct        = 100 - inPersonPct

    const topByDemand = [...TUTORS].sort((a, b) => b.weeklySessionsUsed - a.weeklySessionsUsed)
    const topByRating = [...TUTORS].sort((a, b) => b.rating - a.rating)

    const periodLabel: Record<string, string> = { week:"This Week", month:"This Month", semester:"This Semester", year:"This Year" }

    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Program Insights</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Demand trends, tutor performance, and platform usage</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["week","month","semester","year"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer", textTransform: "capitalize",
                fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 12,
                background: period === p ? "var(--blue)" : "white",
                color: period === p ? "white" : "var(--muted)",
                border: `1.5px solid ${period === p ? "var(--blue)" : "#E0E4EF"}`,
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Subject demand + mode split */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
          <Card style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Most In-Demand Subjects</div>
              <Badge label={periodLabel[period]} color="blue" />
            </div>
            {demandData.map((d, i) => (
              <div key={d.subject} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 11, color: "var(--muted)", width: 18 }}>#{i+1}</span>
                    <span style={{ fontWeight: 500, color: "var(--text)" }}>{d.subject}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--blue)" }}>{d.sessions} sessions</span>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: "#EEF1F8" }}>
                  <div style={{ height: 8, borderRadius: 99, width: `${(d.sessions/maxSessions)*100}%`, background: (["var(--blue)","#1a4a9e","#2d5fce","#4674d4","#6089de"])[i] || "var(--blue)" }} />
                </div>
              </div>
            ))}
          </Card>

          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Online vs. In-Person</div>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 32, color: "var(--blue)" }}>{inPersonPct}%</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>In-Person</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{inPersonSessions} sessions</div>
              </div>
              <div style={{ width: 1, background: "#EEF1F8" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 32, color: "#2D8CFF" }}>{onlinePct}%</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Online</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{onlineSessions} sessions</div>
              </div>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "#EEF1F8", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: `${inPersonPct}%`, background: "var(--blue)", borderRadius: "99px 0 0 99px" }} />
                <div style={{ width: `${onlinePct}%`, background: "#2D8CFF", borderRadius: "0 99px 99px 0" }} />
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 8 }}>Locations by Use</div>
            {LOCATION_STATS.map((loc, i) => (
              <div key={loc.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #F5F6FA", fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700, color: "var(--muted)", fontSize: 11, width: 18 }}>#{i+1}</span>
                  <span style={{ color: "var(--text)", fontWeight: 500 }}>{loc.name.includes("—") ? loc.name.split("—")[1].trim() : loc.name}</span>
                </div>
                <Badge label={`${loc.sessions}`} color={loc.mode === "Online" ? "blue" : "gray"} />
              </div>
            ))}
          </Card>
        </div>

        {/* Tutor performance tables */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Most In-Demand Tutors</div>
            {topByDemand.map((t, i) => (
              <div key={t.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F5F6FA" }}>
                <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 12, color: "var(--muted)", width: 18 }}>#{i+1}</span>
                <Avatar initials={t.avatar} size={32} bg="var(--blue)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.subjects.slice(0,2).join(", ")}</div>
                </div>
                <Badge label={`${t.weeklySessionsUsed} / wk`} color={t.weeklySessionsUsed >= t.weeklySessionLimit ? "red" : "green"} />
              </div>
            ))}
          </Card>

          <Card style={{ padding: "24px" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Highest Rated Tutors</div>
            {topByRating.map((t, i) => (
              <div key={t.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F5F6FA" }}>
                <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 12, color: i === 0 ? "var(--gold)" : "var(--muted)", width: 18 }}>#{i+1}</span>
                <Avatar initials={t.avatar} size={32} bg="var(--blue)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.reviews} reviews</div>
                </div>
                <span style={{ fontWeight: 700, color: "var(--gold)", fontSize: 15 }}>{t.rating}★</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Chatbot usage */}
        <Card style={{ padding: "24px" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Chatbot &amp; AI Usage</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { label:"Total Queries",       value: String(CHATBOT_STATS.totalQueries),         color:"var(--blue)"  },
              { label:"Unique Students",     value: String(CHATBOT_STATS.uniqueStudents),        color:"var(--blue)"  },
              { label:"Resolution Rate",     value:`${CHATBOT_STATS.resolutionRate}%`,           color:"#059669"      },
              { label:"Avg Queries / User",  value: String(CHATBOT_STATS.avgQueriesPerUser),     color:"var(--gold)"  },
            ].map(stat => (
              <div key={stat.label} style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg)", textAlign: "center" }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Top Topics Students Ask</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHATBOT_STATS.topTopics.map((topic, i) => (
              <span key={topic} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "var(--blue-light)", color: "var(--blue)" }}>
                #{i+1} {topic}
              </span>
            ))}
          </div>
        </Card>

        {/* Anonymous tutor feedback */}
        <Card style={{ padding: "24px", marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Anonymous Tutor Feedback Themes</div>
            <Badge label="Anonymized" color="gray" />
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>Aggregated from student session ratings. No responses are linked to individual students.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ANONYMOUS_FEEDBACK.map(f => {
              const maxCount = ANONYMOUS_FEEDBACK[0].count
              const bg = f.sentiment === "positive" ? "#DCFCE7" : f.sentiment === "negative" ? "#FEE2E2" : "#FEF9C3"
              const fg = f.sentiment === "positive" ? "#166534" : f.sentiment === "negative" ? "#991B1B" : "#92660A"
              const bar = f.sentiment === "positive" ? "#22C55E" : f.sentiment === "negative" ? "#EF4444" : "var(--gold)"
              return (
                <div key={f.theme} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: bar, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, width: 260, flexShrink: 0 }}>{f.theme}</div>
                  <div style={{ flex: 1, height: 8, borderRadius: 99, background: "#F5F6FA", overflow: "hidden" }}>
                    <div style={{ height: 8, borderRadius: 99, width: `${(f.count / maxCount) * 100}%`, background: bar, transition: "width .4s" }} />
                  </div>
                  <div style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: bg, color: fg, flexShrink: 0 }}>{f.count} mentions</div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, background: "var(--bg)", fontSize: 12, color: "var(--muted)" }}>
            Feedback collected from post-session ratings. Themes extracted by Rooty AI — no student names, emails, or session IDs are stored with these results.
          </div>
        </Card>
      </div>
    )
  }

  // ── SETTINGS ─────────────────────────────────────────────
  function SettingsScreen() {
    const [vals, setVals] = useState({ ...LIMITS_CONFIG })
    const [saved, setSaved] = useState(false)
    function adj(key: keyof typeof LIMITS_CONFIG, delta: number, min: number, max: number) {
      setVals(v => ({ ...v, [key]: Math.min(max, Math.max(min, v[key] + delta)) }))
      setSaved(false)
    }
    function Counter({ label, sub, k, min, max }: { label: string; sub: string; k: keyof typeof LIMITS_CONFIG; min: number; max: number }) {
      return (
        <div style={{ padding: "16px 18px", borderRadius: 12, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => adj(k, -1, min, max)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E0E4EF", background: "white", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--blue)", minWidth: 36, textAlign: "center" }}>{vals[k]}</span>
            <button onClick={() => adj(k, +1, min, max)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E0E4EF", background: "white", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        </div>
      )
    }
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>Platform Settings</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Configure session limits, booking policies, and system parameters</div>
          </div>
          <Btn variant="primary" onClick={() => { setSaved(true); showToast("Settings saved ✓") }}>
            Save Changes
          </Btn>
        </div>

        {saved && (
          <div style={{ padding: "10px 16px", borderRadius: 10, background: "#ECFDF5", border: "1.5px solid #6EE7B7", marginBottom: 20, fontSize: 13, color: "#065F46", fontWeight: 600 }}>
            ✓ Settings saved successfully
          </div>
        )}

        {/* Student limits */}
        <Card style={{ padding: "22px", marginBottom: 20 }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Student Session Limits</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Control how many sessions students can book per week and per semester.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Counter label="Sessions per Week" sub="Max bookings a student can make in 7 days" k="studentSessionsPerWeek" min={1} max={7} />
            <Counter label="Sessions per Semester" sub="Hard cap across the full semester" k="studentSessionsPerSemester" min={5} max={60} />
          </div>
        </Card>

        {/* Tutor limits */}
        <Card style={{ padding: "22px", marginBottom: 20 }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Tutor Capacity Limits</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Set maximum workloads to stay within budget and protect tutor availability.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Counter label="Sessions per Week (Tutor)" sub="Max sessions a single tutor can take per week" k="tutorSessionsPerWeek" min={1} max={15} />
            <Counter label="Hours per Week (Tutor)" sub="Maximum billable hours per week" k="tutorHoursPerWeek" min={4} max={40} />
            <Counter label="Hours per Semester (Tutor)" sub="Semester hour cap per tutor" k="tutorHoursPerSemester" min={20} max={400} />
          </div>
        </Card>

        {/* Booking policy */}
        <Card style={{ padding: "22px", marginBottom: 20 }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Booking & Cancellation Policy</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Control booking windows, session duration, and cancellation deadlines.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Counter label="Session Duration (min)" sub="Default length of a tutoring session" k="sessionDurationMinutes" min={30} max={120} />
            <Counter label="Advance Booking Window (days)" sub="How many days ahead a student can book" k="advanceBookingDays" min={1} max={30} />
            <Counter label="Cancellation Deadline (hours)" sub="Minimum notice required to cancel without penalty" k="cancellationHours" min={1} max={72} />
          </div>
        </Card>

        {/* Alerts */}
        <Card style={{ padding: "22px" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Budget Alert Threshold</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Trigger a warning email when semester spend hits this percentage.</div>
          <Counter label="Budget Alert at %" sub="Email the Director when this % of budget is spent" k="semesterBudgetAlert" min={50} max={95} />
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "var(--gold-light)", border: "1px solid var(--gold)", fontSize: 12, color: "#92660A" }}>
            Currently set to alert at <strong>{vals.semesterBudgetAlert}%</strong> — an email will be sent to tutoring@ncf.edu when spend reaches ${Math.round(BUDGET_DATA.total * vals.semesterBudgetAlert / 100).toLocaleString()}.
          </div>
        </Card>
      </div>
    )
  }

  const screens: Record<string, React.ReactNode> = {
    dashboard:      <DashboardScreen />,
    approvals:      <ApprovalsScreen />,
    tutors:         <TutorsScreen />,
    sessions:       <TutorsScreen />,
    accountability: <AccountabilityScreen />,
    insights:       <InsightsScreen />,
    budget:         <BudgetScreen />,
    hiring:         <HiringScreen />,
    reports:        <ReportsScreen />,
    privacy:        <PrivacyScreen />,
    settings:       <SettingsScreen />,
  }

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "DM Sans, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
        {screens[screen] || <DashboardScreen />}
      </div>

      {/* Action modal */}
      {actionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setActionModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "28px", width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 6 }}>
              {actionModal.type === "approve" ? "✓ Approve Tutor" : "✕ Reject Application"}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              {actionModal.type === "approve"
                ? `${actionModal.tutor.name} will be notified by email and added to the tutor roster.`
                : `${actionModal.tutor.name}'s application will be rejected. Provide optional feedback below.`}
            </div>
            {actionModal.type === "reject" && (
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                placeholder="Feedback for applicant (optional)…"
                style={{ width: "100%", height: 80, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "none", boxSizing: "border-box", marginBottom: 16 }} />
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setActionModal(null)}>Cancel</Btn>
              {actionModal.type === "approve"
                ? <Btn variant="primary" onClick={() => approveTutor(actionModal.tutor.id)}>Approve</Btn>
                : <Btn variant="danger"  onClick={() => rejectTutor(actionModal.tutor.id)}>Reject</Btn>}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, padding: "12px 20px",
          background: toast.color === "green" ? "#059669" : "#DC2626",
          color: "white", borderRadius: 10, fontWeight: 600, fontSize: 13,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, fontFamily: "DM Sans, sans-serif",
        }}>{toast.msg}</div>
      )}
    </div>
  )
}
