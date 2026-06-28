import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

// Camera waypoints for each section (matched to HtmlSections scroll positions)
const WAYPOINTS = [
  { pos: [0, 1, 20], look: [0, 0, 0] },       // Hero     (0%)
  { pos: [-4, 3, 5], look: [0, 1, -10] },      // About    (20%)
  { pos: [4, 6, -14], look: [0, 2, -25] },     // Projects (40%)
  { pos: [-3, 2, -30], look: [0, 1, -42] },    // Exp      (60%)
  { pos: [0, 0, -50], look: [0, 0, -60] },     // Contact  (80%)
]

function lerpWaypoints(t, waypoints) {
  const n = waypoints.length - 1
  const scaled = Math.max(0, Math.min(1, t)) * n
  const i = Math.min(Math.floor(scaled), n - 1)
  const f = scaled - i
  const a = waypoints[i]
  const b = waypoints[i + 1]
  return {
    pos: a.pos.map((v, k) => THREE.MathUtils.lerp(v, b.pos[k], f)),
    look: a.look.map((v, k) => THREE.MathUtils.lerp(v, b.look[k], f)),
  }
}

// ── Orbital rings (Hero) ────────────────────────────────────────────────────
function OrbitalRings() {
  const g1 = useRef(), g2 = useRef(), g3 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (g1.current) { g1.current.rotation.x = t * 0.22; g1.current.rotation.y = t * 0.14 }
    if (g2.current) { g2.current.rotation.x = -t * 0.18; g2.current.rotation.z = t * 0.10 }
    if (g3.current) { g3.current.rotation.y = t * 0.20; g3.current.rotation.z = -t * 0.12 }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={g1}>
        <torusGeometry args={[4.5, 0.055, 12, 80]} />
        <meshStandardMaterial color="#00E5A0" emissive="#00E5A0" emissiveIntensity={3} />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[6.2, 0.04, 10, 80]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={2.5} />
      </mesh>
      <mesh ref={g3}>
        <torusGeometry args={[8.0, 0.03, 8, 80]} />
        <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={2} />
      </mesh>
      {/* Center glow sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
      </mesh>
      <pointLight color="#00E5A0" intensity={3} distance={20} />
    </group>
  )
}

// ── Neural network (About) ──────────────────────────────────────────────────
function NeuralNet({ position }) {
  const nodes = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 6,
      color: ['#00E5A0', '#8B5CF6', '#0EA5E9', '#F59E0B'][i % 4],
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  const edges = useMemo(() => {
    const e = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.sqrt(
          (nodes[i].x - nodes[j].x) ** 2 +
          (nodes[i].y - nodes[j].y) ** 2
        )
        if (d < 6) e.push([i, j])
      }
    }
    return e
  }, [nodes])

  const meshRefs = useRef([])
  const lineRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    nodes.forEach((n, i) => {
      if (meshRefs.current[i]) {
        meshRefs.current[i].position.y = n.y + Math.sin(t * n.speed + n.phase) * 0.4
        const pulse = 0.8 + Math.sin(t * n.speed * 2 + n.phase) * 0.2
        meshRefs.current[i].material.emissiveIntensity = pulse * 2
      }
    })

    // Rebuild edge geometry
    if (lineRef.current) {
      const pts = []
      edges.forEach(([a, b]) => {
        const na = meshRefs.current[a]
        const nb = meshRefs.current[b]
        if (na && nb) {
          pts.push(na.position.clone(), nb.position.clone())
        }
      })
      if (pts.length > 0) {
        lineRef.current.geometry.setFromPoints(pts)
      }
    }
  })

  return (
    <group position={position}>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          position={[n.x, n.y, n.z]}
        >
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry ref={lineRef} />
        <lineBasicMaterial color="#00E5A0" transparent opacity={0.22} />
      </lineSegments>
    </group>
  )
}

// ── Floating project cubes (Projects) ───────────────────────────────────────
const PROJECT_COLORS = ['#00E5A0', '#8B5CF6', '#0EA5E9', '#F59E0B', '#FF6B8A', '#34D399']

function ProjectCubes({ position }) {
  const refs = useRef([])
  const layout = useMemo(
    () =>
      PROJECT_COLORS.map((color, i) => ({
        x: ((i % 3) - 1) * 5.5,
        y: i < 3 ? 2 : -2.5,
        color,
        speed: 0.25 + i * 0.08,
        phase: (i / PROJECT_COLORS.length) * Math.PI * 2,
      })),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.x = t * layout[i].speed * 0.6
      m.rotation.y = t * layout[i].speed
      m.position.y = layout[i].y + Math.sin(t * 0.4 + layout[i].phase) * 0.5
    })
  })

  return (
    <group position={position}>
      {layout.map((l, i) => (
        <group key={i} position={[l.x, l.y, 0]}>
          {/* Wireframe outer */}
          <mesh ref={(el) => (refs.current[i] = el)}>
            <boxGeometry args={[1.6, 1.6, 1.6]} />
            <meshStandardMaterial
              color={l.color}
              emissive={l.color}
              emissiveIntensity={0.3}
              roughness={0.1}
              metalness={0.9}
              wireframe={false}
              transparent
              opacity={0.15}
            />
          </mesh>
          {/* Glowing edges */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.6, 1.6, 1.6)]} />
            <lineBasicMaterial color={l.color} />
          </lineSegments>
          <pointLight color={l.color} intensity={2} distance={8} />
        </group>
      ))}
    </group>
  )
}

