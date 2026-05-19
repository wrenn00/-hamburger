// 🍞 빵
//
// BottomBun (type='bottom'):
//   짧은 실린더(CYLH) + 작은 타원 돔 → ╰─⌣─╯ 형태
//   총 높이 = CYLH + DOME_H = 0.25 + 0.10 = 0.35  (← data height 0.35)
//
// TopBun (type='top'):
//   타원 반구만! 실린더 없음 → ⌒ 형태
//   sphereGeometry (equator 평면이 바닥) + scaleY 로 높이 맞춤
//   총 높이 = 0.60  (← data height 0.60)

const BUN_R   = 1.20   // 빵 가로 반지름 (가로 폭 기준, 통일)
const BUN_CLR = '#D4A574'

// ── 참깨 (top bun 용) ─────────────────────────────────────────────────────
// sphere 표면 좌표를 scale 적용 후 위치 계산
function Sesame({ scaleY }) {
  const seeds = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const angle = (i / 8) * Math.PI * 2
    const r     = 0.5                                      // 분포 반지름
    const ox    = Math.cos(angle) * r
    const oz    = Math.sin(angle) * r
    const yRaw  = Math.sqrt(Math.max(0, BUN_R * BUN_R - r * r))  // sphere 표면 y (scale 전)
    const y     = yRaw * scaleY + 0.015                   // scale 후 + 살짝 띄움
    return { ox, oz, y }
  })

  return seeds.map(({ ox, oz, y }, i) => (
    <mesh key={i} position={[ox, y, oz]} scale={[0.04, 0.025, 0.065]} castShadow>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#F0E6C8" roughness={0.9} />
    </mesh>
  ))
}

export default function Bun({ type = 'bottom', color = BUN_CLR }) {

  // ── 빵 아래 ─────────────────────────────────────────────────────────────
  if (type === 'bottom') {
    const cylH  = 0.25
    const domeH = 0.10
    const domeScaleY = domeH / BUN_R   // 타원 돔 Y 배율

    return (
      <group>
        {/* 바닥 실린더: y 0 → cylH */}
        <mesh position={[0, cylH / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[BUN_R, BUN_R * 1.04, cylH, 32]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
        {/* 작은 타원 돔: 실린더 꼭대기 위에 얹혀서 윗면 봉긋 */}
        <mesh position={[0, cylH, 0]} scale={[1, domeScaleY, 1]} castShadow>
          <sphereGeometry args={[BUN_R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      </group>
    )
  }

  // ── 빵 위 ────────────────────────────────────────────────────────────────
  // 타원 반구만: cylinder 없음
  // sphere center = local y=0 (= group 바닥)
  // equator (y=0) → 평평한 아랫면 (바닥)
  // north pole (y=BUN_R) × scaleY → 꼭대기 y=0.60
  const bunTopH  = 0.60
  const scaleY   = bunTopH / BUN_R   // 0.60 / 1.20 = 0.50

  return (
    <group>
      <mesh scale={[1, scaleY, 1]} castShadow receiveShadow>
        <sphereGeometry args={[BUN_R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <Sesame scaleY={scaleY} />
    </group>
  )
}
