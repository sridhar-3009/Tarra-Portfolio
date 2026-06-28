import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiExternalLink, FiTwitter } from 'react-icons/fi'
import { personal } from '../../data/personal'
import { projects } from '../../data/projects'
import { experiences } from '../../data/experience'
import { skillCategories } from '../../data/skills'

// ── Shared tokens ─────────────────────────────────────────────────────────────
const COLORS = {
  home: '#00E5A0',
  about: '#00C8FF',
  projects: '#8B5CF6',
  experience: '#F59E0B',
  contact: '#FF6B8A',
}

const sectionBase = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'all',
}

function FadeIn({ children, delay = 0, y = 30, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function Label({ text, color }) {
  return (
    <div
      style={{
        fontFamily: 'monospace',
        fontSize: '11px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color,
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ display: 'inline-block', width: 24, height: 1, background: color }} />
      {text}
    </div>
  )
}

const tag = (color) => ({
  fontSize: '11px',
  color: 'rgba(255,255,255,0.45)',
  background: `${color}12`,
  border: `1px solid ${color}35`,
  borderRadius: 4,
  padding: '3px 10px',
  display: 'inline-block',
})

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const color = COLORS.home

  return (
    <section
      style={{
        ...sectionBase,
        padding: '0 10vw',
      }}
    >
      <div style={{ maxWidth: 700 }}>
        <FadeIn delay={0.1}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: `${color}15`,
              border: `1px solid ${color}40`,
              borderRadius: 100,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 6px ${color}`,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                color,
                fontSize: '11px',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
              }}
            >
              {personal.availability}
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1
            style={{
              fontSize: 'clamp(3.2rem, 8vw, 7rem)',
              fontWeight: 900,
              color: '#F8F8F8',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              margin: '0 0 12px 0',
            }}
          >
            Machine
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${color} 0%, #0EA5E9 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Learning
            </span>
            <br />
            Engineer.
          </h1>
        </FadeIn>

        <FadeIn delay={0.35}>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            I'm <strong style={{ color: '#F8F8F8' }}>Sai Sridhar Tarra</strong> — ML Engineer
            at Accenture and founder of MailAir. I build production ML systems, LLM-powered
            products, and intelligent systems at scale.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={personal.resume}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: color,
                color: '#010812',
                fontWeight: 700,
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
            >
              Download Resume
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#F8F8F8',
                fontWeight: 600,
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              <FiGithub size={15} /> GitHub
            </a>
            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 500,
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Blog →
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.65}>
          <div
            style={{
              marginTop: 52,
              display: 'flex',
              gap: 36,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {personal.stats.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: '1.8rem',
                    color,
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {s.value}{s.suffix}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const color = COLORS.about

  return (
    <section style={{ ...sectionBase, padding: '0 10vw', justifyContent: 'flex-end' }}>
      <FadeIn style={{ maxWidth: 560 }}>
        <Label text="02 · About" color={color} />
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            color: '#F8F8F8',
            letterSpacing: '-0.03em',
            margin: '0 0 20px 0',
            lineHeight: 1.1,
          }}
        >
          Who I am
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            marginBottom: 30,
          }}
        >
          {personal.longBio}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {skillCategories.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color,
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {cat.icon} {cat.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {cat.skills.slice(0, 3).map((s) => (
                  <span key={s.name} style={tag(color)}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────
function Projects() {
  const color = COLORS.projects

  return (
    <section style={{ ...sectionBase, padding: '0 8vw', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <FadeIn>
          <Label text="03 · Projects" color={color} />
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#F8F8F8',
              letterSpacing: '-0.03em',
              margin: '0 0 36px 0',
              lineHeight: 1.1,
            }}
          >
            What I've built
          </h2>
        </FadeIn>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {projects.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.07}>
              <div
                style={{
                  padding: '20px 22px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  height: '100%',
                  transition: 'border-color 0.25s, background 0.25s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}55`
                  e.currentTarget.style.background = `${color}06`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: '9px',
                      color,
                      fontFamily: 'monospace',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.category}
                  </span>
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.25)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                  >
                    <FiExternalLink size={13} />
                  </a>
                </div>
                <div
                  style={{
                    color: '#F0F0F0',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '12px',
                    lineHeight: 1.65,
                    marginBottom: 12,
                  }}
                >
                  {p.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} style={tag(color)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
function Experience() {
  const color = COLORS.experience

  return (
    <section style={{ ...sectionBase, padding: '0 10vw' }}>
      <div style={{ width: '100%', maxWidth: 700 }}>
        <FadeIn>
          <Label text="04 · Experience" color={color} />
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#F8F8F8',
              letterSpacing: '-0.03em',
              margin: '0 0 40px 0',
              lineHeight: 1.1,
            }}
          >
            My journey
          </h2>
        </FadeIn>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(255,255,255,0.06)',
            }}
          />

          {experiences.map((exp, i) => (
            <FadeIn key={exp.id} delay={i * 0.1}>
              <div style={{ paddingLeft: 48, position: 'relative', marginBottom: 36 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 6,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: exp.color || color,
                    boxShadow: `0 0 10px ${exp.color || color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: '#010812',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: exp.color || color,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  {exp.type} · {exp.period}
                </div>
                <div
                  style={{
                    color: '#F0F0F0',
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginBottom: 2,
                  }}
                >
                  {exp.role}
                </div>
                <div
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: 8 }}
                >
                  {exp.company}
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {exp.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {exp.tech.slice(0, 5).map((t) => (
                    <span key={t} style={tag(exp.color || color)}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const color = COLORS.contact

  const links = [
    { icon: <FiMail size={17} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: <FiGithub size={17} />, label: 'GitHub', value: '@sridhar-3009', href: personal.github },
    { icon: <FiLinkedin size={17} />, label: 'LinkedIn', value: 'sai-sridhar-tarra', href: personal.linkedin },
    { icon: <FiTwitter size={17} />, label: 'Twitter', value: '@sridhar_3009', href: personal.twitter },
  ]

  return (
    <section style={{ ...sectionBase, padding: '0 10vw', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: 520 }}>
        <FadeIn delay={0.1}>
          <Label text="05 · Contact" color={color} />
          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#F8F8F8',
              letterSpacing: '-0.03em',
              margin: '0 0 14px 0',
              lineHeight: 1.1,
            }}
          >
            Let's talk
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.95rem',
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            Open to ML engineering roles, research collaborations, and interesting
            projects. Drop me a message.
          </p>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {links.map(({ icon, label, value, href }, i) => (
            <FadeIn key={label} delay={0.15 + i * 0.08}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'all 0.22s',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}50`
                  e.currentTarget.style.background = `${color}09`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <span style={{ color }}>{icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.35)',
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ color: '#F0F0F0', fontSize: '13.5px', fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
                <FiExternalLink
                  size={12}
                  style={{ color: 'rgba(255,255,255,0.18)', marginLeft: 'auto' }}
                />
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div
            style={{
              marginTop: 28,
              padding: '18px 20px',
              background: `${color}0D`,
              border: `1px solid ${color}35`,
              borderRadius: 10,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}`,
                marginBottom: 10,
              }}
            />
            <div style={{ color, fontWeight: 700, fontSize: '0.9rem' }}>
              Open to Opportunities
            </div>
            <div
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: 5 }}
            >
              {personal.availability}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ── Floating top nav ──────────────────────────────────────────────────────────
function TopNav() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 10vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(1,8,18,0.9) 0%, transparent 100%)',
        pointerEvents: 'all',
      }}
    >
      <span
        style={{
          color: '#00E5A0',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}
      >
        {personal.name}
      </span>
      <div style={{ display: 'flex', gap: '20px' }}>
        {[
          { label: 'Blog', to: '/blog', isLink: true },
          { label: 'GitHub ↗', href: personal.github },
        ].map(({ label, to, href }) =>
          to ? (
            <Link
              key={label}
              to={to}
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '11px',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
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
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '11px',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}
            >
              {label}
            </a>
          )
        )}
      </div>
    </div>
  )
}

// ── Scroll hint ───────────────────────────────────────────────────────────────
function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5 }}
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}
      >
        scroll
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 1,
          height: 30,
          background: 'linear-gradient(to bottom, rgba(0,229,160,0.5), transparent)',
        }}
      />
    </motion.div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function HtmlSections() {
  return (
    <>
      <TopNav />
      <ScrollHint />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </>
  )
}
