import { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useHamsterStore } from '../store'

function ChefHat({ y }) {
  return (
    <group position={[0, y, 0]}>
      {/* 챙 */}
      <mesh castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.07, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      {/* 본체 */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.30, 0.34, 0.60, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      {/* 빨간 밴드 */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.325, 0.325, 0.07, 32]} />
        <meshStandardMaterial color="#E53935" roughness={0.5} />
      </mesh>
    </group>
  )
}

function HamsterWithHat({ path }) {
  const { scene } = useGLTF(path)
  const groupRef = useRef()
  const clock = useRef(0)

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  const hatY = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    return box.max.y + 0.05
  }, [scene])

  useFrame((_, delta) => {
    clock.current += delta
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.current * 1.8) * 0.07
      groupRef.current.rotation.y = Math.sin(clock.current * 0.6) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <ChefHat y={hatY} />
    </group>
  )
}

function SpeechBubble({ message, color }) {
  return (
    <div
      className="float-up relative px-4 py-3 rounded-2xl text-sm leading-snug shadow-md"
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: `2px solid ${color}`,
        fontFamily: "'Jua', sans-serif",
        color: '#3D2C00',
        maxWidth: 200,
      }}
    >
      {message}
      {/* 꼬리 */}
      <div
        style={{
          position: 'absolute',
          bottom: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `12px solid ${color}`,
        }}
      />
    </div>
  )
}

export default function LeftHamsterPanel() {
  const { selectedHamster, hamsters, burgerStack, completed, getPersonality } = useHamsterStore()
  const hamster = hamsters.find((h) => h.id === selectedHamster)
  const personality = getPersonality()

  const [message, setMessage] = useState('')

  useEffect(() => {
    const getMessages = () => {
      if (completed) return personality.complete
      if (burgerStack.length === 0) return personality.idle
      return personality.add
    }

    const msgs = getMessages()
    const pick = () => msgs[Math.floor(Math.random() * msgs.length)]
    setMessage(pick())

    const interval = setInterval(() => setMessage(pick()), 3500)
    return () => clearInterval(interval)
  }, [burgerStack.length, completed, personality])

  if (!hamster) return null

  return (
    <div
      className="h-full flex flex-col items-center justify-center gap-4 p-4"
      style={{
        background: `linear-gradient(180deg, ${hamster.bgFrom}CC 0%, ${hamster.bgTo}99 100%)`,
        borderRight: `1px solid ${hamster.color}44`,
      }}
    >
      {/* 이름 뱃지 */}
      <div
        className="px-4 py-1 rounded-full text-sm font-bold shadow-sm"
        style={{
          background: hamster.color,
          color: '#fff',
          fontFamily: "'Jua', sans-serif",
        }}
      >
        {hamster.emoji} {hamster.name}
      </div>

      {/* 말풍선 */}
      {message && <SpeechBubble message={message} color={hamster.color} />}

      {/* 3D 햄스터 */}
      <div
        className="rounded-2xl overflow-hidden shadow-lg"
        style={{
          width: 220,
          height: 260,
          background: `radial-gradient(circle at 50% 70%, ${hamster.bgTo}88, transparent)`,
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.5, 3.2], fov: 44 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.7} color="#FFF8F0" />
          <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow color="#FFE8C0" />
          <Suspense fallback={null}>
            <HamsterWithHat path={hamster.file} />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.3} scale={3} blur={1.5} color="#6B4226" />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>
      </div>

      {/* 직함 */}
      <div
        className="text-center text-xs px-3 py-1 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.6)',
          color: hamster.color,
          fontFamily: "'Jua', sans-serif",
          backdropFilter: 'blur(6px)',
        }}
      >
        {hamster.title}
      </div>
    </div>
  )
}
