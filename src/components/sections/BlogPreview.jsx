import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { reelLinks } from '../../data/reelLinks'

export default function BlogPreview() {
  const recentDrops = reelLinks.slice(0, 3)

  return (
    <section className="space-y-6 my-10 sm:my-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Writing & Code Drops</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ articles & snippets</span>
        </h2>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            to="/blog"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>Articles</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <Link
            to="/code-drops"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>Code Drops</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Code Drops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {recentDrops.map((drop) => (
          <Link
            key={drop.id}
            to={`/code-drops/${drop.slug}`}
            className="group p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-3 block"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                  {drop.tag}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  {drop.date}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors line-clamp-1">
                {drop.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                {drop.description}
              </p>
            </div>

            <div className="pt-2 flex items-center text-xs font-mono font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Explore snippet</span>
              <FiArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
