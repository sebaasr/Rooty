"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Icon } from "./Icon"

const SUBJECTS = [
  "Mathematics", "Chemistry", "Biology", "Writing", "History",
  "Computer Science", "Physics", "Political Science", "Economics",
  "Psychology", "Spanish", "Environmental Studies",
]

const STARTERS = [
  "Explain this concept to me…",
  "Help me solve this problem…",
  "Review my writing…",
  "Help me prep for my exam…",
]

const DEMO_RESPONSES: Record<string, string> = {
  math: "Great question! Let me walk you through this step by step. First, identify what you're solving for. In calculus, for integration by parts, we use the formula **∫u dv = uv − ∫v du**. The key is choosing *u* and *dv* wisely — typically, let *u* be the function that simplifies when differentiated (polynomials, logs) and *dv* be the part that's easy to integrate. Want me to work through a specific example?",
  writing: "I'd be happy to help with your writing! Strong academic writing at NCF typically needs: (1) a **clear, arguable thesis** — not just a topic but a claim; (2) **evidence** tied directly to that claim; and (3) **analysis** that explains *why* the evidence supports your argument. Paste your draft or thesis statement and I'll give you specific feedback.",
  default: "That's a great topic to explore! I can help you understand this concept from multiple angles. Let me break it down: start with the core idea, then we'll look at examples, and finally connect it to what you already know. What specific aspect are you finding tricky? The more detail you give me, the better I can tailor my explanation.",
}

function getDemoResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("math") || lower.includes("calculus") || lower.includes("equation") || lower.includes("integral") || lower.includes("derivative")) return DEMO_RESPONSES.math
  if (lower.includes("essay") || lower.includes("thesis") || lower.includes("writing") || lower.includes("paragraph")) return DEMO_RESPONSES.writing
  return DEMO_RESPONSES.default
}

