import { Suspense, useState, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows, Environment } from '@react-three/drei'

function MiniHamsterModel({ path }) {
  const { scene } = useGLTF(path)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

function MiniPlate({ color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[1.2, 64]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

export default function HamsterCard({ hamster, onClick, index }) {
  const [hovered, setHovered] = useState(false)
  const [jumping, setJumping] = useState(false)
  const jumpTimerRef = useRef(null)

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current)
    setJumping(true)
    jumpTimerRef.current = setTimeout(() => setJumping(false), 550)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
  }, [])

  return (
    <div
      className="fade-slide-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 ${jumping ? 'card-jump' : ''}`}
        style={{
          width: 210,
          boxShadow: hovered
            ? `0 20px 40px ${hamster.color}88, 0 0 0 3px ${hamster.color}`
            : '0 6px 24px rgba(0,0,0,0.10)',
          transform: hovered && !jumping ? 'scale(1.04)' : undefined,
          transition: 'box-shadow 0.3s, transform 0.3s',
          background: `linear-gradient(160deg, ${hamster.bgFrom} 0%, ${hamster.bgTo} 100%)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(hamster.id)}
      >
        {/* 미니 Canvas */}
        <div style={{ height: 200, position: 'relative' }}>
          <Canvas
            shadows
            camera={{ position: [0, 1.8, 3.5], fov: 42 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.7} color="#FFF8F0" />
            <directionalLight
              position={[3, 5, 3]}
              intensity={1.2}
              castShadow
              color="#FFE8C0"
            />
            <Suspense fallback={null}>
              <MiniHamsterModel path={hamster.file} />
              <MiniPlate color={hamster.bgTo} />
              <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.3}
                scale={3}
                blur={1.5}
                far={3}
                color="#6B4226"
              />
              <Environment preset="sunset" />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate
              autoRotateSpeed={hovered ? 3.5 : 1.2}
            />
          </Canvas>
        </div>

        {/* 정보 카드 */}
        <div
          className="px-4 pb-4 pt-2 text-center"
          style={{ fontFamily: "'Jua', sans-serif" }}
        >
          <div className="text-2xl mb-1">{hamster.emoji}</div>
          <div
            className="text-base font-bold mb-0.5"
            style={{ color: '#3D2C00' }}
          >
            {hamster.name}
          </div>
          <div
            className="text-xs leading-snug"
            style={{ color: '#7A5C2A' }}
          >
            {hamster.title}
          </div>
        </div>

        {/* 호버 시 떠오르는 "선택하기" 뱃지 */}
        {hovered && (
          <div
            className="float-up absolute inset-x-0 bottom-3 flex justify-center pointer-events-none"
          >
            <span
              className="px-4 py-1 rounded-full text-xs font-bold text-white shadow-md"
              style={{ background: hamster.color, fontFamily: "'Jua', sans-serif" }}
            >
              선택하기 ✨
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
