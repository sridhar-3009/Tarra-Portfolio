// Inspired by kartavya-singh.com — bold split-screen, orange accent, horizontal work scroller
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'
import { skillCategories } from '../data/skills'

const ORANGE = '#FF6B00'
const BG = '#0C0C0C'
const SURFACE = '#151515'
const BORDER = 'rgba(255,255,255,0.07)'
const TEXT = '#F2F2F2'
const MUTED = 'rgba(255,255,255,0.4)'

// ── Cursor dot ────────────────────────────────────────────────────────────────
function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hov, setHov] = useState(false)

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    const over = (e) => setHov(e.target.closest('a, button') !== null)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])

  return (
    <>
      <motion.div style={{
        position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999,
        width: hov ? 40 : 8, height: hov ? 40 : 8,
        borderRadius: '50%', background: hov ? 'transparent' : ORANGE,
        border: hov ? `1.5px solid ${ORANGE}` : 'none',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        transition: 'width 0.2s, height 0.2s, background 0.2s',
      }} />
    </>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mixBlendMode: 'difference',
      }}
    >
      <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
        SST<span style={{ color: ORANGE }}>.</span>
      </span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[
          { label: 'Work', href: '#work' },
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
        ].map(({ label, href }) => (
          <a key={label} href={href} style={{
            color: '#fff', fontSize: '13px', textDecoration: 'none',
            padding: '7px 14px', borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.12)',
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = `${ORANGE}15` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent' }}>
            {label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}

// ── HERO — split screen ───────────────────────────────────────────────────────
function Hero() {
  const roles = ['ML Engineer', 'AI Builder', 'LLM Specialist', 'Founder']
  const [roleIdx, setRoleIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative' }}>
      {/* Left — dark */}
      <div style={{
        background: BG, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '0 4vw 60px 5vw',
      }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '11px', color: ORANGE,
            letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Portfolio · 2025
          </div>
          <h1 style={{
            fontSize: 'clamp(3rem, 6.5vw, 7rem)', fontWeight: 900, color: TEXT,
            lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 24px',
          }}>
            Sai<br />Sridhar<br />Tarra
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{ width: 32, height: 1, background: ORANGE }} />
            <div style={{ height: 28, overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.span key={roleIdx}
                  initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -28, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'block', color: TEXT, fontSize: '15px', fontWeight: 600 }}>
                  {roles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <a href="#work" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            color: BG, background: ORANGE, fontWeight: 800,
            fontSize: '13px', padding: '13px 24px', borderRadius: 100,
            textDecoration: 'none', letterSpacing: '0.03em',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            See my work <FiArrowRight size={14} />
          </a>
        </motion.div>

        {/* Bottom social strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: '50%',
            padding: '20px 5vw', display: 'flex', gap: 16,
            borderTop: `1px solid ${BORDER}`,
          }}>
          {[
            { icon: <FiGithub size={16} />, href: personal.github },
            { icon: <FiLinkedin size={16} />, href: personal.linkedin },
            { icon: <FiMail size={16} />, href: `mailto:${personal.email}` },
          ].map(({ icon, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: MUTED, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = ORANGE}
              onMouseLeave={e => e.target.style.color = MUTED}>
              {icon}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Right — orange */}
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }}
        transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: ORANGE, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 5vw 60px',
          position: 'relative', overflow: 'hidden',
        }}>
        {/* Big bg text */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          fontSize: '18vw', fontWeight: 900, color: 'rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap', letterSpacing: '-0.06em', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          ML
        </div>

        {/* Stats */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {personal.stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              style={{
                borderTop: i > 0 ? '1px solid rgba(0,0,0,0.12)' : 'none',
                padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
              <span style={{ fontWeight: 900, fontSize: '2.4rem', color: '#000', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {s.value}{s.suffix}
              </span>
              <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom right nav hint */}
        <div style={{
          position: 'absolute', bottom: 20, right: 5, fontSize: '9px',
          color: 'rgba(0,0,0,0.4)', letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: 'monospace', writingMode: 'vertical-rl',
        }}>
          Scroll to explore
        </div>
      </motion.div>
    </section>
  )
}

// ── WORK — horizontal scroll ──────────────────────────────────────────────────
function Work() {
  const trackRef = useRef()
  const [active, setActive] = useState(null)
  const ref = useRef()
  const inView = useInView(ref, { once: true })

  const PROJ_COLORS = [ORANGE, '#00C8FF', '#A855F7', '#22C55E', '#F59E0B', '#EC4899']

  return (
    <section id="work" ref={ref} style={{ background: BG, paddingTop: 100 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ padding: '0 5vw 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: ORANGE, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
            /02 Selected Work
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)', fontWeight: 900, color: TEXT, letterSpacing: '-0.04em', lineHeight: 0.95, margin: 0 }}>
            Things I've<br /><span style={{ color: ORANGE }}>built.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => trackRef.current?.scrollBy({ left: -420, behavior: 'smooth' })}
            style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${BORDER}`, background: 'transparent', color: TEXT, cursor: 'pointer', fontSize: '18px' }}>
            ←
          </button>
          <button onClick={() => trackRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
            style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${ORANGE}`, background: ORANGE, color: '#000', cursor: 'pointer', fontSize: '18px' }}>
            →
          </button>
        </div>
      </motion.div>

      {/* Horizontal scroll track */}
      <div ref={trackRef} style={{
        display: 'flex', gap: 16, overflowX: 'auto', padding: '0 5vw 60px',
        scrollbarWidth: 'none', scrollSnapType: 'x mandatory',
      }}>
        {projects.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            onMouseEnter={() => setActive(p.id)} onMouseLeave={() => setActive(null)}
            style={{
              minWidth: 340, scrollSnapAlign: 'start',
              border: `1px solid ${active === p.id ? PROJ_COLORS[i] : BORDER}`,
              borderRadius: 12, overflow: 'hidden', flexShrink: 0,
              background: active === p.id ? `${PROJ_COLORS[i]}08` : SURFACE,
              transition: 'border-color 0.25s, background 0.25s',
              cursor: 'pointer',
            }}
          >
            {/* Color bar */}
            <div style={{ height: 3, background: PROJ_COLORS[i % PROJ_COLORS.length] }} />
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{
                  fontFamily: 'monospace', fontSize: '10px',
                  color: PROJ_COLORS[i % PROJ_COLORS.length],
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                }}>
                  {p.category}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, color: BORDER }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: TEXT, letterSpacing: '-0.02em', marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ color: MUTED, fontSize: '13px', lineHeight: 1.65, marginBottom: 18 }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 20 }}>
                {p.tech?.slice(0, 4).map(t => (
                  <span key={t} style={{
                    fontSize: '10px', color: MUTED, fontFamily: 'monospace',
                    border: `1px solid ${BORDER}`, borderRadius: 3, padding: '2px 7px',
                  }}>{t}</span>
                ))}
              </div>
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: PROJ_COLORS[i % PROJ_COLORS.length], fontSize: '12px', fontWeight: 700,
                  textDecoration: 'none', transition: 'gap 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                onMouseLeave={e => e.currentTarget.style.gap = '6px'}>
                View project <FiArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} style={{ background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 5vw' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
          {/* Left */}
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: ORANGE, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
              /03 About
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, color: TEXT, letterSpacing: '-0.04em', lineHeight: 0.95, margin: '0 0 28px' }}>
              Engineer<br />by craft.<br /><span style={{ color: ORANGE }}>Builder</span><br />by nature.
            </h2>
            <p style={{ color: MUTED, fontSize: '15px', lineHeight: 1.8, marginBottom: 28 }}>
              {personal.longBio}
            </p>
            <a href={`mailto:${personal.email}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#000', background: ORANGE, fontWeight: 700, fontSize: '13px',
              padding: '12px 22px', borderRadius: 100, textDecoration: 'none',
            }}>
              Get in touch <FiArrowRight size={13} />
            </a>
          </div>

          {/* Right — skills grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {skillCategories.map((cat, i) => (
              <motion.div key={cat.id}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07 }}
                style={{
                  padding: '20px', border: `1px solid ${BORDER}`, borderRadius: 10,
                  background: BG, transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = ORANGE}
                onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: TEXT, marginBottom: 8 }}>{cat.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {cat.skills.slice(0, 4).map(s => (
                    <span key={s.name} style={{
                      fontSize: '10px', color: MUTED, fontFamily: 'monospace',
                      border: `1px solid ${BORDER}`, borderRadius: 3, padding: '2px 7px',
                    }}>{s.name}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
function Experience() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: '100px 5vw' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: ORANGE, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            /04 Journey
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, color: TEXT, letterSpacing: '-0.04em', margin: '0 0 56px', lineHeight: 0.95 }}>
            Experience.
          </h2>
        </motion.div>

        {experiences.map((exp, i) => (
          <motion.div key={exp.id}
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{
              display: 'grid', gridTemplateColumns: '160px 1fr',
              gap: 32, padding: '28px 0',
              borderTop: `1px solid ${BORDER}`,
            }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: MUTED, marginBottom: 8 }}>{exp.period}</div>
              <span style={{
                fontSize: '10px', fontWeight: 700, color: exp.color || ORANGE,
                textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                {exp.type}
              </span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: TEXT, marginBottom: 3 }}>{exp.role}</div>
              <div style={{ fontSize: '13px', color: MUTED, marginBottom: 12 }}>{exp.company}</div>
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{
      background: ORANGE, padding: '100px 5vw',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(0,0,0,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
          /05 Contact
        </div>
        <h2 style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, color: '#000', letterSpacing: '-0.05em', lineHeight: 0.9, margin: '0 0 28px' }}>
          Let's build<br />something<br />great.
        </h2>
        <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: '16px', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 36px' }}>
          Open to ML engineering roles, research collaborations, and interesting projects.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`mailto:${personal.email}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#000', color: ORANGE, fontWeight: 800, fontSize: '14px',
            padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
          }}>
            Say Hello <FiArrowRight size={14} />
          </a>
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.12)', color: '#000', fontWeight: 700, fontSize: '14px',
            padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
          }}>
            <FiLinkedin size={14} /> LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#080808', padding: '24px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${BORDER}` }}>
      <span style={{ fontWeight: 900, fontSize: '14px', color: TEXT }}>SST<span style={{ color: ORANGE }}>.</span></span>
      <div style={{ display: 'flex', gap: 24 }}>
        <Link to="/blog" style={{ color: MUTED, fontSize: '12px', textDecoration: 'none' }}>Blog</Link>
        <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ color: MUTED, fontSize: '12px', textDecoration: 'none' }}>GitHub</a>
      </div>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)' }}>© 2025 Sai Sridhar Tarra</span>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function KartavyaHome() {
  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: TEXT, overflowX: 'hidden', cursor: 'none' }}>
      <Cursor />
      <Nav />
      <Hero />
      <Work />
      <About />
      <Experience />
      <Contact />
      <Footer />
    </div>
  )
}
