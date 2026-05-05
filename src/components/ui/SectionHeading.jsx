import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

function scrambleText(el, finalText, duration = 0.9) {
  if (!el) return
  const total = Math.round(duration * 60)
  let frame = 0

  const tick = () => {
    frame++
    const progress = frame / total
    const revealed = Math.floor(progress * finalText.length)
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (i < revealed) return char
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join('')
    if (frame < total) requestAnimationFrame(tick)
    else el.textContent = finalText
  }

  requestAnimationFrame(tick)
}

export default function SectionHeading({ label, title, subtitle, centered = false, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const titleRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (inView && !hasAnimated.current && titleRef.current) {
      hasAnimated.current = true
      setTimeout(() => scrambleText(titleRef.current, title, 0.8), 100)
    }
  }, [inView, title])

  const containerClass = centered ? 'flex flex-col items-center text-center' : 'flex flex-col'

  return (
    <div ref={ref} className={`${containerClass} ${className}`}>
      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <motion.span
            style={{ display: 'block', height: 1, backgroundColor: '#8B5CF6', transformOrigin: 'left', width: 24 }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5 }}
          />
          <span className="text-purple-400 text-xs font-semibold tracking-widest uppercase">{label}</span>
          <motion.span
            style={{ display: 'block', height: 1, backgroundColor: '#8B5CF6', transformOrigin: 'right', width: 24 }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        </motion.div>
      )}

      {/* Title — scramble reveal */}
      <div className="overflow-hidden mb-4">
        <motion.h2
          initial={{ y: '100%', opacity: 0 }}
          animate={inView ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight gradient-text"
        >
          <span ref={titleRef}>{title}</span>
        </motion.h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className={`text-zinc-400 text-base md:text-lg leading-relaxed ${centered ? 'max-w-2xl' : 'max-w-xl'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
