import React from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { personal } from '../../data/personal'
import { SectionTitle, Pill, Reveal } from '../home/ui'

const topics = [
  'The MSc Statistics with Data Science course and modules',
  'Applications, statement of purpose, and LORs',
  'Scholarships, funding, and cost of living',
  'Student visa, accommodation, and moving to Edinburgh',
  'Finding part-time jobs while studying',
  'UK job search, CVs, interviews, and the Graduate Route',
  'Software engineering and ML roles in the UK',
  'Student life in Edinburgh',
]

// The card tilts gently toward the cursor.
function TiltCard({ children, className }) {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 5)
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export default function BookCall() {
  const href = personal.bookingUrl
    || `mailto:${personal.email}?subject=${encodeURIComponent('Call request: Edinburgh / UK jobs')}`

  return (
    <section id="book-a-call" aria-labelledby="call-title" className="scroll-mt-24">
      <Reveal>
      <TiltCard className="rounded-2xl border-2 border-ink bg-zinc-100 p-6 shadow-[6px_6px_0_rgb(var(--c-accent))] sm:p-10 dark:bg-zinc-900">
        <SectionTitle id="call-title" className="mb-4">Studying at Edinburgh or job hunting in the UK?</SectionTitle>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-ink">
          I&apos;m doing my MSc in Statistics with Data Science at Edinburgh. Book a 30-minute call about applying,
          moving here, part-time work, or landing a job in the UK, and I&apos;ll share what I&apos;ve learned firsthand.
        </p>

        <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic} className="flex gap-2 text-base text-ink">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent">
                <path d="M12 1.5c.9 5.4 3.3 8.1 10.5 10.5-7.2 2.4-9.6 5.1-10.5 10.5C11.1 17.1 8.7 14.4 1.5 12 8.7 9.6 11.1 6.9 12 1.5Z" fill="currentColor" />
              </svg>
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Pill href={href}>Book a call ↗</Pill>
          <span className="text-sm text-ink/70">
            My own experience, not official university or immigration advice.
          </span>
        </div>
      </TiltCard>
      </Reveal>
    </section>
  )
}
