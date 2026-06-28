import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Scene3D from './Scene3D'
import WorldPanel from './WorldPanel'
import { personal } from '../../data/personal'

export const ZONES = [
  {
    id: 'home',
    label: 'HOME',
    position: [0, 0, 0],
    color: '#00E5A0',
    camera: { pos: [0, 22, 32], target: [0, 0, 0] },
  },
  {
    id: 'about',
    label: 'ABOUT',
    position: [-15, 0, -18],
    color: '#00C8FF',
    camera: { pos: [-15, 18, -4], target: [-15, 0, -18] },
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    position: [15, 0, -18],
    color: '#8B5CF6',
    camera: { pos: [15, 18, -4], target: [15, 0, -18] },
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    position: [0, 0, -36],
    color: '#F59E0B',
    camera: { pos: [0, 18, -22], target: [0, 0, -36] },
  },
  {
    id: 'contact',
    label: 'CONTACT',
    position: [0, 0, -54],
    color: '#FF6B8A',
    camera: { pos: [0, 18, -40], target: [0, 0, -54] },
  },
]

export default function World3D() {
  const [activeZone, setActiveZone] = useState('home')
  const [panelOpen, setPanelOpen] = useState(false)

  const handleZoneClick = useCallback(
    (zoneId) => {
      if (zoneId === activeZone && panelOpen) {
        setPanelOpen(false)
      } else {
        setActiveZone(zoneId)
        setPanelOpen(true)
      }
    },
    [activeZone, panelOpen]
  )

  const handleClose = useCallback(() => setPanelOpen(false), [])

  useEffect(() => {
    const zoneIds = ZONES.map((z) => z.id)
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setPanelOpen(false)
        return
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setPanelOpen((prev) => !prev)
        return
      }
      const idx = zoneIds.indexOf(activeZone)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveZone(zoneIds[(idx - 1 + zoneIds.length) % zoneIds.length])
        setPanelOpen(false)
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActiveZone(zoneIds[(idx + 1) % zoneIds.length])
        setPanelOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeZone])

  const activeZoneData = ZONES.find((z) => z.id === activeZone)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#020810',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 22, 32], fov: 50, near: 0.1, far: 300 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <Scene3D zones={ZONES} activeZone={activeZone} onZoneClick={handleZoneClick} />
        </Suspense>
      </Canvas>

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(2,8,16,0.92) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            color: '#00E5A0',
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
          }}
        >
          {personal.name}
        </span>
        <div style={{ display: 'flex', gap: '20px', pointerEvents: 'all' }}>
          <Link
            to="/blog"
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '11px',
              textDecoration: 'none',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}
          >
            Blog
          </Link>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '11px',
              textDecoration: 'none',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#fff')}
            onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.45)')}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Left zone indicator dots */}
      <div
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 10,
        }}
      >
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id
          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              title={zone.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              <div
                style={{
                  width: isActive ? 10 : 5,
                  height: isActive ? 10 : 5,
                  borderRadius: '50%',
                  background: isActive ? zone.color : 'rgba(255,255,255,0.18)',
                  boxShadow: isActive
                    ? `0 0 8px ${zone.color}, 0 0 18px ${zone.color}50`
                    : 'none',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              />
              {isActive && (
                <span
                  style={{
                    color: zone.color,
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {zone.label}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active zone label — bottom center */}
      <motion.div
        key={activeZone}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '58px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: activeZoneData?.color,
          fontSize: '10px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          zIndex: 10,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ▸ {activeZoneData?.label}
      </motion.div>

      {/* Keyboard hint */}
      <AnimatePresence>
        {!panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '26px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.2)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              zIndex: 10,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            click zone · enter to open · ←→ to navigate
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content panel */}
      <WorldPanel activeZone={activeZone} isOpen={panelOpen} onClose={handleClose} />
    </div>
  )
}
