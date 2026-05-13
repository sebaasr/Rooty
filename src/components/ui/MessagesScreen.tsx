"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, Badge, Card } from "./index"
import { Icon } from "./Icon"
import { CONVERSATIONS } from "@/lib/data"

type Msg = { id: number; from: string; text: string; time: string; read: boolean }
type Conv = typeof CONVERSATIONS[0]

// perspective: "student" sees from student POV, "tutor" sees from tutor POV
export default function MessagesScreen({ perspective }: { perspective: "student" | "tutor" }) {
  const [convs, setConvs]         = useState(CONVERSATIONS.map(c => ({ ...c, messages: c.messages.map(m => ({ ...m })) })))
  const [activeId, setActiveId]   = useState<number | null>(convs[0]?.id ?? null)
  const [input, setInput]         = useState("")
  const [search, setSearch]       = useState("")
  const bottomRef                 = useRef<HTMLDivElement>(null)

  const myName = perspective === "student" ? "Riley Sanchez" : "Maya Chen"

  const filtered = convs.filter(c => {
    const other = perspective === "student" ? c.tutor : c.student
    return other.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase())
  })

  const active = convs.find(c => c.id === activeId) ?? null

  const unreadTotal = convs.reduce((n, c) => n + c.messages.filter(m => m.from !== perspective && !m.read).length, 0)

  function openConv(conv: Conv) {
    setActiveId(conv.id)
    // mark all messages in this conv as read
    setConvs(cs => cs.map(c => c.id !== conv.id ? c : {
      ...c,
      messages: c.messages.map(m => ({ ...m, read: true })),
    }))
    setInput("")
  }

  function send() {
    if (!input.trim() || !active) return
    const newMsg: Msg = {
      id: Date.now(),
      from: perspective,
      text: input.trim(),
      time: "Just now",
      read: true,
    }
    setConvs(cs => cs.map(c => c.id !== active.id ? c : {
      ...c,
      messages: [...c.messages, newMsg],
      lastMessageAt: "Just now",
    }))
    setInput("")
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [active?.messages.length])

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Conversation list */}
      <div style={{ width: 300, borderRight: "1px solid #EEF1F8", display: "flex", flexDirection: "column", background: "white", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #EEF1F8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Messages</div>
            {unreadTotal > 0 && <Badge label={String(unreadTotal)} color="blue" />}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
              <Icon name="search" size={14} color="var(--muted)" />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations…"
              style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: 8, border: "1.5px solid #E0E4EF", fontSize: 12, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>No conversations found</div>
          )}
          {filtered.map(conv => {
            const other    = perspective === "student" ? conv.tutor : conv.student
            const otherAv  = perspective === "student" ? conv.tutorAvatar : conv.studentAvatar
            const last     = conv.messages[conv.messages.length - 1]
            const unread   = conv.messages.filter(m => m.from !== perspective && !m.read).length
            const isActive = conv.id === activeId
            return (
              <button
                key={conv.id}
                onClick={() => openConv(conv)}
                style={{
                  width: "100%", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                  background: isActive ? "var(--blue-light)" : "transparent",
                  borderLeft: `3px solid ${isActive ? "var(--blue)" : "transparent"}`,
                  border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #F5F6FA",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar initials={otherAv} size={40} bg="var(--blue)" />
                  {unread > 0 && (
                    <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "var(--blue)", color: "white", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{other}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>{conv.lastMessageAt.split("·")[0].trim()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--blue)", fontWeight: 600, marginBottom: 2 }}>{conv.subject}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: unread > 0 ? 600 : 400 }}>
                    {last?.from === perspective ? "You: " : ""}{last?.text}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Message thread */}
      {active ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          {/* Thread header */}
          <div style={{ padding: "16px 24px", background: "white", borderBottom: "1px solid #EEF1F8", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            <Avatar initials={perspective === "student" ? active.tutorAvatar : active.studentAvatar} size={40} bg="var(--blue)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                {perspective === "student" ? active.tutor : active.student}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {perspective === "student" ? "Tutor" : "Student"} · {active.subject}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {active.messages.map(msg => {
              const isMe = msg.from === perspective
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", gap: 10 }}>
                  {!isMe && (
                    <Avatar initials={perspective === "student" ? active.tutorAvatar : active.studentAvatar} size={28} bg="var(--blue)" />
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    <div style={{
                      padding: "10px 14px", borderRadius: 14, fontSize: 13, lineHeight: 1.65,
                      borderTopLeftRadius: isMe ? 14 : 4,
                      borderTopRightRadius: isMe ? 4 : 14,
                      background: isMe ? "var(--blue)" : "white",
                      color: isMe ? "white" : "var(--text)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, textAlign: isMe ? "right" : "left" }}>{msg.time}</div>
                  </div>
                  {isMe && (
                    <Avatar initials={perspective === "student" ? "RS" : active.tutorAvatar} size={28} bg={perspective === "student" ? "var(--gold)" : "var(--blue)"} />
                  )}
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Compose */}
          <div style={{ padding: "14px 24px", background: "white", borderTop: "1px solid #EEF1F8", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E0E4EF",
                fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "none",
                lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              style={{
                width: 40, height: 40, borderRadius: 10, border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                background: input.trim() ? "var(--gold)" : "#E0E4EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Icon name="arrow-right" size={16} color={input.trim() ? "#1C1C1C" : "#9CA3AF"} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14 }}>
          Select a conversation to start messaging
        </div>
      )}
    </div>
  )
}
