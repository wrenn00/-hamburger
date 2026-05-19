// 🥬 야채 & 토핑 — 모두 bottom-based (y=0 바닥, y=height 꼭대기)

export default function Lettuce({ meshType, color }) {

  if (meshType === 'lettuce') {
    // height = 0.08
    return (
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.08, 1.12, 0.08, 32]} />
        <meshStandardMaterial color={color ?? '#4CAF50'} roughness={0.8} side={2} />
      </mesh>
    )
  }

  if (meshType === 'tomato') {
    // height = 0.11
    return (
      <group>
        <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.80, 0.80, 0.11, 32]} />
          <meshStandardMaterial color={color ?? '#E53935'} roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.38,
            0.055,
            Math.sin((i / 4) * Math.PI * 2) * 0.38,
          ]}>
            <cylinderGeometry args={[0.10, 0.10, 0.11, 12]} />
            <meshStandardMaterial color="#FFCDD2" roughness={0.7} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'onion') {
    // height = 0.12 — torus 튜브 지름 0.11, 중심 y=0.06
    return (
      <group>
        {[0.72, 0.50, 0.30].map((r, i) => (
          <mesh key={i} position={[0, 0.06, 0]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.055, 8, 32]} />
            <meshStandardMaterial color={color ?? '#F8BBD9'} roughness={0.6} transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'pickle') {
    // height = 0.07 — 세 조각 배치
    return (
      <group>
        {[[-0.25, -0.05], [0.12, 0.16], [-0.04, -0.26]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.035, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.07, 20]} />
            <meshStandardMaterial color={color ?? '#388E3C'} roughness={0.75} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'cheese') {
    // height = 0.07, 정사각형 모서리 삐져나오게 회전
    return (
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow rotation={[0, Math.PI / 5, 0]}>
        <boxGeometry args={[1.72, 0.07, 1.72]} />
        <meshStandardMaterial color={color ?? '#FFC107'} roughness={0.5} metalness={0.05} />
      </mesh>
    )
  }

  if (meshType === 'bacon') {
    // height = 0.10
    return (
      <group>
        {[[-0.16, 0], [0.16, 0.18]].map(([ox, rot], i) => (
          <mesh key={i} position={[ox, 0.05, 0]} castShadow receiveShadow rotation={[0, rot, 0]}>
            <boxGeometry args={[1.52, 0.10, 0.44]} />
            <meshStandardMaterial color={i === 0 ? (color ?? '#EF9A9A') : '#C62828'} roughness={0.78} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'egg') {
    // height = 0.42
    // 흰자: h=0.12, r=0.65 (y: 0 → 0.12)
    // 노른자: r=0.16, center at 0.12+0.16=0.28 (y: 0.12 → 0.44 ≈ height)
    const whiteH = 0.12
    const yolkR  = 0.16
    return (
      <group>
        <mesh position={[0, whiteH / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, whiteH, 32]} />
          <meshStandardMaterial color="#FFFDE7" roughness={0.5} />
        </mesh>
        <mesh position={[0, whiteH + yolkR + 0.02, 0]} castShadow>
          <sphereGeometry args={[yolkR, 16, 16]} />
          <meshStandardMaterial color="#FFC107" roughness={0.4} emissive="#FF8F00" emissiveIntensity={0.2} />
        </mesh>
      </group>
    )
  }

  // fallback
  return (
    <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.80, 0.80, 0.07, 32]} />
      <meshStandardMaterial color={color ?? '#888'} roughness={0.7} />
    </mesh>
  )
}
