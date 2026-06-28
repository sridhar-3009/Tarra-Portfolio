import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars, Grid } from '@react-three/drei'
import * as THREE from 'three'
import ZoneIsland from './ZoneIsland'

function CameraController({ zones, activeZone }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 22, 32))
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const zone = zones.find((z) => z.id === activeZone)
    if (!zone) return
    targetPos.current.set(...zone.camera.pos)
    lookAtTarget.current.set(...zone.camera.target)
  }, [activeZone, zones])

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.038)
    currentLookAt.current.lerp(lookAtTarget.current, 0.038)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

function PathLines({ zones }) {
  const geometry = useMemo(() => {
    const points = zones.map((z) => new THREE.Vector3(z.position[0], -1.8, z.position[2]))
    const curve = new THREE.CatmullRomCurve3(points)
    const curvePoints = curve.getPoints(120)
    return new THREE.BufferGeometry().setFromPoints(curvePoints)
  }, [zones])

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#00E5A018' }))} />
  )
}

function FloatingParticles() {
  const count = 60
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = Math.random() * 20 - 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20
    }
    return arr
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#00E5A0" size={0.08} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

export default function Scene3D({ zones, activeZone, onZoneClick }) {
  return (
    <>
      <CameraController zones={zones} activeZone={activeZone} />

      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[20, 30, 20]} intensity={0.35} color="#ffffff" />
      <pointLight position={[0, 30, 0]} color="#00E5A0" intensity={0.6} distance={100} />
      <pointLight position={[-20, 15, -20]} color="#00C8FF" intensity={0.3} distance={60} />
      <pointLight position={[20, 15, -20]} color="#8B5CF6" intensity={0.3} distance={60} />

      {/* Star field */}
      <Stars radius={130} depth={80} count={4500} factor={3.5} saturation={0} fade speed={0.25} />

      {/* Floating micro-particles */}
      <FloatingParticles />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -27]} receiveShadow>
        <planeGeometry args={[180, 140]} />
        <meshStandardMaterial color="#020B16" roughness={1} metalness={0} />
      </mesh>

      {/* Tron-style neon grid */}
      <Grid
        position={[0, -1.96, -27]}
        args={[180, 140]}
        cellSize={3}
        cellThickness={0.4}
        cellColor="#00E5A012"
        sectionSize={12}
        sectionThickness={0.7}
        sectionColor="#00E5A028"
        fadeDistance={100}
        fadeStrength={1.4}
        infiniteGrid
      />

      {/* Dashed path between zones */}
      <PathLines zones={zones} />

      {/* Zone islands */}
      {zones.map((zone) => (
        <ZoneIsland
          key={zone.id}
          zone={zone}
          isActive={activeZone === zone.id}
          onClick={() => onZoneClick(zone.id)}
        />
      ))}

      {/* Depth fog */}
      <fog attach="fog" args={['#020810', 65, 170]} />
    </>
  )
}
