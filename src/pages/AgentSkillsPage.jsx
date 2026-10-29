import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { agentSkills } from '../data/agentSkills'

export default function AgentSkillsPage() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Agent Skills | Sai Sridhar Tarra</title>
        <meta name="description" content="Skills for AI coding agents like Claude Code and Cursor, built by Sai Sridhar Tarra." />
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
          <span className="text-zinc-900 dark:text-white font-semibold">Agent Skills</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Agent Skills
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed font-normal">
          Skills I&apos;ve built for AI coding agents. They work with Claude Code, Cursor, and other agents that support the SKILL.md format.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4">
        {agentSkills.map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-zinc-500">{skill.date}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                {skill.title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                {skill.description}
              </p>

              <p className="font-mono text-[11px] text-zinc-500">
                Works with: {skill.agents.join(' · ')}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-900 flex flex-wrap items-center gap-2 font-mono text-xs">
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Get it on {skill.marketplace} <FiArrowUpRight className="w-3.5 h-3.5" />
              </a>
              {skill.sourceUrl && (
                <a
                  href={skill.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <FiGithub className="w-3.5 h-3.5" /> Source
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
