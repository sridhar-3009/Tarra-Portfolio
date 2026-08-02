import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiExternalLink } from 'react-icons/fi'
import { experiences } from '../../data/experience'

export default function Experience() {
  const [expandedId, setExpandedId] = useState(1)

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="experience" className="space-y-6 my-10 sm:my-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Work & Education</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ timeline</span>
        </h2>
      </div>

      <div className="relative border-l border-zinc-300 dark:border-zinc-800 ml-3 sm:ml-4 space-y-6">
        {experiences.map((item) => {
          const isExpanded = expandedId === item.id

          return (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-zinc-900 dark:bg-white border-2 border-white dark:border-black transition-all group-hover:scale-125" />

              <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-sm space-y-3">
                
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {item.type}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        {item.period}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                      {item.role}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      <span>{item.company}</span>
                      {item.companyUrl && (
                        <a
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <span>•</span>
                      <span className="text-zinc-500 font-mono text-[11px]">{item.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle details"
                    className="self-end sm:self-center p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <FiChevronDown
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>

                {/* Highlights List */}
                <AnimatePresence>
                  {isExpanded && item.achievements && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-2 border-t border-zinc-200 dark:border-zinc-900 space-y-2"
                    >
                      <h4 className="font-mono text-xs font-semibold uppercase text-zinc-500 tracking-wider">
                        Key Highlights & Metrics:
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal">
                        {item.achievements.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-zinc-900 dark:text-white font-bold leading-none mt-1.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tech Chips */}
                {item.tech && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