export default function AiTutor() {
  const [open, setOpen]             = useState(false)
  const [subject, setSubject]       = useState<string | null>(null)
  const [noKey, setNoKey]           = useState(false)
  const [demoMessages, setDemoMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [demoInput, setDemoInput]   = useState("")
  const [demoTyping, setDemoTyping] = useState(false)
  const [unread, setUnread]         = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: "/api/tutor",
    body: { subject },
    onError: (e) => {
      if (e.message?.includes("503") || e.message?.includes("ANTHROPIC_API_KEY")) setNoKey(true)
    },
  })

  const usingDemo = noKey
  const allMessages = usingDemo ? demoMessages : messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages, isLoading, demoTyping])

  function handleOpen() { setOpen(true); setUnread(0) }

  function sendDemo(text: string) {
    if (!text.trim()) return
    setDemoMessages(m => [...m, { role: "user", content: text }])
    setDemoInput("")
    setDemoTyping(true)
    setTimeout(() => {
      setDemoMessages(m => [...m, { role: "assistant", content: getDemoResponse(text) }])
      setDemoTyping(false)
      if (!open) setUnread(u => u + 1)
    }, 900 + Math.random() * 500)
  }

  const isEmpty = allMessages.length === 0

  return (
    <>
      {/* Floating trigger — positioned above the chatbot button */}
      <button
        onClick={() => open ? setOpen(false) : handleOpen()}
        aria-label="Open AI Subject Tutor"
        style={{
          position: "fixed", bottom: 96, right: 28, width: 56, height: 56,
          borderRadius: "50%", background: "var(--gold)", border: "none",
          cursor: "pointer", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "transform .15s",
        }}
      >
        {open
          ? <Icon name="x" size={22} color="#1C1C1C" strokeWidth={2.5} />
          : <Icon name="book-open" size={22} color="#1C1C1C" strokeWidth={2} />}
        {!open && unread > 0 && (
          <span style={{ position: "absolute", top: 0, right: 0, width: 18, height: 18, borderRadius: "50%", background: "var(--blue)", color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 164, right: 28, width: 400, height: 560,
          background: "white", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", zIndex: 299,
          border: "1px solid #EEF1F8", overflow: "hidden",
          fontFamily: "DM Sans, sans-serif",
        }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, var(--blue) 0%, #1a4a9e 100%)", padding: "16px 18px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: subject ? 10 : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ncf-mascot.png" alt="NCF mascot" style={{ width: 32, height: 32, objectFit: "contain", mixBlendMode: "screen" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "white" }}>Subject AI Tutor</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                  {usingDemo ? "Demo mode — add ANTHROPIC_API_KEY for live AI" : "Powered by Claude · Academic help"}
                </div>
              </div>
              {subject && (
                <button onClick={() => setSubject(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "4px 10px", color: "white", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  {subject} ✕
                </button>
              )}
            </div>

            {/* Subject pills */}
            {!subject && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {SUBJECTS.slice(0, 7).map(s => (
                  <button key={s} onClick={() => setSubject(s)} style={{
                    padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
                    border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white",
                    fontFamily: "DM Sans, sans-serif", transition: "all .15s",
                  }}>{s}</button>
                ))}
                <button onClick={() => setSubject("General")} style={{
                  padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                  fontFamily: "DM Sans, sans-serif",
                }}>All subjects</button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {isEmpty && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/ncf-mascot.png" alt="NCF mascot" width={40} height={40} style={{ objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 6 }}>
                  {subject ? `Ask me anything about ${subject}` : "Pick a subject or just ask"}
                </div>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
                  I can explain concepts, work through problems, give writing feedback, or help you prep for exams.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {STARTERS.map(s => (
                    <button key={s} onClick={() => usingDemo ? sendDemo(s) : setInput(s)} style={{
                      padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      border: "1.5px solid #E0E4EF", background: "white", color: "var(--text)",
                      fontFamily: "DM Sans, sans-serif", textAlign: "left", transition: "border-color .15s",
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {allMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ncf-mascot.png" alt="" style={{ width: 20, height: 20, objectFit: "contain", mixBlendMode: "multiply" }} />
                  </div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.65,
                  borderTopLeftRadius: msg.role === "assistant" ? 4 : 14,
                  borderTopRightRadius: msg.role === "user" ? 4 : 14,
                  background: msg.role === "user" ? "var(--blue)" : "var(--bg)",
                  color: msg.role === "user" ? "white" : "var(--text)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {(isLoading || demoTyping) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/ncf-mascot.png" alt="" style={{ width: 20, height: 20, objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 14, borderTopLeftRadius: 4, background: "var(--bg)", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)", animation: `ai-bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {(error) && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FCA5A5", fontSize: 12, color: "#991B1B" }}>
                {noKey ? "AI tutor not configured. Add ANTHROPIC_API_KEY to .env.local." : "Something went wrong. Please try again."}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: "1px solid #EEF1F8", flexShrink: 0 }}>
            {usingDemo ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendDemo(demoInput)}
                  placeholder={subject ? `Ask about ${subject}…` : "Ask anything academic…"}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none" }}
                />
                <button onClick={() => sendDemo(demoInput)} disabled={!demoInput.trim()} style={{ width: 40, height: 40, borderRadius: 10, background: demoInput.trim() ? "var(--gold)" : "#E0E4EF", border: "none", cursor: demoInput.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="arrow-right" size={16} color={demoInput.trim() ? "#1C1C1C" : "#9CA3AF"} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={subject ? `Ask about ${subject}…` : "Ask anything academic…"}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none" }}
                />
                <button type="submit" disabled={isLoading || !input.trim()} style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() && !isLoading ? "var(--gold)" : "#E0E4EF", border: "none", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="arrow-right" size={16} color={input.trim() && !isLoading ? "#1C1C1C" : "#9CA3AF"} />
                </button>
              </form>
            )}
            <div style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", marginTop: 6 }}>
              For academic help only · Not a substitute for attending class
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ai-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
