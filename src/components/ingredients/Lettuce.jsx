// 🥬 야채 & 토핑 — meshType 에 따라 분기

export default function Lettuce({ meshType, color }) {

  if (meshType === 'lettuce') {
    return (
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.08, 1.12, 0.07, 32]} />
        <meshStandardMaterial color={color ?? '#4CAF50'} roughness={0.8} side={2} />
      </mesh>
    )
  }

  if (meshType === 'tomato') {
    return (
      <group>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.80, 0.80, 0.09, 32]} />
          <meshStandardMaterial color={color ?? '#E53935'} roughness={0.6} />
        </mesh>
        {/* 씨방 */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.38,
            0.01,
            Math.sin((i / 4) * Math.PI * 2) * 0.38,
          ]}>
            <cylinderGeometry args={[0.10, 0.10, 0.09, 12]} />
            <meshStandardMaterial color="#FFCDD2" roughness={0.7} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'onion') {
    return (
      <group>
        {[0.72, 0.50, 0.30].map((r, i) => (
          <mesh key={i} castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.055, 8, 32]} />
            <meshStandardMaterial
              color={color ?? '#F8BBD9'}
              roughness={0.6}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'pickle') {
    return (
      <group>
        {[[-0.25, 0, -0.05], [0.1, 0, 0.15], [-0.05, 0, -0.25]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 20]} />
            <meshStandardMaterial color={color ?? '#388E3C'} roughness={0.75} />
          </mesh>
        ))}
      </group>
    )
  }

  if (meshType === 'cheese') {
    return (
      <mesh castShadow receiveShadow rotation={[0, Math.PI / 5, 0]}>
        <boxGeometry args={[1.72, 0.06, 1.72]} />
        <meshStandardMaterial color={color ?? '#FFC107'} roughness={0.5} metalness={0.05} />
      </mesh>
    )
  }

  if (meshType === 'bacon') {
    return (
      <group>
        {[[-0.16, 0, 0], [0.16, 0, 0]].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow rotation={[0, i * 0.18, 0]}>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
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
    return (
      <group>
        {/* 흰자 */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
          <meshStandardMaterial color="#FFFDE7" roughness={0.5} />
        </mesh>
        {/* 노른자 */}
        <mesh position={[0, 0.09, 0]} castShadow>
          <sphereGeometry args={[0.20, 16, 16]} />
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

  // fallback: flat disk
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.80, 0.80, 0.07, 32]} />
      <meshStandardMaterial color={color ?? '#888'} roughness={0.7} />
    </mesh>
  )
}
