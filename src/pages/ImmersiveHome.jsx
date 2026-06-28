import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'
import { TypeAnimation } from 'react-type-animation'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'
import { skillCategories } from '../data/skills'

// ── Constants ─────────────────────────────────────────────────────────────────
const GREEN = '#00FF88'
const PURPLE = '#7C3AED'
const CYAN = '#06B6D4'
const BG = '#060606'

// ── Particle canvas background ────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
    }))

    let id
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,255,136,${0.06 * (1 - dist / 110)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Draw dots
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,255,136,0.35)'
        ctx.fill()
      })

      id = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}
    />
  )
}

// ── Cursor glow ───────────────────────────────────────────────────────────────
function CursorGlow() {
  const [pos, setPos] = useState({ x: -300, y: -300 })
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 320,
        height: 320,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,255,136,0.045) 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'left 0.12s ease, top 0.12s ease',
      }}
    />
  )
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40, style }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ num, text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 28,
        fontFamily: 'monospace',
        fontSize: '11px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)',
      }}
    >
      <span style={{ color: GREEN }}>/{num}</span>
      <span
        style={{
          display: 'inline-block',
          width: 32,
          height: 1,
          background: 'rgba(255,255,255,0.15)',
        }}
      />
      {text}
    </div>
  )
}

// ── Marquee strip ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'ML ENGINEER', 'ACCENTURE', 'MAILAI FOUNDER',
  'LLMs', 'PYTORCH', 'FASTAPI', 'RAG SYSTEMS',
  'DEEP LEARNING', 'PRODUCTION ML', 'NLP', '1000+ DSA',
]

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      style={{
        background: GREEN,
        padding: '10px 0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <motion.div
        style={{ display: 'flex', gap: 40, width: 'max-content' }}
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              color: '#060606',
              fontWeight: 800,
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {item}
            <span style={{ display: 'inline-block', width: 6, height: 6, background: '#06060680', borderRadius: '50%', margin: '0 20px', verticalAlign: 'middle' }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Horizontal divider ────────────────────────────────────────────────────────
function Divider({ color = 'rgba(255,255,255,0.06)' }) {
  return <div style={{ height: 1, background: color, width: '100%' }} />
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '18px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled ? 'rgba(6,6,6,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'background 0.3s, border 0.3s',
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: GREEN,
        }}
      >
        SST
      </span>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {[
          { label: 'Work', href: '#projects' },
          { label: 'About', href: '#about' },
          { label: 'Blog', to: '/blog' },
        ].map(({ label, href, to }) =>
          to ? (
            <Link
              key={label}
              to={to}
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '12px',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '12px',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}
            >
              {label}
            </a>
          )
        )}
        <a
          href={`mailto:${personal.email}`}
          style={{
            background: GREEN,
            color: '#060606',
            fontWeight: 700,
            fontSize: '11px',
            padding: '8px 18px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          Hire me
        </a>
      </div>
    </motion.nav>
  )
}

// ── HERO SECTION ──────────────────────────────────────────────────────────────
function Hero() {
  const words = ['MACHINE', 'LEARNING', 'ENGINEER.']
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px 5vw 60px',
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* Status pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 36,
          width: 'fit-content',
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: GREEN,
            display: 'inline-block',
            boxShadow: `0 0 8px ${GREEN}`,
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: GREEN,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {personal.availability}
        </span>
      </motion.div>

      {/* Giant heading */}
      <div style={{ marginBottom: 32 }}>
        {words.map((word, i) => (
          <div key={word} style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ delay: 0.45 + i * 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(3.5rem, 10.5vw, 11rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                margin: 0,
                ...(i === 1
                  ? {
                      background: `linear-gradient(90deg, ${GREEN} 0%, ${CYAN} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : { color: '#F0F0F0' }),
              }}
            >
              {word}
            </motion.h1>
          </div>
        ))}
      </div>

      {/* Subtitle row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.6 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 44,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          I'm{' '}
          <span style={{ color: '#F0F0F0', fontWeight: 600 }}>Sai Sridhar Tarra</span> — I build
        </span>
        <span style={{ color: GREEN, fontFamily: 'monospace', fontSize: '13px' }}>
          <TypeAnimation
            sequence={[
              'production ML pipelines.', 2000,
              'LLM-powered products.', 2000,
              'scalable AI systems.', 2000,
              'real-world ML at scale.', 2000,
            ]}
            wrapper="span"
            speed={60}
            repeat={Infinity}
          />
        </span>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <a
          href="#projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: GREEN,
            color: '#060606',
            fontWeight: 800,
            fontSize: '13px',
            padding: '14px 28px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          View Work <FiArrowUpRight size={16} />
        </a>
        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#F0F0F0',
            fontWeight: 600,
            fontSize: '13px',
            padding: '14px 28px',
            borderRadius: 4,
            textDecoration: 'none',
          }}
        >
          <FiGithub size={15} /> GitHub
        </a>
        <a
          href={personal.resume}
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            paddingLeft: 12,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.color = '#fff')}
          onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.4)')}
        >
          Resume ↓
        </a>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        style={{
          marginTop: 72,
          paddingTop: 28,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          gap: 48,
          flexWrap: 'wrap',
        }}
      >
        {personal.stats.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontWeight: 900,
                fontSize: '2.2rem',
                color: GREEN,
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {s.value}{s.suffix}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                marginTop: 5,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          position: 'absolute',
          bottom: 32,
          right: '5vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 44,
            background: `linear-gradient(to bottom, ${GREEN}, transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

// ── ABOUT SECTION ─────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: '120px 5vw', position: 'relative', zIndex: 5 }}>
      <Divider />
      <div style={{ marginTop: 80 }}>
        <SectionLabel num="01" text="About" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <Reveal>
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 5rem)',
                fontWeight: 900,
                color: '#F0F0F0',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              ML Engineer
              <br />
              <span style={{ color: GREEN }}>+</span> Founder
              <br />
              based in
              <br />
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>Hyderabad.</span>
            </h2>
          </Reveal>

          {/* Right */}
          <div>
            <Reveal delay={0.1}>
              <p
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  marginBottom: 32,
                }}
              >
                {personal.longBio}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {skillCategories.slice(0, 4).map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      padding: '16px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        color: GREEN,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}
                    >
                      {cat.icon} {cat.label}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '12px',
                        lineHeight: 1.7,
                      }}
                    >
                      {cat.skills
                        .slice(0, 4)
                        .map((s) => s.name)
                        .join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── PROJECTS SECTION ──────────────────────────────────────────────────────────
function Projects() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="projects" style={{ padding: '120px 5vw', position: 'relative', zIndex: 5 }}>
      <Divider />
      <div style={{ marginTop: 80 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 60,
          }}
        >
          <Reveal>
            <SectionLabel num="02" text="Selected Work" />
            <h2
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 5rem)',
                fontWeight: 900,
                color: '#F0F0F0',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              What I've
              <br />
              <span style={{ color: GREEN }}>built.</span>
            </h2>
          </Reveal>
        </div>

        {/* Project list */}
        <div>
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <div>
                <Divider color="rgba(255,255,255,0.05)" />
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr auto auto',
                      alignItems: 'center',
                      gap: 24,
                      padding: '28px 0',
                      transition: 'background 0.2s',
                      background: hovered === p.id ? 'rgba(0,255,136,0.03)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: hovered === p.id ? GREEN : 'rgba(255,255,255,0.2)',
                        transition: 'color 0.2s',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                          fontWeight: 800,
                          color: hovered === p.id ? '#fff' : 'rgba(255,255,255,0.85)',
                          letterSpacing: '-0.02em',
                          transition: 'color 0.2s',
                          marginBottom: 4,
                        }}
                      >
                        {p.title}
                      </div>
                      <AnimatePresence>
                        {hovered === p.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p
                              style={{
                                color: 'rgba(255,255,255,0.45)',
                                fontSize: '13px',
                                lineHeight: 1.65,
                                marginTop: 8,
                                marginBottom: 0,
                              }}
                            >
                              {p.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.category}
                    </span>
                    <motion.span
                      animate={{ x: hovered === p.id ? 4 : 0, opacity: hovered === p.id ? 1 : 0.3 }}
                      style={{ color: GREEN }}
                    >
                      <FiArrowUpRight size={22} />
                    </motion.span>
                  </div>
                </a>
              </div>
            </Reveal>
          ))}
          <Divider color="rgba(255,255,255,0.05)" />
        </div>
      </div>
    </section>
  )
}

