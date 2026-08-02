import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiActivity } from 'react-icons/fi'
import { projects, categories } from '../../data/projects'

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="space-y-6 my-10 sm:my-12">
      {/* Header & Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Featured Projects</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ portfolio</span>
        </h2>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between space-y-4"
            >
              {/* Header: Category & Action Links */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                    {project.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {project.status && (
                      <span className="font-mono text-[11px] text-zinc-500">
                        {project.status}
                      </span>
                    )}
                    {project.githubUrl && (
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <FiGithub className="w-4 h-4" />
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live Demo"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">
                    {project.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {project.description}
                </p>

                {/* Key Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        <FiActivity className="w-3 h-3 text-zinc-500" />
                        <span>{m.label}:</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-200 dark:border-zinc-900">
                {project.tech.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
