import { useState, useEffect, useRef } from 'react'
import './App.css'
import { AuthModal } from './components/AuthModal'
import { GuardianNarrative } from './components/GuardianNarrative'
import { GuardianSkills } from './components/GuardianSkills'
import { useAuth } from './contexts/AuthContext'
import { logOut } from './lib/firebase'
import { calculateZiweiChart } from './engine/ziweiCalculator'
import type { ZiweiChart } from './engine/ziweiCalculator'
import guardiansData from './data/guardians.json'
import type { Guardian } from './types/guardians'

type JourneyStep = 'hero' | 'world-intro' | 'rules' | 'input' | 'calculating' | 'profile' | 'bind'
type ModalStep = 'silhouette' | 'revealing' | 'reveal' | null

const BEASTS = guardiansData as unknown as readonly Guardian[]

// Stars
function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {Array.from({length: 80}, (_, i) => (
        <div key={i} className="star"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            width: `${(i % 4) + 0.5}px`,
            height: `${(i % 4) + 0.5}px`,
            animationDelay: `${(i % 13) * 0.4}s`,
            animationDuration: `${2.5 + (i % 9)}s`,
          }}
        />
      ))}
    </div>
  )
}

// Nav
function Nav({ onHome, stepBack }: { onHome?: () => void; stepBack?: () => void }) {
  return (
    <nav className="nav">
      {stepBack ? (
        <button className="nav-back" onClick={stepBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2 L4 7 L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
      ) : (
        <button className="nav-logo-btn" onClick={onHome}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#C9943A" strokeWidth="1"/>
            <circle cx="9" cy="9" r="3.5" stroke="#C9943A" strokeWidth="0.7" opacity="0.5"/>
            <circle cx="9" cy="9" r="1.5" fill="#C9943A" opacity="0.9"/>
          </svg>
          <span className="nav-logo-text">ASTRAL MYSTICA</span>
        </button>
      )}
      <div className="nav-tag">Ziwei Doushu · Astrology</div>
    </nav>
  )
}

// Hero
function HeroPage({ onBegin, onSignIn, user, onSignOut }: { onBegin: () => void; onSignIn: () => void; user: any | null; onSignOut: () => void }) {
  const [phase, setPhase] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let rafId: number; let t = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const draw = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2; const cy = canvas.height / 2
      for (let r = 0; r < 4; r++) {
        const radius = 80 + r * 60; const rot = t * (0.003 - r * 0.0005)
        ctx!.beginPath(); ctx!.ellipse(cx, cy, radius, radius * 0.35, rot, 0, Math.PI * 2)
        ctx!.strokeStyle = `rgba(201,148,58,${0.1 + r * 0.04})`; ctx!.lineWidth = 0.8; ctx!.stroke()
        for (let i = 0; i < 3; i++) {
          const a = rot + (i / 3) * Math.PI * 2
          ctx!.beginPath(); ctx!.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * 0.35, 2.5, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(139,92,246,${0.35 + r * 0.15})`; ctx!.fill()
        }
      }
      const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 55)
      grd.addColorStop(0, 'rgba(139,92,246,0.12)'); grd.addColorStop(1, 'rgba(139,92,246,0)')
      ctx!.beginPath(); ctx!.arc(cx, cy, 55, 0, Math.PI * 2); ctx!.fillStyle = grd; ctx!.fill()
      ctx!.beginPath(); ctx!.arc(cx, cy, 5, 0, Math.PI * 2); ctx!.fillStyle = 'rgba(201,148,58,0.85)'; ctx!.fill()
      t++; rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div className="page hero-page">
      <Stars />
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-content" style={{ opacity: phase, transform: `translateY(${20 - phase * 20}px)` }}>
        <div className="hero-symbol">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="34" stroke="#C9943A" strokeWidth="0.8" opacity="0.3"/>
            <circle cx="36" cy="36" r="26" stroke="#C9943A" strokeWidth="0.6" opacity="0.4"/>
            <circle cx="36" cy="36" r="18" stroke="#C9943A" strokeWidth="0.4" opacity="0.5"/>
            <circle cx="36" cy="36" r="5" fill="#C9943A" opacity="0.85"/>
            {[0,60,120,180,240,300].map(a => {
              const r = (a * Math.PI) / 180
              return <circle key={a} cx={36 + 26 * Math.cos(r)} cy={36 + 26 * Math.sin(r)} r="2" fill="#C9943A" opacity="0.5"/>
            })}
          </svg>
        </div>
        <div className="hero-eyebrow">✦ ANCIENT CHINESE DIVINATION · EST. 2026 ✦</div>
        <h1 className="hero-title">Discover Your<br/><em>Celestial Guardian</em></h1>
        <p className="hero-subtitle">
          Through the ancient art of Ziwei Doushu astrology, your birth chart reveals your <strong>Ming Palace</strong>, celestial stars, and the <strong>Shanhaijing Guardian</strong> assigned to guide your destiny.
        </p>
        <div className="hero-cta">
          <button className="btn btn-primary btn-large" onClick={onBegin}>Begin Your Journey</button>
          <button className="btn btn-ghost btn-large" onClick={onBegin}>Explore Guardians</button>
        </div>
      </div>
    </div>
  )
}

// World Intro
function WorldIntroPage({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 80); return () => clearTimeout(t) }, [])
  const pillars = [
    { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#8B5CF6" strokeWidth="1.2"/><circle cx="18" cy="18" r="6" stroke="#8B5CF6" strokeWidth="0.8" opacity="0.5"/><circle cx="18" cy="18" r="2" fill="#8B5CF6"/></svg>, title: 'The 12 Palaces', desc: 'Your chart divides life into 12 sacred domains — Career, Fortune, Health, Relationships and more.' },
    { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4 L32 30 H4 Z" stroke="#C9943A" strokeWidth="1.2" fill="none"/><circle cx="18" cy="22" r="5" stroke="#C9943A" strokeWidth="0.8" opacity="0.5"/></svg>, title: '14 Celestial Stars', desc: 'Stars like Ziwei, Tianji, and Taiyang are placed in your chart, each carrying ancient wisdom.' },
    { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#34D399" strokeWidth="1.2"/><path d="M12 18 Q18 10 24 18 Q18 26 12 18" stroke="#34D399" strokeWidth="1" fill="none"/></svg>, title: 'Your Guardian Beast', desc: 'One of 12 Shanhaijing guardians is assigned at your birth — protector of your Ming Palace.' },
  ]
  return (
    <div className="page page-center" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.6s' }}>
      <Stars />
      <div className="content-center">
        <div className="eyebrow">✦ THE ANCIENT SYSTEM ✦</div>
        <h1 className="title-lg">The Eastern Cosmos<br/><em>of Ziwei Doushu</em></h1>
        <p className="desc-md">For over a thousand years, Chinese sages mapped the heavens to reveal human destiny. Ziwei Doushu is the most revered astrological system in the Chinese tradition.</p>
        <div className="pillars">
          {pillars.map((p, i) => (
            <div key={i} className="pillar" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={onNext}>I Understand — Continue →</button>
        {onBack && <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '0.75rem' }}>← Back</button>}
      </div>
    </div>
  )
}

// Rules
function RulesPage({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 80); return () => clearTimeout(t) }, [])
  const rules = [
    { n: '01', title: 'Your Ming Palace is Your Core', desc: 'The Ming Palace (命宫) reveals your personality, strengths, and life purpose. Everything radiates from here.' },
    { n: '02', title: 'Stars Shape Your Destiny', desc: '14 major stars are placed in your palaces. Their combinations create your unique personality profile.' },
    { n: '03', title: 'Your Guardian Beast is Revealed', desc: "Based on your birth year's earthly branch, one of 12 Shanhaijing guardians guides your path." },
    { n: '04', title: 'Four Transformations Indicate Energy', desc: 'Ke, Sheng, Tan, Bi — these describe how your celestial energy flows through life domains.' },
  ]
  return (
    <div className="page page-center" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.6s' }}>
      <Stars />
      <div className="content-center">
        <div className="eyebrow">✦ READING YOUR CHART ✦</div>
        <h1 className="title-lg">How the System<br/><em>Works</em></h1>
        <div className="rules-list">
          {rules.map((r, i) => (
            <div key={i} className="rule" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="rule-num">{r.n}</div>
              <div><h3>{r.title}</h3><p>{r.desc}</p></div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={onNext}>Enter My Birth Details →</button>
      </div>
    </div>
  )
}

// Input
function InputPage({ onSubmit, onBack }: { onSubmit: (d: { name: string; year: number; month: number; day: number; hour: number; gender: 'male' | 'female' }) => void; onBack?: () => void }) {
  const [form, setForm] = useState({ name: '', year: '2000', month: '1', day: '1', hour: '12', gender: 'male' as 'male' | 'female' })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 80); return () => clearTimeout(t) }, [])
  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Please enter your name'
    const y = parseInt(form.year)
    if (!y || y < 1900 || y > 2030) e.year = 'Valid year: 1900-2030'
    const m = parseInt(form.month)
    if (!m || m < 1 || m > 12) e.month = 'Month: 1-12'
    const d = parseInt(form.day)
    if (!d || d < 1 || d > 31) e.day = 'Day: 1-31'
    setErrs(e)
    return Object.keys(e).length === 0
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ name: form.name, year: parseInt(form.year), month: parseInt(form.month), day: parseInt(form.day), hour: parseInt(form.hour), gender: form.gender })
  }
  return (
    <div className="page page-center" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.6s' }}>
      <Stars />
      <div className="content-center">
        <div className="eyebrow">✦ YOUR BIRTH CHART ✦</div>
        <h1 className="title-lg">Enter Your<br/><em>Birth Details</em></h1>
        <p className="desc-md">Your chart is cast from the exact moment of birth. Even one hour changes the palace placements.</p>
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className={`form-input ${errs.name ? 'err' : ''}`} placeholder="How shall we address you?" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errs.name && <span className="form-error">{errs.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <div className="form-radios">
              {(['male', 'female'] as const).map(g => (
                <label key={g} className={`form-radio ${form.gender === g ? 'active' : ''}`}>
                  <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => setForm({ ...form, gender: g })} />
                  <span>{g === 'male' ? 'Male' : 'Female'}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-row3">
            {[{ f: 'year', l: 'Year', p: '2000' }, { f: 'month', l: 'Month', p: '1-12' }, { f: 'day', l: 'Day', p: '1-31' }].map(x => (
              <div key={x.f} className="form-group">
                <label className="form-label">{x.l}</label>
                <input type="number" className={`form-input ${errs[x.f] ? 'err' : ''}`} placeholder={x.p} value={(form as any)[x.f]} onChange={e => setForm({ ...form, [x.f]: e.target.value })} />
                {errs[x.f] && <span className="form-error">{errs[x.f]}</span>}
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Birth Hour (0-23)</label>
            <input type="number" className="form-input" placeholder="12 = noon · 0 = midnight" defaultValue={form.hour} min="0" max="23" onChange={e => setForm({ ...form, hour: (parseInt(e.target.value) || 0) as unknown as string })} />
            <div className="form-hint">Zi(23-01) · Chou(01-03) · Yin(03-05) · Mao(05-07) · Chen(07-09) · Si(09-11) · Wu(11-13) · Wei(13-15) · Shen(15-17) · You(17-19) · Xu(19-21) · Hai(21-23)</div>
          </div>
          <button type="submit" className="btn btn-primary btn-full">Calculate My Chart →</button>
          {onBack && <button type="button" className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop: '0.75rem' }}>← Back</button>}
        </form>
      </div>
    </div>
  )
}

// ── Constellation Star Chart (no Chinese) ───────────────────────────────────
function ConstellationStarChart({ step }: { step: number }) {
  const S = 260, cx = S/2, cy = S/2

  // Outer ring of small stars — rotates slowly
  const outerR = 115, midR = 85, innerR = 55
  const drift = step * 0.9  // degrees per step

  // 36 outer constellation stars
  const outerStars = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2 - Math.PI/2 + (drift * Math.PI / 180)
    return { x: cx + outerR * Math.cos(a), y: cy + outerR * Math.sin(a), i }
  })

  // 12 mid ring nodes (connected by lines to form constellation)
  const midNodes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI/2 + (drift * 0.5 * Math.PI / 180)
    return { x: cx + midR * Math.cos(a), y: cy + midR * Math.sin(a), i }
  })

  // 8 inner ring stars
  const innerStars = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI/2 + (drift * 0.3 * Math.PI / 180)
    return { x: cx + innerR * Math.cos(a), y: cy + innerR * Math.sin(a) }
  })

  // Connecting lines between mid nodes (constellation pattern)
  const midLines = midNodes.map((n, i) => {
    const next = midNodes[(i + 2) % 12]
    return { x1: n.x, y1: n.y, x2: next.x, y2: next.y }
  })

  // Active meridian line — appears at step >= 2
  const meridianAngle = ((step * 0.8) * Math.PI) / 180
  const mLineX2 = cx + 120 * Math.cos(meridianAngle - Math.PI/2)
  const mLineY2 = cy + 120 * Math.sin(meridianAngle - Math.PI/2)

  return (
    <svg
      width="260" height="260"
      viewBox={`0 0 ${S} ${S}`}
      style={{
        filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.4))',
        animation: 'chartRotate 30s linear infinite',
      }}
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.5)"/>
          <stop offset="60%" stopColor="rgba(139,92,246,0.1)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(139,92,246,0.08)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      <style>{`
        @keyframes chartRotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes starPulse { 0%,100% { opacity: 0.25 } 50% { opacity: 0.9 } }
        @keyframes centerPulse { 0%,100% { opacity: 0.5; transform: scale(1) } 50% { opacity: 1; transform: scale(1.15) } }
        @keyframes meridianPulse { 0%,100% { opacity: 0.4 } 50% { opacity: 0.9 } }
      `}</style>

      {/* Outer halo */}
      <circle cx={cx} cy={cy} r={outerR + 20} fill="url(#outerGlow)"/>
      <circle cx={cx} cy={cy} r={outerR + 6} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="8"/>

      {/* 3 orbital rings */}
      {[outerR, midR, innerR].map((r, ri) => (
        <circle key={ri} cx={cx} cy={cy} r={r}
          fill="none"
          stroke={['rgba(139,92,246,0.12)', 'rgba(139,92,246,0.2)', 'rgba(139,92,246,0.3)'][ri]}
          strokeWidth={[0.6, 0.8, 1][ri]}
          strokeDasharray={ri === 2 ? '4 3' : 'none'}
        />
      ))}

      {/* Constellation lines (mid ring) */}
      {midLines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="rgba(139,92,246,0.18)" strokeWidth="0.7"/>
      ))}

      {/* 36 outer stars */}
      {outerStars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={1.5}
          fill="rgba(237,232,255,0.85)"
          style={{
            animation: `starPulse ${1.5 + (i % 3) * 0.4}s ease-in-out infinite`,
            animationDelay: `${(i * 0.12) % 2.5}s`,
          }}
        />
      ))}

      {/* 12 mid ring nodes */}
      {midNodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="2.5"
            fill={i % 3 === 0 ? '#C9943A' : 'rgba(139,92,246,0.7)'}
            opacity={i % 3 === 0 ? 0.9 : 0.6}
            style={{ animation: `starPulse 2s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
          />
          {i % 3 === 0 && (
            <circle cx={n.x} cy={n.y} r="5" fill="none"
              stroke="rgba(201,148,58,0.3)" strokeWidth="0.8"
              style={{ animation: `starPulse 2s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }}
            />
          )}
        </g>
      ))}

      {/* 8 inner ring stars */}
      {innerStars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.8"
          fill="rgba(139,92,246,0.9)"
          style={{ animation: `starPulse ${1.2 + (i % 4) * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
        />
      ))}

      {/* Meridian line (appears when stars are placed) */}
      {step >= 2 && (
        <line x1={cx} y1={cy} x2={mLineX2} y2={mLineY2}
          stroke="rgba(239,68,68,0.6)"
          strokeWidth="1"
          strokeDasharray="3 2"
          style={{ animation: 'meridianPulse 1.5s ease-in-out infinite' }}
        />
      )}

      {/* Center glow */}
      <circle cx={cx} cy={cy} r="18" fill="url(#centerGlow)"/>
      <circle cx={cx} cy={cy} r="5" fill="#A78BFA"
        style={{ animation: 'centerPulse 2s ease-in-out infinite' }}/>
      <circle cx={cx} cy={cy} r="10" fill="none"
        stroke="rgba(139,92,246,0.4)" strokeWidth="0.8"
        style={{ animation: 'centerPulse 2s ease-in-out infinite 0.5s' }}/>
    </svg>
  )
}

// Calculating
function CalculatingPage({ name, onCancel }: { name: string; onCancel?: () => void }) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const msgs = [
    { m: 'Mapping the stars...', s: 'Charting your celestial birth signature' },
    { m: 'Reading the lunar cycle...', s: 'Aligning with the moon at your birth' },
    { m: 'Placing 14 celestial stars...', s: 'Ziwei, Tianji, Taiyang, Wuqu and more' },
    { m: 'Finding your Ming Palace...', s: 'The center of your life chart' },
    { m: 'Summoning your Guardian...', s: 'The Shanhaijing ancient one stirs' },
  ]
  useEffect(() => {
    const t1 = setInterval(() => setStep(s => Math.min(s + 1, msgs.length - 1)), 1500)
    const t2 = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 200)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="page page-center">
      <Stars />
      <div className="calc-compass-layout">
        {/* Left: constellation chart */}
        <div className="compass-wrap">
          <div className="compass-outer-ring" />
          <ConstellationStarChart step={step} />
          {step >= 2 && <div className="compass-needle-glow" />}
        </div>

        {/* Right: text progress */}
        <div className="calc-text-panel">
          <div className="compass-title">Casting Your Chart</div>
          <div className="compass-subtitle">Ziwei Doushu · Astrology</div>
          <div className="calc-progress"><div className="calc-fill" style={{ width: `${progress}%` }}/></div>
          <div className="calc-pct">{progress}%</div>
          <div className="calc-msg">{msgs[step]?.m}</div>
          <div className="calc-sub">{msgs[step]?.s}</div>
          <div className="calc-for">Reading for {name}</div>
          {onCancel && <button className="btn btn-ghost" onClick={onCancel}>← Cancel</button>}
        </div>
      </div>
    </div>
  )
}

// Profile Reveal (Centered Modal — Blurry Silhouette + Simple Pillars)
function ProfileRevealPage({ chart, onDiscover, onClose, onBack }: { chart: ZiweiChart; onDiscover: () => void; onClose?: () => void; onBack?: () => void }) {
  const beast = BEASTS[chart.guardianBeastId - 1]
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 80); return () => clearTimeout(t) }, [])

  return (
    <div className="profile-modal-overlay" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.5s' }}>
      <Stars />
      <div className="profile-modal-card profile-reveal-card">

        {/* Close */}
        <div className="profile-modal-header">
          <div className="eyebrow">✦ YOUR Ziwei CHART ✦</div>
          {onClose && (
            <button className="profile-modal-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* Blurry Guardian Silhouette */}
        <div className="reveal-silhouette-wrap">
          <div className="reveal-sil-glow" style={{ background: `radial-gradient(circle, ${beast.glowColor}44 0%, transparent 70%)` }}/>
          <img
            src={beast.icon}
            alt="Guardian"
            className="reveal-sil-img"
          />
          <div className="reveal-sil-mask">
            <div className="reveal-sil-label">Guardian Enshrouded</div>
            <div className="reveal-sil-hint">Unlock to reveal</div>
          </div>
        </div>

        {/* Poetic Copy */}
        <div className="reveal-copy">
          <div className="reveal-copy-title">Your Destiny Structure</div>
          <div className="reveal-copy-body">
            You are shaped less by fleeting impulses<br/>
            and more by enduring inner patterns.<br/>
            <span style={{ opacity: 0.6 }}>This is not a prediction, but a<br/>
            reflection of how your forces are aligned.</span>
          </div>
          <div className="reveal-copy-guardian">
            Your Guardian remains unseen.<br/>
            Unlock the full reading to meet the force<br/>
            that has walked with you long before<br/>
            you noticed it.
          </div>
        </div>

        {/* Simple Pillars */}
        <div className="reveal-pillars">
          <div className="reveal-pillars-label">Your Chart Foundations</div>
          <div className="reveal-pillars-grid">
            <div className="reveal-pillar-item">
              <div className="reveal-pillar-key">Year</div>
              <div className="reveal-pillar-val" style={{ color: '#C9943A' }}>{chart.calculationDetails.yearlyStem} {chart.calculationDetails.yearlyBranch}</div>
            </div>
            <div className="reveal-pillar-item">
              <div className="reveal-pillar-key">Month</div>
              <div className="reveal-pillar-val" style={{ color: '#C9943A' }}>{chart.calculationDetails.monthlyBranch}</div>
            </div>
            <div className="reveal-pillar-item">
              <div className="reveal-pillar-key">Hour</div>
              <div className="reveal-pillar-val" style={{ color: '#C9943A' }}>{chart.calculationDetails.hourlyBranch}</div>
            </div>
            <div className="reveal-pillar-item">
              <div className="reveal-pillar-key">Ming Palace</div>
              <div className="reveal-pillar-val" style={{ color: '#C9943A' }}>{chart.mingPalace}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="reveal-cta">
          <button className="btn btn-primary btn-full" onClick={onDiscover}>
            Unlock Full Reading — $1.99
          </button>
          {onBack && <button className="btn btn-ghost btn-full" onClick={onBack}>← Calculate Another</button>}
        </div>
      </div>
    </div>
  )
}

// Silhouette Modal
function SilhouetteModal({ beast, onClose, onUnlock }: { beast: typeof BEASTS[number]; onClose: () => void; onUnlock: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card sil-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <div className="sil-eyebrow">✦ A GUARDIAN APPROACHES ✦</div>
        <h2 className="sil-title">Your Shanhaijing<br/><em>Guardian Beast</em></h2>
        <div className="sil-orb">
          <div className="sil-orb-glow" style={{ background: `radial-gradient(circle, ${beast.glowColor} 0%, transparent 70%)` }}/>
          <img
            src={beast.icon}
            alt="Guardian"
            className="sil-orb-img"
            style={{
              filter: `blur(${phase < 2 ? 14 : 0}px) brightness(${phase < 2 ? 0.2 : 1})`,
              transform: phase >= 2 ? 'scale(1)' : 'scale(0.92)',
              transition: 'filter 2s, transform 2s',
            }}
          />
          {phase < 2 && <div className="sil-mystery">? ? ?</div>}
          {phase >= 2 && (
            <div className="sil-reveal">
              <div className="sil-reveal-name">{beast.name}</div>
              <div className="sil-reveal-tag">{beast.tagline}</div>
            </div>
          )}
        </div>
        {phase >= 2 && (
          <div className="sil-desc">
            <p>Your Guardian is <strong style={{ color: beast.color }}>{beast.name}</strong> — divine protector of the <strong>{beast.palace}</strong>.</p>
            <button className="btn btn-primary btn-full" onClick={onUnlock}>Unlock Full Reading — $1.99 →</button>
            <p className="sil-note">Instant access · No subscription</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Payment Modal
function PaymentModal({ beast, onClose, onSuccess }: { beast: typeof BEASTS[number]; onClose: () => void; onSuccess: () => void }) {
  const [processing, setProcessing] = useState(false)
  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => { setProcessing(false); onSuccess() }, 2200)
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card pay-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <div className="eyebrow">✦ SECURE CHECKOUT ✦</div>
        <h2 className="pay-title">Unlock Your<br/><em>Guardian Reading</em></h2>
        <div className="pay-beast-row">
          <img src={beast.icon} alt={beast.name} className="pay-beast-icon" />
          <div>
            <div className="pay-beast-name">{beast.name}</div>
            <div className="pay-beast-sub" style={{ color: beast.color }}>{beast.tagline}</div>
          </div>
        </div>
        <div className="pay-divider"/>
        <div className="pay-features">
          {[
            'Complete mythology & origin story',
            'Your personality arc & divine strengths',
            'Growth edge & life challenges',
            'Full palace interpretation',
            '14 celestial star placement',
            'Four Transformations explained',
            'Lucky cycles & timing',
            'Lifetime access · Updates included',
          ].map((item, i) => (
            <div key={i} className="pay-feat">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#34D399" strokeWidth="1"/><path d="M4 7 L6.5 9.5 L10.5 4.5" stroke="#34D399" strokeWidth="1.2" fill="none"/></svg>
              {item}
            </div>
          ))}
        </div>
        <div className="pay-price">$1.99 <span>one-time payment</span></div>
        <button className="btn btn-primary btn-full" onClick={handlePay} disabled={processing}>
          {processing ? <span className="dots"><span>.</span><span>.</span><span>.</span></span> : 'Complete Purchase — $1.99'}
        </button>
        <div className="pay-secure">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="4" width="10" height="7" rx="1" stroke="rgba(237,232,245,0.3)" strokeWidth="0.8"/><path d="M3.5 4V2.5A2.5 2.5 0 0 1 8.5 2.5V4" stroke="rgba(237,232,245,0.3)" strokeWidth="0.8" fill="none"/></svg>
          Secure · Encrypted · Instant access
        </div>
      </div>
    </div>
  )
}

// Reveal Animation
function RevealAnimation({ beast, onDone }: { beast: typeof BEASTS[number]; onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => onDone(), 5200),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])
  return (
    <div className="reveal-overlay">
      <Stars />
      <button className="reveal-close" onClick={onDone} aria-label="Skip">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3 L15 15 M15 3 L3 15" stroke="rgba(237,232,245,0.5)" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      <div className={`reveal-iris ${phase >= 1 ? 'open' : ''}`} />
      <div className={`reveal-center ${phase >= 2 ? 'vis' : ''}`}>
        <div className="reveal-glow" style={{ background: `radial-gradient(circle, ${beast.glowColor} 0%, transparent 65%)` }}/>
        <img src={beast.icon} alt={beast.name} className="reveal-img" />
        <div className="reveal-particles">
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * 360
            const dist = 50 + (i % 4) * 20
            const delay = (i % 6) * 0.12
            return (
              <div key={i} className="r-particle"
                style={{ transform: `rotate(${angle}deg) translateX(${dist}px)`, animationDelay: `${delay}s` }}
              />
            )
          })}
        </div>
      </div>
      {phase >= 3 && (
        <div className="reveal-name-block">
          <div className="reveal-branch" style={{ color: beast.color, borderColor: `${beast.color}50` }}>
            {beast.zodiac} · {beast.branch} Branch · {beast.palace}
          </div>
          <div className="reveal-name-lg">{beast.name}</div>
          <div className="reveal-tag-sm" style={{ color: beast.color }}>{beast.tagline}</div>
        </div>
      )}
    </div>
  )
}

