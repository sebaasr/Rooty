import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rooty — Peer Tutoring | New College of Florida",
  description: "Book peer tutoring sessions at New College of Florida",
}

const cssVars = {
  "--blue": "#003087",
  "--blue-light": "#EEF2F9",
  "--gold": "#FFB81C",
  "--gold-light": "#FFF8E7",
  "--bg": "#F4F6FB",
  "--text": "#1C2333",
  "--muted": "#6B7280",
  "--surface": "#FFFFFF",
} as React.CSSProperties

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={cssVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  )
}
