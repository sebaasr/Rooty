export function BanyanLogo({ size = 32, color = "#003087" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="18" y="24" width="4" height="12" rx="2" fill={color} />
      <ellipse cx="20" cy="18" rx="12" ry="10" fill={color} />
      <path d="M10 22 Q6 28 8 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 22 Q34 28 32 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="14" cy="13" rx="5" ry="4" fill="white" opacity="0.18" />
      <ellipse cx="26" cy="14" rx="4" ry="3" fill="white" opacity="0.18" />
    </svg>
  )
}

export function RootyWordmark({ inverted = false }: { inverted?: boolean }) {
  const c = inverted ? "#fff" : "var(--blue)"
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <BanyanLogo size={28} color={c} />
      <span style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 20, color: c, letterSpacing: "-0.3px" }}>
        rooty
      </span>
    </div>
  )
}
