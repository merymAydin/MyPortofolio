import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'
import { projects } from '../../../data/projects.js'
import './case-files.css'

export default function CaseFilesPage() {
  return (
    <main className="case-files-page">
      <section className="case-files-paper" aria-labelledby="case-files-title">
        <p className="case-files-paper__eyebrow">Archive III</p>
        <h1 id="case-files-title" className="case-files-paper__title">Case Files</h1>

        <div className="case-files-grid">
          {projects.map((project) => (
            <Link
              key={project.slug}
              className={`case-file case-file--${project.slug}`}
              to={ROUTES.caseFile(project.slug)}
            >
              {project.image ? (
                <img className="case-file__image" src={project.image} alt="" />
              ) : (
                <span
                  className="case-file__image-slot"
                  role="img"
                  aria-label={`${project.title} image slot; project image not supplied yet`}
                >
                  Project image to be supplied
                </span>
              )}
              <span className="case-file__title">{project.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

