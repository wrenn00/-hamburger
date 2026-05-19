// 🐹 햄스터 GLB 재료 — 뿅! 등장 애니메이션 (스케일 + 점프)

import { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

function HamsterModel({ modelPath, scale }) {
  const { scene } = useGLTF(modelPath)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return <primitive object={scene} scale={scale} />
}

export default function HamsterTopping({ modelPath, scale = 0.52 }) {
  const [{ s, py }, api] = useSpring(() => ({
    s: 0,
    py: 0.3,
    config: { mass: 1, tension: 320, friction: 18 },
  }))

  useEffect(() => {
    // 뿅! : 0 → 1.25 → 1 (overshoot), y: 위에서 정착
    api.start({ s: 1, py: 0 })
  }, [])

  return (
    <animated.group scale-x={s} scale-y={s} scale-z={s} position-y={py}>
      <Suspense fallback={null}>
        <HamsterModel modelPath={modelPath} scale={scale} />
      </Suspense>
    </animated.group>
  )
}
