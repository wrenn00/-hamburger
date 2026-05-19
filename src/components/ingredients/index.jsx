// ── 통일 규칙 ────────────────────────────────────────────────────────────────
// 모든 컴포넌트: { height, color? } 수신
// 로컬 좌표: 바닥 y=0, 꼭대기 y=height
// 메쉬 center 공식: position={[0, height/2, 0]}
// 부모 group이 world position을 담당 (스택 baseY)
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useBurgerStore } from '../../store/useBurgerStore'

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

// ── 양파링 — 도넛 2개 (바깥 + 안쪽), 살구빛 베이지 ──────────────────────────
export function Onion({ height = 0.10 }) {
  const tubeR = height / 2  // 튜브 반지름 = height/2 → 전체 두께 = height
  return (
    <group position={[0, height / 2, 0]}>
      {/* 바깥 링 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.90, tubeR, 16, 32]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.50} />
      </mesh>
      {/* 안쪽 링 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.50, tubeR * 0.80, 16, 32]} />
        <meshStandardMaterial color="#EBD5BD" roughness={0.50} />
      </mesh>
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

// ── 계란프라이 — 흰자(큰 납작 원) + 불규칙 가장자리 + 노른자(볼록 구체) ────────
// Math.random() 사용 시 매 렌더마다 달라지지 않도록 고정 오프셋 사용
const EGG_BLOB_ANGLES = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2 + 0.3)
const EGG_BLOB_RADII  = [1.05, 1.15, 1.00, 1.18, 1.08]

export function Egg({ height = 0.15 }) {
  const whiteH = height * 0.55
  const blobH  = height * 0.60
  const yolkR  = height * 0.42
  return (
    <group>
      {/* 흰자 본체 */}
      <mesh position={[0, whiteH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.10, 1.10, whiteH, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.60} />
      </mesh>

      {/* 불규칙 가장자리 블롭 */}
      {EGG_BLOB_ANGLES.map((angle, i) => {
        const r = EGG_BLOB_RADII[i]
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, whiteH / 2, Math.sin(angle) * r]}
            scale={[0.30, blobH, 0.30]}
            castShadow
          >
            <sphereGeometry args={[1, 10, 10]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.60} />
          </mesh>
        )
      })}

      {/* 노른자 — 흰자 위에 봉긋 */}
      <mesh position={[0, whiteH + yolkR * 0.55, 0]} castShadow>
        <sphereGeometry args={[yolkR, 24, 24]} />
        <meshStandardMaterial color="#FFC93C" roughness={0.40} emissive="#FFA500" emissiveIntensity={0.10} />
      </mesh>
    </group>
  )
}

// ── 햄스터 GLB ───────────────────────────────────────────────────────────────
// 스케일 기준: 가로폭(max of x,z) → TARGET_WIDTH
// 스케일 후 실제 Y 높이 측정 → store 업데이트 → Burger.jsx 스택 자동 보정
const TARGET_WIDTH = 2.2  // 빵 지름(2.4)에 근접한 가로폭

function HamsterModel({ scene, uid }) {
  const updateHeight = useBurgerStore((s) => s.updateStackItemHeight)

  const { cloned, actualHeight } = useMemo(() => {
    const c = scene.clone(true)

    c.traverse(child => {
      if (child.isMesh) { child.castShadow = true; child.receiveShadow = true }
    })

    // 스케일 초기화
    c.scale.set(1, 1, 1)
    c.position.set(0, 0, 0)

    const box1 = new THREE.Box3().setFromObject(c)
    const size = box1.getSize(new THREE.Vector3())

    // 가로폭(x, z 중 큰 값) 기준으로 스케일 → 빵 폭에 맞춤
    const horizDim = Math.max(size.x, size.z)
    if (horizDim > 0) c.scale.setScalar(TARGET_WIDTH / horizDim)

    // 스케일 후 실제 높이 측정
    const box2 = new THREE.Box3().setFromObject(c)
    const measuredH = box2.max.y - box2.min.y

    // 바닥을 y=0으로 정렬
    c.position.y = -box2.min.y

    return { cloned: c, actualHeight: measuredH }
  }, [scene])

  // 실제 높이를 store에 보고 → Burger.jsx 스택 재계산 → 위 재료 spring 이동
  useEffect(() => {
    if (actualHeight > 0 && uid) updateHeight(uid, actualHeight)
  }, [actualHeight]) // eslint-disable-line

  return <primitive object={cloned} />
}

export function HamsterTopping({ height = 1.0, modelPath, uid }) {
  const { scene } = useGLTF(modelPath)
  return (
    <Suspense fallback={null}>
      <HamsterModel scene={scene} uid={uid} />
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
