import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

export default function ZoneIsland({ zone, isActive, onClick }) {
  const platformRef = useRef()
  const topFaceRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (platformRef.current) {
      const target = isActive ? 0.32 + Math.sin(t * 2.2) * 0.07 : hovered ? 0.16 : 0.04
      platformRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        platformRef.current.material.emissiveIntensity,
        target,
        0.07
      )
    }

    if (topFaceRef.current) {
      const target = isActive ? 0.7 + Math.sin(t * 2) * 0.15 : hovered ? 0.35 : 0.08
      topFaceRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        topFaceRef.current.material.emissiveIntensity,
        target,
        0.07
      )
      topFaceRef.current.material.opacity = THREE.MathUtils.lerp(
        topFaceRef.current.material.opacity,
        isActive ? 0.55 : hovered ? 0.25 : 0.1,
        0.07
      )
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.008
      const target = isActive ? 3.5 + Math.sin(t * 3) * 0.5 : hovered ? 1.5 : 0.4
      ringRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        ringRef.current.material.emissiveIntensity,
        target,
        0.06
      )
    }
  })

  const setCursor = (val) => {
    document.body.style.cursor = val
  }

  // Corner gem positions around hexagonal platform
  const gemPositions = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6
    return [Math.cos(angle) * 4.35, -0.3, Math.sin(angle) * 4.35]
  })

  return (
    <group position={zone.position}>
      <Float speed={1.4} rotationIntensity={0} floatIntensity={isActive ? 0.55 : 0.25}>
        {/* Main hexagonal platform */}
        <mesh
          ref={platformRef}
          position={[0, -1.2, 0]}
          onClick={onClick}
          onPointerOver={() => { setHovered(true); setCursor('pointer') }}
          onPointerOut={() => { setHovered(false); setCursor('auto') }}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[3.85, 4.5, 1.8, 6]} />
          <meshStandardMaterial
            color={isActive ? '#0C1D2E' : '#07101C'}
            emissive={zone.color}
            emissiveIntensity={0.04}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* Glowing top face */}
        <mesh
          ref={topFaceRef}
          position={[0, -0.28, 0]}
          rotation={[0, Math.PI / 6, 0]}
          onClick={onClick}
          onPointerOver={() => { setHovered(true); setCursor('pointer') }}
          onPointerOut={() => { setHovered(false); setCursor('auto') }}
        >
          <cylinderGeometry args={[3.82, 3.82, 0.04, 6]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={0.08}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Rotating glow ring */}
        <mesh ref={ringRef} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.05, 0.065, 8, 40]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Second static ring */}
        <mesh position={[0, -1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.48, 0.04, 6, 36]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={isActive ? 1.5 : 0.2}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Corner octahedron gems */}
        {gemPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial
              color={zone.color}
              emissive={zone.color}
              emissiveIntensity={isActive ? 4.5 : 0.5}
              metalness={1}
              roughness={0}
            />
          </mesh>
        ))}
      </Float>

      {/* Zone label — floats above platform */}
      <Float speed={1.6} rotationIntensity={0} floatIntensity={0.45}>
        <Text
          position={[0, 3.4, 0]}
          fontSize={0.62}
          color={isActive ? zone.color : 'rgba(255,255,255,0.55)'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
          onClick={onClick}
          onPointerOver={() => { setHovered(true); setCursor('pointer') }}
          onPointerOut={() => { setHovered(false); setCursor('auto') }}
        >
          {zone.label}
        </Text>

        {/* Zone number */}
        <Text
          position={[0, 2.55, 0]}
          fontSize={0.2}
          color={isActive ? `${zone.color}99` : 'rgba(255,255,255,0.18)'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
        >
          {String(
            ['home', 'about', 'projects', 'experience', 'contact'].indexOf(zone.id) + 1
          ).padStart(2, '0')}
        </Text>
      </Float>

      {/* Active: light cone + vertical beam */}
      {isActive && (
        <>
          <pointLight color={zone.color} intensity={5} distance={22} position={[0, 6, 0]} />

          {/* Upward light beam */}
          <mesh position={[0, 12, 0]}>
            <cylinderGeometry args={[0.04, 1.2, 26, 8, 1, true]} />
            <meshStandardMaterial
              color={zone.color}
              emissive={zone.color}
              emissiveIntensity={2}
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Ground glow disk */}
          <mesh position={[0, -1.94, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[5, 32]} />
            <meshStandardMaterial
              color={zone.color}
              emissive={zone.color}
              emissiveIntensity={1}
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  )
}
