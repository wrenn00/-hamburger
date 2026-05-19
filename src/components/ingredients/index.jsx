// ── 통일 규칙 ────────────────────────────────────────────────────────────────
// 모든 컴포넌트: { height, color? } 수신
// 로컬 좌표: 바닥 y=0, 꼭대기 y=height
// 메쉬 center 공식: position={[0, height/2, 0]}
// 부모 group이 world position을 담당 (스택 baseY)
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const BUN_R = 1.20  // 빵 가로 반지름 (모든 재료 폭 기준)

// ── 빵 아래 — 짧은 실린더 + 살짝 봉긋한 타원 돔 ────────────────────────────
export function BottomBun({ height = 0.35, color = '#D4A574' }) {
  const cylH  = height * 0.72   // 실린더 부분
  const domeH = height * 0.28   // 돔 부분
  return (
    <group>
      <mesh position={[0, cylH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[BUN_R, BUN_R * 1.04, cylH, 32]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
      {/* 타원 돔: scaleY = domeH/BUN_R, sphere equator y=0 → top y=domeH */}
      <mesh position={[0, cylH, 0]} scale={[1, domeH / BUN_R, 1]} castShadow>
        <sphereGeometry args={[BUN_R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.75} />
      </mesh>
    </group>
  )
}

// ── 빵 위 — 타원 반구만 (실린더 없음!) ──────────────────────────────────────
export function TopBun({ height = 0.50, color = '#D4A574' }) {
  const scaleY = height / BUN_R  // north pole y = BUN_R * scaleY = height ✓
  const seedAngles = [0, 1, 2, 3, 4, 5, 6, 7].map(i => (i / 8) * Math.PI * 2)

  return (
    <group>
      {/* sphere equator y=0 (바닥), north pole y=height (꼭대기) */}
      <mesh scale={[1, scaleY, 1]} castShadow receiveShadow>
        <sphereGeometry args={[BUN_R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      {/* 참깨: sphere 표면 좌표 × scaleY */}
      {seedAngles.map((a, i) => {
        const r  = 0.52
        const ox = Math.cos(a) * r
        const oz = Math.sin(a) * r
        const y  = Math.sqrt(Math.max(0, BUN_R * BUN_R - r * r)) * scaleY + 0.012
        return (
          <mesh key={i} position={[ox, y, oz]} scale={[0.04, 0.025, 0.065]} castShadow>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#F0E6C8" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

// ── 패티 — 납작한 원기둥 (torus 없음) ───────────────────────────────────────
export function Patty({ height = 0.25, color = '#5C2C0C' }) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.10, 1.14, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.90} metalness={0.02} />
    </mesh>
  )
}

// ── 양상추 — 빵보다 넓게, 가장자리 삐져나옴 ─────────────────────────────────
export function Lettuce({ height = 0.12, color = '#4CAF50' }) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.28, 1.32, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.85} side={2} />
    </mesh>
  )
}

// ── 토마토 — 슬라이스 + 씨방 ────────────────────────────────────────────────
export function Tomato({ height = 0.10, color = '#E53935' }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.05, height, 32]} />
        <meshStandardMaterial color={color} roughness={0.60} />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[
          Math.cos((i / 4) * Math.PI * 2) * 0.40,
          height / 2,
          Math.sin((i / 4) * Math.PI * 2) * 0.40,
        ]}>
          <cylinderGeometry args={[0.09, 0.09, height, 10]} />
          <meshStandardMaterial color="#FFCDD2" roughness={0.70} />
        </mesh>
      ))}
    </group>
  )
}

// ── 양파링 — 눕힌 torus 3개 (rotation으로 수평) ─────────────────────────────
export function Onion({ height = 0.10, color = '#F8BBD9' }) {
  const tubeR = height / 2  // tube 지름 = height, 중심 y = height/2
  return (
    <group>
      {[0.70, 0.48, 0.28].map((r, i) => (
        <mesh key={i} position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[r, tubeR, 8, 32]} />
          <meshStandardMaterial color={color} roughness={0.60} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  )
}

// ── 피클 — 작은 원기둥 3조각 ────────────────────────────────────────────────
export function Pickle({ height = 0.08, color = '#388E3C' }) {
  return (
    <group>
      {[[-0.24, -0.05], [0.13, 0.19], [-0.05, -0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, height / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.20, 0.20, height, 20]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
    </group>
  )
}

// ── 치즈 — 회전된 사각 판, 모서리 삐져나옴 ──────────────────────────────────
export function Cheese({ height = 0.06, color = '#FFC107' }) {
  return (
    <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI / 5, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.0, height, 2.0]} />
      <meshStandardMaterial color={color} roughness={0.50} metalness={0.05} />
    </mesh>
  )
}

// ── 베이컨 — 두 줄 긴 판 ────────────────────────────────────────────────────
export function Bacon({ height = 0.08, color = '#EF9A9A' }) {
  return (
    <group>
      {[[-0.14, 0], [0.14, 0.20]].map(([ox, rot], i) => (
        <mesh key={i} position={[ox, height / 2, 0]} rotation={[0, rot, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.60, height, 0.45]} />
          <meshStandardMaterial color={i === 0 ? color : '#C62828'} roughness={0.78} />
        </mesh>
      ))}
    </group>
  )
}

// ── 계란프라이 — 흰자 원기둥 + 노른자 구체 ──────────────────────────────────
export function Egg({ height = 0.15 }) {
  const whiteH = height * 0.55
  const yolkR  = (height - whiteH) / 2  // yolk: top = whiteH + 2*yolkR = height ✓
  return (
    <group>
      <mesh position={[0, whiteH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.70, 0.70, whiteH, 32]} />
        <meshStandardMaterial color="#FFFDE7" roughness={0.50} />
      </mesh>
      <mesh position={[0, whiteH + yolkR, 0]} castShadow>
        <sphereGeometry args={[yolkR, 14, 14]} />
        <meshStandardMaterial color="#FFC107" roughness={0.40} emissive="#FF8F00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// ── 햄스터 GLB — bbox 정규화 → height에 맞춤, 바닥 y=0 ──────────────────────
function HamsterModel({ scene, height }) {
  const normalized = useMemo(() => {
    const cloned = scene.clone(true)

    cloned.traverse(child => {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true }
    })

    // 스케일 초기화 후 측정
    cloned.scale.set(1, 1, 1)
    cloned.position.set(0, 0, 0)
    const box  = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) cloned.scale.setScalar(height / maxDim)

    // 바닥을 y=0으로 정렬
    box.setFromObject(cloned)
    cloned.position.y = -box.min.y

    return cloned
  }, [scene, height])

  return <primitive object={normalized} />
}

export function HamsterTopping({ height = 0.60, modelPath }) {
  const { scene } = useGLTF(modelPath)
  return (
    <Suspense fallback={null}>
      <HamsterModel scene={scene} height={height} />
    </Suspense>
  )
}

// ── 컴포넌트 매핑 (meshType → 컴포넌트) ────────────────────────────────────
export const INGREDIENT_COMPONENTS = {
  bun_bottom:    BottomBun,
  bun_top:       TopBun,
  patty:         Patty,
  patty_chicken: Patty,
  lettuce:       Lettuce,
  tomato:        Tomato,
  onion:         Onion,
  pickle:        Pickle,
  cheese:        Cheese,
  bacon:         Bacon,
  egg:           Egg,
  hamster:       HamsterTopping,
}
