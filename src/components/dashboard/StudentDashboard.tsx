"use client"

import { useState } from "react"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Avatar, Pill, Badge, Btn, Card, StarRating, SectionHeader, EmptyState } from "@/components/ui/index"
import MessagesScreen from "@/components/ui/MessagesScreen"
import { TUTORS, SUBJECTS, SESSIONS, STUDENT_WEEK, STUDENT_SEMESTER, TUTOR_REQUIREMENTS, LOCATIONS, FACULTY_REFERRALS, STUDY_BUDDY_POOL, OFFICE_HOURS, CONVERSATIONS } from "@/lib/data"

type Panel = "detail" | "booking" | "confirmed" | null
type Tutor = typeof TUTORS[0]
type Session = typeof SESSIONS[0]

const UNREAD_REFERRALS = FACULTY_REFERRALS.filter(r => !r.booked).length
const UNREAD_MESSAGES  = CONVERSATIONS.reduce((n, c) => n + c.messages.filter(m => m.from !== "student" && !m.read).length, 0)

const NAV = [
  { key: "directory",    icon: "search",    label: "Find Tutors"      },
  { key: "sessions",     icon: "calendar",  label: "My Sessions"      },
  { key: "messages",     icon: "chat",      label: UNREAD_MESSAGES > 0 ? `Messages (${UNREAD_MESSAGES})` : "Messages" },
  { key: "officehours",  icon: "clock",     label: "Office Hours"     },
  { key: "referrals",    icon: "mail",      label: UNREAD_REFERRALS > 0 ? `Referrals (${UNREAD_REFERRALS})` : "Referrals" },
  { key: "buddy",        icon: "users",     label: "Study Buddy"      },
  { key: "apply",        icon: "briefcase", label: "Become a Tutor"   },
  { key: "profile",      icon: "user",      label: "My Profile"       },
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
  const [bookingMode, setBookingMode]         = useState<string | null>(null)
  const [bookingSubject, setBookingSubject]   = useState<string | null>(null)
  const [bookingLocation, setBookingLocation] = useState<typeof LOCATIONS[0] | null>(null)
  const [bookingType, setBookingType]         = useState<"individual" | "group">("individual")
  const [groupSize, setGroupSize]             = useState(2)
  const [waitlisted, setWaitlisted]           = useState<number[]>([])
  const [showMatchModal, setShowMatchModal]   = useState(false)

  const atLimit = STUDENT_WEEK.sessionsUsed >= STUDENT_WEEK.sessionLimit

  const filtered = TUTORS.filter(t => {
    const matchSearch = !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchSubject = !filterSubject || t.subjects.includes(filterSubject)
    return matchSearch && matchSubject
  })

  function openTutor(t: Tutor) { setSelectedTutor(t); setPanel("detail"); setSelectedSlot(null) }
  function openTutorById(id: number) {
    const t = TUTORS.find(x => x.id === id)
    if (t) openTutor(t)
  }
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
          <button onClick={() => setShowMatchModal(true)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
            background: "var(--blue)", color: "white", border: "none", cursor: "pointer",
            fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontWeight: 600, fontSize: 13,
          }}>
            <Icon name="search" size={14} color="white" />
            Help me choose
          </button>
        </div>
        {showMatchModal && (
          <TutorMatchModal onClose={() => setShowMatchModal(false)} onBook={id => { openTutorById(id); setShowMatchModal(false) }} />
        )}

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
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {t.mode.map(m => (
                      <span key={m} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--muted)" }}>
                        <Icon name={m === "Online" ? "video" : "pin"} size={10} color="var(--muted)" /> {m}
                      </span>
                    ))}
                  </div>
                  {t.crla !== "None" && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, letterSpacing: "0.3px",
                      background: t.crla === "Level II" ? "#DCFCE7" : t.crla === "Level I" ? "#DBEAFE" : "#FEF9C3",
                      color:      t.crla === "Level II" ? "#166534"  : t.crla === "Level I" ? "#1D4ED8"  : "#92660A",
                    }}>CRLA {t.crla}</span>
                  )}
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
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
            {/* CRLA certification badge */}
            {selectedTutor.crla !== "None" && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, padding: "10px 14px", borderRadius: 10,
                background: selectedTutor.crla === "Level II" ? "#DCFCE7" : selectedTutor.crla === "Level I" ? "#DBEAFE" : "#FEF9C3",
                border: `1px solid ${selectedTutor.crla === "Level II" ? "#86EFAC" : selectedTutor.crla === "Level I" ? "#93C5FD" : "#FDE68A"}` }}>
                <Icon name="check-circle" size={14} color={selectedTutor.crla === "Level II" ? "#166534" : selectedTutor.crla === "Level I" ? "#1D4ED8" : "#92660A"} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedTutor.crla === "Level II" ? "#166534" : selectedTutor.crla === "Level I" ? "#1D4ED8" : "#92660A" }}>
                    CRLA {selectedTutor.crla} Certified
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {selectedTutor.crla === "Level II" ? "Advanced certified peer tutor" : selectedTutor.crla === "Level I" ? "Certified peer tutor" : "Certification in progress"}
                  </div>
                </div>
              </div>
            )}
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
            ) : selectedTutor && selectedTutor.weeklySessionsUsed >= selectedTutor.weeklySessionLimit ? (
              waitlisted.includes(selectedTutor.id) ? (
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "#ECFDF5", border: "1px solid #6EE7B7", fontSize: 13, color: "#065F46", fontWeight: 600, display: "flex", gap: 8, alignItems: "center" }}>
                  <Icon name="check-circle" size={15} color="#065F46" /> On waitlist — you&apos;ll be notified when a slot opens.
                </div>
              ) : (
                <div>
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FEF9C3", border: "1px solid var(--gold)", fontSize: 12, color: "#92660A", marginBottom: 10 }}>
                    {selectedTutor.name} is fully booked this week. Join the waitlist and get notified when a slot opens.
                  </div>
                  <Btn fullWidth variant="outline" onClick={() => setWaitlisted(w => [...w, selectedTutor.id])}>
                    <Icon name="clock" size={14} color="var(--blue)" /> Join Waitlist
                  </Btn>
                </div>
              )
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
          {/* Session type: individual vs group */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Session Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["individual", "group"] as const).map(t => (
                <button key={t} onClick={() => setBookingType(t)} style={{
                  flex: 1, padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, textTransform: "capitalize",
                  background: bookingType === t ? "var(--blue)" : "white",
                  color: bookingType === t ? "white" : "var(--muted)",
                  border: `1.5px solid ${bookingType === t ? "var(--blue)" : "#E0E4EF"}`,
                }}>{t === "individual" ? "1-on-1  ·  $12/hr" : "Group  ·  $8/student/hr"}</button>
              ))}
            </div>
            {bookingType === "group" && (
              <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: 10, background: "var(--gold-light)", border: "1px solid var(--gold)", fontSize: 12, color: "#92660A" }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Group size (2–6 students)</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setGroupSize(s => Math.max(2, s - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #F6D860", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>−</button>
                  <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--blue)", minWidth: 20, textAlign: "center" }}>{groupSize}</span>
                  <button onClick={() => setGroupSize(s => Math.min(6, s + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #F6D860", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>+</button>
                  <span style={{ marginLeft: 4 }}>students · <strong>${8 * groupSize}/hr total</strong></span>
                </div>
              </div>
            )}
          </div>

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
                  <button key={m} onClick={() => { setBookingMode(m); setBookingLocation(null) }} style={{
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
          {/* Location / meeting info */}
          {bookingMode === "Online" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Virtual Meeting</label>
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", fontSize: 12, color: "var(--blue)" }}>
                <div style={{ fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="video" size={13} color="var(--blue)" /> Meeting link auto-generated after booking
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#2D8CFF", color: "white" }}>Zoom</span>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: "#00897B", color: "white" }}>Google Meet</span>
                </div>
              </div>
            </div>
          )}
          {bookingMode === "In-Person" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Location</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LOCATIONS.filter(l => l.type !== "virtual").map(loc => (
                  <button key={loc.id} onClick={() => setBookingLocation(loc)} style={{
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                    fontFamily: "DM Sans, sans-serif", fontSize: 12,
                    background: bookingLocation?.id === loc.id ? "var(--blue-light)" : "white",
                    border: `1.5px solid ${bookingLocation?.id === loc.id ? "var(--blue)" : "#E0E4EF"}`,
                    color: "var(--text)", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{loc.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Capacity: {loc.capacity}</div>
                    </div>
                    {bookingLocation?.id === loc.id && <Icon name="check-circle" size={16} color="var(--blue)" />}
                  </button>
                ))}
              </div>
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
              <div style={{ fontSize: 12 }}>A Zoom or Google Meet link has been generated. You can also find it in My Sessions.</div>
            </div>
          ) : (
            <div style={{ width: "100%", padding: "14px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", marginBottom: 16, fontSize: 13, color: "var(--blue)", textAlign: "left" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>📍 {bookingLocation?.name ?? "Location TBD"}</div>
              <div style={{ fontSize: 12 }}>Arrive 5 minutes early. Bring your course materials.</div>
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
  const [viewTab, setViewTab]   = useState<"weekly" | "semester">("weekly")
  const [tab, setTab]           = useState<"upcoming" | "completed">("upcoming")
  const [ratingTarget, setRatingTarget] = useState<Session | null>(null)
  const [starValue, setStarValue]       = useState(0)
  const [ratings, setRatings]           = useState<Record<number, number>>({})
  const [cancelTarget, setCancelTarget] = useState<Session | null>(null)
  const [cancelled, setCancelled]       = useState<number[]>([])
  const filtered = SESSIONS.filter(s => s.status === tab && !cancelled.includes(s.id))

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      {/* Weekly / Semester toggle */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "2px solid #EEF1F8" }}>
        {(["weekly", "semester"] as const).map(t => (
          <button key={t} onClick={() => setViewTab(t)} style={{
            padding: "8px 18px", background: "none", border: "none", cursor: "pointer",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13, textTransform: "capitalize",
            color: viewTab === t ? "var(--blue)" : "var(--muted)",
            borderBottom: viewTab === t ? "2px solid var(--blue)" : "2px solid transparent",
            marginBottom: -2,
          }}>{t === "weekly" ? "This Week" : "This Semester"}</button>
        ))}
      </div>

      {viewTab === "weekly" && (
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
              {STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed} session{STUDENT_WEEK.sessionLimit - STUDENT_WEEK.sessionsUsed !== 1 ? "s" : ""} remaining · Limit resets every Monday
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--blue)" }}>{STUDENT_WEEK.hoursUsed}h</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>of {STUDENT_WEEK.hourLimit}h this week</div>
          </div>
        </Card>
      )}

      {viewTab === "semester" && (
        <Card style={{ padding: "20px", marginBottom: 20, background: "var(--blue-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Spring 2026 Progress</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{STUDENT_SEMESTER.sessionsUsed} of {STUDENT_SEMESTER.sessionCap} sessions used · {STUDENT_SEMESTER.sessionCap - STUDENT_SEMESTER.sessionsUsed} remaining</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--blue)" }}>{Math.round((STUDENT_SEMESTER.sessionsUsed / STUDENT_SEMESTER.sessionCap) * 100)}%</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>of semester cap</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: "#D1D5DB", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ height: 8, borderRadius: 99, width: `${(STUDENT_SEMESTER.sessionsUsed / STUDENT_SEMESTER.sessionCap) * 100}%`, background: "var(--blue)", transition: "width .4s" }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>By Subject</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {STUDENT_SEMESTER.breakdown.map(b => (
              <div key={b.subject} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, width: 120, flexShrink: 0 }}>{b.subject}</div>
                <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#D1D5DB", overflow: "hidden" }}>
                  <div style={{ height: 6, borderRadius: 99, width: `${(b.sessions / STUDENT_SEMESTER.sessionsUsed) * 100}%`, background: "var(--blue)" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--blue)", width: 24, textAlign: "right" }}>{b.sessions}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: "var(--muted)" }}>Total tutoring hours this semester: <strong>{STUDENT_SEMESTER.hoursUsed}h</strong> of {STUDENT_SEMESTER.hourCap}h max</div>
        </Card>
      )}

      {/* Upcoming session reminder */}
      {SESSIONS.filter(s => s.status === "upcoming").slice(0, 1).map(s => (
        <div key={s.id} style={{ padding: "12px 16px", borderRadius: 10, background: "#FFFBEB", border: "1.5px solid var(--gold)", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <Icon name="clock" size={16} color="#92660A" />
          <div style={{ flex: 1, fontSize: 13, color: "#92660A" }}>
            <strong>Upcoming:</strong> Session with <strong>{s.tutor}</strong> on {s.date} at {s.time}
          </div>
          <MeetingBadge session={s} />
        </div>
      ))}
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    {s.status === "upcoming" && (
                      <button onClick={() => setCancelTarget(s)} style={{
                        padding: "6px 14px", borderRadius: 99, border: "1.5px solid #FCA5A5",
                        background: "white", color: "#DC2626", fontFamily: "DM Sans, sans-serif",
                        fontWeight: 600, fontSize: 12, cursor: "pointer",
                      }}>Cancel</button>
                    )}
                    {s.status === "completed" && !ratings[s.id] && (
                      <button onClick={() => setRatingTarget(s)} style={{
                        padding: "8px 16px", borderRadius: 99, border: "1.5px solid var(--gold)",
                        background: "var(--gold-light)", color: "#92660A", display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer",
                      }}>
                        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
                            fill="var(--gold)" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Rate
                      </button>
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
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setStarValue(i)} aria-label={`Rate ${i} star${i !== 1 ? "s" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 8, transition: "transform .15s", display: "flex" }}>
                  <svg width={36} height={36} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
                      fill={i <= starValue ? "var(--gold)" : "#D1D5DB"}
                      stroke={i <= starValue ? "var(--gold)" : "#D1D5DB"}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
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

      {/* Cancel confirmation modal */}
      {cancelTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={() => setCancelTarget(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "32px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="warning" size={24} color="#DC2626" />
            </div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 8 }}>Cancel this session?</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
              Session with <strong>{cancelTarget.tutor}</strong> on <strong>{cancelTarget.date}</strong> at <strong>{cancelTarget.time}</strong>.
            </p>
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF9C3", border: "1px solid var(--gold)", fontSize: 12, color: "#92660A", marginBottom: 20 }}>
              Cancellations made less than 24 hours before the session may count as a no-show. This session slot will be returned to the tutor.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setCancelled(c => [...c, cancelTarget.id]); setCancelTarget(null) }} style={{
                flex: 1, padding: "11px", borderRadius: 10, background: "#DC2626", color: "white", border: "none",
                fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>Yes, cancel session</button>
              <button onClick={() => setCancelTarget(null)} style={{
                flex: 1, padding: "11px", borderRadius: 10, background: "white", color: "var(--muted)", border: "1.5px solid #E0E4EF",
                fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}>Keep it</button>
            </div>
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

// ── TUTOR MATCH MODAL ────────────────────────────────────
function TutorMatchModal({ onClose, onBook }: { onClose: () => void; onBook: (tutorId: number) => void }) {
  const [step, setStep]       = useState(0)
  const [subject, setSubject] = useState<string | null>(null)
  const [mode, setMode]       = useState<string | null>(null)

  const STEPS = [
    { q: "What subject do you need help with?", opts: SUBJECTS.slice(0, 10) },
    { q: "How do you prefer to meet?",          opts: ["Online", "In-Person", "No preference"] },
    { q: "What type of help do you need?",      opts: ["Concept explanation", "Problem sets / practice", "Essay or writing feedback", "Exam prep"] },
  ]

  const matches = TUTORS.filter(t => {
    const subMatch  = !subject || t.subjects.includes(subject)
    const modeMatch = !mode    || mode === "No preference" || t.mode.includes(mode)
    return subMatch && modeMatch
  }).sort((a, b) => b.rating - a.rating).slice(0, 3)

  const done = step >= STEPS.length

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "var(--blue)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 18, color: "white" }}>
              {done ? "Your Best Matches" : "Find Your Tutor"}
            </div>
            {!done && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Step {step + 1} of {STEPS.length}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>
          {!done ? (
            <>
              {/* Progress bar */}
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < step ? "var(--blue)" : i === step ? "var(--gold)" : "#E0E4EF", transition: "background .2s" }} />
                ))}
              </div>
              <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>
                {STEPS[step].q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STEPS[step].opts.map(opt => (
                  <button key={opt} onClick={() => {
                    if (step === 0) setSubject(opt)
                    if (step === 1) setMode(opt)
                    setStep(s => s + 1)
                  }} style={{
                    padding: "12px 16px", borderRadius: 12, textAlign: "left", cursor: "pointer",
                    background: "var(--bg)", border: "1.5px solid #E0E4EF", fontSize: 14,
                    fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontWeight: 500, color: "var(--text)",
                    transition: "all .15s",
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 16, background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  ← Back
                </button>
              )}
            </>
          ) : (
            <>
              {matches.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)", fontSize: 14 }}>
                  No tutors found for that combination. Try adjusting your preferences.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {subject && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Best matches for <strong>{subject}</strong> · {mode ?? "Any mode"}</div>}
                  {matches.map((t, i) => (
                    <div key={t.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", borderRadius: 14, background: i === 0 ? "var(--blue-light)" : "var(--bg)", border: `1.5px solid ${i === 0 ? "var(--blue)" : "#E0E4EF"}` }}>
                      <Avatar initials={t.avatar} size={44} bg="var(--blue)" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                          {t.name}
                          {i === 0 && <Badge label="Best match" color="blue" />}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{t.subjects.slice(0, 2).join(" · ")} · {t.rating}★</div>
                      </div>
                      <Btn size="sm" variant={i === 0 ? "gold" : "outline"} onClick={() => { onBook(t.id); onClose() }}>Book</Btn>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => { setStep(0); setSubject(null); setMode(null) }}
                style={{ marginTop: 16, background: "none", border: "none", color: "var(--blue)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                ← Start over
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── FACULTY REFERRALS SCREEN ─────────────────────────────
function ReferralsScreen({ setScreen }: { setScreen: (s: string) => void }) {
  const [booked, setBooked] = useState<number[]>(FACULTY_REFERRALS.filter(r => r.booked).map(r => r.id))
  const priorityColor = (p: string) => p === "recommended" ? "red" : "gold"

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 720 }}>
      <h1 style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 6 }}>Faculty Referrals</h1>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
        Your professors can send you a direct referral to the Tutoring Center. Each referral links to a specific subject tutor.
      </div>

      {FACULTY_REFERRALS.length === 0 ? (
        <Card style={{ padding: "48px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="mail" size={36} color="var(--muted)" strokeWidth={1.25} />
          </div>
          <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 600, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>No referrals yet</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>If a professor recommends tutoring, their referral will appear here.</div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FACULTY_REFERRALS.map(ref => {
            const isBooked = booked.includes(ref.id)
            return (
              <Card key={ref.id} style={{ padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="user" size={20} color="var(--blue)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{ref.from}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{ref.department} · {ref.date}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Pill label={ref.subject} />
                    <Badge label={ref.priority === "recommended" ? "Strongly Recommended" : "Suggested"} color={priorityColor(ref.priority) as "red" | "gold"} />
                  </div>
                </div>
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg)", fontSize: 13, color: "var(--text)", lineHeight: 1.65, fontStyle: "italic", marginBottom: 16 }}>
                  &ldquo;{ref.message}&rdquo;
                </div>
                {isBooked ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#065F46", fontWeight: 600 }}>
                    <Icon name="check-circle" size={16} color="#065F46" /> Session booked for this referral
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="gold" onClick={() => { setBooked(b => [...b, ref.id]); setScreen("directory") }}>
                      <Icon name="search" size={14} color="#1C1C1C" /> Find a {ref.subject} Tutor
                    </Btn>
                    <Btn variant="ghost" onClick={() => setBooked(b => [...b, ref.id])}>Dismiss</Btn>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", fontSize: 12, color: "var(--blue)", lineHeight: 1.6 }}>
        <strong>Note:</strong> Faculty referrals are confidential between you, your professor, and the Director of Tutoring Services. They are not shared with other students or tutors beyond what&apos;s needed to match you.
      </div>
    </div>
  )
}

// ── STUDY BUDDY SCREEN ───────────────────────────────────
function StudyBuddyScreen() {
  const [opted, setOpted]         = useState(false)
  const [mySubject, setMySubject] = useState<string | null>(null)
  const [myMode, setMyMode]       = useState<string | null>(null)
  const [myGoals, setMyGoals]     = useState("")
  const [sent, setSent]           = useState<number[]>([])

  const available = STUDY_BUDDY_POOL.filter(b => !b.matched)

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", maxWidth: 760 }}>
      <h1 style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 6 }}>Study Buddy</h1>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
        Opt in to be matched with a peer who&apos;s studying the same subject. Study buddies complement (not replace) tutoring — accountability, shared notes, and group prep sessions.
      </div>

      {/* Opt-in form */}
      {!opted ? (
        <Card style={{ padding: "24px", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>Add yourself to the pool</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Let other students find you as a study partner. Your name is only visible to students you both match with.</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Subject</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {SUBJECTS.slice(0, 8).map(s => (
                <button key={s} onClick={() => setMySubject(mySubject === s ? null : s)} style={{
                  padding: "6px 13px", borderRadius: 99, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  fontFamily: "DM Sans, sans-serif",
                  background: mySubject === s ? "var(--blue)" : "white",
                  color: mySubject === s ? "white" : "var(--muted)",
                  border: `1.5px solid ${mySubject === s ? "var(--blue)" : "#E0E4EF"}`,
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Preferred Mode</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["In-Person", "Online", "Either"].map(m => (
                <button key={m} onClick={() => setMyMode(myMode === m ? null : m)} style={{
                  padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600,
                  fontFamily: "DM Sans, sans-serif",
                  background: myMode === m ? "var(--blue)" : "white",
                  color: myMode === m ? "white" : "var(--muted)",
                  border: `1.5px solid ${myMode === m ? "var(--blue)" : "#E0E4EF"}`,
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Study Goals (optional)</label>
            <textarea value={myGoals} onChange={e => setMyGoals(e.target.value)}
              placeholder="e.g. Calc II exam prep, 2×/week, evenings preferred…"
              style={{ width: "100%", height: 72, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", resize: "none", boxSizing: "border-box" as const }} />
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--blue-light)", border: "1px solid #BDD0F0", fontSize: 12, color: "var(--blue)", marginBottom: 16 }}>
            Your name is only revealed to mutual matches. You can opt out at any time.
          </div>
          <Btn variant="gold" disabled={!mySubject || !myMode} onClick={() => setOpted(true)}>
            <Icon name="users" size={14} color="#1C1C1C" /> Add me to the pool
          </Btn>
        </Card>
      ) : (
        <div style={{ padding: "14px 16px", borderRadius: 10, background: "#ECFDF5", border: "1.5px solid #6EE7B7", marginBottom: 24, display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#065F46", fontWeight: 600 }}>
          <Icon name="check-circle" size={16} color="#065F46" />
          You&apos;re in the pool for <strong>{mySubject}</strong> ({myMode}) — we&apos;ll notify you when a match is found.
          <button onClick={() => setOpted(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#065F46", cursor: "pointer", fontWeight: 600, fontSize: 12, textDecoration: "underline" }}>Opt out</button>
        </div>
      )}

      {/* Available buddies */}
      <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 12 }}>
        Students looking for a study partner ({available.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {available.map(b => {
          const hasSent = sent.includes(b.id)
          return (
            <Card key={b.id} style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar initials={b.avatar} size={44} bg="var(--blue)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{b.name}</div>
                  <Badge label={b.year} color="gray" />
                  <Pill label={b.subject} size="sm" />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{b.mode} · {b.goals}</div>
              </div>
              {hasSent ? (
                <div style={{ fontSize: 12, color: "#059669", fontWeight: 600, display: "flex", gap: 5, alignItems: "center" }}>
                  <Icon name="check-circle" size={14} color="#059669" /> Request sent
                </div>
              ) : (
                <Btn size="sm" variant="outline" onClick={() => setSent(s => [...s, b.id])}>Connect</Btn>
              )}
            </Card>
          )
        })}
      </div>
      {available.length === 0 && (
        <Card style={{ padding: "40px", textAlign: "center" }}>
          <Icon name="users" size={32} color="var(--muted)" strokeWidth={1.25} />
          <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 600, fontSize: 15, color: "var(--text)", marginTop: 12 }}>No open requests right now</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Add yourself to the pool and be the first match for incoming requests.</div>
        </Card>
      )}
    </div>
  )
}

function ExportDataModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", padding: "28px 28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>My Data Export</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Your personal tutoring record · FERPA right to access</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "var(--muted)", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* FERPA rights notice */}
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "#EFF6FF", border: "1.5px solid #93C5FD", marginBottom: 20, fontSize: 12, color: "#1D4ED8", lineHeight: 1.6 }}>
          <strong>Your FERPA rights:</strong> Under the Family Educational Rights and Privacy Act, you have the right to inspect and review your own education records. This export contains all data Rooty holds about you.
        </div>

        {/* Account info */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Account Information</div>
          {[
            ["Name",        "Riley Sanchez"          ],
            ["Email",       "riley.sanchez@ncf.edu"  ],
            ["Role",        "Student"                ],
            ["Enrolled",    "Spring 2026"            ],
            ["Account ID",  "STU-0042"               ],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F5F6FA", fontSize: 13 }}>
              <span style={{ color: "var(--muted)" }}>{k}</span>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Session history */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Session History (7 sessions)</div>
          {SESSIONS.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F5F6FA", fontSize: 12 }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{s.subject} · {s.tutor}</div>
                <div style={{ color: "var(--muted)", marginTop: 1 }}>{s.date} · {s.time}</div>
              </div>
              <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.status === "upcoming" ? "#EFF6FF" : "#F0FDF4", color: s.status === "upcoming" ? "#1D4ED8" : "#166534" }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>

        {/* Ratings given */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 10 }}>Ratings You Submitted</div>
          <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>Avg. 4.8★ across 3 completed sessions. Individual ratings are not stored with tutor names to protect your anonymity in program data.</div>
        </div>

        {/* Data retention */}
        <div style={{ padding: "12px 14px", borderRadius: 10, background: "#FAFAFA", border: "1px solid #E0E4EF", marginBottom: 20, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>Data Retention:</strong> Your records are retained for 5 years per NCF policy, then permanently deleted. Academic content in session notes is retained for 2 years. You may request deletion of non-academic data by contacting the Registrar.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            flex: 1, padding: "11px", borderRadius: 10, cursor: "pointer",
            background: "var(--blue)", color: "white", border: "none",
            fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 14,
          }}>
            Download as PDF
          </button>
          <button onClick={onClose} style={{
            padding: "11px 20px", borderRadius: 10, cursor: "pointer",
            background: "white", color: "var(--muted)", border: "1.5px solid #E0E4EF",
            fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 14,
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen({ setScreen }: { setScreen: (s: string) => void }) {
  const [showExport, setShowExport] = useState(false)
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
      {/* FERPA data rights card */}
      <div style={{ padding: "14px 16px", borderRadius: 10, background: "#EFF6FF", border: "1.5px solid #93C5FD", marginBottom: 20, fontSize: 13, color: "#1D4ED8", lineHeight: 1.6 }}>
        <strong>Your data rights:</strong> Under FERPA, you can access, review, and request deletion of your own records at any time.
        <button onClick={() => setShowExport(true)} style={{ display: "block", marginTop: 8, background: "none", border: "none", color: "#1D4ED8", fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
          View &amp; export all my data →
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="outline">Edit Profile</Btn>
        <Btn variant="outline" onClick={() => setShowExport(true)}>Export My Data</Btn>
        <Btn variant="ghost" style={{ color: "#991B1B" }}>Sign Out</Btn>
      </div>
      {showExport && <ExportDataModal onClose={() => setShowExport(false)} />}
    </div>
  )
}

const DAYS_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function OfficeHoursScreen() {
  const [rsvp, setRsvp]       = useState<number[]>([])
  const [filterDay, setFilterDay] = useState<string | null>(null)
  const [filterSubject, setFilterSubject] = useState<string | null>(null)

  const days = [...new Set(OFFICE_HOURS.map(h => h.day))].sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b))
  const subjects = [...new Set(OFFICE_HOURS.map(h => h.subject))]

  const filtered = OFFICE_HOURS.filter(h =>
    (!filterDay || h.day === filterDay) &&
    (!filterSubject || h.subject === filterSubject)
  ).sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day))

  function toggleRsvp(id: number) {
    setRsvp(r => r.includes(id) ? r.filter(x => x !== id) : [...r, id])
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "var(--text)", margin: 0, marginBottom: 6 }}>Office Hours</h1>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Drop-in group tutoring — no booking required. Show up anytime during the session window.</div>

      <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--blue-light)", border: "1.5px solid #BDD0F0", marginBottom: 24, fontSize: 13, color: "var(--blue)" }}>
        <strong>How office hours work:</strong> These are open, recurring weekly sessions. Just show up — no booking or cancellation needed. Sessions are group format with up to 8–12 students. RSVP below so your tutor knows to expect you.
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setFilterDay(null)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: !filterDay ? "var(--blue)" : "white", color: !filterDay ? "white" : "var(--muted)", border: `1.5px solid ${!filterDay ? "var(--blue)" : "#E0E4EF"}` }}>All Days</button>
        {days.map(d => (
          <button key={d} onClick={() => setFilterDay(filterDay === d ? null : d)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: filterDay === d ? "var(--blue)" : "white", color: filterDay === d ? "white" : "var(--muted)", border: `1.5px solid ${filterDay === d ? "var(--blue)" : "#E0E4EF"}` }}>{d}</button>
        ))}
        <div style={{ width: 1, background: "#E0E4EF", margin: "0 4px" }} />
        {subjects.map(s => (
          <button key={s} onClick={() => setFilterSubject(filterSubject === s ? null : s)} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", background: filterSubject === s ? "var(--gold)" : "white", color: filterSubject === s ? "#1C1C1C" : "var(--muted)", border: `1.5px solid ${filterSubject === s ? "var(--gold)" : "#E0E4EF"}` }}>{s}</button>
        ))}
      </div>

      {/* Office hours cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No office hours match your filters.</div>
        )}
        {filtered.map(h => {
          const isRsvp    = rsvp.includes(h.id)
          const spotsLeft = isRsvp ? h.spotsLeft - 1 : h.spotsLeft
          const pct       = Math.round(((h.capacity - spotsLeft) / h.capacity) * 100)
          return (
            <Card key={h.id} style={{ padding: "20px 24px", display: "flex", gap: 18, alignItems: "flex-start" }}>
              {/* Day badge */}
              <div style={{ width: 58, textAlign: "center", flexShrink: 0 }}>
                <div style={{ padding: "6px 0", borderRadius: 10, background: "var(--blue-light)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h.day.slice(0,3)}</div>
                  <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--blue)", lineHeight: 1 }}>{h.time.split("–")[0].trim()}</div>
                  <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 1 }}>weekly</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Avatar initials={h.avatar} size={32} bg="var(--blue)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{h.tutor}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{h.day} · {h.time}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Pill label={h.subject} active />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  {h.mode === "Online"
                    ? <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="video" size={12} color="var(--muted)" /> Online (link sent on RSVP)</span>
                    : <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={12} color="var(--muted)" /> {h.location}</span>
                  }
                  <Badge label={spotsLeft <= 2 ? `${spotsLeft} spots left!` : `${spotsLeft} / ${h.capacity} spots`} color={spotsLeft <= 2 ? "red" : spotsLeft <= 4 ? "gold" : "gray"} />
                </div>
                {/* Capacity bar */}
                <div style={{ height: 5, borderRadius: 99, background: "#EEF1F8", marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ height: 5, borderRadius: 99, width: `${pct}%`, background: pct > 80 ? "#EF4444" : "var(--blue)", transition: "width .3s" }} />
                </div>
                <button
                  onClick={() => toggleRsvp(h.id)}
                  style={{
                    padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    fontFamily: "DM Sans, sans-serif", border: "none", transition: "all .15s",
                    background: isRsvp ? "#ECFDF5" : "var(--gold)",
                    color: isRsvp ? "#065F46" : "#1C1C1C",
                  }}
                >
                  {isRsvp ? "✓ RSVP'd — Cancel" : "RSVP (free, drop-in)"}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg)", fontSize: 12, color: "var(--muted)", marginTop: 24 }}>
        Office hours are not deducted from your weekly session limit. Contact <strong>tutoring@ncf.edu</strong> to request a new recurring office hour session for a subject not listed.
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const [screen, setScreen] = useState("directory")

  const screens: Record<string, React.ReactNode> = {
    directory:   <DirectoryScreen setScreen={setScreen} />,
    sessions:    <SessionsScreen />,
    messages:    <MessagesScreen perspective="student" />,
    officehours: <OfficeHoursScreen />,
    referrals:   <ReferralsScreen setScreen={setScreen} />,
    buddy:       <StudyBuddyScreen />,
    apply:       <ApplyScreen />,
    profile:     <ProfileScreen setScreen={setScreen} />,
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
