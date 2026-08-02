import React from 'react'
import { motion } from 'framer-motion'
import { skillCategories } from '../../data/skills'

export default function Skills() {
  return (
    <section id="skills" className="space-y-6 my-10 sm:my-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Technical Stack</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ skills & tools</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skillCategories.map((cat, catIdx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: catIdx * 0.1 }}
            className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 space-y-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {cat.label}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, skillIdx) => (
                <motion.span
                  key={skill.name}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 3 + (skillIdx % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: skillIdx * 0.15,
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
