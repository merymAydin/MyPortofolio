import { MATERIAL_COLORS } from './materials.js'

/**
 * Foreground desk blockout. The top surface is at y = 1.05 so every
 * object can be positioned relative to the same working plane.
 */
export default function BlockoutDesk() {
  return (
    <group name="blockout-desk">
      {/* Top and edge */}
      <mesh position={[0, 0.98, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[7.8, 0.14, 2.9]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.045, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[7.9, 0.025, 3.0]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodTrim} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.04, 3.47]} castShadow>
        <boxGeometry args={[7.9, 0.06, 0.04]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodTrim} roughness={0.45} />
      </mesh>

      {/* Leather writing surface */}
      <mesh position={[0, 1.062, 2.0]} receiveShadow>
        <boxGeometry args={[4.95, 0.012, 1.72]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.95} />
      </mesh>

      {/* Apron and legs */}
      <mesh position={[0, 0.78, 2.0]} castShadow>
        <boxGeometry args={[7.4, 0.32, 2.5]} />
        <meshStandardMaterial color={MATERIAL_COLORS.wood} roughness={0.8} />
      </mesh>
      {[-3.55, 3.55].map((x) =>
        [0.78, 3.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.46, z]} castShadow>
            <boxGeometry args={[0.24, 0.92, 0.24]} />
            <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.85} />
          </mesh>
        )),
      )}
      {[-3.68, 3.68].map((x) => (
        <mesh key={x} position={[x, 0.68, 2.0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 2.3]} />
          <meshStandardMaterial color={MATERIAL_COLORS.wood} roughness={0.85} />
        </mesh>
      ))}

      {/* Drawer fronts and brass knobs */}
      {[-2.5, 0, 2.5].map((x) => (
        <group key={x} position={[x, 0.77, 3.36]}>
          <mesh castShadow>
            <boxGeometry args={[2.15, 0.26, 0.08]} />
            <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={0.75} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.045, 12, 8]} />
            <meshStandardMaterial
              color={MATERIAL_COLORS.gold}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
