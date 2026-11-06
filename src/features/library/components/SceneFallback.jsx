import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'

const COPY = {
  unsupported: {
    eyebrow: 'The Reading Room',
    title: 'The 3D library is unavailable',
    message:
      'This browser or device does not support WebGL. Continue to the archive to use the standard navigation.',
  },
  error: {
    eyebrow: 'The Reading Room',
    title: 'The library could not be displayed',
    message:
      'The 3D scene encountered an error. Continue to the archive to use the standard navigation.',
  },
}

/**
 * Full-screen failure state. It only appears when the 3D scene cannot be
 * displayed, and it provides a route back to the conventional archive.
 */
export default function SceneFallback({ status = 'error' }) {
  const copy = COPY[status] ?? COPY.error

  return (
    <div className="scene-fallback" role="alert">
      <p className="scene-fallback__eyebrow">{copy.eyebrow}</p>
      <h1 className="scene-fallback__title">{copy.title}</h1>
      <p className="scene-fallback__message">{copy.message}</p>
      <p className="scene-fallback__action">
        <Link to={ROUTES.author}>Continue to The Author</Link>
      </p>
    </div>
  )
}
