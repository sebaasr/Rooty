import type { Metadata } from "next"
import { Lora, DM_Sans } from "next/font/google"
import "./globals.css"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lora",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Rooty — Peer Tutoring | New College of Florida",
  description: "Book peer tutoring sessions at New College of Florida",
}

const cssVars = {
  "--blue":       "#003087",
  "--blue-light": "#EEF2F9",
  "--gold":       "#FFB81C",
  "--gold-light": "#FFF8E7",
  "--bg":         "#F4F6FB",
  "--text":       "#1C2333",
  "--muted":      "#6B7280",
  "--surface":    "#FFFFFF",
} as React.CSSProperties

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={cssVars} className={`${lora.variable} ${dmSans.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  )
}
