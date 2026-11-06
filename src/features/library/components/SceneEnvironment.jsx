import BlockoutRoom from './blockout/BlockoutRoom.jsx'
import BlockoutBookshelves from './blockout/BlockoutBookshelves.jsx'
import BlockoutFireplace from './blockout/BlockoutFireplace.jsx'
import BlockoutDesk from './blockout/BlockoutDesk.jsx'
import BlockoutBook from './blockout/BlockoutBook.jsx'
import BlockoutTypewriter from './blockout/BlockoutTypewriter.jsx'
import BlockoutLamp from './blockout/BlockoutLamp.jsx'
import BlockoutProps from './blockout/BlockoutProps.jsx'

/**
 * Scene composition. Interactive objects are wrapped in named groups now
 * so later tasks can attach independent pointer handlers without
 * restructuring the environment.
 */
export default function SceneEnvironment({ onJournalOpen, isJournalOpening }) {
  return (
    <>
      <BlockoutRoom />
      <BlockoutBookshelves />
      <BlockoutFireplace />
      <BlockoutDesk />

      <group name="interactive-book" position={[0, 1.06, 1.9]}>
        <BlockoutBook onOpen={onJournalOpen} isOpening={isJournalOpening} />
      </group>

      <group name="interactive-typewriter">
        <BlockoutTypewriter />
      </group>

      <BlockoutLamp />
      <BlockoutProps />
    </>
  )
}

