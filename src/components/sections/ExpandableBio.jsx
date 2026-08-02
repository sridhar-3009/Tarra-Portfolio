import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function ExpandableBio() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="about" className="space-y-4 pt-2">
      <div className="relative">
        <motion.div
          animate={{ maxHeight: expanded ? '1000px' : '11rem' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        >
          <div className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed space-y-4 font-normal">
            <p>
              I&apos;m a software engineer specializing in{' '}
              <span className="text-zinc-900 dark:text-white font-bold underline decoration-zinc-400 dark:decoration-zinc-600 decoration-2 underline-offset-4">
                Machine Learning & AI systems
              </span>
              , building production ML pipelines, LLM-powered applications, and scalable data infrastructure. Formerly ML Engineer at Accenture.
            </p>
            <p>
              Founder of{' '}
              <span className="text-zinc-900 dark:text-white font-bold underline decoration-zinc-400 dark:decoration-zinc-600 decoration-2 underline-offset-4">
                MailAir
              </span>
              , an AI email assistant utilizing LLMs and Retrieval-Augmented Generation (RAG) to auto-draft responses, summarize thread histories, and categorize high-priority messages.
            </p>
            <p>
              Deeply interested in large language models, MLOps, NLP workflows, and high-performance algorithms. Solved over 1000+ competitive programming problems and built end-to-end forecasting engines handling 50K+ products.
            </p>
          </div>
        </motion.div>

        {/* Gradient Mask Overlay when Collapsed */}
        {!expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-start pt-1">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5 focus:outline-none"
        >
          <span>{expanded ? 'show less ←' : 'show more →'}</span>
        </button>
      </div>
    </section>
  )
}
