import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { agentSkills } from '../data/agentSkills'
import { Rows, Row, SectionTitle, Bouncy, Sparkle } from '../components/home/ui'

export default function ProjectsPage() {
  return (
    <div className="space-y-16">
      <Helmet>
        <title>Projects · Sai Sridhar Tarra</title>
        <meta name="description" content="Everything Sai Sridhar Tarra has built: backend systems, ML projects, and skills for AI agents." />
      </Helmet>

      <header>
        <Link to="/" className="text-ink/70 hover:text-ink">← Home</Link>
        <h1 className="mt-4 font-display font-extrabold text-ink text-[clamp(2.75rem,1.6rem+3.6vw,4.5rem)] leading-[1.02] tracking-[-0.01em]">
          <span className="relative inline-block">
            <Sparkle className="-left-5 -top-2 text-highlight" size={18} /><Sparkle className="-right-6 top-0 text-accent" size={13} delay={1.1} />
            <Bouncy text="Projects" />
          </span>
        </h1>
      </header>

      <section>
        <Rows>
          {projects.map((p) => (
            <Row
              key={p.id}
              href={p.liveUrl || p.githubUrl}
              meta={p.category}
              name={p.title}
              description={p.description}
            />
          ))}
        </Rows>
      </section>

      {agentSkills.length > 0 && (
        <section aria-labelledby="skills-title">
          <SectionTitle id="skills-title" className="mb-6">Skills for AI agents</SectionTitle>
          <Rows>
            {agentSkills.map((s) => (
              <Row key={s.id} href={s.link} meta={s.marketplace} name={s.title} description={s.description} />
            ))}
          </Rows>
        </section>
      )}
    </div>
  )
}
