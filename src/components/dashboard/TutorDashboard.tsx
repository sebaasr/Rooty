"use client"

import { useState, useEffect } from "react"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Avatar, Pill, Badge, Btn, Card, StatCard, SectionHeader, EmptyState } from "@/components/ui/index"
import { TUTORS, TUTOR_SESSIONS } from "@/lib/data"

const tutor    = TUTORS[0]
const upcoming = TUTOR_SESSIONS.filter(s => s.status === "upcoming")
const past     = TUTOR_SESSIONS.filter(s => s.status === "completed")
const pctHours = Math.round((tutor.hours / tutor.hoursMax) * 100)
const sessionsLeft = tutor.weeklySessionLimit - tutor.weeklySessionsUsed

const NAV = [
  { key: "dashboard",    icon: "home",     label: "Dashboard"    },
  { key: "sessions",     icon: "calendar", label: "Sessions"     },
  { key: "checkin",      icon: "check-circle", label: "Check-In" },
  { key: "availability", icon: "clock",    label: "Availability" },
  { key: "profile",      icon: "user",     label: "My Profile"   },
]

const DAYS       = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const TIME_SLOTS = ["8am–10am","10am–12pm","12pm–2pm","2pm–4pm","4pm–6pm","6pm–8pm"]

function MeetingInfo({ session }: { session: (typeof TUTOR_SESSIONS)[0] }) {
  if (session.mode === "Online" && session.meetingLink) {
    const isZoom = session.meetingType === "zoom"
    return (
      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 8, textDecoration: "none", fontSize: 11, fontWeight: 600,
        background: isZoom ? "#2D8CFF" : "#34A853", color: "white",
      }}>
        <Icon name="video" size={11} color="white" />
        {isZoom ? "Zoom" : "Google Meet"}
      </a>
    )
  }
  if (session.mode === "In-Person" && session.location) {
    return (
      <span style={{ fontSize: 11, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Icon name="pin" size={11} color="var(--muted)" /> {session.location}
      </span>
    )
  }
  return null
}

function Sidebar({ screen, setScreen }: { screen: string; setScreen: (s: string) => void }) {
  return (
    <div style={{ width: 220, background: "var(--blue)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 22px 28px" }}>
        <RootyWordmark inverted />
        <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Tutor Portal</div>
      </div>
      <nav style={{ flex: 1 }}>
        {NAV.map(item => {
          const active = screen === item.key
          return (
            <button key={item.key} onClick={() => setScreen(item.key)} style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 22px",
              background: active ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: active ? "3px solid var(--gold)" : "3px solid transparent",
              border: "none", cursor: "pointer", textAlign: "left",
              color: active ? "#fff" : "rgba(255,255,255,0.6)",
              fontFamily: "DM Sans, sans-serif", fontWeight: active ? 600 : 400, fontSize: 14,
            }}>
              <Icon name={item.icon} size={16} color={active ? "#fff" : "rgba(255,255,255,0.5)"} strokeWidth={active ? 2 : 1.5} />
              {item.label}
            </button>
          )
        })}
      </nav>
      {/* Sessions remaining mini-widget */}
      <div style={{ margin: "0 12px 12px", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 6 }}>SESSIONS THIS WEEK</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
          {Array.from({ length: tutor.weeklySessionLimit }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i < tutor.weeklySessionsUsed ? "var(--gold)" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: sessionsLeft === 0 ? "#FCA5A5" : "rgba(255,255,255,0.7)", fontWeight: 500 }}>
          {tutor.weeklySessionsUsed}/{tutor.weeklySessionLimit} done · {sessionsLeft} slot{sessionsLeft !== 1 ? "s" : ""} left
        </div>
      </div>
      <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={tutor.avatar} size={32} bg="rgba(255,255,255,0.2)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{tutor.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Tutor</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardScreen({ setScreen }: { setScreen: (s: string) => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0 }}>
            Good morning, {tutor.name.split(" ")[0]} 👋
          </h1>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>Here&apos;s your week at a glance</div>
        </div>
        <Avatar initials={tutor.avatar} size={44} bg="var(--blue)" />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {/* Hours card */}
        <Card style={{ padding: "18px", background: "linear-gradient(135deg, var(--blue) 0%, #1a4a9e 100%)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Hours This Week</div>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "white" }}>
            {tutor.hours}<span style={{ fontSize: 14, opacity: 0.7 }}>/{tutor.hoursMax}h</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.2)", marginTop: 8 }}>
            <div style={{ height: 4, borderRadius: 99, width: `${pctHours}%`, background: pctHours >= 80 ? "var(--gold)" : "white" }} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
            {pctHours >= 80 ? "⚠ Approaching cap" : `${tutor.hoursMax - tutor.hours}h remaining`}
          </div>
        </Card>

        {/* Sessions card */}
        <Card style={{ padding: "18px" }}>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 4 }}>Sessions This Week</div>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)" }}>
            {tutor.weeklySessionsUsed}<span style={{ fontSize: 14, color: "var(--muted)" }}>/{tutor.weeklySessionLimit}</span>
          </div>
          <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
            {Array.from({ length: tutor.weeklySessionLimit }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < tutor.weeklySessionsUsed ? "var(--gold)" : "#E0E4EF" }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: sessionsLeft === 0 ? "#DC2626" : "var(--muted)", marginTop: 4, fontWeight: sessionsLeft === 0 ? 600 : 400 }}>
            {sessionsLeft === 0 ? "Limit reached this week" : `${sessionsLeft} slot${sessionsLeft !== 1 ? "s" : ""} remaining`}
          </div>
        </Card>

        <StatCard label="Avg Rating"     value={`${tutor.rating}★`}        icon="star"     color="green"  sub={`${tutor.reviews} reviews`} />
        <StatCard label="Estimated Pay"  value={`$${tutor.hours * tutor.rate}`} icon="dollar" color="purple" sub="this week" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Upcoming sessions */}
        <Card style={{ padding: "22px" }}>
          <SectionHeader title="Upcoming Sessions" action="View all" onAction={() => setScreen("sessions")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.length === 0
              ? <EmptyState icon="📅" title="No upcoming sessions" sub="Your schedule is clear" />
              : upcoming.map(s => (
                <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px", borderRadius: 10, background: "var(--bg)" }}>
                  <Avatar initials={s.studentAvatar} size={40} bg="var(--blue)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{s.student}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.date} · {s.time}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
                      <Pill label={s.subject} size="sm" />
                      <MeetingInfo session={s} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* My subjects + pay */}
        <Card style={{ padding: "22px" }}>
          <SectionHeader title="My Subjects" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {tutor.subjects.map(s => <Pill key={s} label={s} active />)}
          </div>
          <SectionHeader title="Session Modes" />
          <div style={{ display: "flex", gap: 10 }}>
            {tutor.mode.map(m => (
              <div key={m} style={{ flex: 1, padding: "14px", borderRadius: 10, background: "var(--blue-light)", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                  <Icon name={m === "Online" ? "video" : "pin"} size={20} color="var(--blue)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "12px", borderRadius: 10, background: "var(--gold-light)", border: "1px solid var(--gold)" }}>
            <div style={{ fontSize: 12, color: "#92660A", fontWeight: 600 }}>Pay Rate</div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>${tutor.rate}/hr</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Configured by Director</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function SessionsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming")
  const list = tab === "upcoming" ? upcoming : past
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 20 }}>Sessions</h1>

      {/* Week summary */}
      <Card style={{ padding: "16px 20px", marginBottom: 20, display: "flex", gap: 20, alignItems: "center", background: "var(--blue-light)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            <span>Weekly session usage</span>
            <span style={{ color: "var(--blue)" }}>{tutor.weeklySessionsUsed}/{tutor.weeklySessionLimit}</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: tutor.weeklySessionLimit }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < tutor.weeklySessionsUsed ? "var(--blue)" : "#D1D5DB" }} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--blue)" }}>${tutor.hours * tutor.rate}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>earned this week</div>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid #EEF1F8" }}>
        {(["upcoming", "completed"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
            color: tab === t ? "var(--blue)" : "var(--muted)",
            borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent",
            marginBottom: -2, textTransform: "capitalize",
          }}>{t} ({(tab === "upcoming" ? upcoming : past).length})</button>
        ))}
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #EEF1F8", background: "var(--bg)" }}>
              {["Student","Subject","Date & Time","Meeting","Status","Action"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid #F5F6FA" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={s.studentAvatar} size={32} bg="var(--blue)" />
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{s.student}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}><Pill label={s.subject} size="sm" /></td>
                <td style={{ padding: "12px 16px", color: "var(--muted)" }}>{s.date} · {s.time}</td>
                <td style={{ padding: "12px 16px" }}><MeetingInfo session={s} /></td>
                <td style={{ padding: "12px 16px" }}><Badge label={s.status} color={s.status === "upcoming" ? "blue" : "green"} /></td>
                <td style={{ padding: "12px 16px" }}>
                  {s.status === "upcoming"
                    ? <Badge label="Upcoming" color="blue" />
                    : <Btn size="sm" variant="ghost">View Notes</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function CheckInScreen() {
  const [checkedIn, setCheckedIn]       = useState(false)
  const [checkInTime, setCheckInTime]   = useState<number | null>(null)
  const [checkedOut, setCheckedOut]     = useState(false)
  const [sessionNotes, setSessionNotes] = useState("")
  const [elapsed, setElapsed]           = useState(0)
  const s = upcoming[0]

  useEffect(() => {
    if (!checkedIn || !checkInTime) return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - checkInTime) / 60000)), 10000)
    return () => clearInterval(id)
  }, [checkedIn, checkInTime])

  if (!s) return <EmptyState icon="📅" title="No upcoming session" sub="Check back when you have a booking" />

  if (checkedOut) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="check-circle" size={40} color="#059669" />
        </div>
        <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 8 }}>Session Complete!</div>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
          1h 30m logged with {s.student}. Notes saved to session record.
        </p>
        <Card style={{ padding: "16px", marginBottom: 20, textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Session Notes</div>
          <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.5 }}>{sessionNotes || "No notes added."}</p>
        </Card>
        <Btn variant="primary" onClick={() => { setCheckedIn(false); setCheckedOut(false); setSessionNotes(""); setElapsed(0) }}>
          Back to Dashboard
        </Btn>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 24 }}>Session Check-In</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880 }}>
        <div>
          <Card style={{ padding: "20px", marginBottom: 16, background: "var(--blue-light)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar initials={s.studentAvatar} size={52} bg="var(--blue)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>{s.student}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", margin: "2px 0" }}>{s.subject} · {s.time}</div>
                <div style={{ marginTop: 4 }}><MeetingInfo session={s} /></div>
              </div>
            </div>
          </Card>

          {/* Meeting join button for online sessions */}
          {s.mode === "Online" && s.meetingLink && (
            <div style={{ marginBottom: 16 }}>
              <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10, textDecoration: "none",
                background: s.meetingType === "zoom" ? "#2D8CFF" : "#34A853", color: "white",
                fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 14,
              }}>
                <Icon name="video" size={16} color="white" />
                {s.meetingType === "zoom" ? "Join Zoom Meeting" : "Join Google Meet"}
              </a>
            </div>
          )}

          {/* In-person location */}
          {s.mode === "In-Person" && s.location && (
            <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "white", border: "1px solid #E0E4EF", display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--text)" }}>
              <Icon name="pin" size={16} color="var(--blue)" />
              <div>
                <div style={{ fontWeight: 600 }}>In-Person Location</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{s.location}</div>
              </div>
            </div>
          )}

          {!checkedIn ? (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <button onClick={() => { setCheckedIn(true); setCheckInTime(Date.now()) }} style={{
                width: 160, height: 160, borderRadius: "50%", background: "var(--blue)", border: "none",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", margin: "0 auto", boxShadow: "0 8px 32px rgba(0,48,135,0.3)",
              }}>
                <Icon name="play" size={36} color="white" />
                <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 14, color: "white", marginTop: 6 }}>Check In</span>
              </button>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 20 }}>Tap to begin tracking your session</div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "var(--blue-light)", border: "4px solid var(--blue)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 32, color: "var(--blue)" }}>{elapsed}m</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>elapsed</div>
              </div>
              <Badge label="Session in progress" color="green" />
              <div style={{ marginTop: 20 }}>
                <Btn variant="gold" onClick={() => setCheckedOut(true)}>
                  <Icon name="stop" size={14} color="#1C1C1C" /> Check Out &amp; Save
                </Btn>
              </div>
            </div>
          )}
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Session Notes</label>
          <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)}
            placeholder="What did you cover? Topics explained? Homework reviewed? Any follow-up needed?"
            style={{ width: "100%", height: 220, padding: "14px", borderRadius: 12, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "none", boxSizing: "border-box", marginBottom: 12 }} />
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Notes are saved with the session record and visible to the Director.</div>
        </div>
      </div>
    </div>
  )
}

