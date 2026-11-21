import React, { useEffect, useRef } from 'react'
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
import { motion, useReducedMotion } from 'framer-motion'
import { SectionTitle, Pill, Rows, Row, TextLink, Reveal, Bouncy, Sparkle } from '../components/home/ui'
import PhotoPile from '../components/home/PhotoPile'
import ScrollLine from '../components/home/ScrollLine'
import Eyes from '../components/home/Eyes'
import BookCall from '../components/sections/BookCall'

const HOME_PROJECTS = 4

export default function Home() {
  const location = useLocation()
  const rootRef = useRef(null)
  const reduce = useReducedMotion()
  // Hero copy rises in one line after another while the pencil draws.
  const intro = (i) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.35 + i * 0.12 } }

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

      <div ref={rootRef} className="relative">
      <ScrollLine rootRef={rootRef} />
      <div className="relative z-10 space-y-24 sm:space-y-32">
        {/* Hello */}
        <section className="grid items-center gap-10 pt-6 sm:pt-12 md:grid-cols-[5fr_6fr] md:gap-16">
          <div
            data-line="portrait"
            role="img"
            aria-label="A line drawing of Sai"
            className="order-2 mx-auto aspect-[400/540] w-full max-w-[17rem] md:order-1 md:max-w-none"
          />
          <div className="relative order-1 md:order-2">
            <Sparkle className="-left-6 top-2 text-highlight" size={22} />
            <Sparkle className="left-36 top-0 text-accent" size={14} delay={0.9} />
            <Sparkle className="right-6 top-24 text-highlight hidden sm:block" size={18} delay={1.6} />
            <motion.div {...intro(0)}>
              <Eyes className="mb-4 w-24 sm:w-28" />
            </motion.div>
            {/* Opacity only: the scroll line measures the name to underline it. */}
            <motion.h1
              {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: 0.2 } })}
              className="font-display font-extrabold text-ink text-[clamp(2.75rem,1.6rem+3.6vw,4.5rem)] leading-[1.02] tracking-[-0.01em] mb-8"
            >
              <span data-line="lead" className="inline-block"><Bouncy text="Hi, I'm Sai." delay={0.25} /></span>
            </motion.h1>
            <div className="space-y-4 text-lg leading-relaxed text-ink">
              <motion.p {...intro(1)}>I live in Edinburgh. I build backend systems and I&apos;m into machine learning.</motion.p>
              <motion.p {...intro(2)}>
                Right now I&apos;m doing an MSc in Statistics with Data Science at the University of Edinburgh.
                Before that I spent 2.5+ years as a Software Engineer at Accenture, making C++ and Python services
                faster for a banking client.
              </motion.p>
              <motion.p {...intro(3)} className="flex items-center gap-2 text-ink/80">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                {personal.availability}.
              </motion.p>
            </div>
            <motion.div {...intro(4)} className="mt-8 flex flex-wrap gap-3">
              <Pill href={personal.resume} download>Résumé ↓</Pill>
              <Pill href="#book-a-call">Book a call</Pill>
            </motion.div>
          </div>
        </section>

        {/* MailAir */}
        <section aria-labelledby="mailair-title" className="max-w-3xl">
          <Reveal slide={false}>
            <SectionTitle id="mailair-title" className="mb-5">I&apos;m building <span data-line="mailair" className="inline-block"><Bouncy text="MailAir" inView delay={0.15} /></span></SectionTitle>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4 text-lg leading-relaxed text-ink">
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
          </Reveal>
        </section>

        {/* Things I made */}
        <section id="projects" aria-labelledby="things-title" className="scroll-mt-24">
          <Reveal slide={false}>
            <SectionTitle id="things-title" className="mb-8 text-center"><span data-line="things"><Bouncy text="Some things I made" inView /></span></SectionTitle>
          </Reveal>
          <Rows>
            {things.map((t, i) => (
              <Row key={t.id} i={i} href={t.href} name={t.name} description={t.description} lineId={i === 0 ? 'first-thing' : undefined} />
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
          <Reveal slide={false}>
            <SectionTitle id="experience-title" className="mb-8"><span data-line="experience"><Bouncy text="Where I've been" inView /></span></SectionTitle>
          </Reveal>
          <Rows>
            {experiences.map((e, i) => (
              <Row
                key={e.id}
                i={i}
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
            <Reveal slide={false}>
              <SectionTitle id="writing-title" className="mb-8"><span data-line="writing"><Bouncy text="Things I wrote" inView /></span></SectionTitle>
            </Reveal>
            <Rows>
              {blogPosts.slice(0, 5).map((post, i) => (
                <Row key={post.slug} i={i} href={`/blog/${post.slug}`} meta={formatDate(post.date)} name={post.title} />
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
            <div data-line="pile">
              <PhotoPile photos={photos} />
            </div>
          </section>
        )}

        {/* Book a call */}
        <div data-line="call">
          <BookCall />
        </div>

        {/* Say hi */}
        <section id="contact" aria-labelledby="hi-title" className="scroll-mt-24 text-center">
          <Reveal>
            <SectionTitle id="hi-title" className="mb-3">
              <span className="relative inline-block">
                <Bouncy text="Say hi" inView />
                <Sparkle className="-right-6 -top-1 text-accent" size={16} />
                <Sparkle className="-left-5 top-3 text-highlight" size={12} delay={1.2} />
              </span>
            </SectionTitle>
            <p className="mx-auto mb-8 max-w-xl text-lg text-ink">
              Email is the best way to reach me. I&apos;m open to software engineering and ML roles in the UK.
            </p>
          </Reveal>
          <div data-line="links" className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
            <Pill href={`mailto:${personal.email}`}><FiMail /> Email</Pill>
            <Pill href={`tel:${personal.phone.replace(/\s/g, '')}`}><FiPhone /> Call</Pill>
            <Pill href={personal.linkedin}><FiLinkedin /> LinkedIn</Pill>
            <Pill href={personal.github}><FiGithub /> GitHub</Pill>
            <Pill href={personal.twitter}><FiTwitter /> X</Pill>
          </div>
        </section>
      </div>
      </div>
    </>
  )
}
