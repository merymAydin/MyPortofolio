import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const DESK_DRAG_HEIGHT = 1.068
const DESK_X_BOUNDS = [-3.75, 3.75]
const DESK_Z_BOUNDS = [0.55, 3.42]

/**
 * R3F raycast selection plus pointer-captured movement on the desk plane.
 * The object's visible children and initial transform stay unchanged.
 */
export default function DraggableProp({
  name,
  initialPosition,
  rotation = [0, 0, 0],
  hitbox,
  children,
}) {
  const groupRef = useRef(null)
  const dragRef = useRef(null)
  const listenersRef = useRef(null)
  const [position, setPosition] = useState(initialPosition)
  const domElement = useThree((state) => state.gl.domElement)
  const cursorElementRef = useRef(null)
  const camera = useThree((state) => state.camera)
  const invalidate = useThree((state) => state.invalidate)
  const pointer = useMemo(() => new THREE.Vector2(), [])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -DESK_DRAG_HEIGHT),
    [],
  )

  const removePointerListeners = () => {
    const listeners = listenersRef.current
    if (!listeners) return

    window.removeEventListener('pointermove', listeners.move)
    window.removeEventListener('pointerup', listeners.end)
    window.removeEventListener('pointercancel', listeners.end)
    listenersRef.current = null
  }

  useEffect(() => {
    cursorElementRef.current = domElement
    return () => {
      removePointerListeners()
      if (cursorElementRef.current) cursorElementRef.current.style.cursor = ''
      cursorElementRef.current = null
    }
  }, [domElement])

  const moveOnDesk = (event, pointerId) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== pointerId) return

    const rect = domElement.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    const point = raycaster.ray.intersectPlane(dragPlane, new THREE.Vector3())
    if (!point) return

    const x = THREE.MathUtils.clamp(point.x + drag.offsetX, ...DESK_X_BOUNDS)
    const z = THREE.MathUtils.clamp(point.z + drag.offsetZ, ...DESK_Z_BOUNDS)
    setPosition([x, initialPosition[1], z])
    invalidate()
  }

  const finishDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    event.stopPropagation?.()
    dragRef.current = null
    removePointerListeners()
    try {
      drag.captureTarget.releasePointerCapture(event.pointerId)
    } catch {
      // The browser may have already released pointer capture.
    }
    if (cursorElementRef.current) cursorElementRef.current.style.cursor = ''
    invalidate()
  }

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    event.stopPropagation()
    const point = event.ray.intersectPlane(dragPlane, new THREE.Vector3())
    if (!point || !groupRef.current) return

    dragRef.current = {
      pointerId: event.pointerId,
      captureTarget: event.target,
      offsetX: groupRef.current.position.x - point.x,
      offsetZ: groupRef.current.position.z - point.z,
    }

    try {
      event.target.setPointerCapture(event.pointerId)
    } catch {
      // Window-level pointer listeners still track this drag.
    }

    const move = (nativeEvent) => {
      if (nativeEvent.pointerId !== event.pointerId) return
      nativeEvent.preventDefault()
      moveOnDesk(nativeEvent, nativeEvent.pointerId)
    }
    const end = (nativeEvent) => finishDrag(nativeEvent)

    listenersRef.current = { move, end }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    if (cursorElementRef.current) cursorElementRef.current.style.cursor = 'grabbing'
    invalidate()
  }

  const setHoverCursor = (cursor) => {
    if (!dragRef.current && cursorElementRef.current) cursorElementRef.current.style.cursor = cursor
  }

  return (
    <group
      ref={groupRef}
      name={name}
      position={position}
      rotation={rotation}
      onPointerDown={onPointerDown}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={finishDrag}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHoverCursor('grab')
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        setHoverCursor('')
      }}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      {children}
      <mesh position={hitbox.position} name={name + '-interaction-hitbox'}>
        <boxGeometry args={hitbox.size} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          colorWrite={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

