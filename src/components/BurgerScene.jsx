// 도마 윗면 = y=0 (cylinder h=0.20, center y=-0.10)
// 재료 스택은 y=0 에서 위로 쌓임

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { useBurgerStore } from '../store/useBurgerStore'
import Burger from './Burger'

// ── 카메라: target=버거 1/4 높이, 거리는 버거 높이에 비례 줌아웃 ─────────────
function CameraRig() {
  const controlsRef = useRef()
  const stack = useBurgerStore((s) => s.stack)

  const totalH  = stack.reduce((sum, { def }) => sum + def.height, 0)
  const targetY = Math.max(0.4, totalH * 0.28)
  const radius  = Math.max(7, totalH * 2.0 + 4)

  useFrame(() => {
    if (!controlsRef.current) return
    const c = controlsRef.current
    c.target.y += (targetY - c.target.y) * 0.05
    const cam    = c.object
    const offset = cam.position.clone().sub(c.target)
    const cur    = offset.length()
    const next   = cur + (radius - cur) * 0.04
    cam.position.copy(c.target.clone().add(offset.normalize().multiplyScalar(next)))
    c.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={4}
      maxDistance={30}
      minPolarAngle={Math.PI / 10}
      maxPolarAngle={Math.PI / 2.1}
      autoRotate
      autoRotateSpeed={0.7}
    />
  )
}

// ── 원형 도마 — 윗면 정확히 y=0 ─────────────────────────────────────────────
// cylinder h=0.20, center y=-0.10 → top = 0, bottom = -0.20
function CuttingBoard() {
  return (
    <group>
      <mesh position={[0, -0.10, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.2, 0.20, 64]} />
        <meshStandardMaterial color="#8B6340" roughness={0.88} />
      </mesh>
      {/* 나무결 링 — 윗면(y=0) */}
      {[0.6, 1.1, 1.6, 2.0].map((r, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.04, 64]} />
          <meshStandardMaterial color="#6B4A28" roughness={0.9} transparent opacity={0.35} />
        </mesh>
      ))}
      {/* 손잡이 */}
      <mesh position={[2.6, -0.10, 0]} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.30, 1.0, 24]} />
        <meshStandardMaterial color="#7A5530" roughness={0.85} />
      </mesh>
    </group>
  )
}

export default function BurgerScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 10], fov: 45 }}
      gl={{ alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} color="#FFF5E6" />
      <directionalLight
        position={[5, 9, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        color="#FFE8C8"
      />
      <pointLight position={[-4, 5, -3]} intensity={0.4} color="#FFD580" />

      <Suspense fallback={null}>
        <CuttingBoard />
        <Burger />
        {/* 그림자는 도마 윗면(y=0) 위에 */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={4}
          color="#5C3A1A"
        />
        <Environment preset="sunset" />
      </Suspense>

      <CameraRig />
    </Canvas>
  )
}
