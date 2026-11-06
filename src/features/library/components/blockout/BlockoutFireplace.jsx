import { MATERIAL_COLORS } from './materials.js'

/**
 * Fireplace blockout on the right wall. The fire is static emissive
 * geometry; the warm light lives in SceneLighting.
 */
export default function BlockoutFireplace() {
  return (
    <group name="blockout-fireplace" position={[6.86, 0, -4]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Hearth */}
      <mesh position={[0, 0.07, 0.36]} receiveShadow>
        <boxGeometry args={[2.5, 0.14, 0.95]} />
        <meshStandardMaterial color={MATERIAL_COLORS.stone} roughness={0.95} />
      </mesh>

      {/* Stone surround */}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 1.2, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 2.4, 0.4]} />
          <meshStandardMaterial color={MATERIAL_COLORS.stone} roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[0, 2.22, 0.12]} castShadow receiveShadow>
        <boxGeometry args={[2.34, 0.38, 0.42]} />
        <meshStandardMaterial color={MATERIAL_COLORS.stone} roughness={0.92} />
      </mesh>

      {/* Firebox */}
      <mesh position={[0, 0.82, 0.02]}>
        <boxGeometry args={[1.55, 1.6, 0.12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.stoneDeep} roughness={1} />
      </mesh>

      {/* Logs */}
      {[-0.18, 0.02, 0.2].map((x, index) => (
        <mesh
          key={x}
          position={[x, 0.22 + index * 0.06, 0.26]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.055, 0.055, 0.9, 8]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
        </mesh>
      ))}

      {/* Static fire volume */}
      <mesh position={[0, 0.55, 0.28]}>
        <planeGeometry args={[1.15, 0.78]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.fire}
          emissive={MATERIAL_COLORS.fire}
          emissiveIntensity={1.4}
          roughness={1}
        />
      </mesh>
      {[-0.24, 0.02, 0.26].map((x, index) => (
        <mesh key={x} position={[x, 0.55 + index * 0.04, 0.32]}>
          <coneGeometry args={[0.16, 0.62 + index * 0.1, 7]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.candle}
            emissive={MATERIAL_COLORS.fire}
            emissiveIntensity={1.6}
            roughness={1}
          />
        </mesh>
      ))}

      {/* Mantel and painting */}
      <mesh position={[0, 2.47, 0.24]} castShadow receiveShadow>
        <boxGeometry args={[2.66, 0.13, 0.58]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodTrim} roughness={0.8} />
      </mesh>
      <group position={[0, 3.45, 0.08]}>
        <mesh>
          <boxGeometry args={[1.42, 1.16, 0.08]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.gold}
            metalness={0.55}
            roughness={0.45}
          />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.2, 0.94, 0.02]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
