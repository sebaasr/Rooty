"use client"

import { useState, useRef, useEffect } from "react"
import { Icon } from "./Icon"

const CHATBOT_QA: { q: string[]; a: string }[] = [
  {
    q: ["how do i book", "book a session", "schedule", "find a tutor"],
    a: "To book a session, go to <strong>Find Tutors</strong>, browse or search for a tutor, select an available time slot, and click \"Book this Tutor\". You'll get a confirmation email after booking.",
  },
  {
    q: ["cancel", "cancellation"],
    a: "You can cancel a session from <strong>My Sessions</strong> — click the Cancel button on any upcoming session. Cancellations made less than 24 hours before the session may count as a no-show.",
  },
  {
    q: ["how many session", "sessions per week", "session limit", "weekly limit"],
    a: "You can book up to <strong>3 sessions per week</strong> and <strong>30 sessions per semester</strong>. Your current usage shows on the Sessions screen under \"This Week\" or \"This Semester\".",
  },
  {
    q: ["zoom", "google meet", "online", "virtual", "video call"],
    a: "When you book an online session, a <strong>Zoom or Google Meet link</strong> is automatically generated and emailed to both you and your tutor. The link also appears in your session details.",
  },
  {
    q: ["location", "where", "room", "in person", "in-person"],
    a: "In-person sessions are held at NCF campus locations including <strong>Hume Library study rooms, Pei Residence, and Cook Hall</strong>. Your specific room is shown in your session confirmation.",
  },
  {
    q: ["apply", "become a tutor", "tutor application", "join as tutor"],
    a: "To apply as a tutor, click <strong>\"Become a Tutor\"</strong> in your sidebar. You'll need a 3.5 GPA, a strong grade in your tutored subjects, and a faculty reference. The process takes about a week.",
  },
  {
    q: ["pay", "payment", "how much", "earn", "salary", "wage"],
    a: "NCF peer tutors earn <strong>$12/hour</strong> for 1-on-1 sessions. Group sessions are <strong>$8/student/hr</strong>. Pay is processed bi-weekly through NCF Payroll.",
  },
  {
    q: ["no show", "missed session", "absent"],
    a: "Missing a session without 24-hour notice counts as a no-show. Three no-shows in a semester may result in a temporary booking restriction. If your tutor no-shows, contact tutoring@ncf.edu.",
  },
  {
    q: ["rate", "rating", "review", "feedback"],
    a: "After each completed session, students can leave a <strong>1–5 star rating</strong> from My Sessions. Ratings are anonymous to tutors — they see aggregate scores only.",
  },
  {
    q: ["hours", "weekly hours", "hour cap"],
    a: "Tutors can work up to <strong>20 hours per week</strong>. Your current hours and remaining capacity are shown on your Tutor Dashboard. The Director can adjust your cap.",
  },
  {
    q: ["sso", "login", "sign in", "password"],
    a: "You can sign in using your <strong>NCF Single Sign-On (SSO)</strong> credentials — the same ones you use for Canvas and MyNCF. Email/password login is also available.",
  },
  {
    q: ["contact", "director", "help", "support", "issue", "problem"],
    a: "For help, contact the <strong>Director of Tutoring Services</strong> at tutoring@ncf.edu. For urgent issues, visit the Academic Support office in Cook Hall.",
  },
  {
    q: ["recurring", "weekly", "same tutor", "regular"],
    a: "Yes — you can book the same tutor at the same time each week by using their availability slots repeatedly. Contact tutoring@ncf.edu to set up a formal recurring arrangement.",
  },
  {
    q: ["what subjects", "subject", "tutor for", "available"],
    a: "Rooty covers 14+ subjects: Mathematics, Writing, Biology, Chemistry, Computer Science, History, Political Science, Economics, Spanish, Art History, Environmental Studies, Psychology, Sociology, and Physics.",
  },
  {
    q: ["training", "orientation", "onboarding", "crla"],
    a: "New tutors complete a <strong>2-hour Rooty Orientation</strong> before their first session. NCF tutors can also pursue CRLA certification (College Reading & Learning Association) — Levels I and II — which is recognized nationally.",
  },
  {
    q: ["group session", "group tutoring", "study group"],
    a: "You can book <strong>group sessions</strong> for 2–6 students at a discounted rate of $8/student/hr instead of the standard $12/hr. Select \"Group\" when booking in Find Tutors.",
  },
  {
    q: ["study buddy", "study partner", "peer"],
    a: "The <strong>Study Buddy</strong> feature (sidebar → Study Buddy) lets you opt in to be matched with a peer studying the same subject. It's great for accountability partners and group exam prep.",
  },
  {
    q: ["waitlist", "full", "booked", "no slots"],
    a: "If a tutor is fully booked for the week, you can click <strong>Join Waitlist</strong> in their profile. You'll be notified by email when a slot opens up.",
  },
  {
    q: ["referral", "professor", "faculty"],
    a: "If a professor recommends tutoring, you'll see a <strong>Faculty Referral</strong> notification in your sidebar. It links directly to the relevant subject tutors.",
  },
  {
    q: ["canvas", "ncf portal", "myncf", "banner"],
    a: "Rooty is separate from Canvas and MyNCF. For Canvas questions, visit the NCF IT Help Desk. Rooty handles tutoring bookings only — your grades and academic records are in Banner/MyNCF.",
  },
  {
    q: ["ferpa", "privacy", "data", "my data"],
    a: "Rooty is FERPA-compliant. You can view and export all data Rooty holds about you via <strong>My Profile → Export My Data</strong>. Only you, your tutors (session-level only), and the Director can see your records.",
  },
  {
    q: ["thesis", "isp", "independent study", "contract"],
    a: "Many NCF students use tutoring during thesis or ISP work — especially for Writing, Statistics, and research methods. When booking, mention your thesis subject so the tutor can prepare.",
  },
  {
    q: ["semester", "how long", "when does tutoring", "does tutoring run"],
    a: "Rooty is available throughout the full academic semester. The platform resets session counts at the start of each new term. Check with tutoring@ncf.edu for Jan-term and summer availability.",
  },
  {
    q: ["ai tutor", "subject tutor", "rooty ai", "ai help"],
    a: "The <strong>Subject AI Tutor</strong> (gold button, bottom-right) can help you understand concepts, work through problems, and review writing — 24/7. It's powered by Claude AI and focused on academic topics.",
  },
]

