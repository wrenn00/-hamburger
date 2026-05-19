// 🐹 햄스터 GLB — bounding box 정규화 → TARGET_HEIGHT=1.0 (data height와 일치)
// 바닥이 y=0에 오도록 모델 이동 → bottom-based 스택과 정합

import { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'

const TARGET_HEIGHT = 1.0  // data/ingredients.js 의 hamster height와 동일

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

    // 1) scale 초기화
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)

    // 2) bounding box로 실제 크기 측정
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    // 3) TARGET_HEIGHT에 맞춰 균일 스케일
    if (maxDim > 0) scene.scale.setScalar(TARGET_HEIGHT / maxDim)

    // 4) 정규화 후 바닥을 y=0으로 이동 (bottom-based 정합)
    box.setFromObject(scene)
    scene.position.y = -box.min.y
  }, [scene])

  return <primitive object={scene} />
}

export default function HamsterTopping({ modelPath }) {
  // 뿅! 등장 — scale 0 → 1 spring
  const [{ s }, api] = useSpring(() => ({
    s: 0,
    config: { mass: 0.8, tension: 340, friction: 18 },
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
