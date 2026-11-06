import { RoundedBox } from '@react-three/drei'
import { MATERIAL_COLORS } from './materials.js'

const KEY_ROWS = [
  { z: 0.12, count: 8, width: 0.78 },
  { z: 0.23, count: 8, width: 0.82 },
  { z: 0.34, count: 7, width: 0.74 },
]

function TypewriterPaper() {
  return (
    <group position={[0, 0.82, -0.18]} rotation={[-0.22, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.56, 0.62, 0.012]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchment} roughness={0.96} />
      </mesh>
      {[-0.18, -0.08, 0.02, 0.12, 0.22].map((y, index) => (
        <mesh key={y} position={[0, y, 0.008]}>
          <boxGeometry args={[0.4 - index * 0.015, 0.004, 0.002]} />
          <meshStandardMaterial color={MATERIAL_COLORS.ink} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Typewriter blockout on the right side of the desk. The silhouette is
 * deliberately recognisable while remaining primitive geometry.
 */
export default function BlockoutTypewriter() {
  return (
    <group name="blockout-typewriter" position={[2.55, 1.06, 1.78]} rotation={[0, -0.22, 0]}>
      <RoundedBox args={[1.15, 0.34, 0.82]} radius={0.045} smoothness={3} position={[0, 0.17, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MATERIAL_COLORS.charcoal} roughness={0.62} metalness={0.15} />
      </RoundedBox>

      <mesh position={[0, 0.37, 0.02]} castShadow>
        <boxGeometry args={[1.0, 0.13, 0.62]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Carriage and roller */}
      <mesh position={[0, 0.5, -0.17]} castShadow>
        <boxGeometry args={[1.03, 0.14, 0.3]} />
        <meshStandardMaterial color={MATERIAL_COLORS.stoneDeep} roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.57, -0.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1.08, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.85} />
      </mesh>
      {[-0.57, 0.57].map((x) => (
        <mesh key={x} position={[x, 0.57, -0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 12]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.brass}
            metalness={0.65}
            roughness={0.4}
          />
        </mesh>
      ))}

      <TypewriterPaper />

      {/* Keys */}
      {KEY_ROWS.map((row) => (
        <group key={row.z} position={[0, 0.44, row.z]}>
          {Array.from({ length: row.count }, (_, index) => {
            const x = -row.width / 2 + (index * row.width) / (row.count - 1)
            return (
              <mesh key={index} position={[x, 0, 0]}>
                <cylinderGeometry args={[0.032, 0.032, 0.025, 10]} />
                <meshStandardMaterial
                  color={MATERIAL_COLORS.parchmentAged}
                  metalness={0.25}
                  roughness={0.55}
                />
              </mesh>
            )
          })}
        </group>
      ))}
      <mesh position={[0, 0.44, 0.43]}>
        <boxGeometry args={[0.48, 0.02, 0.05]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.6} />
      </mesh>

      {/* Feet */}
      {[
        [-0.46, 0.03, -0.3],
        [0.46, 0.03, -0.3],
        [-0.46, 0.03, 0.3],
        [0.46, 0.03, 0.3],
      ].map((position) => (
        <mesh key={position.join('-')} position={position}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.brass}
            metalness={0.6}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  )
}
