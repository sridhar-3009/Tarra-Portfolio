import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const THEME_ORDER = ['neural', 'space', 'matrix', 'ocean']

export default function ThemeToggle() {
  const { theme, setTheme, THEME_META } = useTheme()
  const [open, setOpen] = useState(false)

  const current = THEME_META[theme]

  return (
    <div style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 9990 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '110%',
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              alignItems: 'flex-end',
            }}
          >
            {THEME_ORDER.filter(t => t !== theme).map(t => {
              const m = THEME_META[t]
              return (
                <motion.button
                  key={t}
                  onClick={() => { setTheme(t); setOpen(false) }}
                  whileHover={{ scale: 1.06, x: -4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(16px)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${m.accent1}, ${m.accent2})`,
                    display: 'inline-block', flexShrink: 0,
                  }} />
                  {m.label}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main pill */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 18px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(20px)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'none',
          boxShadow: `0 0 18px ${current.accent1}33`,
        }}
      >
        <span style={{
          width: 12, height: 12, borderRadius: '50%',
          background: `linear-gradient(135deg, ${current.accent1}, ${current.accent2})`,
          display: 'inline-block',
          boxShadow: `0 0 8px ${current.accent1}88`,
        }} />
        <span>{current.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-block', opacity: 0.6, fontSize: 10 }}
        >
          ▲
        </motion.span>
      </motion.button>
    </div>
  )
}
