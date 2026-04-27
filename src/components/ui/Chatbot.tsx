"use client"

import { useState } from "react"
import { Icon } from "./Icon"

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I book a session?",
    a: "Go to Find Tutors, click on a tutor to open their profile, select an available time slot, choose your subject and format (in-person or online), then confirm your booking. You'll get a confirmation with meeting details."
  },
  {
    q: "What are the session limits?",
    a: "Students can book up to 3 sessions per week. The weekly limit resets every Monday. If you're at your limit, you'll see a notice in Find Tutors. Limits may be adjusted by the Director as the semester progresses."
  },
  {
    q: "How do I join my online session?",
    a: "Your session card in My Sessions shows a 'Join Google Meet' or 'Join Zoom' button. A link is also emailed to your NCF address. The link becomes active 5 minutes before your session."
  },
  {
    q: "Where are in-person sessions held?",
    a: "Most sessions meet in Hamilton Center. Your confirmed booking will show the specific room. Some tutors also hold sessions in the Library study rooms or the Four Winds Café — it's listed on your session card."
  },
  {
    q: "How do I apply to be a tutor?",
    a: "Click 'Become a Tutor' in the sidebar. Requirements include a 3.5+ GPA, sophomore standing, a faculty recommendation in your subject, and availability for at least 4 hours/week. Pay is $12/hr through NCF payroll."
  },
  {
    q: "What subjects are covered?",
    a: "Rooty currently covers 12 subjects: Mathematics, Chemistry, Biology, Writing, History, Political Science, Computer Science, Physics, Spanish, Art History, Environmental Studies, Economics, Psychology, and Sociology."
  },
  {
    q: "How do I cancel a session?",
    a: "Go to My Sessions, find the upcoming session, and click Cancel. Please cancel at least 24 hours in advance to avoid a no-show mark. Three no-shows may result in a temporary booking hold."
  },
  {
    q: "What is the no-show policy?",
    a: "Missing a session without 24-hour notice counts as a no-show for both students and tutors. After three no-shows, booking access may be temporarily suspended. The Director reviews all no-show records."
  },
  {
    q: "How do I contact support?",
    a: "Email the Director of Tutoring at tutoring@ncf.edu or visit Hamilton Center Room 105 during office hours (Mon–Fri, 9am–5pm)."
  },
]

type Message = { from: "user" | "bot"; text: string }

export default function Chatbot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! I'm the Rooty assistant. Ask me anything about tutoring at NCF, or pick a quick question below 👇" }
  ])
  const [input, setInput] = useState("")

  function handleQuestion(q: string, a: string) {
    setMessages(prev => [
      ...prev,
      { from: "user", text: q },
      { from: "bot", text: a },
    ])
  }

  function handleSend() {
    const q = input.trim()
    if (!q) return
    const match = FAQ.find(f => f.q.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(f.q.toLowerCase().split(" ").slice(1, 3).join(" ")))
    const answer = match
      ? match.a
      : "I'm not sure about that one! For specific questions, email tutoring@ncf.edu or visit Hamilton Center Room 105."
    setMessages(prev => [...prev, { from: "user", text: q }, { from: "bot", text: answer }])
    setInput("")
  }

  const shownFAQs = FAQ.slice(0, 5)

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: 28, right: 28, width: 56, height: 56,
        borderRadius: "50%", background: "var(--blue)", border: "none",
        boxShadow: "0 6px 24px rgba(0,48,135,0.35)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 300, transition: "transform .2s",
        transform: open ? "scale(0.9)" : "scale(1)",
      }}>
        {open
          ? <Icon name="x" size={20} color="white" strokeWidth={2.5} />
          : <Icon name="chat" size={22} color="white" strokeWidth={2} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28,
          width: 360, maxHeight: 560, borderRadius: 20,
          background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", zIndex: 299,
          overflow: "hidden", fontFamily: "DM Sans, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: "var(--blue)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="chat" size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "white" }}>Rooty Assistant</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>New College of Florida · Tutoring Help</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.from === "user" ? "var(--blue)" : "var(--bg)",
                  color: m.from === "user" ? "white" : "var(--text)",
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {shownFAQs.map((f, i) => (
                  <button key={i} onClick={() => handleQuestion(f.q, f.a)} style={{
                    textAlign: "left", padding: "9px 14px", borderRadius: 12,
                    border: "1.5px solid #E0E4EF", background: "white", cursor: "pointer",
                    fontSize: 12, fontWeight: 500, color: "var(--blue)",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "border-color .15s",
                  }}>
                    {f.q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #EEF1F8", display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask a question…"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid #E0E4EF", fontSize: 13,
                fontFamily: "DM Sans, sans-serif", outline: "none",
              }}
            />
            <button onClick={handleSend} style={{
              padding: "10px 14px", borderRadius: 10, background: "var(--blue)", border: "none", cursor: "pointer",
            }}>
              <Icon name="arrow-right" size={16} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
