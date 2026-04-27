"use client"

export function BarChart({ data, height = 120, color = "var(--blue)" }: {
  data: { label: string; value: number }[]
  height?: number
  color?: string
}) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%",
            height: (d.value / max) * (height - 24),
            background: color,
            borderRadius: "4px 4px 0 0",
            transition: "height .4s",
          }} />
          <div style={{ fontSize: 9, color: "var(--muted)", textAlign: "center", fontWeight: 500 }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export function DonutChart({ segments, size = 100 }: {
  segments: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = segments.reduce((a, b) => a + b.value, 0)
  let offset = 0
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.35
  const stroke = size * 0.2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        const pct = seg.value / total
        const dash = pct * circ
        const gap = circ - dash
        const rotate = (offset * 360 / total) - 90
        offset += seg.value
        return (
          <circle
            key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        )
      })}
    </svg>
  )
}
