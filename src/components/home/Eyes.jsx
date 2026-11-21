import React, { useEffect, useRef, useState } from 'react'

// Doodle eyes that follow the cursor, blink now and then, and look around on
// their own on touch devices. They widen when you hover them.
export default function Eyes({ className = '' }) {
  const svgRef = useRef(null)
  const [look, setLook] = useState({ x: 0, y: 2 })
  const [blink, setBlink] = useState(false)
  const [surprised, setSurprised] = useState(false)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let lastMove = 0
    let wander = 0
    let blinker = 0

    const aim = (cx, cy) => {
      const r = svg.getBoundingClientRect()
      const dx = cx - (r.left + r.width / 2)
      const dy = cy - (r.top + r.height * 0.6)
      const dist = Math.hypot(dx, dy) || 1
      const k = Math.min(1, dist / 240)
      setLook({ x: (dx / dist) * 9 * k, y: (dy / dist) * 12 * k + 2 })
    }
    const onMove = (e) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        lastMove = performance.now()
        aim(e.clientX, e.clientY)
      }
    }
    const onDown = (e) => {
      if (e.pointerType === 'touch') {
        lastMove = performance.now()
        aim(e.clientX, e.clientY)
      }
    }
    const roam = () => {
      wander = setTimeout(roam, 1800 + Math.random() * 2600)
      if (reduce.matches || fine.matches || performance.now() - lastMove < 3500) return
      const a = Math.random() * Math.PI * 2
      const k = Math.random() < 0.3 ? 0 : 0.5 + Math.random() * 0.5
      setLook({ x: Math.cos(a) * 9 * k, y: Math.sin(a) * 11 * k + 2 })
    }
    const blinkLoop = () => {
      blinker = setTimeout(blinkLoop, 2600 + Math.random() * 4200)
      if (reduce.matches || document.hidden) return
      setBlink(true)
      setTimeout(() => setBlink(false), 130)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    roam()
    blinker = setTimeout(blinkLoop, 2200)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      clearTimeout(wander)
      clearTimeout(blinker)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 210 130"
      aria-hidden="true"
      focusable="false"
      onPointerEnter={() => setSurprised(true)}
      onPointerLeave={() => setSurprised(false)}
      className={`overflow-visible fill-none stroke-ink [stroke-linecap:round] [stroke-width:6.2px] ${className}`}
    >
      {/* Brows lift when surprised */}
      <g style={{ transform: `translateY(${surprised ? -8 : 0}px)`, transition: 'transform .2s ease' }}>
        <path d="M24 20C34 16 44 10 54 4" />
        <path d="M156 4C166 10 176 16 186 20" />
      </g>
      <g
        style={{
          transformOrigin: '105px 92px',
          transform: `scaleY(${blink ? 0.08 : surprised ? 1.08 : 1})`,
          transition: 'transform .09s ease',
        }}
      >
        <ellipse cx="62" cy="88" rx="38" ry="54" className="fill-paper" />
        <ellipse cx="148" cy="88" rx="38" ry="54" className="fill-paper" />
        <g style={{ transform: `translate(${look.x.toFixed(1)}px, ${look.y.toFixed(1)}px)`, transition: 'transform .12s ease-out' }}>
          <circle cx="62" cy="84" r="9" className="fill-ink stroke-none" />
          <circle cx="148" cy="84" r="9" className="fill-ink stroke-none" />
        </g>
      </g>
    </svg>
  )
}
