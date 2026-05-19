// 🥩 패티 — geometry height = data height 정확히 일치
// beef: h=0.28 / chicken: h=0.22
// cylinder center = h/2 → 바닥 y=0, 꼭대기 y=h ✓

export default function Patty({ color = '#4A1C00', variant = 'beef' }) {
  const h = variant === 'chicken' ? 0.22 : 0.28
  const r = 0.88

  return (
    <group>
      {/* 본체 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 1.04, h, 36]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* 구운 가장자리 (torus tube_r < h/2 이므로 cylinder 범위 안에 있음) */}
      <mesh position={[0, h / 2, 0]}>
        <torusGeometry args={[r * 0.97, h * 0.22, 6, 36]} />
        <meshStandardMaterial
          color={variant === 'chicken' ? '#8B6A20' : '#2A0E00'}
          roughness={1}
        />
      </mesh>
    </group>
  )
}
