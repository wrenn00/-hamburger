// 🥩 패티 — 납작한 원기둥 (bottom-based: y=0 바닥, y=h 꼭대기)
// beef h=0.28 / chicken h=0.22

export default function Patty({ color = '#5C2C0C', variant = 'beef' }) {
  const h = variant === 'chicken' ? 0.22 : 0.28
  const c = variant === 'chicken' ? '#C8915A' : (color ?? '#5C2C0C')

  return (
    <group>
      {/* 본체: 아랫면이 살짝 넓어서 구운 느낌 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.08, 1.12, h, 32]} />
        <meshStandardMaterial color={c} roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  )
}
