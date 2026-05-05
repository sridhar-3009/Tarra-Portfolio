import { useEffect, useRef } from 'react'

const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>?!'
const CHARS = KATAKANA + LATIN

export default function MatrixCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let w, h
    const FONT_SIZE = 15
    let cols, drops

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      cols = Math.floor(w / FONT_SIZE)
      drops = new Array(cols).fill(1).map(() => Math.random() * -60)
    }

    function draw() {
      // Fading trail
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      ctx.fillRect(0, 0, w, h)

      ctx.font = `${FONT_SIZE}px monospace`

      for (let i = 0; i < cols; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const y = drops[i] * FONT_SIZE

        // Head char — bright white/yellow-green
        if (y >= 0 && y < h) {
          ctx.fillStyle = '#CCFFCC'
          ctx.globalAlpha = 0.95
          ctx.fillText(char, i * FONT_SIZE, y)
        }

        // Random bright flash behind head
        const prevY = (drops[i] - 1) * FONT_SIZE
        if (prevY >= 0 && prevY < h && Math.random() > 0.7) {
          ctx.fillStyle = '#00FF41'
          ctx.globalAlpha = 0.6
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT_SIZE, prevY)
        }

        ctx.globalAlpha = 1

        // Reset drop at bottom + random restart
        if (drops[i] * FONT_SIZE > h && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }

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
        pointerEvents: 'none', zIndex: 0, opacity: 0.45,
      }}
    />
  )
}
