import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiGithub, FiLinkedin, FiTwitter, FiMail, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { personal } from '../../data/personal'
import { projects } from '../../data/projects'
import { experiences } from '../../data/experience'
import { skillCategories } from '../../data/skills'

const ZONE_COLORS = {
  home: '#00E5A0',
  about: '#00C8FF',
  projects: '#8B5CF6',
  experience: '#F59E0B',
  contact: '#FF6B8A',
}

// ── Shared micro-styles ───────────────────────────────────────────────────────
const s = {
  label: (color) => ({
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color,
    display: 'block',
    marginBottom: '14px',
  }),
  h1: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 800,
    fontSize: '2rem',
    color: '#F8F8F8',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  h2: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '1rem',
    color: '#F8F8F8',
    margin: '0 0 10px 0',
  },
  body: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.84rem',
    lineHeight: 1.72,
    margin: 0,
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.06)',
    margin: '22px 0',
  },
  tag: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 3,
    padding: '3px 8px',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: '14px 16px',
    transition: 'border-color 0.2s',
  },
}

// ── Home section ──────────────────────────────────────────────────────────────
function HomePanel({ color }) {
  return (
    <div>
      <span style={s.label(color)}>01 / Home</span>
      <h1 style={s.h1}>
        Sai Sridhar
        <br />
        <span style={{ color }}>Tarra</span>
      </h1>
      <p style={{ ...s.body, marginTop: 12, fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)' }}>
        {personal.title}
      </p>
      <p style={{ ...s.body, marginTop: 10 }}>{personal.bio}</p>

      <div style={s.divider} />

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {personal.stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: '12px 14px',
            }}
          >
            <div style={{ color, fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '11px', marginTop: 3 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={s.divider} />

      {/* Social links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { href: personal.github, icon: <FiGithub size={14} />, label: 'GitHub' },
          { href: personal.linkedin, icon: <FiLinkedin size={14} />, label: 'LinkedIn' },
          { href: personal.twitter, icon: <FiTwitter size={14} />, label: 'Twitter' },
          { href: `mailto:${personal.email}`, icon: <FiMail size={14} />, label: 'Email' },
        ].map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '7px 11px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            {icon} {label}
          </a>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href={personal.resume}
          style={{
            display: 'inline-block',
            background: color,
            color: '#020810',
            fontWeight: 700,
            fontSize: '12px',
            padding: '10px 20px',
            borderRadius: 6,
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          Download Resume
        </a>
        <Link
          to="/blog"
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '12px',
            padding: '10px 20px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Read Blog →
        </Link>
      </div>
    </div>
  )
}

// ── About section ─────────────────────────────────────────────────────────────
function AboutPanel({ color }) {
  return (
    <div>
      <span style={s.label(color)}>02 / About</span>
      <h1 style={{ ...s.h1, fontSize: '1.7rem' }}>Who I am</h1>
      <p style={{ ...s.body, marginTop: 14 }}>{personal.longBio}</p>

      <div style={s.divider} />

      <h2 style={s.h2}>Tech Stack</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {skillCategories.slice(0, 4).map((cat) => (
          <div key={cat.id}>
            <div
              style={{
                fontSize: '10px',
                color,
                fontFamily: 'monospace',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              {cat.icon} {cat.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {cat.skills.map((skill) => (
                <span key={skill.name} style={s.tag}>{skill.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={s.divider} />

      <div
        style={{
          padding: '14px 16px',
          background: `${color}0D`,
          border: `1px solid ${color}30`,
          borderRadius: 8,
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
        }}
      >
        📍 {personal.location} &nbsp;·&nbsp; {personal.availability}
      </div>
    </div>
  )
}

// ── Projects section ──────────────────────────────────────────────────────────
function ProjectsPanel({ color }) {
  return (
    <div>
      <span style={s.label(color)}>03 / Projects</span>
      <h1 style={{ ...s.h1, fontSize: '1.7rem' }}>What I've built</h1>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={s.card}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}55`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '9px',
                    color,
                    fontFamily: 'monospace',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    marginBottom: 3,
                  }}
                >
                  {project.category} · {project.status}
                </div>
                <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: '0.9rem' }}>
                  {project.title}
                </div>
              </div>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.28)', flexShrink: 0, transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
              >
                <FiExternalLink size={13} />
              </a>
            </div>
            <p style={{ ...s.body, marginTop: 6, fontSize: '11.5px' }}>{project.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {project.tech.slice(0, 4).map((t) => (
                <span key={t} style={s.tag}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Experience section ────────────────────────────────────────────────────────
function ExperiencePanel({ color }) {
  return (
    <div>
      <span style={s.label(color)}>04 / Experience</span>
      <h1 style={{ ...s.h1, fontSize: '1.7rem' }}>My journey</h1>
      <div style={{ marginTop: 22, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ paddingLeft: 40, position: 'relative' }}>
              {/* Timeline dot */}
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 4,
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: exp.color || color,
                  boxShadow: `0 0 8px ${exp.color || color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#020810' }} />
              </div>

              <div
                style={{
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  color: exp.color || color,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}
              >
                {exp.type} · {exp.period}
              </div>
              <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: '0.9rem' }}>{exp.role}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: 2 }}>
                {exp.company}
              </div>
              <p style={{ ...s.body, marginTop: 7, fontSize: '11.5px' }}>{exp.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {exp.tech.slice(0, 5).map((t) => (
                  <span key={t} style={s.tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Contact section ───────────────────────────────────────────────────────────
function ContactPanel({ color }) {
  const links = [
    { icon: <FiMail size={18} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}` },
    { icon: <FiGithub size={18} />, label: 'GitHub', value: '@sridhar-3009', href: personal.github },
    { icon: <FiLinkedin size={18} />, label: 'LinkedIn', value: 'sai-sridhar-tarra', href: personal.linkedin },
    { icon: <FiTwitter size={18} />, label: 'Twitter / X', value: '@sridhar_3009', href: personal.twitter },
  ]

  return (
    <div>
      <span style={s.label(color)}>05 / Contact</span>
      <h1 style={{ ...s.h1, fontSize: '1.7rem' }}>Get in touch</h1>
      <p style={{ ...s.body, marginTop: 12 }}>
        I'm always open to ML engineering roles, research collaborations, and interesting projects.
        Drop me a message.
      </p>

      <div style={s.divider} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(({ icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'all 0.2s',
              color: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${color}55`
              e.currentTarget.style.background = `${color}08`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
          >
            <span style={{ color }}>{icon}</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ color: '#F0F0F0', fontSize: '13px', fontWeight: 500 }}>{value}</div>
            </div>
            <FiExternalLink
              size={12}
              style={{ color: 'rgba(255,255,255,0.18)', marginLeft: 'auto' }}
            />
          </a>
        ))}
      </div>

      <div style={s.divider} />

      <div
        style={{
          padding: '18px',
          background: `${color}0D`,
          border: `1px solid ${color}30`,
          borderRadius: 8,
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
        <div style={{ color, fontWeight: 700, fontSize: '0.9rem' }}>Open to Opportunities</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: 4 }}>
          {personal.availability}
        </div>
      </div>
    </div>
  )
}

// ── Panel content router ──────────────────────────────────────────────────────
function PanelContent({ activeZone, color }) {
  switch (activeZone) {
    case 'home': return <HomePanel color={color} />
    case 'about': return <AboutPanel color={color} />
    case 'projects': return <ProjectsPanel color={color} />
    case 'experience': return <ExperiencePanel color={color} />
    case 'contact': return <ContactPanel color={color} />
    default: return null
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function WorldPanel({ activeZone, isOpen, onClose }) {
  const color = ZONE_COLORS[activeZone] || '#00E5A0'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Tinted backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2,8,16,0.45)',
              backdropFilter: 'blur(3px)',
              zIndex: 20,
            }}
          />

          {/* Slide-in panel */}
          <motion.div
            key={`panel-${activeZone}`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '44%',
              minWidth: 380,
              maxWidth: 560,
              background: 'rgba(2, 8, 16, 0.97)',
              borderLeft: `1px solid ${color}28`,
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                height: 2,
                background: `linear-gradient(90deg, ${color}, ${color}00)`,
                flexShrink: 0,
              }}
            />

            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 26px 0',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color,
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                }}
              >
                ▸ {activeZone}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 6,
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                }}
              >
                <FiX size={13} />
              </button>
            </div>

            {/* Scrollable content */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '22px 26px 52px',
                scrollbarWidth: 'thin',
                scrollbarColor: `${color}30 transparent`,
              }}
            >
              <PanelContent activeZone={activeZone} color={color} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
