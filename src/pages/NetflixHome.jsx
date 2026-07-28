import GitHubStats from '../components/sections/GitHubStats'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPlay, FiInfo, FiChevronLeft, FiChevronRight, FiGithub, FiExternalLink, FiPlus } from 'react-icons/fi'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'
import { skillCategories } from '../data/skills'

const RED = '#E50914'
const BG = '#141414'
const CARD_BG = '#2F2F2F'
const ROW_COLORS = ['#1a1a2e', '#16213e', '#0f3460', '#1b1b2f']

// ── Netflix top nav ───────────────────────────────────────────────────────────
function NetflixNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled
        ? 'rgba(20,20,20,0.97)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
      padding: '14px 5vw',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transition: 'background 0.4s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ color: RED, fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.04em', fontFamily: 'Georgia, serif' }}>
          SST
        </span>
        {['Work', 'About', 'Blog'].map((item) =>
          item === 'Blog' ? (
            <Link key={item} to="/blog" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', textDecoration: 'none', letterSpacing: '0.02em' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}>
              {item}
            </Link>
          ) : (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}>
              {item}
            </a>
          )
        )}
      </div>
      <a href={`mailto:${personal.email}`} style={{
        background: RED, color: '#fff', fontWeight: 700, fontSize: '13px',
        padding: '7px 18px', borderRadius: 4, textDecoration: 'none',
      }}>
        Hire Me
      </a>
    </nav>
  )
}

