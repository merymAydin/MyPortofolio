import { MATERIAL_COLORS } from './materials.js'

const WALL_PANEL_X = [-6.3, -5.4, -4.5, -3.6, -2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6]

/**
 * Room shell, floor, rug, paneling and window.
 * All geometry is a temporary blockout.
 */
export default function BlockoutRoom() {
  return (
    <group name="blockout-room">
      {/* Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[14, 0.1, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.95} />
      </mesh>

      {/* Walls and ceiling */}
      <mesh position={[0, 3.1, -6]} receiveShadow>
        <boxGeometry args={[14, 6.2, 0.2]} />
        <meshStandardMaterial color={MATERIAL_COLORS.charcoal} roughness={1} />
      </mesh>
      <mesh position={[-7, 3.1, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6.2, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
      </mesh>
      <mesh position={[7, 3.1, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6.2, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
      </mesh>
      <mesh position={[0, 6.15, 0]}>
        <boxGeometry args={[14, 0.15, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.charcoal} roughness={1} />
      </mesh>

      {/* Wall panelling strips */}
      {WALL_PANEL_X.map((x) => (
        <mesh key={x} position={[x, 3.0, -5.88]}>
          <boxGeometry args={[0.06, 5.6, 0.05]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 5.35, -5.87]}>
        <boxGeometry args={[13, 0.08, 0.06]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodTrim} roughness={0.85} />
      </mesh>

      {/* Rug with a restrained border */}
      <mesh position={[0, 0.015, 1.05]} receiveShadow>
        <boxGeometry args={[6.4, 0.02, 4.1]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={1} />
      </mesh>
      <mesh position={[0, 0.03, 1.05]} receiveShadow>
        <boxGeometry args={[5.9, 0.01, 3.6]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={1} />
      </mesh>

      {/* Window and curtains on the back-right wall */}
      <group position={[4.45, 2.9, -5.86]}>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.7, 3.5, 0.05]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.window}
            emissive={MATERIAL_COLORS.window}
            emissiveIntensity={0.3}
            roughness={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.06, 3.5, 0.06]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.7, 0.06, 0.06]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.9} />
        </mesh>
        {[-1.02, 1.02].map((x) => (
          <mesh key={x} position={[x, 0.1, 0.12]}>
            <boxGeometry args={[0.38, 3.7, 0.14]} />
            <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
