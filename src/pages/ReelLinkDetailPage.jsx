import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiExternalLink, FiArrowLeft } from 'react-icons/fi'
import { getBySlug } from '../data/reelLinks'

export default function ReelLinkDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const item = getBySlug(slug)

  useEffect(() => {
    if (!item) navigate('/code-drops', { replace: true })
  }, [item, navigate])

  if (!item) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <Helmet>
        <title>{item.title} | Code Drops — Sai Sridhar Tarra</title>
        <meta name="description" content={item.description} />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 font-mono text-xs">
        <Link
          to="/code-drops"
          className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>All Code Drops</span>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
          {item.tag}
        </span>
      </div>

      {/* Content Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 space-y-6 shadow-sm">
        <div className="space-y-2">
          <span className="font-mono text-xs text-zinc-500">Published {item.date}</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {item.title}
          </h1>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          {item.description}
        </p>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-between font-mono text-xs">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            <span>{item.cta || 'View Source Code'}</span>
            <FiExternalLink className="w-4 h-4" />
          </a>

          <Link
            to="/code-drops"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Back to list
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
