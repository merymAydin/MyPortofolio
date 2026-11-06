import { RoundedBox } from '@react-three/drei'
import { MATERIAL_COLORS } from './materials.js'

/**
 * Green banker lamp blockout on the left side of the desk.
 */
export default function BlockoutLamp() {
  return (
    <group name="blockout-banker-lamp" position={[-2.72, 1.06, 1.9]}>
      {/* Base and stem */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.29, 0.05, 20]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.brass}
          metalness={0.6}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.12, 16]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.brass}
          metalness={0.6}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, 0.43, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.035, 0.62, 12]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.brass}
          metalness={0.65}
          roughness={0.32}
        />
      </mesh>

      {/* Shade and warm bulb */}
      <RoundedBox
        args={[1.2, 0.36, 0.66]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.95, 0.02]}
        rotation={[0, 0, -0.05]}
        castShadow
      >
        <meshStandardMaterial color={MATERIAL_COLORS.lampGreen} roughness={0.5} metalness={0.08} />
      </RoundedBox>
      <mesh position={[0, 0.79, 0.02]}>
        <sphereGeometry args={[0.055, 12, 8]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.lampGlow}
          emissive={MATERIAL_COLORS.lampGlow}
          emissiveIntensity={1.6}
          roughness={1}
        />
      </mesh>
      <mesh position={[0, 1.15, 0.02]}>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.brass}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}
