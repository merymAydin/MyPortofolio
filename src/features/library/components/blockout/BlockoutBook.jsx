import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MATERIAL_COLORS } from './materials.js'

const PAGE_LINES = [-0.45, -0.24, -0.03, 0.18, 0.39]

function Page({ side, isOpening }) {
  const isLeft = side === 'left'
  const x = isLeft ? -0.68 : 0.68
  const tilt = isLeft ? 0.03 : -0.03
  const pageRef = useRef(null)
  const progressRef = useRef(1)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    if (isOpening) {
      progressRef.current = 0
      invalidate()
    } else if (pageRef.current) {
      pageRef.current.rotation.z = tilt
    }
  }, [invalidate, isOpening, tilt])

  useFrame((state, delta) => {
    if (!isOpening || !pageRef.current || progressRef.current >= 1) return

    progressRef.current = Math.min(1, progressRef.current + delta / 0.62)
    const pageLift = Math.sin(progressRef.current * Math.PI)
    const turnAmount = isLeft ? 0.12 : -0.82
    pageRef.current.rotation.z = tilt + turnAmount * pageLift

    if (progressRef.current < 1) state.invalidate()
  })

  return (
    <group ref={pageRef} position={[x, 0.18, 0]} rotation={[0, 0, tilt]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.34, 0.028, 1.78]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchment} roughness={0.96} />
      </mesh>

      {/* Suggested handwriting, not real text */}
      {PAGE_LINES.map((z, index) => (
        <mesh key={z} position={[0, 0.017, z]}>
          <boxGeometry args={[0.86 - index * 0.045, 0.002, 0.007]} />
          <meshStandardMaterial color={MATERIAL_COLORS.ink} roughness={1} />
        </mesh>
      ))}

      {/* Suggested marginal sketch */}
      <mesh position={[isLeft ? -0.22 : 0.24, 0.018, 0.5]}>
        <boxGeometry args={[0.36, 0.002, 0.3]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={1} />
      </mesh>
    </group>
  )
}

/**
 * Central book blockout. Its scene transform remains fixed; opening is a
 * temporary page lift while the separately designed journal interface is pending.
 */
export default function BlockoutBook({ onOpen, isOpening = false }) {
  const stopPointer = (event) => event.stopPropagation()

  return (
    <group
      name="blockout-open-book"
      onPointerDown={stopPointer}
      onPointerUp={stopPointer}
      onClick={(event) => {
        event.stopPropagation()
        onOpen?.()
      }}
      onDoubleClick={stopPointer}
    >
      {/* Cover and page block */}
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.95, 0.07, 1.95]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leatherDeep} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.105, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.07, 1.83]} />
        <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={0.95} />
      </mesh>

      <Page side="left" isOpening={isOpening} />
      <Page side="right" isOpening={isOpening} />

      {/* Spine and outer page edges */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.07, 0.045, 1.8]} />
        <meshStandardMaterial color={MATERIAL_COLORS.leather} roughness={0.8} />
      </mesh>
      {[-1.36, 1.36].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]}>
          <boxGeometry args={[0.035, 0.05, 1.8]} />
          <meshStandardMaterial color={MATERIAL_COLORS.parchmentAged} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
