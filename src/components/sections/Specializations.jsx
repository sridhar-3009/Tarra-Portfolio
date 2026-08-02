import React from 'react'
import { motion } from 'framer-motion'
import { TbBrain, TbCpu, TbLayoutGrid, TbChartBar } from 'react-icons/tb'

export const services = [
  {
    id: 'llm',
    title: 'LLMs & Agentic AI',
    description: 'Architecting retrieval-augmented generation (RAG) pipelines, intelligent agents, and context-aware natural language workflows.',
    icon: TbBrain,
    tag: 'GenAI & RAG',
  },
  {
    id: 'ml',
    title: 'ML Pipelines & MLOps',
    description: 'Designing deep learning models (LSTMs, XGBoost), automated anomaly detection, model monitoring, and continuous retraining.',
    icon: TbCpu,
    tag: 'Predictive Modeling',
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Systems',
    description: 'Building high-performance React web interfaces, FastAPI microservices, real-time WebRTC channels, and browser extensions.',
    icon: TbLayoutGrid,
    tag: 'Web & APIs',
  },
  {
    id: 'data',
    title: 'Data & Analytics',
    description: 'Extracting actionable insights from millions of data points, Power BI business dashboards, and optimized SQL engines.',
    icon: TbChartBar,
    tag: 'BI & Analytics',
  },
]

export default function Specializations() {
  return (
    <section className="space-y-6 my-10 sm:my-12">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Specializations</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ what i build</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black text-zinc-900 dark:text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
