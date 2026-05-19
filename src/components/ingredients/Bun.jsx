// 🍞 빵 — bottom-based (y=0이 바닥, y=height가 꼭대기)
// 실린더(CYLH) + 반구(R) → 전체 높이 = CYLH + R = 0.22 + 0.95 = 1.17

const CYLH = 0.22   // 바닥 실린더 높이
const R    = 0.95   // 돔 반지름 (= 실린더 반지름)

// 참깨: 돔 표면(ox, oz) 위치 계산
//   구 중심 y = CYLH, 표면 y = CYLH + sqrt(R²-ox²-oz²)
const SESAME = [
  [0.28, 0.20], [-0.26, 0.22], [0.08, -0.28],
  [-0.14, 0.08], [0.20, -0.12],
]

export default function Bun({ type = 'bottom', color = '#D4936A' }) {
  // bottom bun: 반구(PI*0.50) — 돔이 실린더 위에 딱 얹힘
  // top bun  : 더 볼록한 반구(PI*0.58) — 더 둥글게
  const thetaLen = type === 'bottom' ? Math.PI * 0.50 : Math.PI * 0.58

  return (
    <group>
      {/* 실린더 — 바닥 y=0, 중심 y=CYLH/2, 꼭대기 y=CYLH */}
      <mesh position={[0, CYLH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R * 0.94, CYLH, 48]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>

      {/* 돔 — 구 중심을 실린더 꼭대기(CYLH)에 배치 */}
      {/* thetaLen=PI*0.5(반구)이면 돔 바닥이 정확히 실린더 위에 이어짐 */}
      <mesh position={[0, CYLH, 0]} castShadow>
        <sphereGeometry args={[R, 32, 16, 0, Math.PI * 2, 0, thetaLen]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* 참깨 — 돔 표면 위에 배치 */}
      {SESAME.map(([ox, oz], i) => {
        const r2 = ox * ox + oz * oz
        const surfY = CYLH + Math.sqrt(Math.max(0, R * R - r2)) + 0.015
        return (
          <mesh key={i} position={[ox, surfY, oz]} castShadow>
            <sphereGeometry args={[0.038, 6, 6]} />
            <meshStandardMaterial color="#F5F0DC" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}
