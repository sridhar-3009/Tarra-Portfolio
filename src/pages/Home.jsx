import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import ExpandableBio from '../components/sections/ExpandableBio'
import TerminalTypewriter from '../components/ui/TerminalTypewriter'
import Specializations from '../components/sections/Specializations'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Skills from '../components/sections/Skills'
import BlogPreview from '../components/sections/BlogPreview'
import Contact from '../components/sections/Contact'
import { personal } from '../data/personal'

const SectionDivider = () => (
  <hr className="border-t border-zinc-200 dark:border-zinc-800/80 my-8 sm:my-12" />
)

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return

    const timer = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)

    return () => clearTimeout(timer)
  }, [location.state])

  return (
    <>
      <Helmet>
        <title>{personal.name} | ML & AI Engineer</title>
        <meta name="description" content={`${personal.name} — ${personal.title}. ${personal.bio}`} />
        <meta property="og:title" content={`${personal.name} | ML & AI Engineer`} />
        <meta property="og:description" content={personal.bio} />
        <link rel="canonical" href="https://saisridhartarra.in/" />
      </Helmet>

      {/* Bio Section */}
      <ExpandableBio />

      {/* Robotic Futuristic Terminal Typewriter Component */}
      <TerminalTypewriter />

      <SectionDivider />

      {/* Specializations Grid ("What I Do") */}
      <Specializations />

      <SectionDivider />

      {/* Featured Projects Grid */}
      <Projects />

      <SectionDivider />

      {/* Experience & Education Timeline */}
      <Experience />

      <SectionDivider />

      {/* Technical Skills Grid */}
      <Skills />

      <SectionDivider />

      {/* Blog & Code Drops Preview Feed */}
      <BlogPreview />

      <SectionDivider />

      {/* Contact Card */}
      <Contact />
    </>
  )
}