// Guardian Reveal Page
function GuardianRevealPage({ chart, onBind, onClose, onBack }: { chart: ZiweiChart; onBind: () => void; onClose?: () => void; onBack?: () => void }) {
  const beast = BEASTS[chart.guardianBeastId - 1]
  const [tab, setTab] = useState<'myth' | 'narrative' | 'chart' | 'powers'>('myth')
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 100); return () => clearTimeout(t) }, [])
  return (
    <div className="page guardian-page" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.7s' }}>
      <Stars />
      <div className="guardian-aura" style={{ background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${beast.glowColor} 0%, transparent 70%)` }}/>
      {onClose && (
        <button className="close-x guardian-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      )}
      <div className="guardian-content">
        <div className="eyebrow">✦ YOUR GUARDIAN REVEALED ✦</div>
        <div className="guardian-hdr">
          <div className="guardian-icon-wrap">
            <div className="guardian-icon-glow" style={{ boxShadow: `0 0 50px 10px ${beast.glowColor}` }} />
            <img src={beast.icon} alt={beast.name} className="guardian-icon" />
          </div>
          <div>
            <div className="guardian-name">{beast.name}</div>
            <div className="guardian-meta" style={{ color: beast.color }}>{beast.zodiac} · {beast.branch} · {beast.palace}</div>
            <div className="guardian-tagline">{beast.tagline}</div>
            <div className="guardian-tags-row">
              <span className="guardian-tag-badge" style={{ color: beast.color, borderColor: `${beast.color}40` }}>{beast.element}</span>
              <span className="guardian-tag-badge" style={{ color: beast.color, borderColor: `${beast.color}40` }}>{chart.personalityType}</span>
            </div>
          </div>
        </div>
        <div className="guardian-tabs-row">
          {(['myth', 'narrative', 'chart', 'powers'] as const).map(tid => (
            <button key={tid} className={`guardian-tab ${tab === tid ? 'active' : ''}`} onClick={() => setTab(tid)}>
              {tid === 'myth' ? 'Mythology' : tid === 'narrative' ? 'Your Arc' : tid === 'chart' ? 'Chart' : 'Powers'}
            </button>
          ))}
        </div>
        <div className="guardian-body">
          {tab === 'myth' && (
            <div className="guardian-section">
              <h3 className="guardian-section-title">Origin & Mythology</h3>
              <p className="guardian-section-text">{beast.desc}</p>
              <div className="guardian-quote">"{beast.tagline}" — The Shanhaijing</div>
            </div>
          )}
          {tab === 'narrative' && (
            <div className="guardian-section">
              <GuardianNarrative guardian={beast} />
            </div>
          )}
          {tab === 'powers' && (
            <div className="guardian-section">
              <GuardianSkills guardian={beast} />
            </div>
          )}
          {tab === 'chart' && (
            <div className="guardian-section">
              <h3 className="guardian-section-title">Your Chart Summary</h3>
              <div className="guardian-chart-grid">
                {[
                  { l: 'Ming Palace', v: chart.mingPalace },
                  { l: 'Year Branch', v: chart.calculationDetails.yearlyBranch },
                  { l: 'Month Branch', v: chart.calculationDetails.monthlyBranch },
                  { l: 'Hour Branch', v: chart.calculationDetails.hourlyBranch },
                  { l: 'Year Stem', v: chart.calculationDetails.yearlyStem },
                  { l: 'Guardian', v: `${beast.name} (${beast.branch})` },
                  { l: 'Lunar Date', v: `${chart.lunarYear}/${chart.lunarMonth}/${chart.lunarDay}` },
                ].map((item, i) => (
                  <div key={i} className="guardian-chart-item" style={{ borderColor: `${beast.color}20` }}>
                    <div className="guardian-chart-label">{item.l}</div>
                    <div className="guardian-chart-value" style={{ color: beast.color }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div className="guardian-trans">
                <div className="guardian-trans-label">Four Transformations</div>
                <div className="guardian-trans-items">
                  {Object.entries(chart.fourTransformations).map(([k, v]) => (
                    <span key={k} className="guardian-trans-badge" style={{ color: beast.color, borderColor: `${beast.color}35` }}>
                      {k}: {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="guardian-cta">
          <button className="btn btn-primary btn-full" onClick={onBind} style={{ marginBottom: "0.5rem" }}>Bind Identity & Save →</button>
          {onBack && <button className="btn btn-ghost btn-full" onClick={onBack}>← Back</button>}
          <p className="guardian-cta-note">Save to access anytime · No account required</p>
        </div>
      </div>
    </div>
  )
}

// Bind Page
function BindPage({ chart, onComplete, onClose }: { chart: ZiweiChart; onComplete: () => void; onClose?: () => void }) {
  const beast = BEASTS[chart.guardianBeastId - 1]
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(0)
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 100); return () => clearTimeout(t) }, [])
  const handleBind = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.includes('@')) return
    setStep(1)
    setTimeout(onComplete, 2200)
  }
  return (
    <div className="page page-center" style={{ opacity: v ? 1 : 0, transition: 'opacity 0.6s' }}>
      <Stars />
      {onClose && (
        <button className="close-x" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      )}
      <div className="content-center">
        {step === 0 && (
          <>
            <div className="eyebrow">✦ SAVE YOUR CHART ✦</div>
            <h1 className="title-lg">Bind Your<br/><em>Identity</em></h1>
            <p className="desc-md">Save your chart to access anytime.</p>
            <div className="bind-beast-card" style={{ borderColor: `${beast.color}30` }}>
              <img src={beast.icon} alt={beast.name} className="bind-beast-img" />
              <div>
                <div className="bind-beast-name">{beast.name}</div>
                <div className="bind-beast-type">{chart.personalityType}</div>
                <div className="bind-beast-tag" style={{ color: beast.color, fontSize: '0.75rem' }}>{beast.tagline}</div>
              </div>
            </div>
            <form className="form-card" onSubmit={handleBind}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input type="text" className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-full">Save & Complete →</button>
            </form>
            <button className="btn btn-ghost btn-full" onClick={onComplete} style={{ marginTop: '0.75rem' }}>Skip for now</button>
          </>
        )}
        {step === 1 && (
          <div className="bind-success">
            <div className="bind-success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#34D399" strokeWidth="1.5" opacity="0.5"/>
                <circle cx="32" cy="32" r="20" stroke="#34D399" strokeWidth="1" opacity="0.3"/>
                <path d="M20 32 L28 40 L44 24" stroke="#34D399" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <h2 className="bind-success-title">Chart Saved!</h2>
            <p className="bind-success-sub">Your guardian {beast.name} is bound to your profile. Welcome to your journey.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// App Root
export default function App() {
  const [journey, setJourney] = useState<JourneyStep>('hero')
  const [formData, setFormData] = useState<{ name: string; year: number; month: number; day: number; hour: number; gender: 'male' | 'female' } | null>(null)
  const [chart, setChart] = useState<ZiweiChart | null>(null)
  const [modal, setModal] = useState<ModalStep>(null)
  const [, setPaid] = useState(false)  // paid tracked for future use
  const { user } = useAuth()
  const [authModal, setAuthModal] = useState(false)

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data)
    setJourney('calculating')
    setTimeout(() => {
      if (!data) return
      const c = calculateZiweiChart(data.year, data.month, data.day, data.hour, data.gender)
      setChart(c)
      setJourney('profile')
    }, 5200)
  }

  const beast = chart ? BEASTS[chart.guardianBeastId - 1] : BEASTS[0]
  const closeModal = () => { setPaid(false); setModal(null) }
  const resetAll = () => { setJourney('hero'); setChart(null); setFormData(null); setPaid(false); setModal(null) }

  return (
    <div className="app">
      <button
        className="nav-signin-btn"
        onClick={() => setAuthModal(true)}
        style={{position:'fixed',top:16,right:20,zIndex:999,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',padding:'7px 16px',borderRadius:20,cursor:'pointer',fontSize:13,backdropFilter:'blur(8px)'}}
      >
        {user ? '\u2605 Account' : '\u2606 Sign In'}
      </button>
      {journey === 'hero' && <HeroPage onBegin={() => setJourney('world-intro')} onSignIn={() => setAuthModal(true)} user={user} onSignOut={() => logOut()} />}
      {journey === 'world-intro' && <><Nav stepBack={resetAll} /><WorldIntroPage onNext={() => setJourney('rules')} onBack={resetAll} /></>}
      {journey === 'rules' && <><Nav stepBack={() => setJourney('world-intro')} /><RulesPage onNext={() => setJourney('input')} onBack={() => setJourney('world-intro')} /></>}
      {journey === 'input' && <><Nav stepBack={() => setJourney('rules')} /><InputPage onSubmit={handleFormSubmit} onBack={() => setJourney('rules')} /></>}
      {journey === 'calculating' && <><Nav stepBack={() => { setJourney('input') }} /><CalculatingPage name={formData?.name || 'Your'} onCancel={() => setJourney('input')} /></>}
      {journey === 'profile' && chart && (
        <ProfileRevealPage chart={chart} onDiscover={() => setModal('silhouette')} onClose={resetAll} onBack={() => setJourney('input')} />
      )}
      {modal === 'silhouette' && (
        <SilhouetteModal beast={beast} onClose={closeModal} onUnlock={() => setModal('revealing')} />
      )}
      {modal === 'revealing' && (
        <RevealAnimation beast={beast} onDone={() => setModal('reveal')} />
      )}
      {modal === 'reveal' && chart && (
        <GuardianRevealPage chart={chart} onBind={() => setJourney('bind')} onClose={closeModal} />
      )}
      {journey === 'bind' && chart && (
        <BindPage chart={chart} onComplete={resetAll} onClose={resetAll} />
      )}
      {authModal && (
        <AuthModal
          onClose={() => setAuthModal(false)}
          onLoginSuccess={(u) => { console.log('Signed in:', u?.email); setAuthModal(false) }}
        />
      )}
    </div>
  )
}
