import { useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

/**
 * Adapts the camera framing to the full viewport.
 *
 * Desktop keeps the complete reference composition. Portrait viewports
 * use a wider field of view and an intentional target shift: tablet keeps
 * the lamp and typewriter in frame, while mobile prioritises the central
 * book and the typewriter.
 */
export default function CameraRig() {
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const cameraRef = useRef(null)

  const config = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1)

    if (aspect < 0.62) {
      return {
        fov: 64,
        position: [0, 2.95, 9.8],
        target: [0.85, 1.15, 1.7],
      }
    }

    if (aspect < 0.9) {
      return {
        fov: 62,
        position: [0, 2.95, 9.7],
        target: [-0.1, 1.12, 1.6],
      }
    }

    if (aspect < 1.3) {
      return {
        fov: 52,
        position: [0, 2.9, 8.6],
        target: [0, 1.15, 1.55],
      }
    }

    if (aspect < 1.6) {
      return {
        fov: 46,
        position: [0, 2.95, 7.8],
        target: [0, 1.2, 1.55],
      }
    }

    return {
      fov: 42,
      position: [0, 2.9, 7.2],
      target: [0, 1.1, 1.55],
    }
  }, [size])

  useLayoutEffect(() => {
    const camera = cameraRef.current
    if (!camera) return

    camera.lookAt(...config.target)
    camera.updateProjectionMatrix()
    invalidate()
  }, [config, invalidate])

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      near={0.1}
      far={60}
      fov={config.fov}
      position={config.position}
    />
  )
}
