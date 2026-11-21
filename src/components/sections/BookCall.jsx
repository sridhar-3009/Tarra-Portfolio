import React from 'react'
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

export default function BookCall() {
  const href = personal.bookingUrl
    || `mailto:${personal.email}?subject=${encodeURIComponent('Call request: Edinburgh / UK jobs')}`

  return (
    <section id="book-a-call" aria-labelledby="call-title" className="scroll-mt-24">
      <Reveal className="rounded-2xl border-2 border-ink bg-zinc-100 p-6 shadow-[6px_6px_0_rgb(var(--c-accent))] sm:p-10 dark:bg-zinc-900">
        <SectionTitle id="call-title" className="mb-4">Studying at Edinburgh or job hunting in the UK?</SectionTitle>
        <p className="mb-6 max-w-2xl text-lg leading-relaxed text-ink">
          I&apos;m doing my MSc in Statistics with Data Science at Edinburgh. Book a 30-minute call about applying,
          moving here, part-time work, or landing a job in the UK, and I&apos;ll share what I&apos;ve learned firsthand.
        </p>

        <ul className="mb-8 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {topics.map((topic) => (
            <li key={topic} className="flex gap-2 text-base text-ink">
              <span aria-hidden="true" className="text-accent">✦</span>
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
      </Reveal>
    </section>
  )
}
