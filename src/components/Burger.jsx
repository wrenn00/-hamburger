// 🍔 햄버거 조립체 — 완전 재작성
//
// 단일 규칙:
//   yCursor = 0 (도마 윗면 y=0 에서 시작)
//   각 재료 baseY = yCursor, 다음 재료 yCursor += def.height
//   IngredientLayer: group을 spring으로 baseY로 이동
//   내부 컴포넌트: 로컬 y=0(바닥) ~ y=height(꼭대기), mesh center = height/2

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useBurgerStore } from '../store/useBurgerStore'
import { INGREDIENT_COMPONENTS } from './ingredients/index'

// ── spring physics 레이어 ────────────────────────────────────────────────────
function IngredientLayer({ uid, def, baseY }) {
  const removeIngredient = useBurgerStore((s) => s.removeIngredient)
  const groupRef = useRef()

  // spring state
  const pos    = useRef(def.isHamster ? baseY : baseY + 4)
  const vel    = useRef(0)
  const target = useRef(baseY)

  useEffect(() => {
    target.current = baseY
  }, [baseY])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const cdt = Math.min(dt, 0.05)
    // k=260, b=30 → critically-damped (미세 바운스)
    const acc = -260 * (pos.current - target.current) - 30 * vel.current
    vel.current += acc * cdt
    pos.current += vel.current * cdt
    groupRef.current.position.y = pos.current
  })

  const Component = INGREDIENT_COMPONENTS[def.meshType]
  if (!Component) return null

  return (
    <group
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); removeIngredient(uid) }}
    >
      {/* uid는 HamsterTopping이 측정 후 store 업데이트에 사용 */}
      <Component
        height={def.height}
        color={def.color}
        modelPath={def.modelPath}
        uid={uid}
      />
    </group>
  )
}

// ── 전체 햄버거 ─────────────────────────────────────────────────────────────
export default function Burger() {
  const stack = useBurgerStore((s) => s.stack)

  // yCursor = 0 (도마 윗면 = y=0)
  let yCursor = 0
  const layers = stack.map(({ uid, def }) => {
    const baseY = yCursor
    yCursor += def.height
    return { uid, def, baseY }
  })

  // 스택 디버그 (개발 환경)
  useEffect(() => {
    if (stack.length === 0 || import.meta.env.PROD) return
    let y = 0
    console.groupCollapsed('🍔 Burger Stack')
    stack.forEach((item, i) => {
      console.log(`${i}: ${item.def.name} [${item.def.meshType}] bottom=${y.toFixed(2)} top=${(y + item.def.height).toFixed(2)}`)
      y += item.def.height
    })
    console.groupEnd()
  }, [stack])

  return (
    <group>
      {layers.map(({ uid, def, baseY }) => (
        <IngredientLayer key={uid} uid={uid} def={def} baseY={baseY} />
      ))}
    </group>
  )
}
