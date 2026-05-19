// 🍔 햄버거 조립체 — spring drop-in + 클릭 제거

import { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useBurgerStore } from '../store/useBurgerStore'
import Bun from './ingredients/Bun'
import Patty from './ingredients/Patty'
import Lettuce from './ingredients/Lettuce'
import HamsterTopping from './ingredients/HamsterTopping'

// ── 재료 타입 → 3D 컴포넌트 분기 ──────────────────────────
function IngredientMesh({ def }) {
  const { meshType, color, modelPath, hamsterScale } = def

  if (meshType === 'bun_bottom') return <Bun type="bottom" color={color} />
  if (meshType === 'bun_top')    return <Bun type="top"    color={color} />
  if (meshType === 'patty')         return <Patty color={color} variant="beef" />
  if (meshType === 'patty_chicken') return <Patty color={color} variant="chicken" />
  if (meshType === 'hamster')
    return <HamsterTopping modelPath={modelPath} scale={hamsterScale ?? 0.52} />

  // lettuce / tomato / onion / pickle / cheese / bacon / egg / …
  return <Lettuce meshType={meshType} color={color} />
}

// ── 개별 레이어 — drop-in spring 애니메이션 ──────────────
function IngredientLayer({ uid, def, targetY }) {
  const removeIngredient = useBurgerStore((s) => s.removeIngredient)

  const [{ posY }, api] = useSpring(() => ({
    posY: def.isHamster ? targetY : targetY + 5, // 햄스터는 제자리 등장
    config: { mass: 1.1, tension: 270, friction: 22 },
  }))

  useEffect(() => {
    api.start({ posY: targetY })
  }, [targetY])

  return (
    <animated.group
      position-y={posY}
      onClick={(e) => {
        e.stopPropagation()
        removeIngredient(uid)
      }}
    >
      <IngredientMesh def={def} />
    </animated.group>
  )
}

// ── 전체 햄버거 ─────────────────────────────────────────
const PLATE_TOP = 0.10

export default function Burger() {
  const stack = useBurgerStore((s) => s.stack)

  let currentH = PLATE_TOP
  const layers = stack.map(({ uid, def }) => {
    const targetY = currentH + def.height / 2
    currentH += def.height
    return { uid, def, targetY }
  })

  return (
    <group>
      {layers.map(({ uid, def, targetY }) => (
        <IngredientLayer key={uid} uid={uid} def={def} targetY={targetY} />
      ))}
    </group>
  )
}
