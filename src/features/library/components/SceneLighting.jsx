import { useMemo } from 'react'
import * as THREE from 'three'

function DeskSpotlight() {
  const target = useMemo(() => new THREE.Object3D(), [])

  return (
    <>
      <primitive object={target} position={[0, 1.05, 1.65]} />
      <spotLight
        position={[-2.6, 3.0, 1.95]}
        target={target}
        angle={0.7}
        penumbra={0.9}
        intensity={55}
        distance={12}
        decay={2}
        color="#ffe1b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
    </>
  )
}

/**
 * Lighting blockout: warm practical lights, one cool window rim and
 * a single shadow-casting lamp to keep the static scene inexpensive.
 */
export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.32} color="#c8b08a" />
      <hemisphereLight args={['#3b4656', '#171714', 0.45]} />

      <DeskSpotlight />

      {/* Soft front wash to keep the desk and shelves legible */}
      <directionalLight
        position={[3, 4, 6]}
        intensity={0.8}
        color="#c9a97a"
      />

      {/* Low foreground fill so the desk edge reads without flattening the scene */}
      <pointLight
        position={[0, 2.5, 5.5]}
        intensity={12}
        distance={10}
        decay={2}
        color="#c9a97a"
      />

      {/* Fireplace glow */}
      <pointLight
        position={[6.3, 0.95, -4]}
        intensity={30}
        distance={7}
        decay={2}
        color="#ff7a33"
      />

      {/* Candle glow */}
      <pointLight
        position={[1.42, 1.52, 0.82]}
        intensity={5}
        distance={3.8}
        decay={2}
        color="#ffc06a"
      />

      {/* Cool light through the back window */}
      <directionalLight
        position={[4.6, 5.2, -4.4]}
        intensity={0.55}
        color="#8ea6c4"
      />
    </>
  )
}
