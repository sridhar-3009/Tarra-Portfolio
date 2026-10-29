import React from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiCheck } from 'react-icons/fi'
import { personal } from '../../data/personal'

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
  const external = Boolean(personal.bookingUrl)

  return (
    <section id="book-a-call" className="space-y-6 my-10 sm:my-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Book a Call</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ edinburgh &amp; uk jobs</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 space-y-5 shadow-sm"
      >
        <div className="space-y-1">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Studying at Edinburgh or job hunting in the UK?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            I&apos;m currently doing my MSc in Statistics with Data Science at Edinburgh. Book a 1:1 call about applying, moving here, part-time work, or landing a job in the UK, and I&apos;ll share what I&apos;ve learned firsthand.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {topics.map((topic) => (
            <li key={topic} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <FiCheck className="w-4 h-4 mt-0.5 shrink-0 text-zinc-900 dark:text-white" />
              <span>{topic}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-900">
          <span className="font-mono text-[11px] text-zinc-500">
            Sharing my own experience, not official university or immigration advice.
          </span>
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shrink-0 shadow-sm"
          >
            <FiCalendar className="w-3.5 h-3.5" />
            <span>Book a Call</span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}