const SUGGESTIONS = [
  "How do I book a session?",
  "How many sessions can I book?",
  "How do I apply to be a tutor?",
  "How does online tutoring work?",
  "Where are sessions held?",
]

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const item of CHATBOT_QA) {
    if (item.q.some(k => lower.includes(k))) return item.a
  }
  return "I'm not sure about that. For detailed help, contact <strong>tutoring@ncf.edu</strong> or ask the Director of Tutoring Services. You can also try rephrasing your question!"
}

type Message = { from: "user" | "bot"; text: string }

export default function Chatbot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! I'm <strong>Rooty AI</strong> — your NCF tutoring assistant. How can I help you today?" }
  ])
  const [input, setInput]   = useState("")
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  function send(text: string) {
    if (!text.trim()) return
    setMessages(m => [...m, { from: "user", text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const reply = getResponse(text)
      setMessages(m => [...m, { from: "bot", text: reply }])
      setTyping(false)
      if (!open) setUnread(u => u + 1)
    }, 700 + Math.random() * 400)
  }

  function handleOpen() { setOpen(true); setUnread(0) }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => open ? setOpen(false) : handleOpen()}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 56, height: 56,
          borderRadius: "50%", background: "var(--blue)", border: "none",
          cursor: "pointer", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,48,135,0.35)", transition: "transform .15s",
        }}
      >
        {open
          ? <Icon name="x" size={22} color="white" strokeWidth={2.5} />
          : <Icon name="chat" size={22} color="white" strokeWidth={2} />}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0, width: 18, height: 18,
            borderRadius: "50%", background: "var(--gold)", color: "#1C1C1C",
            fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "DM Sans, sans-serif",
          }}>{unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, width: 360, height: 520,
          background: "white", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", zIndex: 299,
          border: "1px solid #EEF1F8", overflow: "hidden",
          fontFamily: "DM Sans, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: "var(--blue)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ncf-mascot.png" alt="NCF" style={{ width: 32, height: 32, objectFit: "contain", mixBlendMode: "screen" }} />
            </div>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "white" }}>Rooty Assistant</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Platform help · Booking · Policies</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                {msg.from === "bot" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ncf-mascot.png" alt="" style={{ width: 20, height: 20, objectFit: "contain", mixBlendMode: "multiply" }} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: 14,
                    borderTopLeftRadius: msg.from === "bot" ? 4 : 14,
                    borderTopRightRadius: msg.from === "user" ? 4 : 14,
                    background: msg.from === "user" ? "var(--blue)" : "var(--bg)",
                    color: msg.from === "user" ? "white" : "var(--text)",
                    fontSize: 13, lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ncf-mascot.png" alt="" style={{ width: 20, height: 20, objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 14, borderTopLeftRadius: 4, background: "var(--bg)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)", animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion chips (first open only) */}
            {messages.length <= 1 && (
              <div style={{ padding: "4px 0 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding: "5px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                    fontFamily: "DM Sans, sans-serif", cursor: "pointer",
                    border: "1.5px solid var(--blue)", background: "white", color: "var(--blue)",
                  }}>{s}</button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid #EEF1F8", display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask a question…"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid #E0E4EF", fontSize: 13,
                fontFamily: "DM Sans, sans-serif", outline: "none",
              }}
            />
            <button onClick={() => send(input)} style={{
              width: 40, height: 40, borderRadius: 10, background: "var(--blue)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name="arrow-right" size={16} color="white" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
