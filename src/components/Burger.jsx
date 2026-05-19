// 🍔 햄버거 조립체
//
// [수정] animated.group position-y → useRef + useFrame 직접 업데이트
//   - animated.group 은 Three.js property 업데이트를 보장하지 않음
//   - useFrame 에서 groupRef.current.position.y = val 로 직접 세팅
//
// [스택 순서]
//   stack[0] = 도마 바로 위 (가장 아래)
//   stack[N] = 맨 위
//   baseY = PLATE_TOP + 이전 재료들 height 누적합

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBurgerStore } from '../store/useBurgerStore'
import Bun from './ingredients/Bun'
import Patty from './ingredients/Patty'
import Lettuce from './ingredients/Lettuce'
import HamsterTopping from './ingredients/HamsterTopping'

// CuttingBoard cylinder height=0.16, center y=0 → top y=0.08
const PLATE_TOP = 0.08
export { PLATE_TOP }  // BurgerScene의 CameraRig 에서도 사용

function IngredientMesh({ def }) {
  const { meshType, color, modelPath } = def
  if (meshType === 'bun_bottom') return <Bun type="bottom" color={color} />
  if (meshType === 'bun_top')    return <Bun type="top"    color={color} />
  if (meshType === 'patty')         return <Patty color={color} variant="beef" />
  if (meshType === 'patty_chicken') return <Patty color={color} variant="chicken" />
  if (meshType === 'hamster')       return <HamsterTopping modelPath={modelPath} />
  return <Lettuce meshType={meshType} color={color} />
}

// ── 개별 레이어 ────────────────────────────────────────────────────────────
// useRef + useFrame spring physics (overshoot 없는 critically-damped 스프링)
function IngredientLayer({ uid, def, baseY }) {
  const removeIngredient = useBurgerStore((s) => s.removeIngredient)
  const groupRef = useRef()

  // spring state: pos(현재위치), vel(속도), target(목표위치)
  const spring = useRef({
    pos: def.isHamster ? baseY : baseY + 5, // 햄스터 = 제자리, 나머지 = 위에서 낙하
    vel: 0,
    target: baseY,
  })

  // baseY 바뀌면 (아래 재료 제거 시) target 업데이트
  useEffect(() => {
    spring.current.target = baseY
  }, [baseY])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const s = spring.current
    const clampDt = Math.min(dt, 0.05)

    // k=260 (스프링 강성), b=30 (감쇠) → 거의 critically-damped, 미세 바운스
    const acc = -260 * (s.pos - s.target) - 30 * s.vel
    s.vel += acc * clampDt
    s.pos += s.vel * clampDt

    // 직접 Three.js position 업데이트 (animated.group 없이)
    groupRef.current.position.y = s.pos
  })

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); removeIngredient(uid) }}
    >
      <IngredientMesh def={def} />
    </group>
  )
}

// ── 전체 햄버거 ────────────────────────────────────────────────────────────
export default function Burger() {
  const stack = useBurgerStore((s) => s.stack)

  // stack[0] = 도마 바로 위 (baseY=PLATE_TOP)
  // stack[i+1] = stack[i] 위 (baseY 누적)
  let currentH = PLATE_TOP
  const layers = stack.map(({ uid, def }) => {
    const baseY = currentH
    currentH += def.height
    return { uid, def, baseY }
  })

  return (
    <group>
      {layers.map(({ uid, def, baseY }) => (
        <IngredientLayer key={uid} uid={uid} def={def} baseY={baseY} />
      ))}
    </group>
  )
}
