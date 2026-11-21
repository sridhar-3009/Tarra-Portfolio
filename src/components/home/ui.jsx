import React from 'react'
import { Link } from 'react-router-dom'

// Shared building blocks for the cream & cobalt home page.

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

const pill =
  'inline-flex items-center justify-center gap-1.5 rounded-full border border-ink bg-paper px-6 pb-2 pt-[calc(0.5rem+1px)] font-display text-base font-semibold uppercase tracking-wide text-ink no-underline transition-colors duration-150 hover:border-lavender hover:bg-lavender hover:text-[#0033e6] focus-visible:border-lavender focus-visible:bg-lavender focus-visible:text-[#0033e6]'

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

// One row: optional meta (date) on the left, name + description, and an arrow.
export function Row({ href, name, description, meta, arrow, lineId }) {
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
        <span className="shrink-0 pt-0.5 font-display text-2xl leading-8 text-ink transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5">
          {arrow || (internal ? '→' : '↗')}
        </span>
      )}
    </div>
  )

  if (!href) return <li>{content}</li>
  return (
    <li className="transition-colors hover:bg-lavender/40">
      {internal ? (
        <Link to={href} className="block px-1">{content}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block px-1">{content}</a>
      )}
    </li>
  )
}

export function TextLink({ to, children }) {
  return (
    <Link to={to} className="font-semibold text-ink underline decoration-ink/40 decoration-2 underline-offset-4 hover:decoration-ink">
      {children}
    </Link>
  )
}
