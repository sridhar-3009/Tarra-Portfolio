import React, { useEffect, useRef } from 'react'
import { figureStrokes, FIGURE_W } from './figure'

// One hand-drawn line that runs down the whole home page and draws itself as
// you scroll: it underlines the name, sketches the doodle in the hero, circles
// things, squiggles between sections, and loops around the contact links.
//
// Anchor elements inside the root are found by data-line="<name>".

function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Catmull-Rom through points → cubic Bézier path data.
function smooth(pts) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function buildPath(root) {
  const base = root.getBoundingClientRect()
  const W = root.clientWidth
  const rand = rng(42)
  const j = (n) => (rand() - 0.5) * n
  const box = (name) => {
    const el = root.querySelector(`[data-line="${name}"]`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    const x = r.left - base.left
    const y = r.top - base.top
    return { x, y, w: r.width, h: r.height, r: x + r.width, b: y + r.height, cx: x + r.width / 2, cy: y + r.height / 2 }
  }
  // Side lanes in the page gutters, so long runs don't cross the text.
  const gutter = Math.max(0, base.left)
  const lane = Math.min(70, Math.max(8, gutter * 0.55))
  const L = -lane
  const R = W + lane
  const clampX = (x) => Math.min(W + gutter - 4, Math.max(-gutter + 4, x))

  const strokes = []
  let cur = []
  let fine = false // portrait detail strokes use a finer pen
  const go = (...pts) => cur.push(...pts.map(([x, y]) => [clampX(x), y]))
  const lift = () => {
    if (cur.length) strokes.push({ pts: cur, fine })
    cur = []
  }

  // Loose hand-drawn ellipse around a box, overshooting a little.
  const circle = (b, { padX = 18, padY = 14, turns = 1.12, start = -2.6 } = {}) => {
    const rx = b.w / 2 + padX
    const ry = b.h / 2 + padY
    const n = 30
    for (let i = 0; i <= n; i++) {
      const a = start + (i / n) * turns * Math.PI * 2
      const wob = 1 + j(0.07)
      go([b.cx + Math.cos(a) * rx * wob, b.cy + Math.sin(a) * ry * wob])
    }
  }
  // Wavy horizontal squiggle.
  const wave = (x0, x1, y, amp = 9) => {
    const n = Math.max(3, Math.round(Math.abs(x1 - x0) / 46))
    for (let i = 0; i <= n; i++) {
      go([x0 + ((x1 - x0) * i) / n + j(6), y + (i % 2 ? amp : -amp) + j(4)])
    }
  }


  const lead = box('lead')
  const fig = box('portrait')

  // Underline the name, left to right, then head off to the right.
  const underline = () => {
    const y = lead.b + 4
    go([lead.x - 26, y - 14], [lead.x - 6, y + 2])
    const n = 10
    for (let i = 1; i <= n; i++) go([lead.x + (lead.w * i) / n, y + Math.sin(i * 1.3) * 3 + j(2)])
    go([lead.r + 16, y - 6], [lead.r + 30, y + 10])
  }

  // Sketch the doodle. The first stroke continues the line; the rest lift the
  // pen like a real sketch.
  const sketch = () => {
    const s = fig.w / FIGURE_W
    const tf = ([x, y]) => [fig.x + x * s, fig.y + y * s]
    figureStrokes.forEach((stroke, i) => {
      if (i > 0) lift()
      fine = i > 0
      stroke.map(tf).forEach((p) => cur.push(p))
    })
    lift()
    fine = false
  }

  // 1–2. Desktop: the doodle sits left of the name, so draw it first, then
  // sweep over and underline. Mobile: the name comes first.
  if (fig && lead && fig.y < lead.y + lead.h && fig.r < lead.x + 20) {
    go([fig.x + fig.w * 0.15, -40], [fig.x + fig.w * 0.2, fig.y - 10])
    sketch()
    // Leave the drawing through the gap between the columns, not across it.
    const gap = (fig.r + lead.x) / 2
    go([gap - 6, fig.b - 30], [gap, lead.b + 40])
    underline()
    go([lead.r + 60, lead.y + lead.h * 0.2], [R, lead.y + lead.h * 0.5])
  } else {
    if (lead) {
      go([Math.min(W - 30, lead.r + 60), -40], [lead.x - 30, lead.y - 10])
      underline()
    }
    if (fig) {
      go([R, lead ? lead.b + 30 : fig.y - 60], [R, fig.y - 30], [fig.x + fig.w * 0.25, fig.y - 16])
      sketch()
      go([R, fig.b + 10])
    }
  }

  // 3. Down the right lane, then circle "MailAir".
  const mail = box('mailair')
  if (mail) {
    const heroBottom = Math.max(lead ? lead.b : 0, fig ? fig.b : 0)
    go([R, heroBottom + 20], [R - 10, mail.y - 120], [mail.r + 90, mail.y - 50])
    circle(mail, { padX: 16, padY: 12, start: -0.9 })
    go([mail.r + 100, mail.y - 20], [R, mail.y + 30])
  }

  // 4. Squiggle above the projects (right to left), then circle the first one.
  const things = box('things')
  if (things) {
    const y = things.y - 44
    go([R, y - 50])
    wave(R - 10, L + 10, y, 8)
    go([L, things.b + 10])
  }
  const first = box('first-thing')
  if (first) {
    go([L, first.y - 6], [first.x - 4, first.y - 14])
    circle(first, { padX: 18, padY: 14, start: -2.4 })
    go([L, first.b + 40])
  }

  // 5. Squiggle in above each later section, alternating sides.
  let side = 'L'
  ;['experience', 'writing'].forEach((name) => {
    const b = box(name)
    if (!b) return
    const y = b.y - 46
    const from = side === 'L' ? L : R
    const to = side === 'L' ? R : L
    go([from, y - 60])
    wave(from + (side === 'L' ? 10 : -10), to + (side === 'L' ? -10 : 10), y, 7)
    go([to, b.b + 20])
    side = side === 'L' ? 'R' : 'L'
  })
  const laneX = side === 'L' ? L : R

  // 6. A big loose circle around the photo pile.
  const pile = box('pile')
  let x = laneX
  if (pile) {
    go([laneX, pile.y - 80])
    circle(pile, { padX: Math.min(30, gutter * 0.4 + 6), padY: 22, turns: 1.05, start: laneX < 0 ? -2.6 : -0.5 })
    x = cur[cur.length - 1][0] < W / 2 ? L : R
    go([x, pile.b + 60])
  }

  // 7. Down a lane past the call card, then loop around the contact links.
  const call = box('call')
  if (call) go([x, call.y - 10], [x, call.b + 20])
  const links = box('links')
  if (links) {
    go([x === L ? links.x - 50 : links.r + 50, links.y - 40])
    circle(links, { padX: 26, padY: 22, start: x === L ? -2.6 : -0.6 })
    const e = cur[cur.length - 1]
    // A little flourish to finish.
    go([e[0] + 40, e[1] + 40], [e[0] + 10, e[1] + 70], [e[0] - 20, e[1] + 48], [e[0] + 30, e[1] + 30], [e[0] + 90, e[1] + 64])
  }
  lift()

  return strokes.map(({ pts, fine: f }) => ({ d: smooth(pts), pts, fine: f }))
}

export default function ScrollLine({ rootRef }) {
  const svgRef = useRef(null)
  const groupRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    const group = groupRef.current
    const tip = tipRef.current
    if (!root || !svg || !group) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    // One <path> per pen stroke: SVG restarts dash patterns on every subpath,
    // so strokes have to be separate elements to draw in sequence.
    let strokes = [] // { el, start, len }
    let total = 0
    let samples = [] // [length along the whole line, cumulative max y]
    let drawn = 0
    let raf = 0

    const pointAt = (l) => {
      for (const s of strokes) {
        if (l <= s.start + s.len) return s.el.getPointAtLength(Math.max(0, l - s.start))
      }
      const last = strokes[strokes.length - 1]
      return last.el.getPointAtLength(last.len)
    }

    let lastKey = ''
    const rebuild = () => {
      const W = root.clientWidth
      const H = root.scrollHeight
      const key = `${W}x${H}`
      if (key === lastKey) return
      lastKey = key
      const t0 = performance.now()
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.style.width = `${W}px`
      svg.style.height = `${H}px`

      group.replaceChildren()
      strokes = []
      total = 0
      samples = []
      let maxY = -Infinity
      buildPath(root).forEach(({ d, pts, fine }) => {
        if (!d) return
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        el.setAttribute('d', d)
        if (fine) el.setAttribute('stroke-width', '2.2')
        group.appendChild(el)
        const len = el.getTotalLength()
        el.style.strokeDasharray = `${len} ${len}`
        strokes.push({ el, start: total, len })

        // Map scroll depth to line length using the stroke's own points:
        // asking the browser for points along a long path is very slow.
        let run = 0
        const seg = pts.map((p, i) => (i ? (run += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])) : 0))
        const poly = run || 1
        pts.forEach((p, i) => {
          maxY = Math.max(maxY, p[1])
          samples.push([total + (seg[i] / poly) * len, maxY])
        })
        total += len
      })
      drawn = Math.min(drawn, total)
      paint()
      tick()
      if (import.meta.env.DEV) console.debug('scroll line built in', (performance.now() - t0).toFixed(1), 'ms')
    }

    // How much of the line should show for the current scroll position:
    // everything above ~72% of the way down the viewport.
    const target = () => {
      if (reduce.matches) return total
      const edge = window.innerHeight * 0.72 - root.getBoundingClientRect().top
      let lo = 0
      let hi = samples.length - 1
      if (hi < 0) return 0
      if (samples[hi][1] <= edge) return total
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (samples[mid][1] <= edge) lo = mid + 1
        else hi = mid
      }
      return samples[lo][0]
    }

    const paint = () => {
      for (const s of strokes) {
        const shown = Math.min(s.len, Math.max(0, drawn - s.start))
        s.el.style.strokeDashoffset = `${s.len - shown}`
      }
      if (!tip) return
      if (!strokes.length || drawn <= 0.5 || drawn >= total - 0.5 || reduce.matches) {
        tip.style.opacity = '0'
        return
      }
      const p = pointAt(drawn)
      const q = pointAt(Math.max(0, drawn - 4))
      const a = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI
      tip.style.opacity = '1'
      tip.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${a + 180}deg)`
    }

    function tick() {
      cancelAnimationFrame(raf)
      if (reduce.matches) {
        drawn = total
        paint()
        return
      }
      const step = () => {
        const t = target()
        const diff = t - drawn
        if (Math.abs(diff) < 0.5) {
          drawn = t
          paint()
          return
        }
        // Ease toward the target, but never faster than a quick pen.
        drawn += Math.sign(diff) * Math.min(Math.abs(diff) * 0.12 + 2, 46)
        paint()
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    let resizeTimer = 0
    const scheduleRebuild = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(rebuild, 120)
    }
    const ro = new ResizeObserver(scheduleRebuild)
    ro.observe(root)
    window.addEventListener('scroll', tick, { passive: true })
    document.fonts?.ready.then(scheduleRebuild)
    rebuild()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      window.removeEventListener('scroll', tick)
    }
  }, [rootRef])

  return (
    <>
      <svg ref={svgRef} aria-hidden="true" focusable="false" className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible">
        <g
          ref={groupRef}
          fill="none"
          className="stroke-ink"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div ref={tipRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 opacity-0" style={{ transformOrigin: '0 0' }}>
        {/* Pencil: point at the origin, body trailing behind. */}
        <svg width="46" height="16" viewBox="0 -8 46 16" className="block" style={{ transform: 'translateY(-8px)' }}>
          <path d="M0 0 L11 -5.5 L11 5.5 Z" className="fill-paper stroke-ink" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M0 0 L4 -2 L4 2 Z" className="fill-ink" />
          <rect x="11" y="-5.5" width="26" height="11" rx="1" className="fill-ink" />
          <rect x="37" y="-5.5" width="7" height="11" rx="2" className="fill-lavender stroke-ink" strokeWidth="1.4" />
        </svg>
      </div>
    </>
  )
}
