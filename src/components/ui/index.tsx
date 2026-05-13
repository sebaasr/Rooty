"use client"

import { useState } from "react"
import { Icon } from "./Icon"

export function Avatar({ initials, size = 40, bg, style: extraStyle = {} }: {
  initials: string; size?: number; bg?: string; style?: React.CSSProperties
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg || "var(--blue)", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontWeight: 700,
      fontSize: size > 36 ? 16 : 12, color: "#fff", flexShrink: 0, letterSpacing: "0.5px",
      ...extraStyle
    }}>{initials}</div>
  )
}

export function Pill({ label, active, onClick, size = "md" }: {
  label: string; active?: boolean; onClick?: () => void; size?: "sm" | "md"
}) {
  const sm = size === "sm"
  return (
    <button onClick={onClick} style={{
      padding: sm ? "3px 10px" : "5px 14px", borderRadius: 99,
      fontSize: sm ? 11 : 12, fontWeight: 600, fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
      border: active ? "1.5px solid var(--blue)" : "1.5px solid #E0E4EF",
      background: active ? "var(--blue)" : "white",
      color: active ? "white" : "var(--muted)",
      cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all .15s",
    }}>{label}</button>
  )
}

export function Badge({ label, color = "blue" }: { label: string; color?: "blue" | "gold" | "green" | "red" | "gray" }) {
  const styles = {
    blue:  { bg: "var(--blue-light)", color: "var(--blue)" },
    gold:  { bg: "var(--gold-light)", color: "#92660A" },
    green: { bg: "#ECFDF5",           color: "#065F46" },
    red:   { bg: "#FEF2F2",           color: "#991B1B" },
    gray:  { bg: "#F3F4F6",           color: "#374151" },
  }
  const s = styles[color]
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
      whiteSpace: "nowrap" as const,
    }}>{label}</span>
  )
}

export function Btn({ children, variant = "primary", onClick, fullWidth, size = "md", disabled, style: extra = {} }: {
  children: React.ReactNode; variant?: "primary" | "gold" | "outline" | "ghost" | "danger";
  onClick?: () => void; fullWidth?: boolean; size?: "sm" | "md"; disabled?: boolean; style?: React.CSSProperties
}) {
  const [pressed, setPressed] = useState(false)
  const sm = size === "sm"
  const base: React.CSSProperties = {
    borderRadius: 10, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", fontWeight: 600,
    fontSize: sm ? 13 : 15, padding: sm ? "8px 16px" : "12px 22px",
    width: fullWidth ? "100%" : "auto",
    transition: "all .15s ease",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    opacity: disabled ? 0.5 : 1,
    transform: pressed && !disabled ? "scale(0.97)" : "scale(1)",
  }
  const variants = {
    primary: { background: "var(--blue)", color: "#fff",    boxShadow: "0 2px 8px rgba(0,48,135,0.25), inset 0 1px 0 rgba(255,255,255,0.1)" },
    gold:    { background: "var(--gold)", color: "#1C1C1C", boxShadow: "0 2px 8px rgba(255,184,28,0.35), inset 0 1px 0 rgba(255,255,255,0.3)" },
    outline: { background: "transparent", color: "var(--blue)", border: "1.5px solid var(--blue)", boxShadow: "none" },
    ghost:   { background: "transparent", color: "var(--muted)", boxShadow: "none" },
    danger:  { background: "#FEF2F2", color: "#991B1B", border: "1.5px solid #FCA5A5", boxShadow: "none" },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-disabled={disabled}
      style={{ ...base, ...variants[variant], ...extra }}
    >
      {children}
    </button>
  )
}

// Claymorphism-inspired Card: double shadow (inner + outer) + subtle border
export function Card({ children, style: extra = {}, onClick, hover }: {
  children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; hover?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const shadowBase = "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)"
  const shadowHover = "0 8px 28px rgba(0,48,135,0.13), 0 2px 6px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: "white",
        borderRadius: 18,
        border: "1px solid rgba(0,48,135,0.07)",
        boxShadow: hovered ? shadowHover : shadowBase,
        transition: "box-shadow .2s ease, transform .2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: onClick ? "pointer" : "default",
        ...extra,
      }}
    >{children}</div>
  )
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{title}</span>
      {action && (
        <button onClick={onAction} style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
          {action}
        </button>
      )}
    </div>
  )
}

// SVG star for empty states — no emoji
function StarIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
        fill="var(--gold)" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  // Render SVG via Icon component; fall back to a calendar icon for unrecognised names
  const iconName = icon.length <= 2 ? "calendar" : icon
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted)" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, opacity: 0.5 }}>
        <Icon name={iconName} size={40} color="var(--blue)" strokeWidth={1.25} />
      </div>
      <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 600, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  )
}

export function StatCard({ label, value, sub, icon, color = "blue", trend }: {
  label: string; value: string | number; sub?: string; icon: string
  color?: "blue" | "gold" | "green" | "purple"; trend?: string
}) {
  const colors = {
    blue:   { light: "var(--blue-light)", text: "var(--blue)" },
    gold:   { light: "var(--gold-light)", text: "#92660A" },
    green:  { light: "#ECFDF5",           text: "#065F46" },
    purple: { light: "#EDE9FE",           text: "#5B21B6" },
  }
  const iconColors = { blue: "var(--blue)", gold: "#92660A", green: "#065F46", purple: "#5B21B6" }
  const c = colors[color]
  const ic = iconColors[color]
  const trendColor = trend && (trend.startsWith("+") || trend.startsWith("↑")) ? "green" : "gray"
  return (
    <Card style={{ padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: c.light, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8)` }}>
          <Icon name={icon} size={19} color={ic} strokeWidth={1.75} />
        </div>
        {trend && <Badge label={trend} color={trendColor as "green" | "gray"} />}
      </div>
      <div style={{ fontFamily: "var(--font-lora), Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: c.text, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
    </Card>
  )
}

export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polygon
            points="12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3"
            fill={i <= Math.round(value) ? "var(--gold)" : "#D1D5DB"}
            stroke={i <= Math.round(value) ? "var(--gold)" : "#D1D5DB"}
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      ))}
      <span style={{ marginLeft: 3, fontSize: size - 1, color: "var(--muted)", fontWeight: 500 }}>
        {value.toFixed(1)}
      </span>
    </span>
  )
}
