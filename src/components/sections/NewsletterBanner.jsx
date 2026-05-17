import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiMail } from 'react-icons/fi'

export default function NewsletterBanner() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, #06B6D4 100%)' }}
        />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass gradient-border rounded-2xl px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center gap-10 md:gap-16"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <FiMail size={28} style={{ color: '#A78BFA' }} />
          </motion.div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3"
            >
              Weekly AI Newsletter
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-2xl md:text-3xl font-black font-display tracking-tight text-white mb-3"
            >
              Stay Sharp on AI & ML
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-zinc-400 text-base leading-relaxed max-w-lg"
            >
              Papers, breakthroughs, and practical insights — curated weekly. No hype, no fluff. Just the stuff worth knowing.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex-shrink-0"
          >
            <a
              href="https://ai-newsletter-bml1.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:-translate-y-1 group"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                boxShadow: '0 0 24px rgba(139,92,246,0.35)',
              }}
            >
              Subscribe Free
              <FiArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
