import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { FiMail, FiPhone, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { personal } from '../data/personal'
import { projects } from '../data/projects'
import { experiences } from '../data/experience'
import { agentSkills } from '../data/agentSkills'
import { photos } from '../data/photos'
import { blogPosts } from '../blog'
import { formatDate } from '../utils/blogUtils'
import { SectionTitle, Pill, Rows, Row, TextLink } from '../components/home/ui'
import PhotoPile from '../components/home/PhotoPile'
import BookCall from '../components/sections/BookCall'

const HOME_PROJECTS = 4

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

  const things = [
    ...projects.slice(0, HOME_PROJECTS).map((p) => ({
      id: p.id,
      name: p.title,
      description: p.subtitle,
      href: p.liveUrl || p.githubUrl,
    })),
    ...agentSkills.slice(0, 1).map((s) => ({
      id: s.id,
      name: 'Triangulate Research',
      description: 'An agent skill for cited answers that flag where sources disagree.',
      href: s.link,
    })),
  ]
  const moreCount = projects.length - HOME_PROJECTS + Math.max(0, agentSkills.length - 1)

  return (
    <>
      <Helmet>
        <title>{personal.name} | Software Engineer &amp; ML</title>
        <meta name="description" content={`${personal.name} — ${personal.title}. ${personal.bio}`} />
        <meta property="og:title" content={`${personal.name} | Software Engineer & ML`} />
        <meta property="og:description" content={personal.bio} />
        <link rel="canonical" href="https://saisridhartarra.in/" />
      </Helmet>

      <div className="space-y-24 sm:space-y-32">
        {/* Hello */}
        <section className="grid items-center gap-10 pt-6 sm:pt-12 md:grid-cols-[6fr_5fr] md:gap-16">
          <div>
            <h1 className="font-display font-extrabold text-ink text-[clamp(2.75rem,1.6rem+3.6vw,4.5rem)] leading-[1.02] tracking-[-0.01em] mb-6">
              Hi, I&apos;m Sai.
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-ink">
              <p>I live in Edinburgh. I build backend systems and I&apos;m into machine learning.</p>
              <p>
                Right now I&apos;m doing an MSc in Statistics with Data Science at the University of Edinburgh.
                Before that I spent 2.5+ years as a Software Engineer at Accenture, making C++ and Python services
                faster for a banking client.
              </p>
              <p className="text-ink/80">{personal.availability}.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill href={personal.resume} download>Résumé ↓</Pill>
              <Pill href="#book-a-call">Book a call</Pill>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[22rem] md:max-w-none">
            <div className="rotate-[3deg] overflow-hidden rounded-lg border-2 border-ink bg-zinc-100 shadow-[0_1px_2px_#00000014,0_18px_40px_-16px_#00000059] transition-transform duration-500 hover:rotate-0 dark:bg-zinc-900">
              <img src="/tanjiro.jpg?v=2" alt={personal.name} className="aspect-[4/5] w-full object-cover grayscale" />
            </div>
          </div>
        </section>

        {/* MailAir */}
        <section aria-labelledby="mailair-title" className="max-w-3xl">
          <SectionTitle id="mailair-title" className="mb-5">I&apos;m building MailAir</SectionTitle>
          <div className="space-y-4 text-lg leading-relaxed text-ink">
            <p>
              MailAir gives small teams one place to run their customer communication: email campaigns and
              follow-up sequences, a shared Gmail and Outlook inbox, and docs, files, chat, and calls in one
              workspace. The connected setup big companies get, without the price tag or the IT department.
            </p>
            <p>
              Underneath is an AI layer built on Claude that sorts email by priority, pulls out action items and
              deadlines, spots revenue signals like quotes and renewals, and drafts replies in each person&apos;s
              own voice. I lead product and engineering, and built it end to end with Next.js, FastAPI, Supabase,
              and React Native.
            </p>
          </div>
        </section>

        {/* Things I made */}
        <section id="projects" aria-labelledby="things-title" className="scroll-mt-24">
          <SectionTitle id="things-title" className="mb-8 text-center">Some things I made</SectionTitle>
          <Rows>
            {things.map((t) => (
              <Row key={t.id} href={t.href} name={t.name} description={t.description} />
            ))}
          </Rows>
          {moreCount > 0 && (
            <p className="mt-6 text-center text-lg text-ink">
              Plus {moreCount} more. <TextLink to="/projects">See them all →</TextLink>
            </p>
          )}
        </section>

        {/* Experience */}
        <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24">
          <SectionTitle id="experience-title" className="mb-8">Where I&apos;ve been</SectionTitle>
          <Rows>
            {experiences.map((e) => (
              <Row
                key={e.id}
                meta={e.period.replace(/ – /, '–')}
                name={`${e.role}, ${e.company.split(' – ')[0]}`}
                description={e.description}
              />
            ))}
          </Rows>
        </section>

        {/* Writing */}
        {blogPosts.length > 0 && (
          <section aria-labelledby="writing-title">
            <SectionTitle id="writing-title" className="mb-8">Things I wrote</SectionTitle>
            <Rows>
              {blogPosts.slice(0, 5).map((post) => (
                <Row key={post.slug} href={`/blog/${post.slug}`} meta={formatDate(post.date)} name={post.title} />
              ))}
            </Rows>
            <p className="mt-6 text-lg text-ink">
              <TextLink to="/blog">All {blogPosts.length} articles →</TextLink>
            </p>
          </section>
        )}

        {/* Camera roll */}
        {photos.length > 0 && (
          <section id="photos" aria-labelledby="photos-title" className="scroll-mt-24">
            <div className="mb-10 text-center">
              <SectionTitle id="photos-title" className="mb-2">From my camera roll</SectionTitle>
              <p className="text-ink/80">
                <span className="hidden sm:inline">Drag them around, or click one for a closer look.</span>
                <span className="sm:hidden">Tap one for a closer look, then swipe.</span>
              </p>
            </div>
            <PhotoPile photos={photos} />
          </section>
        )}

        {/* Book a call */}
        <BookCall />

        {/* Say hi */}
        <section id="contact" aria-labelledby="hi-title" className="scroll-mt-24 text-center">
          <SectionTitle id="hi-title" className="mb-3">Say hi</SectionTitle>
          <p className="mx-auto mb-8 max-w-xl text-lg text-ink">
            Email is the best way to reach me. I&apos;m open to software engineering and ML roles in the UK.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Pill href={`mailto:${personal.email}`}><FiMail /> Email</Pill>
            <Pill href={`tel:${personal.phone.replace(/\s/g, '')}`}><FiPhone /> Call</Pill>
            <Pill href={personal.linkedin}><FiLinkedin /> LinkedIn</Pill>
            <Pill href={personal.github}><FiGithub /> GitHub</Pill>
            <Pill href={personal.twitter}><FiTwitter /> X</Pill>
          </div>
        </section>
      </div>
    </>
  )
}
