import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'

function HamsterModel({ path }) {
  const { scene } = useGLTF(path)

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

function GroundPlate() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <circleGeometry args={[1.4, 64]} />
      <meshStandardMaterial
        color="#F5DEB3"
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  )
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#FFB347" wireframe />
    </mesh>
  )
}

export default function HamsterScene({ modelPath }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 4], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} color="#FFF5E6" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        color="#FFE4B5"
      />
      <pointLight position={[-3, 3, -3]} intensity={0.4} color="#FFD700" />

      <Suspense fallback={<Loader />}>
        <HamsterModel path={modelPath} />
        <GroundPlate />
        <ContactShadows
          position={[0, -0.005, 0]}
          opacity={0.4}
          scale={4}
          blur={2}
          far={4}
          color="#8B6914"
        />
        <Environment preset="sunset" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </Canvas>
  )
}
