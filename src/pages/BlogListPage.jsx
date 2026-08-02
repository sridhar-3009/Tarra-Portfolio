import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'
import { blogPosts, getAllCategories } from '../blog'
import { formatDate } from '../utils/blogUtils'

export default function BlogListPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = useMemo(() => Array.from(new Set(['All', ...getAllCategories()])), [])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const q = query.toLowerCase()
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags?.some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesSearch
    })
  }, [query, selectedCategory])

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Articles & Technical Notes | Sai Sridhar Tarra</title>
        <meta name="description" content="Technical articles, research notes, and engineering guides on Machine Learning, LLMs, and Software Systems." />
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
          <span className="text-zinc-900 dark:text-white font-semibold">Articles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Articles & Technical Notes
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-normal">
          Deep dives into Machine Learning research, MLOps architecture, LLMs, and real-world software engineering challenges.
        </p>
      </motion.div>

      {/* Search & Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-3"
      >
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles by title, tag, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts List */}
      <div className="space-y-4 pt-2">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-3 block"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-zinc-400" />
                          {formatDate(post.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3 text-zinc-400" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between font-mono text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="text-zinc-500">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read article <FiArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 font-mono text-xs text-zinc-500">
              No articles found matching &quot;{query}&quot;.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