// ── HERO (Netflix billboard) ──────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: '100vh', position: 'relative', display: 'flex',
      flexDirection: 'column', justifyContent: 'flex-end',
      padding: '0 5vw 80px', overflow: 'hidden',
    }}>
      {/* Background gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 50%, rgba(229,9,20,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 30%, rgba(139,92,246,0.1) 0%, transparent 55%),
          ${BG}
        `,
      }} />
      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, opacity: 0.04,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundSize: '200px',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', zIndex: 2,
        background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 3, maxWidth: 640 }}>
        {/* Netflix-style show badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{
            background: RED, color: '#fff', fontWeight: 900,
            fontSize: '10px', padding: '3px 10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            N
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Featured Portfolio
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 9rem)', fontWeight: 900,
            lineHeight: 0.92, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 16px',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
          }}>
          Sai<br />
          <span style={{ color: RED }}>Sridhar</span><br />
          Tarra.
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 28 }}>
          ML Engineer at Accenture · Founder of MailAir · 4+ years building
          production AI systems, LLM pipelines, and intelligent automation at scale.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#work" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: '#000', fontWeight: 700,
            fontSize: '15px', padding: '12px 26px', borderRadius: 4,
            textDecoration: 'none', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <FiPlay size={17} /> Play Reel
          </a>
          <a href="#about" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(109,109,110,0.7)', color: '#fff', fontWeight: 700,
            fontSize: '15px', padding: '12px 26px', borderRadius: 4,
            textDecoration: 'none', backdropFilter: 'blur(4px)',
          }}>
            <FiInfo size={17} /> More Info
          </a>
        </motion.div>
      </div>

      {/* Stats floating right */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        style={{
          position: 'absolute', right: '5vw', bottom: 80, zIndex: 3,
          display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-end',
        }}>
        {personal.stats.map(s => (
          <div key={s.label} style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: '2rem', color: '#fff', lineHeight: 1 }}>
              {s.value}{s.suffix}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

// ── Netflix-style card ────────────────────────────────────────────────────────
function ProjectCard({ project, i }) {
  const [hovered, setHovered] = useState(false)

  const PALETTE = ['#1a1a4e', '#0d2137', '#1e0a3c', '#002b45', '#1a0a0a', '#0a1a0a']

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.08 : 1, zIndex: hovered ? 10 : 1 }}
      transition={{ duration: 0.25 }}
      style={{
        minWidth: 220, width: 220, borderRadius: 6, overflow: 'hidden',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 130, background: PALETTE[i % PALETTE.length],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>{project.icon || '🤖'}</span>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${project.color || RED}22 0%, transparent 60%)`,
        }} />
        {/* Number */}
        <span style={{
          position: 'absolute', top: 8, left: 10,
          fontFamily: 'monospace', fontSize: '10px',
          color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em',
        }}>
          {String(i + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.85)',
              padding: 14, display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff', marginBottom: 6 }}>
                {project.title}
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
                {project.description?.slice(0, 90)}...
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {project.tech?.slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: '9px', color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '2px 6px', borderRadius: 3, fontFamily: 'monospace',
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: '#fff', color: '#000', fontSize: '11px', fontWeight: 700,
                    padding: '5px 10px', borderRadius: 3, textDecoration: 'none',
                  }}>
                  <FiPlay size={10} /> View
                </a>
                <button style={{
                  width: 28, height: 28, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'transparent', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <FiPlus size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default label */}
      <div style={{
        background: CARD_BG, padding: '10px 12px',
        opacity: hovered ? 0 : 1, transition: 'opacity 0.2s',
      }}>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#fff', marginBottom: 2 }}>
          {project.title}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
          {project.category}
        </div>
      </div>
    </motion.div>
  )
}

// ── Scrollable row ────────────────────────────────────────────────────────────
function ContentRow({ title, badge, children }) {
  const trackRef = useRef()
  const headerRef = useRef()
  const inView = useInView(headerRef, { once: true, margin: '-40px' })

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  return (
    <div style={{ marginBottom: 48 }}>
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ padding: '0 5vw', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e5e5e5', margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        {badge && (
          <span style={{ fontSize: '11px', fontWeight: 700, color: RED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {badge}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={() => scroll(-1)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiChevronRight size={16} />
          </button>
        </div>
      </motion.div>
      <div
        ref={trackRef}
        style={{
          display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 5vw 12px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          cursor: 'grab',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Experience card ───────────────────────────────────────────────────────────
function ExpCard({ exp }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.22 }}
      style={{
        minWidth: 260, width: 260, borderRadius: 6, overflow: 'hidden',
        background: CARD_BG, flexShrink: 0, cursor: 'pointer',
        border: hovered ? `1px solid ${exp.color || RED}` : '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{
        height: 6,
        background: exp.color || RED,
      }} />
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '10px', color: exp.color || RED, fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
          {exp.type} · {exp.period}
        </div>
        <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff', marginBottom: 3 }}>
          {exp.role}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
          {exp.company}
        </div>
        <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          {exp.description?.slice(0, 100)}...
        </p>
      </div>
    </motion.div>
  )
}

// ── Skill pill card ───────────────────────────────────────────────────────────
function SkillRow({ cat }) {
  return (
    <div style={{
      minWidth: 200, width: 200, padding: '16px',
      background: CARD_BG, borderRadius: 6, flexShrink: 0,
    }}>
      <div style={{ fontSize: '18px', marginBottom: 8 }}>{cat.icon}</div>
      <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: 10 }}>{cat.label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {cat.skills.slice(0, 5).map(s => (
          <span key={s.name} style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.07)', borderRadius: 3,
            padding: '2px 7px', fontFamily: 'monospace',
          }}>{s.name}</span>
        ))}
      </div>
    </div>
  )
}

// ── About billboard ───────────────────────────────────────────────────────────
function About() {
  const ref = useRef()
  const inView = useInView(ref, { once: true })

  return (
    <section id="about" ref={ref} style={{ padding: '60px 5vw 80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{
          background: 'linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(229,9,20,0.2)',
          borderRadius: 12, padding: '48px 56px',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: RED, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
            About the creator
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>
            ML Engineer.
            <br />AI Founder.
            <br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>Problem solver.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.8 }}>
            {personal.longBio}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Currently', value: 'ML Engineer @ Accenture', icon: '💼' },
            { label: 'Founded', value: 'MailAir — AI Email tool', icon: '🚀' },
            { label: 'Location', value: 'Hyderabad, India', icon: '📍' },
            { label: 'Focus', value: 'LLMs, RAG, Production ML', icon: '🧠' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.value}</div>
              </div>
            </div>
          ))}
          <a href={`mailto:${personal.email}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: RED, color: '#fff', fontWeight: 700, fontSize: '14px',
            padding: '13px', borderRadius: 6, textDecoration: 'none', marginTop: 6,
          }}>
            <FiPlay size={14} /> Let's Work Together
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 5vw' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: RED, fontWeight: 900, fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>SST</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>GitHub</a>
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>LinkedIn</a>
          <a href={`mailto:${personal.email}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>Email</a>
          <Link to="/blog" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>Blog</Link>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>© 2025 Sai Sridhar Tarra</span>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function NetflixHome() {
  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff', overflowX: 'hidden' }}>
      <NetflixNav />
      <Hero />

      <div id="work" style={{ paddingTop: 40 }}>
        <ContentRow title="Featured Projects" badge="New">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
        </ContentRow>

        <ContentRow title="Experience & Career">
          {experiences.map(exp => <ExpCard key={exp.id} exp={exp} />)}
        </ContentRow>

        <ContentRow title="Skills & Technology">
          {skillCategories.map(cat => <SkillRow key={cat.id} cat={cat} />)}
        </ContentRow>
      </div>

      <About />
      <GitHubStats accentColor="#E50914" dark={true} />
      <Footer />
    </div>
  )
}
