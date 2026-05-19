// 🍞 빵 — 납작 실린더 + 돔 구체 + 참깨 점들

const SESAME_POSITIONS = [
  [0.28, 0.22], [-0.28, 0.18], [0.10, -0.25],
  [-0.12, 0.10], [0.22, -0.10],
]

function Sesame({ ox, oz, domeR, domeY }) {
  const angle = Math.atan2(oz, ox)
  const dist = Math.sqrt(ox * ox + oz * oz)
  const y = domeY + Math.sqrt(Math.max(0, domeR * domeR - dist * dist))
  return (
    <mesh position={[ox, y + 0.01, oz]} castShadow>
      <sphereGeometry args={[0.038, 6, 6]} />
      <meshStandardMaterial color="#F5F0DC" roughness={0.9} />
    </mesh>
  )
}

export default function Bun({ type = 'bottom', color = '#D4936A' }) {
  const isBottom = type === 'bottom'
  const baseH = 0.18
  const domeR = 0.95
  // bottom bun: small dome. top bun: tall dome
  const domeOpenAngle = isBottom ? Math.PI * 0.40 : Math.PI * 0.58
  const domeY = isBottom ? baseH * 0.1 : baseH * 0.05

  return (
    <group>
      {/* 기둥 */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[domeR, domeR * 0.94, baseH, 48]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>

      {/* 돔 */}
      <mesh position={[0, domeY, 0]} castShadow>
        <sphereGeometry
          args={[domeR, 32, 16, 0, Math.PI * 2, 0, domeOpenAngle]}
        />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>

      {/* 참깨 */}
      {SESAME_POSITIONS.map(([ox, oz], i) => (
        <Sesame key={i} ox={ox} oz={oz} domeR={domeR} domeY={domeY} />
      ))}
    </group>
  )
}
