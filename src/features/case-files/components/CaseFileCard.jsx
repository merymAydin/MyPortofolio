import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'

/**
 * A single pinned project document on the Case Files board.
 *
 * @param {Object} props
 * @param {Object} props.project - Project record from src/data/projects.js.
 * @param {number} props.position - Board position, used for layout only.
 */
export default function CaseFileCard({ project, position }) {
  const technologies = Array.isArray(project.technologies) ? project.technologies : []
  const sourceCount = project.githubLinks?.length ?? 0
  const evidence = [
    project.image ? 'Screenshot' : null,
    project.demoUrl ? 'Live record' : null,
    sourceCount > 0 ? `${sourceCount} source ${sourceCount === 1 ? 'record' : 'records'}` : null,
  ].filter(Boolean)

  return (
    <article className={`case-card case-card--${position}`}>
      <span className="case-card__backing" aria-hidden="true" />
      <span className="case-card__pin brass-pin" aria-hidden="true" />

      <Link
        className="case-card__photograph"
        to={ROUTES.caseFile(project.slug)}
        aria-label={`Examine the ${project.title} case`}
      >
        {project.image ? (
          <img src={project.image} alt={`${project.title} project screenshot`} />
        ) : (
          <span className="case-card__image-missing">Project photograph pending</span>
        )}
      </Link>

      <div className="case-card__caption">
        <span className="case-card__tack brass-pin brass-pin--small" aria-hidden="true" />

        <p className="case-card__catalogue">
          <span>{project.caseNumber}</span>
          <span className="case-card__status">{project.caseStatus}</span>
        </p>

        <h2 className="case-card__title">{project.title}</h2>

        {project.description ? (
          <p className="case-card__description">{project.description}</p>
        ) : (
          <p className="case-card__description case-card__description--pending">
            The written dossier is awaiting the author&apos;s notes. The captured record and
            project links are on file.
          </p>
        )}

        {technologies.length > 0 ? (
          <p className="case-card__technologies">{technologies.join(' · ')}</p>
        ) : null}

        {evidence.length > 0 ? (
          <p className="case-card__evidence">Evidence on file · {evidence.join(' · ')}</p>
        ) : null}

        <nav className="case-card__links" aria-label={`${project.title} records`}>
          <Link className="case-card__examine" to={ROUTES.caseFile(project.slug)}>
            Examine Case <span aria-hidden="true">→</span>
          </Link>
          {project.demoUrl ? (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live record <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </nav>
      </div>
    </article>
  )
}
