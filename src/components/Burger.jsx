// 🍔 햄버거 조립체 — bottom-based 스택 + spring drop-in + 클릭 제거
//
// 스택 로직:
//   baseY = 이전 재료들의 height 누적합 + PLATE_TOP
//   다음 재료 baseY += def.height
//   group.position.y = baseY → geometry 바닥이 바로 이전 재료 꼭대기에 닿음

import { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/three'
import { useBurgerStore } from '../store/useBurgerStore'
import Bun from './ingredients/Bun'
import Patty from './ingredients/Patty'
import Lettuce from './ingredients/Lettuce'
import HamsterTopping from './ingredients/HamsterTopping'

// CuttingBoard: cylinderGeometry args=[2.4, 2.2, 0.16] → 중심 y=0 → 윗면 y=0.08
const PLATE_TOP = 0.08

function IngredientMesh({ def }) {
  const { meshType, color, modelPath } = def
  if (meshType === 'bun_bottom') return <Bun type="bottom" color={color} />
  if (meshType === 'bun_top')    return <Bun type="top"    color={color} />
  if (meshType === 'patty')         return <Patty color={color} variant="beef" />
  if (meshType === 'patty_chicken') return <Patty color={color} variant="chicken" />
  if (meshType === 'hamster')       return <HamsterTopping modelPath={modelPath} />
  return <Lettuce meshType={meshType} color={color} />
}

// ── 레이어: group을 baseY에 위치 → 기하 바닥이 baseY ──────────────────────
function IngredientLayer({ uid, def, baseY }) {
  const removeIngredient = useBurgerStore((s) => s.removeIngredient)

  // 햄스터는 제자리 등장(scale spring), 일반 재료는 위에서 낙하
  const startY = def.isHamster ? baseY : baseY + def.height * 2 + 3

  const [{ posY }, api] = useSpring(() => ({
    posY: startY,
    config: { mass: 1.1, tension: 270, friction: 22 },
  }))

  useEffect(() => {
    api.start({ posY: baseY })
  }, [baseY])

  return (
    <animated.group
      position-y={posY}
      onClick={(e) => { e.stopPropagation(); removeIngredient(uid) }}
    >
      <IngredientMesh def={def} />
    </animated.group>
  )
}

export default function Burger() {
  const stack = useBurgerStore((s) => s.stack)

  // 누적 높이 계산: 각 재료 바닥 = 아래 재료들의 height 합산
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
