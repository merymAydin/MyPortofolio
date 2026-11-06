import LandingScreen from '../components/LandingScreen.jsx'
import '../library.css'

/**
 * Active home route: the supplied reference scene and its live HTML controls.
 * The primitive R3F prototype is intentionally not mounted here.
 */
export default function LibraryPage() {
  return (
    <main className="library-page" aria-label="The Forgotten Archives">
      <LandingScreen />
    </main>
  )
}
