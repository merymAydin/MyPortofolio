import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MATERIAL_COLORS } from './materials.js'

const BOOK_COLORS = [
  '#4a3326',
  '#5a4230',
  '#3d2c22',
  '#2f3b30',
  '#4a3b2a',
  '#604832',
  '#3a3230',
  '#54402d',
]

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

/**
 * Books are rendered with a single InstancedMesh per shelf unit.
 * This keeps the blockout cheap while still giving the shelves volume.
 */
function ShelfBooks({ width, height, depth, shelfCount, seed }) {
  const meshRef = useRef()

  const books = useMemo(() => {
    const random = seededRandom(seed)
    const items = []
    const availableWidth = width - 0.22
    const innerHeight = height - 0.16
    const rowHeight = innerHeight / shelfCount
    const halfWidth = availableWidth / 2

    for (let row = 0; row < shelfCount; row += 1) {
      const shelfY = 0.08 + row * rowHeight
      let cursor = -halfWidth

      while (cursor < halfWidth - 0.1) {
        const bookWidth = 0.09 + random() * 0.13
        const bookHeight = rowHeight * (0.62 + random() * 0.26)
        const bookDepth = depth * (0.55 + random() * 0.28)
        const gap = 0.006 + random() * 0.018

        if (cursor + bookWidth > halfWidth) break

        items.push({
          position: [cursor + bookWidth / 2, shelfY + bookHeight / 2, 0.03],
          scale: [bookWidth, bookHeight, bookDepth],
          color: BOOK_COLORS[Math.floor(random() * BOOK_COLORS.length)],
        })

        cursor += bookWidth + gap
      }
    }

    return items
  }, [width, height, depth, shelfCount, seed])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh || books.length === 0) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    books.forEach((book, index) => {
      dummy.position.set(...book.position)
      dummy.scale.set(...book.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, color.set(book.color))
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [books])

  if (books.length === 0) return null

  return (
    <instancedMesh ref={meshRef} args={[null, null, books.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.9} metalness={0} />
    </instancedMesh>
  )
}

function ShelfUnit({ position, rotation = [0, 0, 0], width, height, depth, shelfCount, seed }) {
  const rowHeight = (height - 0.16) / shelfCount

  return (
    <group position={position} rotation={rotation}>
      {/* Back and frame */}
      <mesh position={[0, height / 2, -depth / 2 + 0.03]} receiveShadow>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color={MATERIAL_COLORS.woodDeep} roughness={1} />
      </mesh>
      {[-width / 2 + 0.04, width / 2 - 0.04].map((x) => (
        <mesh key={x} position={[x, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, height, depth]} />
          <meshStandardMaterial color={MATERIAL_COLORS.wood} roughness={0.9} />
        </mesh>
      ))}
      {[0.04, height - 0.04].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, 0.08, depth]} />
          <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={0.9} />
        </mesh>
      ))}

      {/* Shelves and front trim */}
      {Array.from({ length: shelfCount + 1 }, (_, index) => {
        const y = 0.08 + index * rowHeight
        return (
          <group key={index} position={[0, y, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width - 0.12, 0.045, depth - 0.03]} />
              <meshStandardMaterial color={MATERIAL_COLORS.woodRaised} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.03, depth / 2 - 0.04]}>
              <boxGeometry args={[width - 0.18, 0.018, 0.018]} />
              <meshStandardMaterial
                color={MATERIAL_COLORS.gold}
                metalness={0.55}
                roughness={0.45}
              />
            </mesh>
          </group>
        )
      })}

      <ShelfBooks
        width={width}
        height={height}
        depth={depth}
        shelfCount={shelfCount}
        seed={seed}
      />
    </group>
  )
}

export default function BlockoutBookshelves() {
  return (
    <group name="blockout-bookshelves">
      <ShelfUnit
        position={[-1.4, 0, -5.62]}
        width={8.4}
        height={4.9}
        depth={0.55}
        shelfCount={6}
        seed={17}
      />
      <ShelfUnit
        position={[-6.72, 0, -1.2]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.6}
        height={4.5}
        depth={0.5}
        shelfCount={5}
        seed={43}
      />
    </group>
  )
}
