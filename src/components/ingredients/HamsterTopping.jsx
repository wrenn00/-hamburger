// 🐹 햄스터 GLB — bounding box 자동 정규화 → 높이 1.5 단위
// 뿅! 등장: scale 0→1 spring

import { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

const TARGET_HEIGHT = 1.5  // 햄버거 빵과 비슷한 크기

function HamsterModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    // 그림자 설정
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // bounding box로 실제 크기 측정 → TARGET_HEIGHT에 맞춰 정규화
    scene.scale.set(1, 1, 1)  // 먼저 초기화
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      const s = TARGET_HEIGHT / maxDim
      scene.scale.setScalar(s)
    }

    // 정규화 후 바닥이 y=0이 되도록 이동
    box.setFromObject(scene)
    scene.position.y -= box.min.y
  }, [scene])

  return <primitive object={scene} />
}

export default function HamsterTopping({ modelPath }) {
  const [{ s }, api] = useSpring(() => ({
    s: 0,
    config: { mass: 1, tension: 320, friction: 18 },
  }))

  useEffect(() => {
    api.start({ s: 1 })
  }, [])

  return (
    <animated.group scale-x={s} scale-y={s} scale-z={s}>
      <Suspense fallback={null}>
        <HamsterModel modelPath={modelPath} />
      </Suspense>
    </animated.group>
  )
}
