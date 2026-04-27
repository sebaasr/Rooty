"use client"

import { useState } from "react"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Avatar, Pill, Badge, Btn, Card, StarRating, SectionHeader, EmptyState } from "@/components/ui/index"
import { TUTORS, SUBJECTS, SESSIONS, STUDENT_WEEK, TUTOR_REQUIREMENTS } from "@/lib/data"

type Panel = "detail" | "booking" | "confirmed" | null
type Tutor = typeof TUTORS[0]
type Session = typeof SESSIONS[0]

const NAV = [
  { key: "directory", icon: "search",      label: "Find Tutors"      },
  { key: "sessions",  icon: "calendar",    label: "My Sessions"      },
  { key: "apply",     icon: "briefcase",   label: "Become a Tutor"   },
  { key: "profile",   icon: "user",        label: "My Profile"       },
]

function Sidebar({ screen, setScreen }: { screen: string; setScreen: (s: string) => void }) {
  return (
    <div style={{ width: 220, background: "var(--blue)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 22px 28px" }}>
        <RootyWordmark inverted />
        <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>Student</div>
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
      {/* Session limit mini-widget */}
      <div style={{ margin: "0 12px 12px", padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 6 }}>SESSIONS THIS WEEK</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {Array.from({ length: STUDENT_WEEK.sessionLimit }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < STUDENT_WEEK.sessionsUsed ? "var(--gold)" : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
          {STUDENT_WEEK.sessionsUsed}/{STUDENT_WEEK.sessionLimit} used · {STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed} remaining
        </div>
      </div>
      <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials="RS" size={32} bg="rgba(255,255,255,0.2)" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Riley Sanchez</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>Student</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MeetingBadge({ session }: { session: Pick<Session, "mode"|"meetingType"|"meetingLink"|"location"> }) {
  if (session.mode === "Online" && session.meetingLink) {
    const isZoom = session.meetingType === "zoom"
    return (
      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600,
        background: isZoom ? "#2D8CFF" : "#34A853", color: "white",
      }}>
        <Icon name="video" size={12} color="white" />
        {isZoom ? "Join Zoom" : "Join Google Meet"}
      </a>
    )
  }
  if (session.mode === "In-Person" && session.location) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
        <Icon name="pin" size={12} color="var(--muted)" /> {session.location}
      </span>
    )
  }
  return null
}

