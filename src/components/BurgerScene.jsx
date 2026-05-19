import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { useBurgerStore } from '../store/useBurgerStore'
import Burger from './Burger'

const PLATE_TOP = 0.08  // CuttingBoard 윗면 (height 0.16 / 2)

// ── 카메라 target을 버거 세로 중앙으로 부드럽게 추적 ──────────────────────
// OrbitControls.target.y를 버거 높이 절반으로 lerp
// → 재료가 쌓일수록 카메라가 자동으로 올라가며 전체 스택을 유지
function CameraRig() {
  const controlsRef = useRef()
  const stack = useBurgerStore((s) => s.stack)

  const totalH = stack.reduce((sum, { def }) => sum + def.height, 0)
  const midY   = PLATE_TOP + totalH / 2  // 버거 세로 중앙

  useFrame(() => {
    if (!controlsRef.current) return
    // lerp speed 0.06 — 부드럽고 빠른 추적
    controlsRef.current.target.y +=
      (midY - controlsRef.current.target.y) * 0.06
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={3}
      maxDistance={16}
      minPolarAngle={Math.PI / 10}
      maxPolarAngle={Math.PI / 2.05}
      autoRotate
      autoRotateSpeed={0.7}
    />
  )
}

// ── 원형 나무 도마 ──────────────────────────────────────────────────────────
function CuttingBoard() {
  return (
    <group>
      <mesh receiveShadow>
        <cylinderGeometry args={[2.4, 2.2, 0.16, 64]} />
        <meshStandardMaterial color="#8B6340" roughness={0.88} />
      </mesh>
      {[0.6, 1.1, 1.6, 2.0].map((r, i) => (
        <mesh key={i} position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.04, 64]} />
          <meshStandardMaterial color="#6B4A28" roughness={0.9} transparent opacity={0.35} />
        </mesh>
      ))}
      <mesh position={[2.6, 0, 0]} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
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
      camera={{ position: [0, 4.5, 7], fov: 38 }}
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
        <ContactShadows
          position={[0, 0.09, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={4}
          color="#5C3A1A"
        />
        <Environment preset="sunset" />
      </Suspense>

      {/* useFrame을 쓰는 컴포넌트는 Canvas 안에서만 사용 가능 */}
      <CameraRig />
    </Canvas>
  )
}
