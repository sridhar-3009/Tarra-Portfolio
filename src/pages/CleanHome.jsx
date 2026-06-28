import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiArrowUpRight, FiGithub, FiLinkedin, FiMail,
  FiTwitter, FiExternalLink, FiDownload, FiCode,
} from 'react-icons/fi'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'
import { skillCategories } from '../data/skills'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  muted: '#6B7280',
  faint: '#9CA3AF',
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  green: '#059669',
  greenLight: '#ECFDF5',
  rose: '#E11D48',
  amber: '#D97706',
}

// ── Fade-in wrapper ───────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(250,250,250,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: C.indigo,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', color: C.text, letterSpacing: '-0.02em' }}>
            Sai Sridhar
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { label: 'About', href: '#about' },
            { label: 'Projects', href: '#projects' },
            { label: 'Experience', href: '#experience' },
            { label: 'Blog', to: '/blog' },
          ].map(({ label, href, to }) =>
            to ? (
              <Link
                key={label}
                to={to}
                style={{
                  color: C.muted,
                  fontSize: '14px',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = C.text }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted }}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                style={{
                  color: C.muted,
                  fontSize: '14px',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = C.text }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted }}
              >
                {label}
              </a>
            )
          )}
          <a
            href={`mailto:${personal.email}`}
            style={{
              marginLeft: 8,
              background: C.indigo,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              padding: '7px 16px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get in touch
          </a>
        </div>
      </div>
    </nav>
  )
}

