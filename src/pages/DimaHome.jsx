// Inspired by dima-plotnikov.com — cinematic full-screen sections, extreme minimalism, stark white-on-black
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'

// ── Tokens ────────────────────────────────────────────────────────────────────
const B = '#000000'
const W = '#FFFFFF'
const G = 'rgba(255,255,255,0.18)'
const MID = 'rgba(255,255,255,0.45)'

// ── Preloader ─────────────────────────────────────────────────────────────────
function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v += Math.random() * 18 + 4
      if (v >= 100) { v = 100; clearInterval(t); setTimeout(onDone, 300) }
      setPct(Math.floor(v))
    }, 60)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, background: B, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: G, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
        Loading
      </div>
      <div style={{ fontWeight: 900, fontSize: '5rem', color: W, letterSpacing: '-0.05em', lineHeight: 1 }}>
        {String(pct).padStart(3, '0')}
      </div>
      <div style={{ marginTop: 24, width: 200, height: 1, background: G, position: 'relative' }}>
        <motion.div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: W, width: `${pct}%`, transition: 'width 0.08s linear' }} />
      </div>
    </motion.div>
  )
}

// ── Minimal nav ───────────────────────────────────────────────────────────────
function Nav() {
  return (
    <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '24px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
      <span style={{ fontWeight: 900, fontSize: '13px', color: W, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Sai Sridhar
      </span>
      <div style={{ display: 'flex', gap: 32 }}>
        {[{ l: 'Work', h: '#work' }, { l: 'About', h: '#about' }, { l: 'Contact', h: '#contact' }].map(({ l, h }) => (
          <a key={l} href={h} style={{ color: MID, fontSize: '12px', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = W}
            onMouseLeave={e => e.target.style.color = MID}>
            {l}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}

// ── HERO — full screen, huge type, parallax ───────────────────────────────────
function Hero() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5vw', overflow: 'hidden' }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div style={{ y, opacity, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 36 }}>
          Machine Learning Engineer · Hyderabad · 2025
        </motion.div>

        {['SAI', 'SRIDHAR', 'TARRA'].map((word, i) => (
          <div key={word} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 1.3 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(4rem, 14vw, 16rem)', fontWeight: 900, color: W,
                lineHeight: 0.88, letterSpacing: '-0.05em',
                ...(i === 1 ? {
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
                  WebkitTextFillColor: 'transparent',
                } : {}),
              }}>
              {word}
            </motion.div>
          </div>
        ))}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <p style={{ color: MID, fontSize: '15px', lineHeight: 1.75, maxWidth: 380 }}>
            Building production ML systems, LLM-powered products, and AI automation at Accenture and beyond.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#work" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid ${G}`, color: W, fontSize: '13px', fontWeight: 600,
              padding: '12px 22px', borderRadius: 2, textDecoration: 'none', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = W}
              onMouseLeave={e => e.currentTarget.style.borderColor = G}>
              View Work
            </a>
            <a href={`mailto:${personal.email}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: W, color: B, fontSize: '13px', fontWeight: 700,
              padding: '12px 22px', borderRadius: 2, textDecoration: 'none', transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Contact
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '20px 5vw', borderTop: `1px solid ${G}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
        <div style={{ display: 'flex', gap: 40 }}>
          {personal.stats.map(s => (
            <div key={s.label}>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: W, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.value}{s.suffix}
              </div>
              <div style={{ fontSize: '10px', color: G, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'monospace', marginTop: 3 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <FiArrowDown size={18} color={MID} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── WORK — full-width stacked rows ────────────────────────────────────────────
function Work() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="work" ref={ref} style={{ borderTop: `1px solid ${G}` }}>
      {/* Section label */}
      <div style={{ padding: '36px 5vw', borderBottom: `1px solid ${G}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}
          style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Selected Projects
        </motion.span>
        <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.1em' }}>
          {projects.length} projects
        </motion.span>
      </div>

      {/* Project rows */}
      {projects.map((p, i) => (
        <ProjectRow key={p.id} project={p} index={i} inView={inView} />
      ))}
    </section>
  )
}

function ProjectRow({ project, index, inView }) {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: index * 0.07 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${G}`,
        background: hov ? 'rgba(255,255,255,0.02)' : 'transparent',
        transition: 'background 0.3s',
      }}
    >
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', padding: '28px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto auto auto', gap: 24, alignItems: 'center' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: G }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: W, letterSpacing: '-0.02em' }}>
              {project.title}
            </div>
            {hov && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.22 }}>
                <p style={{ color: MID, fontSize: '13px', lineHeight: 1.6, marginTop: 6 }}>
                  {project.description}
                </p>
              </motion.div>
            )}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {project.category}
          </span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
            {project.tech?.slice(0, 2).map(t => (
              <span key={t} style={{ fontSize: '9px', color: G, fontFamily: 'monospace', border: `1px solid ${G}`, padding: '2px 6px', borderRadius: 2, whiteSpace: 'nowrap' }}>{t}</span>
            ))}
          </div>
          <motion.span animate={{ x: hov ? 4 : 0 }} style={{ color: hov ? W : G, display: 'flex' }}>
            <FiArrowUpRight size={18} />
          </motion.span>
        </div>
      </a>
    </motion.div>
  )
}

// ── ABOUT — full screen cinematic ─────────────────────────────────────────────
function About() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const inView = useInView(ref, { once: true })

  return (
    <section id="about" ref={ref} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', borderTop: `1px solid ${G}`, position: 'relative' }}>
      <motion.div style={{ y, width: '100%', padding: '100px 5vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24 }}>
              About
            </div>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 7rem)', fontWeight: 900, color: W,
              letterSpacing: '-0.04em', lineHeight: 0.9, margin: '0 0 40px',
            }}>
              Building<br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)', WebkitTextFillColor: 'transparent' }}>
                intelligent
              </span>
              <br />systems.
            </h2>
            <p style={{ color: MID, fontSize: '15px', lineHeight: 1.8, marginBottom: 36 }}>
              {personal.longBio}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={personal.github} target="_blank" rel="noopener noreferrer"
                style={{ color: MID, fontSize: '12px', textDecoration: 'none', border: `1px solid ${G}`, padding: '9px 16px', borderRadius: 2, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = W; e.currentTarget.style.color = W }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = MID }}>
                GitHub
              </a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ color: MID, fontSize: '12px', textDecoration: 'none', border: `1px solid ${G}`, padding: '9px 16px', borderRadius: 2, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = W; e.currentTarget.style.color = W }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = MID }}>
                LinkedIn
              </a>
              <Link to="/blog"
                style={{ color: MID, fontSize: '12px', textDecoration: 'none', border: `1px solid ${G}`, padding: '9px 16px', borderRadius: 2, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = W; e.currentTarget.style.color = W }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = MID }}>
                Blog
              </Link>
            </div>
          </motion.div>

          {/* Experience list */}
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3, duration: 0.7 }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24 }}>
              Career
            </div>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={{ borderTop: i > 0 ? `1px solid ${G}` : 'none', padding: '22px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: W }}>{exp.role}</div>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: G }}>{exp.period}</span>
                </div>
                <div style={{ fontSize: '13px', color: MID, marginBottom: 8 }}>{exp.company}</div>
                <p style={{ fontSize: '12px', color: G, lineHeight: 1.65, margin: 0 }}>{exp.description?.slice(0, 100)}...</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// ── CONTACT — cinematic full-screen ──────────────────────────────────────────
function Contact() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })

  return (
    <section id="contact" ref={ref} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: `1px solid ${G}`, padding: '0 5vw', position: 'relative', overflow: 'hidden' }}>
      {/* Huge bg text */}
      <div style={{
        position: 'absolute', bottom: -40, right: -20, zIndex: 0,
        fontSize: '28vw', fontWeight: 900, color: 'rgba(255,255,255,0.02)',
        letterSpacing: '-0.06em', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        HELLO
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24 }}>
          Get in touch
        </div>
        <h2 style={{
          fontSize: 'clamp(3rem, 12vw, 13rem)', fontWeight: 900, color: W,
          letterSpacing: '-0.05em', lineHeight: 0.88, margin: '0 0 48px',
        }}>
          Let's<br />
          <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.25)', WebkitTextFillColor: 'transparent' }}>
            talk.
          </span>
        </h2>
        <a href={`mailto:${personal.email}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          color: B, background: W, fontWeight: 800, fontSize: '16px',
          padding: '16px 32px', borderRadius: 2, textDecoration: 'none',
          letterSpacing: '-0.01em', transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {personal.email}
          <FiArrowUpRight size={18} />
        </a>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${G}`, padding: '24px 5vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'monospace', fontSize: '10px', color: G, letterSpacing: '0.12em' }}>
        © 2025 Sai Sridhar Tarra
      </span>
      <span style={{ fontWeight: 900, fontSize: '13px', color: W, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        SST
      </span>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function DimaHome() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ background: B, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: W, overflowX: 'hidden' }}>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      <Nav />
      <Hero />
      <Work />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