// ── EXPERIENCE SECTION ────────────────────────────────────────────────────────
function Experience() {
  return (
    <section style={{ padding: '120px 5vw', position: 'relative', zIndex: 5 }}>
      <Divider />
      <div style={{ marginTop: 80 }}>
        <SectionLabel num="03" text="Experience & Education" />
        <Reveal>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 5rem)',
              fontWeight: 900,
              color: '#F0F0F0',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 0 72px 0',
            }}
          >
            My journey
            <br />
            <span style={{ color: GREEN }}>so far.</span>
          </h2>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
          }}
        >
          {experiences.map((exp, i) => (
            <Reveal key={exp.id} delay={i * 0.08}>
              <div
                style={{
                  padding: '28px 30px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${exp.color}55`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: exp.color || GREEN,
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    color: exp.color || GREEN,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {exp.type} · {exp.period}
                </div>
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#F0F0F0',
                    marginBottom: 4,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {exp.role}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: 14,
                  }}
                >
                  {exp.company}
                </div>
                <p
                  style={{
                    fontSize: '12.5px',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {exp.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {exp.tech.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.35)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 3,
                        padding: '2px 8px',
                        fontFamily: 'monospace',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CONTACT SECTION ───────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      ref={ref}
      style={{ padding: '120px 5vw 80px', position: 'relative', zIndex: 5 }}
    >
      <Divider />
      <div style={{ marginTop: 80 }}>
        <SectionLabel num="04" text="Contact" />

        <motion.div style={{ y }}>
          <h2
            style={{
              fontSize: 'clamp(3rem, 10vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: '#F0F0F0',
              margin: '0 0 24px 0',
            }}
          >
            LET'S
            <br />
            <span
              style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                WebkitTextFillColor: 'transparent',
                display: 'block',
              }}
            >
              WORK
            </span>
            <span style={{ color: GREEN }}>TOGETHER.</span>
          </h2>
        </motion.div>

        <Reveal delay={0.2}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              marginTop: 48,
            }}
          >
            {[
              { icon: <FiMail size={16} />, label: 'Email me', href: `mailto:${personal.email}` },
              { icon: <FiGithub size={16} />, label: 'GitHub', href: personal.github },
              { icon: <FiLinkedin size={16} />, label: 'LinkedIn', href: personal.linkedin },
              { icon: <FiTwitter size={16} />, label: 'Twitter', href: personal.twitter },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 22px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GREEN
                  e.currentTarget.style.color = GREEN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                {icon} {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: '28px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.12em',
        }}
      >
        © 2025 Sai Sridhar Tarra
      </span>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link
          to="/blog"
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', textDecoration: 'none' }}
        >
          Blog
        </Link>
        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', textDecoration: 'none' }}
        >
          GitHub
        </a>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function ImmersiveHome() {
  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        color: '#F0F0F0',
        overflowX: 'hidden',
      }}
    >
      <ParticleCanvas />
      <CursorGlow />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  )
}
