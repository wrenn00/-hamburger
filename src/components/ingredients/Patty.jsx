// 🥩 패티 — 울퉁불퉁한 원기둥 (표면 노이즈는 색으로 표현)

export default function Patty({ color = '#4A1C00', variant = 'beef' }) {
  const r = 0.88
  const h = variant === 'chicken' ? 0.18 : 0.22

  return (
    <group>
      {/* 본체 */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 1.04, h, 36]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.02} />
      </mesh>
      {/* 구운 가장자리 (조금 더 어두운 링) */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[r * 0.97, h * 0.35, 6, 36]} />
        <meshStandardMaterial
          color={variant === 'chicken' ? '#8B6A20' : '#2A0E00'}
          roughness={1}
        />
      </mesh>
    </group>
  )
}
