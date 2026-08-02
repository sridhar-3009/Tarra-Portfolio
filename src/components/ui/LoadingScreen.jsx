import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const intervals = [
      { delay: 80, value: 30 },
      { delay: 300, value: 65 },
      { delay: 600, value: 90 },
      { delay: 900, value: 100 },
    ]

    const timers = intervals.map(({ delay, value }) =>
      setTimeout(() => setProgress(value), delay)
    )

    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onComplete?.(), 400)
    }, 1200)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="relative z-10 flex flex-col items-center gap-6">
            
            {/* Tanjiro Avatar with Pulsing White Border Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-900 shadow-2xl"
            >
              <img
                src="/profile.jpg"
                alt="Sai Sridhar Tarra"
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 border border-white/20 rounded-2xl animate-pulse" />
            </motion.div>

            {/* Name & Subtitle */}
            <motion.div
              className="text-center space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                Sai Sridhar Tarra
              </h1>
              <p className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
                Machine Learning & AI Engineer
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="w-48 flex flex-col gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 text-right tabular-nums">
                {progress}%
              </span>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
