import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowRight } from 'react-icons/fi'
import { reelLinks, getAllTags } from '../data/reelLinks'

export default function ReelLinksPage() {
  const [activeTag, setActiveTag] = useState('All')
  const tags = getAllTags()

  const filtered = useMemo(() => {
    if (activeTag === 'All') return reelLinks
    return reelLinks.filter((r) => r.tag === activeTag)
  }, [activeTag])

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Code Drops & Snippets | Sai Sridhar Tarra</title>
        <meta name="description" content="Direct code snippets, repos, and tools shared across Instagram reels and open source by Sai Sridhar Tarra." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5"
      >
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-semibold">Code Drops</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Code Drops & Snippets
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-normal">
          Quick links, gists, and GitHub repositories for code shared across reels, tutorials, and open source projects.
        </p>
      </motion.div>

      {/* Tag Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex flex-wrap gap-1.5"
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTag === tag
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                to={`/code-drops/${item.slug}`}
                className="group p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-sm flex flex-col justify-between h-full space-y-4 block"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                      {item.tag}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {item.date}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-900 dark:text-white font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {item.cta || 'View Snippet'} <FiArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
