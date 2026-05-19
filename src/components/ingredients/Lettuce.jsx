// 🥬 야채 & 토핑 — 모두 geometry height = data height 정확히 일치
// 바닥 y=0, 꼭대기 y=height
//
// lettuce : cylinder h=0.10 → center y=0.05
// tomato  : cylinder h=0.12 → center y=0.06
// onion   : torus tube_r=0.06 → height=0.12, center y=0.06
// pickle  : cylinder h=0.08 → center y=0.04
// cheese  : box h=0.07 → center y=0.035
// bacon   : box h=0.10 → center y=0.05
// egg     : white cyl h=0.10 (0..0.10) + yolk sphere r=0.08 center=0.14 → top=0.22

export default function Lettuce({ meshType, color }) {

  if (meshType === 'lettuce') {
    return (
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.10, 0.10, 32]} />
        <meshStandardMaterial color={color ?? '#4CAF50'} roughness={0.8} side={2} />
      </mesh>
    )
  }

  if (meshType === 'tomato') {
    return (
      <group>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.12, 32]} />
          <meshStandardMaterial color={color ?? '#E53935'} roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.36,
            0.06,
            Math.sin((i / 4) * Math.PI * 2) * 0.36,
          ]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 10]} />
            <meshStandardMaterial color="#FFCDD2" roughness={0.7} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'onion') {
    // torus: tube_r=0.06 → 지름=0.12 → height=0.12, center y=0.06
    return (
      <group>
        {[0.70, 0.48, 0.28].map((r, i) => (
          <mesh key={i} position={[0, 0.06, 0]} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.06, 8, 32]} />
            <meshStandardMaterial
              color={color ?? '#F8BBD9'}
              roughness={0.6}
              transparent
              opacity={0.88}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'pickle') {
    return (
      <group>
        {[[-0.24, -0.04], [0.12, 0.18], [-0.04, -0.24]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.04, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.20, 0.20, 0.08, 20]} />
            <meshStandardMaterial color={color ?? '#388E3C'} roughness={0.75} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'cheese') {
    // box h=0.07, center y=0.035, 약간 회전해서 모서리 삐져나옴
    return (
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow rotation={[0, Math.PI / 5, 0]}>
        <boxGeometry args={[1.75, 0.07, 1.75]} />
        <meshStandardMaterial color={color ?? '#FFC107'} roughness={0.5} metalness={0.05} />
      </mesh>
    )
  }

  if (meshType === 'bacon') {
    // 두 줄 베이컨, h=0.10, center y=0.05
    return (
      <group>
        {[[-0.14, 0], [0.14, 0.20]].map(([ox, rot], i) => (
          <mesh key={i} position={[ox, 0.05, 0]} castShadow receiveShadow rotation={[0, rot, 0]}>
            <boxGeometry args={[1.55, 0.10, 0.45]} />
            <meshStandardMaterial
              color={i === 0 ? (color ?? '#EF9A9A') : '#C62828'}
              roughness={0.78}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'egg') {
    // height = 0.22
    // 흰자: cylinder h=0.10 (0..0.10)
    // 노른자: sphere r=0.08, center y=0.14 (0.10+0.04), top y=0.14+0.08=0.22 ✓
    return (
      <group>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.10, 32]} />
          <meshStandardMaterial color="#FFFDE7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.08, 14, 14]} />
          <meshStandardMaterial
            color="#FFC107"
            roughness={0.4}
            emissive="#FF8F00"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    )
  }

  // fallback
  return (
    <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.80, 0.80, 0.08, 32]} />
      <meshStandardMaterial color={color ?? '#888'} roughness={0.7} />
    </mesh>
  )
}
