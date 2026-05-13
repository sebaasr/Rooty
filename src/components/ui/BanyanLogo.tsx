// Single-color logo — used on dark backgrounds (inverted white or gold)
export function BanyanLogo({ size = 32, color = "#003087" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="18" y="24" width="4" height="12" rx="2" fill={color} />
      <ellipse cx="20" cy="18" rx="12" ry="10" fill={color} />
      <path d="M10 22 Q6 28 8 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 22 Q34 28 32 36" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="14" cy="13" rx="5" ry="4" fill="white" opacity="0.22" />
      <ellipse cx="26" cy="14" rx="4" ry="3" fill="white" opacity="0.22" />
    </svg>
  )
}

// Full natural-color logo — green canopy, brown trunk & roots
export function BanyanLogoColor({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="18" y="24" width="4" height="12" rx="2" fill="#78350F" />
      <ellipse cx="20" cy="18" rx="12" ry="10" fill="#15803D" />
      <path d="M10 22 Q6 28 8 36" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 22 Q34 28 32 36" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="14" cy="13" rx="5" ry="4" fill="white" opacity="0.3" />
      <ellipse cx="26" cy="14" rx="4" ry="3" fill="white" opacity="0.3" />
    </svg>
  )
}

// Wordmark: colored tree on light bg, NCF mascot on dark/blue bg
export function RootyWordmark({ inverted = false, size = 28 }: { inverted?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      {inverted
        ? <img src="/ncf-mascot.png" alt="NCF mascot" width={size} height={size} style={{ objectFit: "contain", display: "block" }} />
        : <BanyanLogoColor size={size} />}
      <span style={{
        fontFamily: "var(--font-lora), Lora, serif",
        fontWeight: 700,
        fontSize: size > 24 ? 20 : 16,
        color: inverted ? "#fff" : "var(--blue)",
        letterSpacing: "-0.3px",
      }}>
        rooty
      </span>
    </div>
  )
}
