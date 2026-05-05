import { useEffect, useRef } from 'react'

export default function OceanCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const particles = []
    const PARTICLE_COUNT = 160

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    function spawnParticle(forced = false) {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: Math.random() * -0.6 - 0.1,
        life: 0,
        maxLife: Math.random() * 180 + 120,
        // bioluminescence: cyan or indigo
        hue: Math.random() > 0.5 ? 190 : 220,
        sat: Math.floor(Math.random() * 20 + 80),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        born: forced ? 0 : Math.floor(Math.random() * 60),
      }
    }

    resize()
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(spawnParticle(false))

    // Wave lines — horizontal sinusoidal bands
    let waveOffset = 0

    function drawWaves() {
      for (let band = 0; band < 4; band++) {
        const yBase = h * (0.2 + band * 0.2)
        const amp = 18 + band * 8
        const freq = 0.005 - band * 0.0005
        const speed = (band + 1) * 0.4
        ctx.beginPath()
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= w; x += 4) {
          const y = yBase + Math.sin(x * freq + waveOffset * speed) * amp
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(34,211,238,${0.04 - band * 0.008})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      waveOffset += 0.012
      drawWaves()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        if (p.born > 0) { p.born--; continue }

        p.x += p.vx
        p.y += p.vy
        p.life++
        p.pulse += p.pulseSpeed

        const lifeRatio = p.life / p.maxLife
        const alphaPeak = Math.sin(lifeRatio * Math.PI)
        const pulse = 0.5 + 0.5 * Math.sin(p.pulse)
        const alpha = alphaPeak * pulse * 0.7

        // Glow
        const glowR = p.r * 4
        if (isFinite(p.x) && isFinite(p.y) && glowR > 0) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          glow.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, 75%, ${alpha})`)
          glow.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, 75%, 0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 88%, ${Math.min(alpha * 1.5, 0.9)})`
        ctx.fill()

        if (p.life >= p.maxLife) particles[i] = spawnParticle(true)
      }

      // Subtle horizontal depth-haze at top
      const haze = ctx.createLinearGradient(0, 0, 0, h * 0.25)
      haze.addColorStop(0, 'rgba(14,165,233,0.06)')
      haze.addColorStop(1, 'rgba(14,165,233,0)')
      ctx.fillStyle = haze
      ctx.fillRect(0, 0, w, h * 0.25)

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.7,
      }}
    />
  )
}
