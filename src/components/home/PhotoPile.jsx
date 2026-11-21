import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'

// Deterministic pseudo-random so the pile looks the same on every visit.
function seeded(i, salt) {
  const x = Math.sin((i + 1) * 9301 + salt * 49297) * 233280
  return x - Math.floor(x)
}

const DRAG_THRESHOLD = 5

export default function PhotoPile({ photos }) {
  const pileRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [ratios, setRatios] = useState({})
  const [offsets, setOffsets] = useState({})
  const [order, setOrder] = useState(() => photos.map((_, i) => photos.length - 1 - i))
  const [dragging, setDragging] = useState(null)
  const [open, setOpen] = useState(null)
  const drag = useRef(null)

  useLayoutEffect(() => {
    const el = pileRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Uniform prints laid in tidy centred rows, each with a gentle alternating
  // tilt and a little overlap, like polaroids pinned to a board. Same size and
  // shape for every photo keeps it calm; the lightbox shows the full image.
  const isMobile = width < 640
  const cols = Math.min(4, photos.length)
  const cellW = width / cols
  const printW = Math.min(220, cellW * 0.92)
  const printH = printW * 1.25
  const rowStep = printH * 0.86
  const rows = Math.ceil(photos.length / cols)

  const layout = photos.map((_, i) => {
    const row = Math.floor(i / cols)
    const inRow = Math.min(cols, photos.length - row * cols)
    const c = i - row * cols
    const startX = (width - inRow * cellW) / 2
    const x = startX + c * cellW + (cellW - printW) / 2 + (seeded(i, 1) - 0.5) * 18
    const y = row * rowStep + (seeded(i, 2) - 0.5) * 16 + (c % 2 ? 10 : 0)
    const r = (i % 2 ? 1 : -1) * (2 + seeded(i, 3) * 3)
    const off = offsets[i] || { x: 0, y: 0 }
    return { x: x + off.x, y: y + off.y, r, ar: 0.8, h: printH }
  })
  const pileH = (rows - 1) * rowStep + printH + 30

  const bringToFront = (i) => setOrder((o) => [...o.filter((j) => j !== i), i])

  const onPointerDown = (e, i) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const off = offsets[i] || { x: 0, y: 0 }
    drag.current = { i, startX: e.clientX, startY: e.clientY, baseX: off.x, baseY: off.y, moved: false }
    bringToFront(i)
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    if (!d.moved) {
      d.moved = true
      setDragging(d.i)
    }
    setOffsets((o) => ({ ...o, [d.i]: { x: d.baseX + dx, y: d.baseY + dy } }))
  }

  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    setDragging(null)
    if (d && !d.moved) setOpen(d.i)
  }

  // Phones get a tidy deck of cards instead of a scattered pile.
  if (isMobile && width > 0) {
    return (
      <div ref={pileRef} className="w-full">
        <PhotoDeck photos={photos} onOpen={setOpen} />
        {open !== null && (
          <Lightbox photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
        )}
      </div>
    )
  }

  return (
    <>
      <div ref={pileRef} className="relative mx-auto w-full max-w-5xl" style={{ height: pileH }}>
        {width > 0 && photos.map((photo, i) => {
          const p = layout[i]
          const lifted = dragging === i
          return (
            <button
              key={photo.name}
              type="button"
              aria-label={photo.caption || `Open photo ${i + 1}`}
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(i) } }}
              className={`absolute left-0 top-0 overflow-hidden rounded-lg border-2 border-ink bg-zinc-100 dark:bg-zinc-900 select-none touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                lifted
                  ? 'cursor-grabbing shadow-[0_4px_8px_#0000001f,0_26px_50px_-14px_#0006]'
                  : 'cursor-grab shadow-[0_1px_2px_#00000014,0_6px_18px_-8px_#00000040] hover:shadow-[0_2px_4px_#0000001a,0_14px_30px_-10px_#00000052] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)]'
              }`}
              style={{
                width: printW,
                aspectRatio: p.ar,
                zIndex: order.indexOf(i) + 1,
                transform: `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg) scale(${lifted ? 1.06 : 1})`,
              }}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                draggable={false}
                loading="lazy"
                onLoad={(e) => {
                  const { naturalWidth: w, naturalHeight: h } = e.currentTarget
                  if (w && h) setRatios((r) => (r[i] ? r : { ...r, [i]: w / h }))
                }}
                className="h-full w-full object-cover pointer-events-none"
              />
            </button>
          )
        })}
      </div>

      {open !== null && (
        <Lightbox photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  )
}

