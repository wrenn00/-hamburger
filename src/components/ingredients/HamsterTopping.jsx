// 🐹 햄스터 GLB — bounding box 정규화 + scale 0→1 등장 애니메이션
// [수정] animated.group scale → useRef + useFrame 직접 업데이트

import { Suspense, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const TARGET_HEIGHT = 1.0  // data height 와 일치

function HamsterModel({ modelPath }) {
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // 스케일 초기화 후 실제 크기 측정
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)

    const box  = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) scene.scale.setScalar(TARGET_HEIGHT / maxDim)

    // 바닥을 y=0 에 맞춤 (bottom-based 스택과 정합)
    box.setFromObject(scene)
    scene.position.y = -box.min.y
  }, [scene])

  return <primitive object={scene} />
}

export default function HamsterTopping({ modelPath }) {
  const groupRef = useRef()
  const scaleRef = useRef(0)  // 0 → 1 로 lerp

  useFrame((_, dt) => {
    if (!groupRef.current) return
    scaleRef.current += (1 - scaleRef.current) * Math.min(dt * 14, 1)
    const s = scaleRef.current
    groupRef.current.scale.set(s, s, s)
  })

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <HamsterModel modelPath={modelPath} />
      </Suspense>
    </group>
  )
}