function AvailabilityScreen() {
  const [selectedDay, setSelectedDay] = useState("Mon")
  const [availSlots, setAvailSlots]   = useState<Record<string, string[]>>({
    Mon: ["10am–12pm","2pm–4pm"], Tue: ["11am–1pm"], Wed: ["2pm–4pm","4pm–6pm"],
    Thu: [], Fri: ["1pm–3pm"], Sat: [], Sun: [],
  })

  function toggleSlot(slot: string) {
    setAvailSlots(prev => {
      const curr = prev[selectedDay]
      const next = curr.includes(slot) ? curr.filter(s => s !== slot) : [...curr, slot]
      return { ...prev, [selectedDay]: next }
    })
  }
  const totalSlots = Object.values(availSlots).reduce((a, b) => a + b.length, 0)

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>My Availability</h1>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>{totalSlots} time slot{totalSlots !== 1 ? "s" : ""} set · Week limit: {tutor.weeklySessionLimit} sessions/week</div>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Day</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DAYS.map(d => {
              const count = availSlots[d].length
              return (
                <button key={d} onClick={() => setSelectedDay(d)} style={{
                  padding: "12px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                  background: selectedDay === d ? "var(--blue)" : "white",
                  color: selectedDay === d ? "white" : "var(--text)",
                  border: `1.5px solid ${selectedDay === d ? "var(--blue)" : "#E0E4EF"}`,
                  fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  {d}
                  {count > 0 && (
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: selectedDay === d ? "rgba(255,255,255,0.2)" : "var(--blue-light)", color: selectedDay === d ? "white" : "var(--blue)", fontWeight: 700 }}>
                      {count} slot{count !== 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Time Slots — {selectedDay}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {TIME_SLOTS.map(slot => {
              const isActive = availSlots[selectedDay].includes(slot)
              return (
                <button key={slot} onClick={() => toggleSlot(slot)} style={{
                  padding: "14px 18px", borderRadius: 10, cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 500,
                  background: isActive ? "var(--blue)" : "white",
                  color: isActive ? "white" : "var(--text)",
                  border: `1.5px solid ${isActive ? "var(--blue)" : "#E0E4EF"}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>🕐 {slot}</span>
                  {isActive && <span style={{ fontSize: 16 }}>✓</span>}
                </button>
              )
            })}
          </div>
          <Btn variant="gold">Save Availability</Btn>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 640 }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 24 }}>My Profile</h1>
      <Card style={{ padding: "28px", marginBottom: 20, display: "flex", gap: 20, alignItems: "center" }}>
        <Avatar initials={tutor.avatar} size={72} bg="var(--blue)" />
        <div>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--text)" }}>{tutor.name}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>maya.chen@ncf.edu</div>
          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            <Badge label="Tutor · Active" color="blue" />
            <Badge label={`${tutor.rating}★`} color="gold" />
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label:"Rating",                 value:`${tutor.rating}★`,                icon:"star"   },
          { label:"Reviews",                value:tutor.reviews,                     icon:"users"  },
          { label:"Sessions (this week)",   value:`${tutor.weeklySessionsUsed}/${tutor.weeklySessionLimit}`, icon:"calendar" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "18px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
              <Icon name={s.icon} size={20} color="var(--blue)" />
            </div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--blue)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding: "20px", marginBottom: 16 }}>
        <SectionHeader title="Subjects" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tutor.subjects.map(s => <Pill key={s} label={s} active />)}
        </div>
      </Card>
      <Card style={{ padding: "20px", marginBottom: 20 }}>
        <SectionHeader title="Bio" />
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>{tutor.bio}</p>
      </Card>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="outline">Edit Profile</Btn>
        <Btn variant="ghost" style={{ color: "#991B1B" }}>Sign Out</Btn>
      </div>
    </div>
  )
}

export default function TutorDashboard() {
  const [screen, setScreen] = useState("dashboard")

  const screens: Record<string, React.ReactNode> = {
    dashboard:    <DashboardScreen setScreen={setScreen} />,
    sessions:     <SessionsScreen />,
    checkin:      <CheckInScreen />,
    availability: <AvailabilityScreen />,
    profile:      <ProfileScreen />,
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar screen={screen} setScreen={setScreen} />
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)", display: "flex" }}>
        {screens[screen]}
      </div>
    </div>
  )
}