// ── Experience spiral (Experience) ──────────────────────────────────────────
const EXP_COLORS = ['#A100FF', '#10B981', '#F59E0B', '#EF4444']

function ExperienceSpiral({ position }) {
  const sphereRefs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    sphereRefs.current.forEach((m, i) => {
      if (!m) return
      m.material.emissiveIntensity = 1.5 + Math.sin(t * 1.2 + i * 1.2) * 0.8
    })
  })

  const points = useMemo(
    () =>
      EXP_COLORS.map((_, i) => ({
        x: Math.sin((i / EXP_COLORS.length) * Math.PI * 2) * 3,
        y: 3 - i * 2,
        z: Math.cos((i / EXP_COLORS.length) * Math.PI * 2) * 1.5,
      })),
    []
  )

  const lineGeom = useMemo(() => {
    const pts = points.map((p) => new THREE.Vector3(p.x, p.y, p.z))
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [points])

  return (
    <group position={position}>
      {/* Connecting line */}
      <primitive
        object={
          new THREE.Line(
            lineGeom,
            new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12 })
          )
        }
      />

      {points.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]}>
          {/* Glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.7, 0.04, 8, 32]} />
            <meshStandardMaterial
              color={EXP_COLORS[i]}
              emissive={EXP_COLORS[i]}
              emissiveIntensity={2}
            />
          </mesh>
          {/* Center sphere */}
          <mesh ref={(el) => (sphereRefs.current[i] = el)}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial
              color={EXP_COLORS[i]}
              emissive={EXP_COLORS[i]}
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight color={EXP_COLORS[i]} intensity={3} distance={6} />
        </group>
      ))}
    </group>
  )
}

// ── Contact pulsing icosahedron (Contact) ────────────────────────────────────
function ContactSphere({ position }) {
  const outerRef = useRef()
  const innerRef = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.12
      outerRef.current.rotation.y = t * 0.18
      outerRef.current.material.emissiveIntensity = 0.6 + Math.sin(t * 1.5) * 0.4
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.22
      innerRef.current.material.emissiveIntensity = 2 + Math.sin(t * 2) * 1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Outer wireframe icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[3.5, 1]} />
        <meshStandardMaterial
          color="#00E5A0"
          emissive="#00E5A0"
          emissiveIntensity={0.6}
          wireframe
        />
      </mesh>
      {/* Inner solid */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00E5A0"
          emissiveIntensity={2}
          roughness={0}
          metalness={1}
        />
      </mesh>
      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.5, 0.05, 8, 60]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={3} />
      </mesh>
      <pointLight color="#00E5A0" intensity={5} distance={25} />
      <pointLight color="#8B5CF6" intensity={3} distance={18} position={[0, 4, 0]} />
    </group>
  )
}

// ── Ambient floating particles (always visible) ──────────────────────────────
function AmbientParticles() {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(350 * 3)
    for (let i = 0; i < 350; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60
      arr[i * 3 + 2] = (Math.random() - 0.5) * 100 - 25
    }
    return arr
  }, [])

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00E5A0"
        size={0.07}
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  )
}

// ── Camera controller ────────────────────────────────────────────────────────
function CameraRig({ scrollY }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 20))
  const targetLook = useRef(new THREE.Vector3(0, 0, 0))
  const currentLook = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const t = maxScroll > 0 ? scrollY.current / maxScroll : 0

    const { pos, look } = lerpWaypoints(t, WAYPOINTS)
    targetPos.current.set(...pos)
    targetLook.current.set(...look)

    camera.position.lerp(targetPos.current, 0.045)
    currentLook.current.lerp(targetLook.current, 0.045)
    camera.lookAt(currentLook.current)
  })

  return null
}

// ── Root scene ───────────────────────────────────────────────────────────────
export default function BgScene({ scrollY }) {
  return (
    <>
      <CameraRig scrollY={scrollY} />

      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <directionalLight position={[10, 20, 10]} intensity={0.3} />

      {/* Stars */}
      <Stars radius={140} depth={80} count={5000} factor={3} saturation={0} fade speed={0.2} />

      {/* Ambient floating particles */}
      <AmbientParticles />

      {/* Section set-pieces — each at a different Z depth */}
      <OrbitalRings />
      <NeuralNet position={[2, 1, -12]} />
      <ProjectCubes position={[0, 2, -26]} />
      <ExperienceSpiral position={[-2, 1, -43]} />
      <ContactSphere position={[0, 0, -60]} />

      {/* Depth fog */}
      <fog attach="fog" args={['#010812', 60, 200]} />
    </>
  )
}
