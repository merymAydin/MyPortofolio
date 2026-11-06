import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import LibraryScene from './LibraryScene.jsx'
import SceneFallback from './SceneFallback.jsx'
import SceneErrorBoundary from './SceneErrorBoundary.jsx'
import '../library.css'

function supportsWebGL() {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

/**
 * React Three Fiber configuration and failure handling. The full-screen
 * scene is demand-rendered and has no loading UI of its own.
 */
export default function LibraryCanvas({ onJournalOpen, isJournalOpening }) {
  const [webglAvailable] = useState(supportsWebGL)

  if (!webglAvailable) {
    return <SceneFallback status="unsupported" />
  }

  return (
    <SceneErrorBoundary fallback={<SceneFallback status="error" />}>
      <div
        className="library-canvas"
        role="img"
        aria-label="A dark Victorian library with an open book, typewriter, green banker lamp and fireplace."
      >
        <Canvas
          camera={{ fov: 40, near: 0.1, far: 60, position: [0, 2.55, 7.6] }}
          dpr={[1, 1.75]}
          frameloop="demand"
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          shadows="percentage"
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.05
          }}
        >
          <Suspense fallback={null}>
            <LibraryScene onJournalOpen={onJournalOpen} isJournalOpening={isJournalOpening} />
          </Suspense>
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}

