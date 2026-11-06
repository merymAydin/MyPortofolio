import CameraRig from './CameraRig.jsx'
import SceneLighting from './SceneLighting.jsx'
import SceneEnvironment from './SceneEnvironment.jsx'

/**
 * Root of the 3D scene. Static by design: rendering is demand-based and
 * the scene contains no animation loop.
 */
export default function LibraryScene({ onJournalOpen, isJournalOpening }) {
  return (
    <>
      <color attach="background" args={['#0b0907']} />
      <fog attach="fog" args={['#0b0907', 8, 30]} />
      <CameraRig />
      <SceneLighting />
      <SceneEnvironment onJournalOpen={onJournalOpen} isJournalOpening={isJournalOpening} />
    </>
  )
}

