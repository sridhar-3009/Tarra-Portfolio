import { useEffect, useRef } from 'react'

export default function SpaceCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h

    const stars = []
    const STAR_COUNT = 220
    const shooters = []

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    function initStars() {
      stars.length = 0
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.2,
          opacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          // parallax layer 0=slow 1=medium 2=fast
          layer: Math.floor(Math.random() * 3),
        })
      }
    }

    function spawnShooter() {
      shooters.push({
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.4,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 10 + 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        life: 1,
        fade: Math.random() * 0.018 + 0.012,
      })
    }

    // Nebula blobs — drawn once into offscreen, reused
    const offscreen = document.createElement('canvas')
    function drawNebula() {
      offscreen.width = w
      offscreen.height = h
      const oc = offscreen.getContext('2d')
      const blobs = [
        { x: w * 0.15, y: h * 0.3,  r: w * 0.22, c1: 'rgba(129,140,248,0.07)', c2: 'rgba(129,140,248,0)' },
        { x: w * 0.8,  y: h * 0.6,  r: w * 0.18, c1: 'rgba(245,158,11,0.06)',  c2: 'rgba(245,158,11,0)' },
        { x: w * 0.5,  y: h * 0.85, r: w * 0.15, c1: 'rgba(167,139,250,0.05)', c2: 'rgba(167,139,250,0)' },
      ]
      blobs.forEach(b => {
        const g = oc.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, b.c1)
        g.addColorStop(1, b.c2)
        oc.fillStyle = g
        oc.beginPath()
        oc.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        oc.fill()
      })
    }

    let nebulaDrawn = false
    function draw() {
      ctx.clearRect(0, 0, w, h)

      if (!nebulaDrawn) { drawNebula(); nebulaDrawn = true }
      ctx.drawImage(offscreen, 0, 0)

      // Stars
      stars.forEach(s => {
        s.opacity += s.twinkleSpeed * s.twinkleDir
        if (s.opacity >= 0.95) s.twinkleDir = -1
        if (s.opacity <= 0.1) s.twinkleDir = 1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        const col = s.layer === 2 ? '#F59E0B' : s.layer === 1 ? '#818CF8' : '#fff'
        ctx.fillStyle = col
        ctx.globalAlpha = s.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Shooting stars
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        const ex = s.x + Math.cos(s.angle) * s.len
        const ey = s.y + Math.sin(s.angle) * s.len
        const g = ctx.createLinearGradient(s.x, s.y, ex, ey)
        g.addColorStop(0, `rgba(255,255,255,0)`)
        g.addColorStop(0.4, `rgba(255,255,255,${s.life * 0.9})`)
        g.addColorStop(1, `rgba(245,158,11,0)`)
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = g
        ctx.lineWidth = 1.5
        ctx.stroke()

        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.life -= s.fade
        if (s.life <= 0) shooters.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    initStars()
    draw()

    const shooterInterval = setInterval(() => {
      if (shooters.length < 3) spawnShooter()
    }, 2800)

    const resizeHandler = () => { resize(); nebulaDrawn = false; initStars() }
    window.addEventListener('resize', resizeHandler)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(shooterInterval)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.75,
      }}
    />
  )
}
