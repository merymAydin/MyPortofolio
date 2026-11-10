import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'
import { projects } from '../../../data/projects.js'
import ArchitectureSketch from '../components/ArchitectureSketch.jsx'
import BoardMap from '../components/BoardMap.jsx'
import CasePaper from '../components/CasePaper.jsx'
import InvestigationThreads from '../components/InvestigationThreads.jsx'
import './case-files.css'
import './case-detail-board.css'

function recordCount(project) {
  return [
    project.image,
    project.demoUrl,
    ...(project.githubLinks ?? []),
  ].filter(Boolean).length
}

function DossierTitle({ project }) {
  return (
    <header className="dossier-title case-paper">
      <span className="case-paper__pin brass-pin" aria-hidden="true" />
      <span className="dossier-title__stamp" aria-hidden="true">
        {project.caseStudy ? 'Case study' : 'Dossier'}
      </span>

      <div className="dossier-title__copy">
        <p className="dossier-title__eyebrow">
          {project.caseNumber} · Investigation dossier
        </p>
        <h1>{project.title}</h1>
        <p className="dossier-title__catalogue">{project.caseStatus} · {recordCount(project)} records on file</p>
        <nav className="dossier-title__links" aria-label="Project resources">
          {project.demoUrl ? (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live Project <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {project.githubLinks?.map((source) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
              {source.label.replace(' source', ' Source')} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

function EvidencePhotograph({ project }) {
  if (!project.image) return null

  return (
    <figure className="evidence-photograph">
      <span className="evidence-photograph__pin brass-pin" aria-hidden="true" />
      <div className="evidence-photograph__frame">
        <img src={project.image} alt={`${project.title} project screenshot`} />
      </div>
      <figcaption>Exhibit A · Captured project screen</figcaption>
    </figure>
  )
}

function CaseStudySections({ study }) {
  const stackGroups = [
    ['Frontend', study.stack.frontend],
    ['Backend', study.stack.backend],
    ['Database & DevOps', study.stack.databaseDevOps],
  ]

  return (
    <>
      <CasePaper title="Project Overview" className="case-paper--overview">
        <p>{study.overview}</p>
        <p className="case-study-note">
          Scope and behavior are summarized from the project README and implementation.
        </p>
      </CasePaper>

      <CasePaper title="Core Features" className="case-paper--features">
        <ul className="evidence-list">
          {study.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CasePaper>

      <CasePaper title="Technical Stack" className="case-paper--stack">
        <div className="stack-columns">
          {stackGroups.map(([title, items]) => (
            <div className="stack-group" key={title}>
              <h3>{title}</h3>
              <p>{items.join(' · ')}</p>
            </div>
          ))}
        </div>

        <h3 className="subsection-heading">External Services</h3>
        <ul className="service-list">
          {study.stack.external.map((service) => (
            <li key={service.name}>
              <strong>{service.name}</strong>
              <span>{service.note}</span>
            </li>
          ))}
        </ul>
      </CasePaper>

      <CasePaper title="Architecture" className="case-paper--architecture">
        <ArchitectureSketch nodes={study.architecture} />
        <p className="case-study-note">
          Requests flow from the browser to Spring services; repositories persist entity data
          through JPA.
        </p>
      </CasePaper>

      <CasePaper title="Project Structure" className="case-paper--structure">
        <ul className="folder-list">
          {study.structure.map((path) => (
            <li key={path}>
              <code>{path}</code>
            </li>
          ))}
        </ul>
      </CasePaper>

      <CasePaper title="Database & Data Model" className="case-paper--database">
        <div className="entity-map">
          {study.tables.map((table) => (
            <article className="entity-slip" key={table.name}>
              <h3>{table.name}</h3>
              <p>{table.fields}</p>
            </article>
          ))}
        </div>
        <h3 className="subsection-heading">Observed relationships</h3>
        <ul className="evidence-list evidence-list--compact">
          {study.relationships.map((relationship) => (
            <li key={relationship}>{relationship}</li>
          ))}
        </ul>
      </CasePaper>

      <CasePaper title="Technical Challenges & Solutions" className="case-paper--challenges">
        <ol className="challenge-list">
          {study.challenges.map((challenge) => (
            <li key={challenge.title}>
              <h3>{challenge.title}</h3>
              <p>{challenge.detail}</p>
            </li>
          ))}
        </ol>
      </CasePaper>

      <CasePaper title="Security" className="case-paper--security">
        <ul className="evidence-list">
          {study.security.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CasePaper>

      <CasePaper title="Project Status" className="case-paper--status">
        <h3>Implemented in source</h3>
        <p>{study.status.implemented}</p>
        <h3>Verification notes</h3>
        <p>{study.status.caveats}</p>
      </CasePaper>
    </>
  )
}

function PendingDossier({ project }) {
  return (
    <section className="case-paper case-paper--pending">
      <span className="case-paper__pin brass-pin" aria-hidden="true" />
      <h2 className="case-paper__heading">Record Status</h2>
      <div className="case-paper__body">
        <p>
          A full written dossier has not been catalogued for this project yet. No features,
          architecture, stack details or outcomes have been added without source material.
        </p>

        <h3>On file</h3>
        <ul className="evidence-list">
          <li>Case reference and project title</li>
          {project.image ? <li>Captured project screenshot</li> : null}
          {project.demoUrl ? <li>Live project address</li> : null}
          {project.githubLinks?.length > 0 ? <li>Source repository records</li> : null}
        </ul>

        {project.image ? <EvidencePhotograph project={project} /> : null}

        <p className="case-study-note">
          The remaining investigation sections will appear here once verified notes are supplied.
        </p>
      </div>
    </section>
  )
}

export default function CaseFileDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  return (
    <main className="case-detail-page">
      <div className="case-detail-board">
        <div className="case-board__backdrop" aria-hidden="true" />
        <Link className="case-detail-page__return" to={ROUTES.caseFiles}>
          <span aria-hidden="true">←</span> Case Files index
        </Link>

          <div className="case-detail-board__inner">
          {project ? (
            <>
                <BoardMap className="board-map--detail" />
                <InvestigationThreads variant="detail" />
                <div className="case-detail-layout">
                  <EvidencePhotograph project={project} />
                  <DossierTitle project={project} />
                  {project.caseStudy ? (
                    <CaseStudySections study={project.caseStudy} />
                  ) : (
                    <PendingDossier project={project} />
                  )}
                </div>
            </>
          ) : (
            <article className="case-paper case-paper--missing">
              <span className="case-paper__pin brass-pin" aria-hidden="true" />
              <h1>Case file not found</h1>
              <p>No project record matches this reference.</p>
              <Link to={ROUTES.caseFiles}>Return to Case Files</Link>
            </article>
          )}
        </div>
      </div>
    </main>
  )
}
