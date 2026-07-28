import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const USERNAME = 'sridhar-3009'

const STATS_URL = `https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true&hide_border=true&bg_color=1a1b27&title_color=70a5fd&icon_color=bf91f3&text_color=38bdae`

const LANGS_URL = `https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&langs_count=8&theme=tokyonight&hide_border=true&bg_color=1a1b27&title_color=70a5fd&text_color=38bdae&hide=html,css,scss`

const STREAK_URL = `https://streak-stats.demolab.com?user=${USERNAME}&theme=tokyonight&hide_border=true&background=1A1B27&stroke=70a5fd&ring=bf91f3&fire=FF6B00&currStreakNum=38bdae&sideNums=38bdae&currStreakLabel=70a5fd&sideLabels=888888&dates=555555`

const TROPHY_URL = `https://github-profile-trophy.vercel.app/?username=${USERNAME}&theme=tokyonight&no-frame=true&no-bg=true&margin-w=8&column=6`

const GRAPH_URL = `https://github-readme-activity-graph.vercel.app/graph?username=${USERNAME}&theme=tokyo-night&hide_border=true&area=true`

export default function GitHubStats({ accentColor = '#00FF88', dark = true }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const bg = dark ? '#0d1117' : '#f6f8fa'
  const border = dark ? '1px solid #21262d' : '1px solid #d0d7de'
  const text = dark ? 'rgba(255,255,255,0.5)' : '#57606a'
  const heading = dark ? '#ffffff' : '#24292f'

  return (
    <section ref={ref} style={{ padding: '80px 5vw', background: dark ? '#060606' : '#f6f8fa' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: accentColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              GitHub Activity
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: heading, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1 }}>
            Code in the open.
          </h2>
          <p style={{ color: text, fontSize: '14px', marginTop: 8, lineHeight: 1.7 }}>
            Stats, streaks, and contributions — all public on{' '}
            <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer"
              style={{ color: accentColor, textDecoration: 'none', fontWeight: 600 }}>
              github.com/{USERNAME}
            </a>
          </p>
        </motion.div>

        {/* Row 1 — Stats + Languages */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <img src={STATS_URL} alt="GitHub Stats" loading="lazy"
            style={{ width: '100%', borderRadius: 10, border, display: 'block' }} />
          <img src={LANGS_URL} alt="Top Languages" loading="lazy"
            style={{ width: '100%', borderRadius: 10, border, display: 'block' }} />
        </motion.div>

        {/* Row 2 — Streak (centered) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginBottom: 16 }}>
          <img src={STREAK_URL} alt="GitHub Streak" loading="lazy"
            style={{ width: '100%', borderRadius: 10, border, display: 'block' }} />
        </motion.div>

        {/* Row 3 — Trophies */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginBottom: 16, background: bg, borderRadius: 10, border, padding: '16px', overflow: 'hidden' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: text, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
            Trophies
          </div>
          <img src={TROPHY_URL} alt="GitHub Trophies" loading="lazy"
            style={{ width: '100%', display: 'block' }} />
        </motion.div>

        {/* Row 4 — Activity graph */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ background: bg, borderRadius: 10, border, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 0', fontFamily: 'monospace', fontSize: '10px', color: text, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Contribution Graph
          </div>
          <img src={GRAPH_URL} alt="Contribution Graph" loading="lazy"
            style={{ width: '100%', display: 'block' }} />
        </motion.div>

      </div>
    </section>
  )
}
