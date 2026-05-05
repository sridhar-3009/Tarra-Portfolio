import { useEffect, useRef } from 'react'

const NODE_COUNT = 70
const MAX_DIST = 140
const MOUSE_RADIUS = 180
const MOUSE_FORCE = 0.012

function rand(min, max) { return Math.random() * (max - min) + min }

export default function NeuralCanvas() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const nodesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    // Initialise nodes
    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      r: rand(1.5, 3.5),
      pulse: rand(0, Math.PI * 2), // phase offset for glow pulse
    }))

    const COLORS = ['#8B5CF6', '#06B6D4', '#A78BFA', '#67E8F9']

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const nodes = nodesRef.current
      const mx = mouse.current.x
      const my = mouse.current.y
      const t = performance.now() * 0.001

      // Update positions
      nodes.forEach(n => {
        // Mouse attraction
        const dx = mx - n.x
        const dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE
          n.vx += dx / dist * force
          n.vy += dy / dist * force
        }

        // Damping
        n.vx *= 0.985
        n.vy *= 0.985

        n.x += n.vx
        n.y += n.vy

        // Wrap around edges
        if (n.x < -10) n.x = W + 10
        if (n.x > W + 10) n.x = -10
        if (n.y < -10) n.y = H + 10
        if (n.y > H + 10) n.y = -10
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > MAX_DIST) continue

          const alpha = (1 - dist / MAX_DIST) * 0.35
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Draw nodes
      nodes.forEach((n, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + n.pulse)
        const glow = n.r * 4 * pulse
        const color = COLORS[i % COLORS.length]

        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow)
        grad.addColorStop(0, color + '55')
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * (0.85 + 0.15 * pulse), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = 0.7 + 0.3 * pulse
        ctx.fill()
        ctx.globalAlpha = 1
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  )
}
