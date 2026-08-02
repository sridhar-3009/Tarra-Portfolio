import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiGithub, 
  FiLinkedin, 
  FiTwitter, 
  FiMail, 
  FiFileText,
  FiMapPin
} from 'react-icons/fi'
import { personal } from '../../data/personal'

function AnimatedCounter({ from = 0, to, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let start = 0
    const end = parseInt(to)
    if (start === end) return

    let totalMiliseconds = duration * 1000
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20)
    let timer = setInterval(() => {
      start += Math.ceil(end / 30)
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [to, duration])

  return <span>{count}{suffix}</span>
}

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 space-y-6 shadow-sm"
      >
        
        {/* Profile Avatar with Spring Hover Animation */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            whileHover={{ scale: 1.03, rotate: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-black shadow-md relative group cursor-pointer"
          >
            <img
              src="/tanjiro.jpg?v=2"
              alt={personal.name}
              className="w-full h-full object-cover object-center filter grayscale hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
              <span className="font-mono text-[10px] text-white tracking-widest uppercase font-semibold">Demon Slayer Vibe</span>
            </div>
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {personal.name}
            </h1>
            <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 font-medium">
              {personal.title}
            </p>
          </div>

          {/* Availability Pill with Pulsing Animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white animate-ping" />
            <span>Available for ML & AI Roles</span>
          </motion.div>
        </div>

        {/* Short Bio */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-center sm:text-left border-t border-b border-zinc-200 dark:border-zinc-800 py-4 font-normal">
          {personal.bio}
        </p>

        {/* Key Stats with Animated Counter */}
        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black transition-colors"
          >
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              <AnimatedCounter to={3} suffix="+" />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase">Years Exp</div>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black transition-colors"
          >
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              <AnimatedCounter to={1000} suffix="+" />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase">DSA Solved</div>
          </motion.div>
        </div>

        {/* Social & Resume Actions */}
        <div className="space-y-3 pt-1">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-mono text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            <FiFileText className="w-4 h-4" />
            <span>Download Resume</span>
          </motion.a>

          <div className="flex items-center justify-center gap-2 pt-1 text-zinc-600 dark:text-zinc-400">
            {[
              { icon: FiGithub, href: personal.github, label: 'GitHub' },
              { icon: FiLinkedin, href: personal.linkedin, label: 'LinkedIn' },
              { icon: FiTwitter, href: personal.twitter, label: 'Twitter' },
              { icon: FiMail, href: `mailto:${personal.email}`, label: 'Email' },
            ].map((soc, idx) => {
              const Icon = soc.icon
              return (
                <motion.a
                  key={idx}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Location Footer */}
        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <FiMapPin className="w-3 h-3 text-zinc-500" />
          <span>{personal.location}</span>
        </div>
      </motion.div>
    </aside>
  )
}