// ── Pill badge ────────────────────────────────────────────────────────────────
function Pill({ children, color = C.indigo, bg = C.indigoLight }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        background: bg,
        color,
        borderRadius: 100,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </span>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px 100px',
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 60,
        alignItems: 'center',
      }}
    >
      {/* Left */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Pill color={C.green} bg={C.greenLight}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.green,
                display: 'inline-block',
              }}
            />
            {personal.availability}
          </Pill>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            color: C.text,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            margin: '20px 0 16px',
          }}
        >
          Machine Learning
          <br />
          Engineer{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${C.indigo} 0%, #818CF8 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            &
          </span>
          <br />
          AI Builder.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontSize: '1.05rem',
            color: C.muted,
            lineHeight: 1.75,
            maxWidth: 520,
            marginBottom: 32,
          }}
        >
          I'm <strong style={{ color: C.text, fontWeight: 600 }}>Sai Sridhar Tarra</strong> —
          ML Engineer at Accenture and founder of MailAir. I build production ML
          systems, LLM-powered products, and intelligent systems that scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 48 }}
        >
          <a
            href="#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: C.indigo,
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              padding: '11px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
          >
            View Projects <FiArrowUpRight size={15} />
          </a>
          <a
            href={personal.resume}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.text,
              fontWeight: 600,
              fontSize: '14px',
              padding: '11px 22px',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'border-color 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none' }}
          >
            <FiDownload size={14} /> Resume
          </a>
          <div style={{ display: 'flex', gap: 8, marginLeft: 4 }}>
            {[
              { href: personal.github, icon: <FiGithub size={17} /> },
              { href: personal.linkedin, icon: <FiLinkedin size={17} /> },
              { href: personal.twitter, icon: <FiTwitter size={17} /> },
              { href: `mailto:${personal.email}`, icon: <FiMail size={17} /> },
            ].map(({ href, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.muted,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigo; e.currentTarget.style.background = C.indigoLight }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'transparent' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            display: 'flex',
            gap: 32,
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {personal.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontWeight: 800, fontSize: '1.6rem', color: C.text, letterSpacing: '-0.03em' }}>
                {s.value}{s.suffix}
              </div>
              <div style={{ fontSize: '12px', color: C.faint, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Bento cards */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {/* Terminal card */}
        <div
          style={{
            background: '#0F172A',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: 6, fontFamily: 'monospace', fontSize: '11px', color: '#475569' }}>
              train.py
            </span>
          </div>
          <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.7 }}>
            {[
              { t: '$ python train.py --model bert-large', c: '#94A3B8' },
              { t: '', c: '' },
              { t: '✓ Loading dataset... done', c: '#34D399' },
              { t: '  epoch 1/5  loss: 2.341', c: '#60A5FA' },
              { t: '  epoch 3/5  loss: 1.204 ↓', c: '#34D399' },
              { t: '  epoch 5/5  loss: 0.891 ✓', c: '#A78BFA' },
            ].map((line, i) => (
              <div key={i} style={{ color: line.c || 'transparent', minHeight: '1.4em' }}>
                {line.t}
                {i === 5 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ display: 'inline-block', width: 7, height: 13, background: '#A78BFA', marginLeft: 3, verticalAlign: 'text-bottom' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two small cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div
            style={{
              padding: '18px',
              background: C.indigoLight,
              border: `1px solid #C7D2FE`,
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 900, color: C.indigo, letterSpacing: '-0.03em' }}>
              1B+
            </div>
            <div style={{ fontSize: '12px', color: '#6366F1', marginTop: 3, fontWeight: 500 }}>
              Params trained
            </div>
          </div>
          <div
            style={{
              padding: '18px',
              background: C.greenLight,
              border: `1px solid #A7F3D0`,
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 900, color: C.green, letterSpacing: '-0.03em' }}>
              40%
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: 3, fontWeight: 500 }}>
              Less resolve time
            </div>
          </div>
        </div>

        {/* Location card */}
        <div
          style={{
            padding: '16px 18px',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ fontSize: '22px' }}>📍</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: C.text }}>Hyderabad, India</div>
            <div style={{ fontSize: '12px', color: C.faint }}>GMT+5:30 · Open to remote</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ── TECH STACK STRIP ──────────────────────────────────────────────────────────
function TechStrip() {
  const tech = ['Python', 'PyTorch', 'FastAPI', 'React', 'Node.js', 'PostgreSQL', 'LLMs', 'RAG', 'Scikit-learn', 'Pandas', 'SQL', 'Power BI']
  const items = [...tech, ...tech]

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: 'hidden', background: C.surface }}>
      <motion.div
        style={{ display: 'flex', gap: 0, width: 'max-content', padding: '12px 0' }}
        animate={{ x: [0, '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              padding: '4px 20px',
              borderRight: `1px solid ${C.border}`,
              fontFamily: 'monospace',
              fontSize: '12px',
              color: C.muted,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ id, children }) {
  return (
    <section
      id={id}
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px',
      }}
    >
      {children}
    </section>
  )
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <FadeUp style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.indigo }} />
        <span style={{ fontFamily: 'monospace', fontSize: '11px', color: C.indigo, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '1rem', color: C.muted, marginTop: 10, lineHeight: 1.7 }}>{subtitle}</p>
      )}
    </FadeUp>
  )
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <Section id="about">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <SectionHeader label="About me" title={<>Building at the intersection of<br /><span style={{ color: C.indigo }}>AI & Engineering.</span></>} />
            <FadeUp delay={0.1}>
              <p style={{ color: C.muted, fontSize: '1rem', lineHeight: 1.8, marginBottom: 24 }}>
                {personal.longBio}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.indigo, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                >
                  <FiGithub size={14} /> GitHub profile <FiArrowUpRight size={12} />
                </a>
                <span style={{ color: C.border }}>·</span>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.indigo, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                >
                  <FiLinkedin size={14} /> LinkedIn <FiArrowUpRight size={12} />
                </a>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {skillCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  style={{
                    padding: '16px 18px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    background: '#fff',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px', color: C.text, marginBottom: 10 }}>
                    {cat.icon} {cat.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {cat.skills.map((s) => (
                      <span
                        key={s.name}
                        style={{
                          fontSize: '11px',
                          color: C.muted,
                          background: '#F9FAFB',
                          border: `1px solid ${C.border}`,
                          borderRadius: 5,
                          padding: '3px 8px',
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </Section>
    </div>
  )
}

// ── PROJECTS ──────────────────────────────────────────────────────────────────
const PROJECT_ACCENTS = [
  { bg: '#EEF2FF', border: '#C7D2FE', dot: '#4F46E5', text: '#4338CA' },
  { bg: '#ECFDF5', border: '#A7F3D0', dot: '#059669', text: '#047857' },
  { bg: '#FEF3C7', border: '#FDE68A', dot: '#D97706', text: '#B45309' },
  { bg: '#FEE2E2', border: '#FECACA', dot: '#E11D48', text: '#BE123C' },
  { bg: '#F5F3FF', border: '#DDD6FE', dot: '#7C3AED', text: '#6D28D9' },
  { bg: '#E0F2FE', border: '#BAE6FD', dot: '#0284C7', text: '#0369A1' },
]

function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        label="Selected work"
        title="Projects I've built"
        subtitle="Production systems, experiments, and tools — all ML & AI focused."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {projects.map((p, i) => {
          const accent = PROJECT_ACCENTS[i % PROJECT_ACCENTS.length]
          return (
            <FadeUp key={p.id} delay={i * 0.06}>
              <a
                href={p.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <div
                  style={{
                    padding: '24px',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = accent.border }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: accent.text,
                        background: accent.bg,
                        border: `1px solid ${accent.border}`,
                        padding: '3px 10px',
                        borderRadius: 100,
                      }}
                    >
                      {p.category}
                    </span>
                    <FiExternalLink size={14} style={{ color: C.faint }} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: C.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
                    {p.title}
                  </h3>
                  <p style={{ color: C.muted, fontSize: '13px', lineHeight: 1.65, marginBottom: 16 }}>
                    {p.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '11px',
                          color: C.muted,
                          background: '#F9FAFB',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          padding: '2px 7px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </FadeUp>
          )
        })}
      </div>
    </Section>
  )
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
function Experience() {
  return (
    <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <Section id="experience">
        <SectionHeader label="Career & Education" title="My journey" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {experiences.map((exp, i) => (
            <FadeUp key={exp.id} delay={i * 0.08}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: 32,
                  padding: '32px 0',
                  borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                }}
              >
                {/* Left — period */}
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: C.faint, marginBottom: 6 }}>
                    {exp.period}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: exp.color === '#A100FF' ? '#7C3AED' : exp.color === '#10B981' ? '#059669' : exp.color === '#F59E0B' ? '#D97706' : '#DC2626',
                      background: exp.color === '#A100FF' ? '#F5F3FF' : exp.color === '#10B981' ? '#ECFDF5' : exp.color === '#F59E0B' ? '#FEF3C7' : '#FEE2E2',
                      padding: '3px 10px',
                      borderRadius: 100,
                    }}
                  >
                    {exp.type}
                  </span>
                </div>

                {/* Right */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: C.text, letterSpacing: '-0.02em', marginBottom: 3 }}>
                    {exp.role}
                  </div>
                  <div style={{ fontSize: '14px', color: C.muted, marginBottom: 12 }}>{exp.company}</div>
                  <p style={{ color: C.muted, fontSize: '13.5px', lineHeight: 1.7, marginBottom: 14 }}>
                    {exp.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {exp.tech.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '11px',
                          color: C.muted,
                          background: '#F9FAFB',
                          border: `1px solid ${C.border}`,
                          borderRadius: 5,
                          padding: '3px 8px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <Section>
      <div
        style={{
          padding: '56px 64px',
          background: `linear-gradient(135deg, ${C.indigo} 0%, #7C3AED 100%)`,
          borderRadius: 16,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: 32,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* BG decoration */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            right: 60,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <FadeUp>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
            Open to opportunities
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 10px' }}>
            Let's build something
            <br />
            remarkable together.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.65 }}>
            ML engineering roles, research collaborations, or interesting projects — I'm all ears.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
            <a
              href={`mailto:${personal.email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#fff',
                color: C.indigo,
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 22px',
                borderRadius: 8,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <FiMail size={15} /> Send an email
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
                padding: '12px 22px',
                borderRadius: 8,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
            >
              <FiLinkedin size={15} /> Connect on LinkedIn
            </a>
          </div>
        </FadeUp>
      </div>
    </Section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      <span style={{ fontSize: '13px', color: C.faint }}>© 2025 Sai Sridhar Tarra</span>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link to="/blog" style={{ fontSize: '13px', color: C.muted, textDecoration: 'none' }}>Blog</Link>
        <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: C.muted, textDecoration: 'none' }}>GitHub</a>
        <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: C.muted, textDecoration: 'none' }}>LinkedIn</a>
      </div>
    </footer>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function CleanHome() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: C.text }}>
      <Nav />
      <Hero />
      <TechStrip />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  )
}