function DirectoryScreen({ setScreen }: { setScreen: (s: string) => void }) {
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [selectedSlot, setSelectedSlot]   = useState<string | null>(null)
  const [panel, setPanel]                 = useState<Panel>(null)
  const [filterSubject, setFilterSubject] = useState<string | null>(null)
  const [searchQuery, setSearchQuery]     = useState("")
  const [bookingMode, setBookingMode]     = useState<string | null>(null)
  const [bookingSubject, setBookingSubject]= useState<string | null>(null)

  const atLimit = STUDENT_WEEK.sessionsUsed >= STUDENT_WEEK.sessionLimit

  const filtered = TUTORS.filter(t => {
    const matchSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchSubject = !filterSubject || t.subjects.includes(filterSubject)
    return matchSearch && matchSubject
  })

  function openTutor(t: Tutor) { setSelectedTutor(t); setPanel("detail"); setSelectedSlot(null) }
  function startBooking() {
    if (!selectedTutor) return
    setBookingMode(selectedTutor.mode[0])
    setBookingSubject(selectedTutor.subjects[0])
    setPanel("booking")
  }
  function closePanel() { setPanel(null); setSelectedTutor(null) }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Main list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", margin: 0 }}>Find a Tutor</h1>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{TUTORS.length} peer tutors available at NCF</div>
          </div>
        </div>

        {/* Limit warning */}
        {atLimit && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "#FEF2F2", border: "1.5px solid #FCA5A5", marginBottom: 16, display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#991B1B", fontWeight: 500 }}>
            <Icon name="warning" size={15} color="#991B1B" />
            You&apos;ve used all {STUDENT_WEEK.sessionLimit} sessions for this week. New bookings will start next Monday.
          </div>
        )}
        {!atLimit && STUDENT_WEEK.sessionsUsed > 0 && (
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--gold-light)", border: "1px solid var(--gold)", marginBottom: 16, display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#92660A" }}>
            <Icon name="info" size={13} color="#92660A" />
            {STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed} session{STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed !== 1 ? "s" : ""} remaining this week
          </div>
        )}

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Icon name="search" size={15} color="#9CA3AF" />
            </div>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or subject…"
              style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", background: "white", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Pill label="All" active={!filterSubject} onClick={() => setFilterSubject(null)} />
            {SUBJECTS.slice(0, 6).map(s => (
              <Pill key={s} label={s} active={filterSubject === s} onClick={() => setFilterSubject(filterSubject === s ? null : s)} />
            ))}
          </div>
        </div>

        {/* Tutor grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {filtered.map(t => {
            const tutorAtLimit = t.weeklySessionsUsed >= t.weeklySessionLimit
            return (
              <Card key={t.id} hover onClick={() => openTutor(t)} style={{
                padding: "20px", cursor: "pointer",
                outline: selectedTutor?.id === t.id && panel === "detail" ? "2px solid var(--blue)" : "none",
                opacity: tutorAtLimit ? 0.65 : 1,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <Avatar initials={t.avatar} size={48} bg="var(--blue)" />
                  <div>
                    <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{t.name}</div>
                    <StarRating value={t.rating} size={12} />
                  </div>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
                  {t.bio}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {t.subjects.slice(0, 3).map(s => <Pill key={s} label={s} size="sm" />)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {t.mode.map(m => <span key={m} style={{ fontSize: 11, color: "var(--muted)" }}>{m === "Online" ? "💻" : "📍"} {m}</span>)}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: tutorAtLimit ? "#DC2626" : "#059669" }}>
                    {tutorAtLimit ? "At session limit" : "Available"}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Detail panel */}
      {panel === "detail" && selectedTutor && (
        <div style={{ width: 340, borderLeft: "1px solid #EEF1F8", background: "white", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ background: "var(--blue)", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button onClick={closePanel} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar initials={selectedTutor.avatar} size={56} bg="rgba(255,255,255,0.2)" style={{ border: "2px solid rgba(255,255,255,0.4)" }} />
              <div>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "white" }}>{selectedTutor.name}</div>
                <StarRating value={selectedTutor.rating} size={13} />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{selectedTutor.reviews} reviews</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "20px" }}>
            {/* Sessions per week indicator */}
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg)", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>TUTOR AVAILABILITY THIS WEEK</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {Array.from({ length: selectedTutor.weeklySessionLimit }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i < selectedTutor.weeklySessionsUsed ? "var(--blue)" : "#E0E4EF" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>
                {selectedTutor.weeklySessionsUsed}/{selectedTutor.weeklySessionLimit} sessions booked this week
              </div>
            </div>
            <SectionHeader title="Subjects" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {selectedTutor.subjects.map(s => <Pill key={s} label={s} />)}
            </div>
            <SectionHeader title="About" />
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>{selectedTutor.bio}</p>
            <SectionHeader title="Available Slots" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {selectedTutor.availability.map((slot, i) => (
                <button key={i} onClick={() => setSelectedSlot(slot)} style={{
                  padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                  background: selectedSlot === slot ? "var(--blue)" : "var(--bg)",
                  border: `1.5px solid ${selectedSlot === slot ? "var(--blue)" : "#E0E4EF"}`,
                  color: selectedSlot === slot ? "white" : "var(--text)",
                  fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 500,
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>📅 {slot}</span>
                  {selectedSlot === slot && <span>✓</span>}
                </button>
              ))}
            </div>
            {atLimit ? (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FCA5A5", fontSize: 13, color: "#991B1B", fontWeight: 500 }}>
                Weekly session limit reached. Come back next Monday to book more sessions.
              </div>
            ) : (
              <Btn fullWidth variant="gold" disabled={!selectedSlot} onClick={startBooking}>Book this Tutor</Btn>
            )}
          </div>
        </div>
      )}

      {/* Booking panel */}
      {panel === "booking" && selectedTutor && (
        <div style={{ width: 360, borderLeft: "1px solid #EEF1F8", background: "white", overflowY: "auto", flexShrink: 0, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setPanel("detail")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--blue)" }}>‹</button>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Book a Session</div>
          </div>
          <Card style={{ padding: "16px", marginBottom: 20, background: "var(--blue-light)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar initials={selectedTutor.avatar} size={44} bg="var(--blue)" />
              <div>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700 }}>{selectedTutor.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{selectedSlot}</div>
              </div>
            </div>
          </Card>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Subject</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedTutor.subjects.map(s => (
                <button key={s} onClick={() => setBookingSubject(s)} style={{
                  padding: "7px 14px", borderRadius: 99, cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 12,
                  background: bookingSubject === s ? "var(--blue)" : "white",
                  color: bookingSubject === s ? "white" : "var(--muted)",
                  border: `1.5px solid ${bookingSubject === s ? "var(--blue)" : "#E0E4EF"}`,
                }}>{s}</button>
              ))}
            </div>
          </div>
          {selectedTutor.mode.length > 1 && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Format</label>
              <div style={{ display: "flex", gap: 10 }}>
                {selectedTutor.mode.map(m => (
                  <button key={m} onClick={() => setBookingMode(m)} style={{
                    flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13,
                    background: bookingMode === m ? "var(--blue)" : "white",
                    color: bookingMode === m ? "white" : "var(--muted)",
                    border: `1.5px solid ${bookingMode === m ? "var(--blue)" : "#E0E4EF"}`,
                  }}>{m === "Online" ? "💻" : "📍"} {m}</button>
                ))}
              </div>
            </div>
          )}
          {/* Location / meeting preview */}
          {bookingMode === "Online" && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "#F0FFF4", border: "1px solid #6EE7B7", marginBottom: 16, fontSize: 12, color: "#065F46" }}>
              <Icon name="video" size={13} color="#065F46" /> A Google Meet or Zoom link will be generated and emailed to you.
            </div>
          )}
          {bookingMode === "In-Person" && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", marginBottom: 16, fontSize: 12, color: "var(--blue)", display: "flex", gap: 6, alignItems: "center" }}>
              <Icon name="pin" size={13} color="var(--blue)" /> Location: <strong>Hamilton Center · Room 101</strong>
            </div>
          )}
          <div style={{ padding: "16px", borderRadius: 10, background: "var(--bg)", marginBottom: 20 }}>
            {[["Tutor", selectedTutor.name], ["Date/Time", selectedSlot], ["Subject", bookingSubject], ["Format", bookingMode]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #EEF1F8", fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>Sessions remaining</span>
              <span style={{ fontWeight: 600, color: "var(--blue)" }}>{STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed - 1} after this booking</span>
            </div>
          </div>
          <Btn fullWidth variant="gold" onClick={() => setPanel("confirmed")}>Confirm Booking</Btn>
        </div>
      )}

      {/* Confirmed panel */}
      {panel === "confirmed" && selectedTutor && (
        <div style={{ width: 360, borderLeft: "1px solid #EEF1F8", background: "white", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--text)", marginBottom: 8 }}>Booking Confirmed!</div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
            Session with <strong>{selectedTutor.name}</strong> on <strong>{selectedSlot}</strong>.
          </p>
          {bookingMode === "Online" ? (
            <div style={{ width: "100%", padding: "14px", borderRadius: 10, background: "#F0FFF4", border: "1px solid #6EE7B7", marginBottom: 16, fontSize: 13, color: "#065F46", textAlign: "left" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📧 Meeting link sent to your NCF email</div>
              <div style={{ fontSize: 12 }}>A Google Meet link has been generated. You can also find it in My Sessions.</div>
            </div>
          ) : (
            <div style={{ width: "100%", padding: "14px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", marginBottom: 16, fontSize: 13, color: "var(--blue)", textAlign: "left" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📍 Hamilton Center · Room 101</div>
              <div style={{ fontSize: 12 }}>Arrive 5 minutes early. Show your NCF ID at the front desk.</div>
            </div>
          )}
          <Btn fullWidth variant="primary" onClick={closePanel}>Back to Directory</Btn>
          <button onClick={() => { closePanel(); setScreen("sessions") }} style={{ marginTop: 10, background: "none", border: "none", fontSize: 13, color: "var(--blue)", cursor: "pointer", fontWeight: 600 }}>
            View My Sessions →
          </button>
        </div>
      )}
    </div>
  )
}

function SessionsScreen() {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming")
  const [ratingTarget, setRatingTarget] = useState<Session | null>(null)
  const [starValue, setStarValue]       = useState(0)
  const [ratings, setRatings]           = useState<Record<number, number>>({})
  const filtered = SESSIONS.filter(s => s.status === tab)

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* Weekly usage banner */}
      <Card style={{ padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, background: "var(--blue-light)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            <span style={{ color: "var(--text)" }}>Sessions this week</span>
            <span style={{ color: "var(--blue)" }}>{STUDENT_WEEK.sessionsUsed} / {STUDENT_WEEK.sessionLimit} used</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: STUDENT_WEEK.sessionLimit }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: i < STUDENT_WEEK.sessionsUsed ? "var(--blue)" : "#D1D5DB" }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
            {STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed} session{STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed !== 1 ? "s" : ""} remaining this week · Limit resets every Monday
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--blue)" }}>{STUDENT_WEEK.hoursUsed}h</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>of {STUDENT_WEEK.hourLimit}h this week</div>
        </div>
      </Card>

      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 20 }}>My Sessions</h1>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid #EEF1F8" }}>
        {(["upcoming", "completed"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
            color: tab === t ? "var(--blue)" : "var(--muted)",
            borderBottom: tab === t ? "2px solid var(--blue)" : "2px solid transparent",
            marginBottom: -2, textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>
      {filtered.length === 0
        ? <EmptyState icon="📅" title="No sessions" sub={tab === "upcoming" ? "Book a tutor to get started" : "Your completed sessions will appear here"} />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(s => (
              <Card key={s.id} style={{ padding: "20px" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <Avatar initials={s.avatar} size={48} bg="var(--blue)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16 }}>{s.tutor}</div>
                      <Badge label={s.status} color={s.status === "upcoming" ? "blue" : "green"} />
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      {s.date} · {s.time}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                      <Pill label={s.subject} size="sm" />
                      <MeetingBadge session={s} />
                    </div>
                  </div>
                  <div>
                    {s.status === "completed" && !ratings[s.id] && (
                      <button onClick={() => setRatingTarget(s)} style={{
                        padding: "8px 16px", borderRadius: 99, border: "1.5px solid var(--gold)",
                        background: "var(--gold-light)", color: "#92660A",
                        fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer",
                      }}>⭐ Rate</button>
                    )}
                    {ratings[s.id] && <StarRating value={ratings[s.id]} />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      {/* Rating modal */}
      {ratingTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => { setRatingTarget(null); setStarValue(0) }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "32px", width: 360, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <Avatar initials={ratingTarget.avatar} size={56} bg="var(--blue)" style={{ margin: "0 auto 12px" }} />
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{ratingTarget.tutor}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>{ratingTarget.date} · {ratingTarget.subject}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setStarValue(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 32 }}>
                  {i <= starValue ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <Btn fullWidth variant="gold" disabled={starValue === 0}
              onClick={() => { setRatings(r => ({ ...r, [ratingTarget.id]: starValue })); setRatingTarget(null); setStarValue(0) }}>
              Submit Rating
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}

function ApplyScreen() {
  const [step, setStep] = useState<"info" | "form" | "submitted">("info")
  const [form, setForm] = useState({ name: "", email: "", year: "", gpa: "", subjects: [] as string[], bio: "", facultyRef: "", hours: "" })

  function toggleSubject(s: string) {
    setForm(f => ({ ...f, subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s] }))
  }

  if (step === "submitted") return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 40 }}>🎉</div>
        <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", marginBottom: 8 }}>Application Submitted!</div>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
          Thanks, {form.name.split(" ")[0]}! Your tutor application has been received. The Director of Tutoring will review it within 3–5 business days and contact you at your NCF email.
        </p>
        <Card style={{ padding: "16px", textAlign: "left", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 8 }}>What Happens Next</div>
          {[
            "Director reviews your application (3–5 days)",
            "Faculty reference contacted for verification",
            "Interview scheduled if application approved",
            "Tutor training module sent upon offer",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 13, color: "var(--text)" }}>
              <span style={{ color: "var(--blue)", fontWeight: 700 }}>{i + 1}.</span> {s}
            </div>
          ))}
        </Card>
        <Btn variant="outline" onClick={() => setStep("info")}>Back to Requirements</Btn>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", marginBottom: 4 }}>Become a Peer Tutor</h1>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Help your peers succeed while earning $12/hr · New College of Florida</div>

      {step === "info" && (
        <>
          {/* Why tutor */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
            {[
              { icon:"dollar",     title:"$12 / hr",         sub:"Competitive hourly pay, processed bi-weekly through NCF payroll" },
              { icon:"clock",      title:"Flexible Hours",    sub:"Choose your own schedule, minimum 4 hrs/week" },
              { icon:"star",       title:"Build Your Resume", sub:"Mentorship, leadership, and academic engagement" },
            ].map(b => (
              <Card key={b.title} style={{ padding: "20px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon name={b.icon} size={18} color="var(--blue)" />
                </div>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{b.sub}</div>
              </Card>
            ))}
          </div>

          {/* Requirements */}
          <Card style={{ padding: "24px", marginBottom: 24 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 14 }}>Application Requirements</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TUTOR_REQUIREMENTS.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: "var(--bg)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

          <Btn variant="gold" onClick={() => setStep("form")}>
            Start Application <Icon name="arrow-right" size={14} color="#1C1C1C" />
          </Btn>
        </>
      )}

      {step === "form" && (
        <Card style={{ padding: "28px", maxWidth: 640 }}>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 20 }}>Tutor Application</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              { label:"Full Name",     key:"name",       placeholder:"Your full name"       },
              { label:"NCF Email",     key:"email",      placeholder:"you@ncf.edu"          },
              { label:"Year Standing", key:"year",       placeholder:"Sophomore, Junior…"   },
              { label:"Cumulative GPA",key:"gpa",        placeholder:"3.5 or higher"        },
              { label:"Faculty Reference",key:"facultyRef",placeholder:"Prof. Name, Dept." },
              { label:"Available hrs/wk", key:"hours",   placeholder:"e.g. 8"              },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{f.label}</label>
                <input
                  value={form[f.key as keyof typeof form] as string}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", boxSizing: "border-box" as const }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Subjects You Can Tutor</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => toggleSubject(s)} style={{
                  padding: "5px 13px", borderRadius: 99, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${form.subjects.includes(s) ? "var(--blue)" : "#E0E4EF"}`,
                  background: form.subjects.includes(s) ? "var(--blue)" : "white",
                  color: form.subjects.includes(s) ? "white" : "var(--muted)",
                  fontFamily: "DM Sans, sans-serif",
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Why do you want to be a tutor?</label>
            <textarea value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about your academic background and why you want to help your peers…"
              style={{ width: "100%", height: 100, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "none", boxSizing: "border-box" as const }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="gold" onClick={() => setStep("submitted")}>Submit Application</Btn>
            <Btn variant="ghost" onClick={() => setStep("info")}>Back</Btn>
          </div>
        </Card>
      )}
    </div>
  )
}

function ProfileScreen({ setScreen }: { setScreen: (s: string) => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 640 }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 24 }}>My Profile</h1>
      <Card style={{ padding: "28px", marginBottom: 20, display: "flex", gap: 20, alignItems: "center" }}>
        <Avatar initials="RS" size={72} bg="var(--blue)" />
        <div>
          <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--text)" }}>Riley Sanchez</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>riley.sanchez@ncf.edu</div>
          <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge label="Student" color="blue" />
            <Badge label="Spring 2026" color="gray" />
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Sessions",     value: "7",    icon: "calendar"  },
          { label: "Avg. Rating Given",  value: "4.8★", icon: "star"      },
          { label: "Subjects Explored",  value: "5",    icon: "book-open" },
        ].map(s => (
          <Card key={s.label} style={{ padding: "18px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
              <Icon name={s.icon} size={22} color="var(--blue)" />
            </div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--blue)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {/* Become a tutor CTA */}
      <Card style={{ padding: "20px", marginBottom: 20, background: "linear-gradient(135deg, var(--blue) 0%, #1a4a9e 100%)", cursor: "pointer" }} onClick={() => setScreen("apply")}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="briefcase" size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "white", marginBottom: 2 }}>Become a Peer Tutor</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Earn $12/hr helping your peers · Apply in 5 minutes</div>
          </div>
          <Icon name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="outline">Edit Profile</Btn>
        <Btn variant="ghost" style={{ color: "#991B1B" }}>Sign Out</Btn>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const [screen, setScreen] = useState("directory")

  const screens: Record<string, React.ReactNode> = {
    directory: <DirectoryScreen setScreen={setScreen} />,
    sessions:  <SessionsScreen />,
    apply:     <ApplyScreen />,
    profile:   <ProfileScreen setScreen={setScreen} />,
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
