import { Canvas } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import BgScene from './BgScene'
import HtmlSections from './HtmlSections'

export default function World3D() {
  const scrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '600vh', background: '#010812' }}>
      {/* Fixed 3D canvas — sits behind everything */}
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        camera={{ position: [0, 2, 20], fov: 55, near: 0.1, far: 300 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <BgScene scrollY={scrollY} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            intensity={2.2}
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>

      {/* Scrollable HTML on top */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <HtmlSections />
      </div>
    </div>
  )
}
