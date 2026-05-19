// 🥩 패티 — bottom-based

export default function Patty({ color = '#4A1C00', variant = 'beef' }) {
  const r = 0.88
  const h = variant === 'chicken' ? 0.22 : 0.26

  return (
    <group>
      {/* 본체 — 바닥 y=0, 중심 y=h/2 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 1.04, h, 36]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* 구운 가장자리 링 */}
      <mesh position={[0, h / 2, 0]}>
        <torusGeometry args={[r * 0.97, h * 0.28, 6, 36]} />
        <meshStandardMaterial color={variant === 'chicken' ? '#8B6A20' : '#2A0E00'} roughness={1} />
      </mesh>
    </group>
  )
}
