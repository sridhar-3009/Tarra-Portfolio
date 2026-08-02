import React from 'react'
import { 
  SiPython, 
  SiPytorch, 
  SiScikitlearn, 
  SiFastapi, 
  SiNodedotjs, 
  SiExpress, 
  SiReact, 
  SiTailwindcss, 
  SiPostgresql, 
  SiMongodb, 
  SiCplusplus, 
  SiLinux, 
  SiPandas, 
  SiNumpy,
  SiGit
} from 'react-icons/si'
import { TbBrain, TbDatabase, TbCode, TbChartBar } from 'react-icons/tb'

export const skillsList = [
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'LLMs & RAG', icon: TbBrain, color: '#A855F7' },
  { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: 'Scikit-learn', icon: SiScikitlearn, color: '#F89939' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  { name: 'Pandas', icon: SiPandas, color: '#150458' },
  { name: 'NumPy', icon: SiNumpy, color: '#013243' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Power BI', icon: TbChartBar, color: '#F2C811' },
  { name: 'Git & GitHub', icon: SiGit, color: '#F05032' },
  { name: 'Linux', icon: SiLinux, color: '#FCC624' },
]

export default function SkillMarquee() {
  // Duplicate skills list for continuous seamless scroll
  const marqueeItems = [...skillsList, ...skillsList]

  return (
    <div className="w-full py-4 overflow-hidden marquee-mask relative select-none">
      <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((skill, index) => {
          const Icon = skill.icon
          return (
            <div
              key={`${skill.name}-${index}`}
              className="group relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all duration-300 shadow-sm shrink-0"
              style={{ '--skill-color': skill.color }}
            >
              <Icon
                className="w-4 h-4 text-zinc-400 group-hover:text-[var(--skill-color)] transition-colors duration-300"
                style={{ color: undefined }}
              />
              <span className="font-mono text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white">
                {skill.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
