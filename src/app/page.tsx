"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RootyWordmark } from "@/components/ui/BanyanLogo"
import { Icon } from "@/components/ui/Icon"
import { Btn } from "@/components/ui/index"

const SUBJECTS = [
  "Mathematics", "Chemistry", "Biology", "Writing", "History",
  "Political Science", "Computer Science", "Physics", "Spanish",
  "Art History", "Environmental Studies", "Economics", "Psychology", "Sociology",
]

type View = "signin" | "register" | "register-tutor"

interface FormState {
  name: string
  email: string
  password: string
  role: "student" | "tutor"
  subjects: string[]
}

interface Errors {
  name?: string
  email?: string
  password?: string
  subjects?: string
}

function Field({ label, type = "text", id, value, onChange, placeholder, error, icon }: {
  label: string; type?: string; id: string; value: string
  onChange: (v: string) => void; placeholder?: string; error?: string; icon?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 6, letterSpacing: "0.2px" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Icon name={icon} size={15} color={focused ? "var(--blue)" : "#9CA3AF"} />
          </div>
        )}
        <input
          id={id} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: `11px 14px 11px ${icon ? "38px" : "14px"}`,
            borderRadius: 10,
            boxSizing: "border-box",
            border: `1.5px solid ${error ? "#FCA5A5" : focused ? "var(--blue)" : "#E0E4EF"}`,
            fontSize: 14,
            fontFamily: "DM Sans, sans-serif",
            background: error ? "#FEF2F2" : "white",
            outline: "none",
            color: "var(--text)",
            transition: "border-color .15s",
          }}
        />
      </div>
      {error && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 4, fontWeight: 500 }}>{error}</div>}
    </div>
  )
}

function BrandPanel() {
  return (
    <div style={{
      width: 420,
      background: "var(--blue)",
      display: "flex",
      flexDirection: "column",
      padding: "40px 44px",
      justifyContent: "space-between",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      <div>
        {/* Logo in a white pill so navy is visible on blue background */}
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "6px 12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/ncf-logo-horiz.png" alt="New College of Florida"
            style={{ height: 30, objectFit: "contain" }} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        {/* mix-blend-mode:screen makes the black background transparent on dark backgrounds */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/mascot.png" alt="NCF Banyan Mascot"
          style={{ width: 220, objectFit: "contain", display: "block", margin: "0 auto 24px", mixBlendMode: "screen" }} />
        <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 26, color: "white", lineHeight: 1.3, marginBottom: 10 }}>
          Peer tutoring,<br />built for NCF.
        </div>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
          Connect with student tutors, book sessions, and track your academic progress — all in one place.
        </p>
      </div>

      <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20 }}>
        {[["24", "tutors"], ["12", "subjects"], ["186", "sessions"]].map(([num, label], i) => (
          <div key={label} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
            <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 22, color: "var(--gold)" }}>{num}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Suspense } from "react"
export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", background: "var(--blue)" }} />}>
      <AuthPageInner />
    </Suspense>
  )
}

function AuthPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [view, setView] = useState<View>("signin")

  useEffect(() => {
    if (params.get("view") === "register") setView("register")
  }, [params])
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", role: "student", subjects: [] })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  function update(k: keyof FormState, v: string | string[]) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function toggleSubject(s: string) {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s],
    }))
  }

  function validate(fields: string[]): Errors {
    const errs: Errors = {}
    if (fields.includes("email") && !form.email.includes("@")) errs.email = "Enter a valid email address"
    if (fields.includes("password") && form.password.length < 6) errs.password = "Password must be at least 6 characters"
    if (fields.includes("name") && !form.name.trim()) errs.name = "Full name is required"
    if (fields.includes("subjects") && form.subjects.length === 0) errs.subjects = "Select at least one subject"
    return errs
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(["email", "password"])
    if (Object.keys(errs).length) { setErrors(errs); return }
    router.push("/dashboard")
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (view === "register") {
      const errs = validate(["name", "email", "password"])
      if (Object.keys(errs).length) { setErrors(errs); return }
      if (form.role === "tutor") { setView("register-tutor"); return }
      router.push("/dashboard")
    } else {
      const errs = validate(["subjects"])
      if (Object.keys(errs).length) { setErrors(errs); return }
      router.push("/dashboard")
    }
  }

  function handleSSO() {
    router.push("/dashboard")
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>
      <BrandPanel />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", overflowY: "auto" }}>

        {/* ── SIGN IN ─────────────────────────────────────────── */}
        {view === "signin" && (
          <form onSubmit={handleSignIn} style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", marginBottom: 6 }}>
                Welcome back
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Sign in to your Rooty account</div>
            </div>

            <button type="button" onClick={handleSSO} style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #E0E4EF",
              background: "white", cursor: "pointer", fontFamily: "DM Sans, sans-serif",
              fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 20,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/ncf-shield.png" alt="NCF" style={{ height: 22, width: 22, objectFit: "contain", borderRadius: 3 }} />
              Continue with NCF SSO
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#E0E4EF" }} />
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: "#E0E4EF" }} />
            </div>

            <Field label="Email address" type="email" id="signin-email" icon="mail"
              value={form.email} onChange={v => update("email", v)}
              placeholder="you@ncf.edu" error={errors.email} />
            <Field label="Password" type="password" id="signin-password" icon="shield"
              value={form.password} onChange={v => update("password", v)}
              placeholder="••••••••" error={errors.password} />

            <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
              <button type="button" style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                Forgot password?
              </button>
            </div>

            <Btn fullWidth variant="primary" style={{ padding: "13px", fontSize: 15, marginBottom: 20 }}>
              {loading ? "Signing in…" : "Sign In"}
            </Btn>

            <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => { setView("register"); setErrors({}) }}
                style={{ color: "var(--blue)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                Create one
              </button>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #E0E4EF", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Demo Access</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Student View",  href: "/dashboard?role=student" },
                  { label: "Tutor View",    href: "/dashboard?role=tutor"   },
                  { label: "Director View", href: "/dashboard?role=admin"   },
                  { label: "Provost View",  href: "/dashboard?role=provost" },
                ].map(({ label, href }) => (
                  <a key={href} href={href} style={{
                    display: "block", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #E0E4EF",
                    background: "var(--bg)", cursor: "pointer", textDecoration: "none",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 12, color: "var(--text)",
                    textAlign: "center",
                  }}>{label}</a>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ── REGISTER ──────────────────────────────────────────── */}
        {view === "register" && (
          <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ marginBottom: 28 }}>
              <button type="button" onClick={() => { setView("signin"); setErrors({}) }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 13, marginBottom: 16, padding: 0 }}>
                <Icon name="chevron-left" size={16} color="var(--muted)" /> Back to sign in
              </button>
              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 28, color: "var(--text)", marginBottom: 6 }}>
                Create account
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Join Rooty as a student or tutor</div>
            </div>

            <Field label="Full name" id="reg-name" icon="user"
              value={form.name} onChange={v => update("name", v)}
              placeholder="Your full name" error={errors.name} />
            <Field label="NCF email address" type="email" id="reg-email" icon="mail"
              value={form.email} onChange={v => update("email", v)}
              placeholder="you@ncf.edu" error={errors.email} />
            <Field label="Password" type="password" id="reg-password" icon="shield"
              value={form.password} onChange={v => update("password", v)}
              placeholder="Min. 6 characters" error={errors.password} />

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 8, letterSpacing: "0.2px" }}>
                I am a…
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {([
                  { value: "student" as const, icon: "graduation-cap", label: "Student", sub: "Find & book tutors" },
                  { value: "tutor" as const, icon: "pencil", label: "Tutor", sub: "Offer tutoring sessions" },
                ]).map(r => (
                  <button key={r.value} type="button" onClick={() => update("role", r.value)} style={{
                    padding: "14px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                    background: form.role === r.value ? "var(--blue-light)" : "white",
                    border: `1.5px solid ${form.role === r.value ? "var(--blue)" : "#E0E4EF"}`,
                    fontFamily: "DM Sans, sans-serif", transition: "all .15s",
                  }}>
                    <div style={{ marginBottom: 6 }}>
                      <Icon name={r.icon} size={20} color={form.role === r.value ? "var(--blue)" : "#9CA3AF"} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: form.role === r.value ? "var(--blue)" : "var(--text)" }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <Btn fullWidth variant="primary" style={{ padding: "13px", fontSize: 15, marginBottom: 16 }}>
              {loading ? "Creating account…" : form.role === "tutor" ? "Continue →" : "Create Account"}
            </Btn>
            <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
              By registering you agree to NCF&apos;s Student Platform Terms of Use.
            </div>
          </form>
        )}

        {/* ── TUTOR SUBJECTS STEP ───────────────────────────────── */}
        {view === "register-tutor" && (
          <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: 440 }}>
            <div style={{ marginBottom: 24 }}>
              <button type="button" onClick={() => { setView("register"); setErrors({}) }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "DM Sans, sans-serif", fontSize: 13, marginBottom: 16, padding: 0 }}>
                <Icon name="chevron-left" size={16} color="var(--muted)" /> Back
              </button>

              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {(["Account", "Subjects", "Done"] as const).map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "var(--blue)" : i === 1 ? "var(--blue)" : "#E0E4EF",
                      color: i <= 1 ? "white" : "var(--muted)",
                    }}>
                      {i === 0 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: i === 1 ? 600 : 400, color: i === 1 ? "var(--text)" : "var(--muted)" }}>
                      {s}
                    </span>
                    {i < 2 && <div style={{ width: 20, height: 1, background: "#E0E4EF" }} />}
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "Lora, serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 6 }}>
                What do you tutor?
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Select all subjects you can confidently teach</div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {SUBJECTS.map(s => (
                <button key={s} type="button" onClick={() => toggleSubject(s)} style={{
                  padding: "8px 16px", borderRadius: 99, cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif", fontWeight: 600, fontSize: 13,
                  background: form.subjects.includes(s) ? "var(--blue)" : "white",
                  color: form.subjects.includes(s) ? "white" : "var(--muted)",
                  border: `1.5px solid ${form.subjects.includes(s) ? "var(--blue)" : "#E0E4EF"}`,
                  transition: "all .15s",
                }}>
                  {s}
                </button>
              ))}
            </div>

            {errors.subjects && (
              <div style={{ fontSize: 12, color: "#DC2626", marginBottom: 12, fontWeight: 500 }}>{errors.subjects}</div>
            )}

            <div style={{ padding: "14px", borderRadius: 10, background: "var(--gold-light)", border: "1px solid var(--gold)", marginBottom: 20, fontSize: 13, color: "#92660A", lineHeight: 1.6 }}>
              <strong>Note:</strong> Your application will be reviewed by the Director of Tutoring Services before you can start accepting sessions.
            </div>

            <Btn fullWidth variant="gold" style={{ padding: "13px", fontSize: 15, marginBottom: 8 }}>
              {loading
                ? "Submitting…"
                : `Submit Application (${form.subjects.length} subject${form.subjects.length !== 1 ? "s" : ""})`}
            </Btn>
          </form>
        )}

      </div>
    </div>
  )
}
