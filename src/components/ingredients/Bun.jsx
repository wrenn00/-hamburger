// 🍞 빵 — geometry 높이 = data height 정확히 일치
//
// bottom bun: CYLH=0.12 + 반구(R=0.40, thetaLen=PI/2)
//   → 실린더 0..0.12 + 돔 0.12..0.52  → total = 0.52 ✓
//
// top bun: CYLH=0.12 + 큰 반구(R=0.50, thetaLen=PI*0.55)
//   → 실린더 0..0.12 + 돔 꼭대기 0.12+0.50=0.62 → total = 0.62 ✓
//   (thetaLen > PI/2 이면 돔이 실린더 안으로 약간 파고들어 이음새 없어 보임)

const CYLH = 0.12   // 바닥 실린더 높이 (공통)
const CYL_R = 0.92  // 실린더 반지름

// 참깨: 돔 표면 위 배치
// 구 중심 = (0, CYLH, 0), 표면 y = CYLH + sqrt(R²−ox²−oz²)
const SESAME = [
  [0.22, 0.16], [-0.20, 0.18], [0.06, -0.22],
  [-0.10, 0.06], [0.18, -0.10],
]

export default function Bun({ type = 'bottom', color = '#D4936A' }) {
  const R        = type === 'bottom' ? 0.40 : 0.50
  const thetaLen = type === 'bottom' ? Math.PI * 0.50 : Math.PI * 0.55

  return (
    <group>
      {/* 실린더: 바닥 y=0, 중심 y=CYLH/2, 꼭대기 y=CYLH */}
      <mesh position={[0, CYLH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[CYL_R, CYL_R * 0.96, CYLH, 48]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>

      {/* 돔: 구 중심 = 실린더 꼭대기(CYLH) */}
      {/* thetaLen=PI/2(반구) → 돔 바닥=CYLH, 돔 꼭대기=CYLH+R */}
      <mesh position={[0, CYLH, 0]} castShadow>
        <sphereGeometry args={[R, 32, 16, 0, Math.PI * 2, 0, thetaLen]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* 참깨: 돔 표면 위에 정확히 배치 */}
      {SESAME.map(([ox, oz], i) => {
        const r2 = ox * ox + oz * oz
        if (r2 >= R * R) return null
        const surfY = CYLH + Math.sqrt(R * R - r2) + 0.012
        return (
          <mesh key={i} position={[ox, surfY, oz]} castShadow>
            <sphereGeometry args={[0.030, 6, 6]} />
            <meshStandardMaterial color="#F0EBD0" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}
