import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

// Shared building blocks for the home page.

const EASE = [0.2, 0.8, 0.2, 1]

// Fades children in as they scroll into view. `slide` adds a small rise; leave
// it off for anything the scroll line measures (data-line anchors), since a
// transform would shift where the line circles it.
export function Reveal({ children, delay = 0, slide = true, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: slide ? 18 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

export function SectionTitle({ id, children, className = '' }) {
  return (
    <h2
      id={id}
      className={`font-display font-extrabold text-ink text-[clamp(1.5rem,1.1rem+1.9vw,2.25rem)] leading-[1.15] tracking-tight [text-wrap:balance] ${className}`}
    >
      {children}
    </h2>
  )
}

// Pills fill with sunshine yellow from the bottom on hover.
const pill =
  'relative isolate inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full border border-ink bg-paper px-6 pb-2 pt-[calc(0.5rem+1px)] font-display text-base font-semibold uppercase tracking-wide text-ink no-underline transition-[color,border-color,transform] duration-300 ease-out before:absolute before:inset-0 before:-z-10 before:translate-y-full before:rounded-full before:bg-highlight before:transition-transform before:duration-300 before:ease-out hover:-translate-y-0.5 hover:border-highlight hover:text-on-highlight hover:before:translate-y-0 focus-visible:border-highlight focus-visible:text-on-highlight focus-visible:before:translate-y-0 active:translate-y-0'

// Router paths ("/projects") use <Link>; http(s) links open in a new tab;
// anything else (hash links, mailto:, tel:, downloads) is a plain anchor.
export function Pill({ href, children, download }) {
  if (href.startsWith('/') && !href.includes('#') && !download) {
    return <Link to={href} className={pill}>{children}</Link>
  }
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className={pill}
      download={download}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function Rows({ children }) {
  return <ul className="w-full [&>li]:border-t [&>li]:border-ink [&>li:last-child]:border-b">{children}</ul>
}

// A row's content fades in shortly after the one above it.
function RowFade({ i = 0, children }) {
  const reduce = useReducedMotion()
  if (reduce) return children
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 6) * 0.07 }}
    >
      {children}
    </motion.div>
  )
}

// One row: optional meta (date) on the left, name + description, and an arrow.
export function Row({ href, name, description, meta, arrow, lineId, i = 0 }) {
  const internal = href?.startsWith('/')
  const content = (
    <div className="group flex items-start gap-4 py-4 sm:py-5">
      <div className="flex min-w-0 grow flex-col sm:flex-row sm:gap-4">
        {meta && (
          <span className="shrink-0 text-sm tabular-nums text-ink/70 sm:w-32 sm:pt-1">{meta}</span>
        )}
        <div className="min-w-0 grow">
          <span data-line={lineId} className="font-display text-[clamp(1.15rem,1rem+0.8vw,1.5rem)] font-semibold leading-8 text-ink">
            {name}
          </span>
          {description && <p className="mt-0.5 text-base leading-relaxed text-ink/80">{description}</p>}
        </div>
      </div>
      {href && (
        <span className="shrink-0 pt-0.5 font-display text-2xl leading-8 text-ink transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-accent">
          {arrow || (internal ? '→' : '↗')}
        </span>
      )}
    </div>
  )

  if (!href) return <li><RowFade i={i}>{content}</RowFade></li>
  return (
    <li className="relative isolate before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-highlight/30 before:transition-transform before:duration-500 before:ease-out hover:before:scale-x-100">
      {internal ? (
        <Link to={href} className="block px-1"><RowFade i={i}>{content}</RowFade></Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block px-1"><RowFade i={i}>{content}</RowFade></a>
      )}
    </li>
  )
}

export function TextLink({ to, children }) {
  return (
    <Link to={to} className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent">
      {children}
    </Link>
  )
}
