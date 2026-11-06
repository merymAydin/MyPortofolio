import { Link } from 'react-router-dom'
import PagePlaceholder from '../components/ui/PagePlaceholder.jsx'
import { ROUTES } from './routePaths.js'

export default function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="Uncatalogued"
      title="Page Not Found"
      description="No document matching this reference exists in the archives."
    >
      <p>
        <Link to={ROUTES.home}>Return to the reading room</Link>
      </p>
    </PagePlaceholder>
  )
}
