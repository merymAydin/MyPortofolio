import { MATERIAL_COLORS } from './materials.js'
import DraggableProp from './DraggableProp.jsx'

function Armchair({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.22, 0.85]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.99, -0.34]} rotation={[-0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 1.0, 0.18]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.9} />
      </mesh>
      {[-0.49, 0.49].map((x) => (
        <mesh key={x} position={[x, 0.72, 0]} castShadow>
          <boxGeometry args={[0.14, 0.42, 0.8]} />
          <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.65, 0.02]}>
        <boxGeometry args={[0.72, 0.1, 0.64]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leather} roughness={0.95} />
      </mesh>
      {[
        [-0.38, 0.15, -0.3],
        [0.38, 0.15, -0.3],
        [-0.38, 0.15, 0.3],
        [0.38, 0.15, 0.3],
      ].map((leg) => (
        <mesh key={leg.join('-')} position={leg}>
          <boxGeometry args={[0.07, 0.3, 0.07]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Hourglass() {
  return (
    <group name="blockout-hourglass" position={[-1.95, 1.06, 1.32]}>
      {[0.02, 0.42].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.035, 16]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodTrim} roughness={0.7} />
        </mesh>
      ))}
      {[
        [-0.14, -0.14],
        [0.14, -0.14],
        [0.14, 0.14],
        [-0.14, 0.14],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.22, z]}>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 6]} />
          <meshStandardMaterial color={MATERIAL_COLORS.brass} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.2, 16]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.glass}
          transparent
          opacity={0.3}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.12, 0.2, 16]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.glass}
          transparent
          opacity={0.3}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.08, 0.1, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.gold} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Magnifier() {
  return (
    <DraggableProp name="blockout-magnifier" initialPosition={[0.62, 1.27, 1.86]} rotation={[0, -0.5, 0]} hitbox={{ position: [0.32, 0.06, 0], size: [1.45, 0.18, 0.68] }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.022, 10, 32]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.gold}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[0.205, 32]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.glass}
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          side={2}
        />
      </mesh>
      <mesh position={[0.46, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.026, 0.03, 0.5, 10]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.7} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.034, 0.034, 0.22, 10]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leather} roughness={0.85} />
      </mesh>
    </DraggableProp>
  )
}

function Vial() {
  return (
    <DraggableProp name="blockout-vial" initialPosition={[1.62, 1.06, 2.5]} hitbox={{ position: [0, 0.16, 0], size: [0.32, 0.42, 0.32] }}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.glass}
          transparent
          opacity={0.28}
          roughness={0.08}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.17, 16]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.lampGlow}
          emissive={MATERIAL_COLORS.lampGlow}
          emissiveIntensity={0.15}
          transparent
          opacity={0.55}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.08, 16]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.305, 0]} castShadow>
        <cylinderGeometry args={[0.052, 0.058, 0.05, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leather} roughness={0.9} />
      </mesh>
    </DraggableProp>
  )
}

function Candle() {
  return (
    <group name="blockout-candle" position={[1.42, 1.06, 0.82]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.03, 16]} />
        <meshStandardMaterial color={MATERIAL_COLORS.brass} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.26, 12]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <coneGeometry args={[0.022, 0.08, 10]} />
        <meshStandardMaterial
          color={MATERIAL_COLORS.candle}
          emissive={MATERIAL_COLORS.candle}
          emissiveIntensity={2.2}
          roughness={1}
        />
      </mesh>
    </group>
  )
}

function DeskPapers() {
  const papers = [
    { position: [-1.55, 1.07, 2.62], rotation: 0.28, size: [0.55, 0.38] },
    { position: [-1.32, 1.072, 2.5], rotation: -0.12, size: [0.5, 0.34] },
    { position: [1.95, 1.07, 2.85], rotation: -0.35, size: [0.52, 0.36] },
    { position: [2.25, 1.072, 2.65], rotation: 0.18, size: [0.48, 0.32] },
  ]

  return (
    <group name="blockout-papers">
      {papers.map((paper, index) => (
        <mesh
          key={index}
          position={paper.position}
          rotation={[0, paper.rotation, 0]}
          receiveShadow
        >
          <boxGeometry args={[paper.size[0], 0.006, paper.size[1]]} />
          <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.98} />
        </mesh>
      ))}

      {/* Envelope with a folded flap (no wax seal) */}
      <group position={[1.55, 1.075, 3.0]} rotation={[0, -0.28, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.5, 0.012, 0.34]} />
          <meshStandardMaterial color={MATERIAL_COLORS.parchment} roughness={0.96} />
        </mesh>
        <mesh position={[0, 0.008, -0.08]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.5, 0.004, 0.18]} />
          <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.96} />
        </mesh>
      </group>

      {/* Photographs */}
      {[
        [-2.75, 1.075, 2.45, 0.22],
        [-2.4, 1.076, 2.7, -0.16],
      ].map(([x, y, z, rotation], index) => (
        <group key={index} position={[x, y, z]} rotation={[0, rotation, 0]}>
          <mesh>
            <boxGeometry args={[0.3, 0.004, 0.22]} />
            <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={1} />
          </mesh>
          <mesh position={[0, 0.004, 0]}>
            <boxGeometry args={[0.24, 0.002, 0.16]} />
            <meshStandardMaterial color={MATERIAL_COLORS.stoneDeep} roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function DeskBooks() {
  return (
    <group position={[-3.05, 1.06, 2.42]}>
      {[
        { y: 0.045, rotation: 0.05, size: [0.62, 0.09, 0.44] },
        { y: 0.13, rotation: -0.08, size: [0.58, 0.08, 0.4] },
        { y: 0.205, rotation: 0.12, size: [0.54, 0.07, 0.37] },
      ].map((book) => (
        <mesh key={book.y} position={[0, book.y, 0]} rotation={[0, book.rotation, 0]} castShadow>
          <boxGeometry args={book.size} />
          <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.88} />
        </mesh>
      ))}
    </group>
  )
}

function Compass() {
  return (
    <group position={[-1.15, 1.07, 2.95]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 20]} />
        <meshStandardMaterial color={MATERIAL_COLORS.brass} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.018, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.008, 20]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchment} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.03, 0.004, 0.17]} />
        <meshStandardMaterial color={MATERIAL_COLORS.ink} roughness={1} />
      </mesh>
    </group>
  )
}

function PenAndInk() {
  return (
    <group name="blockout-writing-tools">
      <group position={[0.9, 1.08, 2.95]} rotation={[0, 0.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.012, 0.016, 0.5, 8]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={0.6} />
        </mesh>
        <mesh position={[0.28, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.014, 0.09, 8]} />
          <meshStandardMaterial color={MATERIAL_COLORS.gold} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
      <group position={[2.05, 1.07, 3.05]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.08, 0.09, 12]} />
          <meshStandardMaterial
            color={MATERIAL_COLORS.glass}
            transparent
            opacity={0.35}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.025, 12]} />
          <meshStandardMaterial color={MATERIAL_COLORS.brass} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Background furniture and desk props.
 */
export default function BlockoutProps() {
  return (
    <>
      <Armchair position={[-2.85, 0, -2.9]} rotation={[0, 0.35, 0]} />
      <Armchair position={[2.0, 0, -3.35]} rotation={[0, -0.4, 0]} />
      <Hourglass />
      <Magnifier />
      <Vial />
      <Candle />
      <DeskPapers />
      <DeskBooks />
      <Compass />
      <PenAndInk />
    </>
  )
}



