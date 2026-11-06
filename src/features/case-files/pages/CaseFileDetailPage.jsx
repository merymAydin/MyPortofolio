import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'
import { projects } from '../../../data/projects.js'
import './case-files.css'

export default function CaseFileDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  return (
    <main className="case-detail-page">
      <Link className="case-detail-page__return" to={ROUTES.caseFiles}>
        Return to Case Files
      </Link>
      {project ? (
        <article className="case-detail-paper">
          <span className="case-detail-paper__pin" aria-hidden="true" />
          <p className="case-detail-paper__eyebrow">Investigation record</p>
          <h1>{project.title}</h1>
          <h2>Evidence</h2>
          {project.image ? (
            <img className="case-detail-paper__image" src={project.image} alt="" />
          ) : (
            <div
              className="case-detail-paper__image-slot"
              role="img"
              aria-label={`${project.title} evidence image slot; project image not supplied yet`}
            >
              Project image to be supplied
            </div>
          )}
          <p className="case-detail-paper__note">
            Project details will appear here when the source material is available.
          </p>
        </article>
      ) : (
        <article className="case-detail-paper">
          <p className="case-detail-paper__eyebrow">Uncatalogued record</p>
          <h1>Case file not found</h1>
          <p className="case-detail-paper__note">No project record matches this reference.</p>
        </article>
      )}
    </main>
  )
}
