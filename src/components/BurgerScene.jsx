import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import Burger from './Burger'

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
        shadow-camera-far={30}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
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

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </Canvas>
  )
}
