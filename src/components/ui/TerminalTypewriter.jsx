import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTerminal } from 'react-icons/fi'

const phrases = [
  'Initializing neural network architectures...',
  'Building LLM & RAG productivity systems...',
  'Optimizing MLOps & demand forecasting models...',
  'Architecting production AI applications...',
  'Translating research into scalable software...',
]

export default function TerminalTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    let timer

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1))
      }, 30)
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1))
      }, 50)
    }

    if (!isDeleting && displayText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, phraseIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm font-mono text-xs sm:text-sm select-none"
    >
      {/* Terminal Window Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900 text-zinc-400 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
          <FiTerminal className="w-3.5 h-3.5" />
          <span>tarra-ai-agent.sh</span>
        </div>
      </div>

      {/* Dynamic Typewriter Text Area */}
      <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 min-h-[2.5rem]">
        <span className="text-zinc-400 font-bold select-none">&gt;</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
          {displayText}
        </span>
        <span className="w-2 h-4 bg-zinc-900 dark:bg-white animate-pulse inline-block ml-0.5" />
      </div>
    </motion.div>
  )
}