// A stack of prints: the top one can be swiped away to reveal the next,
// and tapped to open. The next two peek out from behind it.
function PhotoDeck({ photos, onOpen }) {
  const reduce = useReducedMotion()
  const [top, setTop] = useState(0)
  const n = photos.length
  const next = () => setTop((t) => (t + 1) % n)
  const prev = () => setTop((t) => (t - 1 + n) % n)
  const behind = [2, 1].filter((k) => k < n)

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[4/5] w-[78%] max-w-[300px]">
        {behind.map((k) => {
          const photo = photos[(top + k) % n]
          return (
            <div
              key={`b${k}-${photo.name}`}
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden rounded-xl border-2 border-ink bg-zinc-100 shadow-[0_8px_20px_-12px_#00000066] transition-transform duration-300 dark:bg-zinc-900"
              style={{ transform: `rotate(${k === 1 ? 4 : -5}deg) translate(${k === 1 ? 10 : -10}px, ${k * 6}px) scale(${1 - k * 0.04})` }}
            >
              <img src={photo.src} alt="" className="h-full w-full object-cover opacity-90" draggable={false} />
            </div>
          )
        })}

        <AnimatePresence initial={false} mode="popLayout">
          <motion.button
            key={photos[top].name}
            type="button"
            aria-label={`Open photo ${top + 1} of ${n}`}
            onClick={() => onOpen(top)}
            className="absolute inset-0 z-10 overflow-hidden rounded-xl border-2 border-ink bg-zinc-100 shadow-[0_14px_30px_-14px_#00000080] dark:bg-zinc-900"
            initial={reduce ? false : { scale: 0.92, rotate: 3, opacity: 0 }}
            animate={{ scale: 1, rotate: -1.5, opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: -320, rotate: -18, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            drag={reduce ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) next()
              else if (info.offset.x > 60 || info.velocity.x > 400) prev()
            }}
          >
            <img src={photos[top].src} alt={photos[top].caption} className="pointer-events-none h-full w-full object-cover" draggable={false} />
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button type="button" aria-label="Previous photo" onClick={prev} className="rounded-full border border-ink p-1.5 text-ink transition-colors hover:bg-highlight hover:border-highlight hover:text-on-highlight">
          <FiChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5" aria-hidden="true">
          {photos.map((p, i) => (
            <span key={p.name} className={`h-1.5 rounded-full transition-all duration-300 ${i === top ? 'w-5 bg-accent' : 'w-1.5 bg-ink/25'}`} />
          ))}
        </div>
        <button type="button" aria-label="Next photo" onClick={next} className="rounded-full border border-ink p-1.5 text-ink transition-colors hover:bg-highlight hover:border-highlight hover:text-on-highlight">
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function Lightbox({ photos, index, onChange, onClose }) {
  const swipe = useRef(null)
  const swiped = useRef(false)
  const photo = photos[index]
  const prev = useCallback(() => onChange((index - 1 + photos.length) % photos.length), [index, photos.length, onChange])
  const next = useCallback(() => onChange((index + 1) % photos.length), [index, photos.length, onChange])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose, prev, next])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper/90 backdrop-blur-sm p-4 sm:p-10"
      onClick={() => {
        if (swiped.current) { swiped.current = false; return }
        onClose()
      }}
      onPointerDown={(e) => { swipe.current = e.clientX }}
      onPointerUp={(e) => {
        if (swipe.current === null) return
        const dx = e.clientX - swipe.current
        swipe.current = null
        if (Math.abs(dx) > 50) { swiped.current = true; dx > 0 ? prev() : next() }
      }}
    >
      <figure className="flex max-h-full max-w-full flex-col items-center gap-3" onClick={(e) => { e.stopPropagation(); swiped.current = false }}>
        <img
          src={photo.src}
          alt={photo.caption}
          draggable={false}
          className="max-h-[78vh] max-w-full rounded-lg border-2 border-ink object-contain shadow-[0_26px_50px_-14px_#0006]"
        />
        <figcaption className="text-sm text-ink">
          {photo.caption && <span>{photo.caption} · </span>}
          <span className="tabular-nums opacity-70">{index + 1} / {photos.length}</span>
        </figcaption>
      </figure>

      <button type="button" aria-label="Close" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-ink bg-paper p-2 text-ink hover:bg-highlight hover:border-highlight hover:text-on-highlight transition-colors">
        <FiX className="h-5 w-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper p-2 text-ink hover:bg-highlight hover:border-highlight hover:text-on-highlight transition-colors">
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper p-2 text-ink hover:bg-highlight hover:border-highlight hover:text-on-highlight transition-colors">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>,
    document.body
  )
}
