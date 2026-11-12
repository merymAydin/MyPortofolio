import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../../../app/routePaths.js'
import { projects } from '../../../data/projects.js'
import ArchitectureSketch from '../components/ArchitectureSketch.jsx'
import CasePaper from '../components/CasePaper.jsx'
import './case-files.css'
import './case-detail-board.css'
import './twitter-case-board.css'
import './ecommerce-case-board.css'

const STACK_GROUPS = [
  ['Frontend', 'frontend'],
  ['Backend', 'backend'],
  ['Database & DevOps', 'databaseDevOps'],
]

function BoardHeader({ indexLabel = '03–17' }) {
  return (
    <header className="investigation-board-header" aria-label="Investigation board heading">
      <span>III. Case Files &amp; Investigations</span>
      <span className="investigation-board-header__ornament" aria-hidden="true">
        <i />
      </span>
      <span>Index No. {indexLabel}</span>
    </header>
  )
}

function InvestigationHeader({ project }) {
  return (
    <header className="dossier-paper dossier-title">
      <span className="brass-pin dossier-title__pin" aria-hidden="true" />
      <p className="dossier-title__eyebrow">
        Case #{project.caseNumber.slice(-3)} · Investigation dossier
      </p>
      <h1>{project.caseStudy.displayTitle || project.title}</h1>
      <p className="dossier-title__project-name">{project.title}</p>
      <span className="dossier-title__stamp" aria-label={`Record status: ${project.caseStatus}`}>
        {project.caseStatus}
      </span>
    </header>
  )
}

function IstanbulPhotographs() {
  return (
    <div className="istanbul-photographs" aria-label="Period-style Istanbul image reconstructions">
      <figure className="archival-photograph archival-photograph--tram">
        <span className="brass-pin" aria-hidden="true" />
        <img
          src="/reference/istanbul-tram-galata-reconstruction.jpg"
          alt="Period-style generated reconstruction of an old Istanbul tram beneath Galata Tower."
          width="1456"
          height="1024"
          decoding="async"
        />
        <figcaption>Illustrative reconstruction · Galata and the tramway</figcaption>
      </figure>
    </div>
  )
}

function ProjectIllustration() {
  return (
    <figure className="project-illustration dossier-paper">
      <span className="brass-pin project-illustration__pin" aria-hidden="true" />
      <div className="project-illustration__frame">
        <img
          src="/reference/istanbulkart-exploded-view.png"
          alt="Conceptual exploded-view artwork of a mechanical wallet and digital circuit. The artwork is illustrative and does not document IstanbulKart hardware."
          width="2560"
          height="1429"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <figcaption>
        Exhibit A · Concept illustration only; the project is a software experience, not a
        physical card teardown.
      </figcaption>
      <span className="project-illustration__stamp" aria-hidden="true">
        Record filed
      </span>
    </figure>
  )
}

function ProjectOverview({ study }) {
  return (
    <CasePaper title="The Investigation" className="case-paper--overview">
      <p>{study.overview}</p>
    </CasePaper>
  )
}

function EvidenceItem({ href, children }) {
  return (
    <li className={href ? 'evidence-item evidence-item--link' : 'evidence-item'}>
      {href ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : children}
    </li>
  )
}

function CoreFeatures({ study }) {
  return (
    <CasePaper title="Core Features" className="case-paper--features">
      <ul className="evidence-list">
        {study.features.map((feature) => <EvidenceItem key={feature}>{feature}</EvidenceItem>)}
      </ul>
    </CasePaper>
  )
}

function TechnicalStack({ study }) {
  return (
    <CasePaper title="Technical Stack" className="case-paper--stack">
      <div className="stack-groups">
        {STACK_GROUPS.map(([title, key]) => (
          <div className="stack-group" key={key}>
            <h3>{title}</h3>
            <ul className="stack-tags" aria-label={`${title} technologies`}>
              {study.stack[key].map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="stack-group stack-group--services">
        <h3>External Services</h3>
        <ul className="service-list">
          {study.stack.external.map((service) => (
            <li key={service.name}>
              <strong>{service.name}</strong>
              <span>{service.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </CasePaper>
  )
}

function Architecture({ study }) {
  return (
    <CasePaper title="Architecture" className="case-paper--architecture">
      <ArchitectureSketch nodes={study.architecture} />
      <p className="architecture-note">
        Recorded flow: browser interface → Spring services → JPA persistence on PostgreSQL.
      </p>
    </CasePaper>
  )
}

function EvidenceCollected({ project }) {
  return (
    <CasePaper title="Evidence Collected" className="case-paper--evidence">
      <ul className="evidence-list evidence-list--links">
        {project.githubLinks?.map((source) => (
          <EvidenceItem key={source.url} href={source.url}>{source.label}</EvidenceItem>
        ))}
        {project.demoUrl ? (
          <EvidenceItem href={project.demoUrl}>Live project record</EvidenceItem>
        ) : null}
      </ul>
      <p className="case-study-note">
        Feature and architecture notes are drawn from the recorded project source.
      </p>
    </CasePaper>
  )
}

const DEFAULT_CONNECTIONS = [
  ['.archival-photograph--tram .brass-pin', '.dossier-title__pin'],
  ['.archival-photograph--tram .brass-pin', '.case-paper--overview .dossier-paper__pin'],
  ['.dossier-title__pin', '.project-illustration__pin'],
  ['.dossier-title__pin', '.twitter-post-fragment__pin'],
  ['.dossier-title__pin', '.case-paper--features .dossier-paper__pin'],
  ['.project-illustration__pin', '.case-paper--features .dossier-paper__pin'],
  ['.project-illustration__pin', '.case-paper--overview .dossier-paper__pin'],
  ['.project-illustration__pin', '.twitter-notification-fragment__pin'],
  ['.case-paper--features .dossier-paper__pin', '.supporting-photograph__pin'],
  ['.supporting-photograph__pin', '.case-paper--challenges .dossier-paper__pin'],
  ['.case-paper--features .dossier-paper__pin', '.case-paper--challenges .dossier-paper__pin'],
  ['.case-paper--overview .dossier-paper__pin', '.case-paper--stack .dossier-paper__pin'],
  ['.case-paper--stack .dossier-paper__pin', '.case-paper--architecture .dossier-paper__pin'],
  ['.case-paper--architecture .dossier-paper__pin', '.case-paper--evidence .dossier-paper__pin'],
]

function InvestigationThreads({ connections = DEFAULT_CONNECTIONS }) {
  const layoutRef = useRef(null)
  const [paths, setPaths] = useState([])

  useLayoutEffect(() => {
    const layout = layoutRef.current?.parentElement
    if (!layout) return undefined

    const measure = () => {
      const layoutBox = layout.getBoundingClientRect()
      if (!layoutBox.width || !layoutBox.height) return
      const scaleX = 1500 / layoutBox.width
      const scaleY = 1460 / layoutBox.height
      const nextPaths = connections.flatMap(([fromSelector, toSelector], index) => {
        const from = layout.querySelector(fromSelector)?.getBoundingClientRect()
        const to = layout.querySelector(toSelector)?.getBoundingClientRect()
        if (!from || !to) return []
        const start = {
          x: (from.left + from.width / 2 - layoutBox.left) * scaleX,
          y: (from.top + from.height / 2 - layoutBox.top) * scaleY,
        }
        const end = {
          x: (to.left + to.width / 2 - layoutBox.left) * scaleX,
          y: (to.top + to.height / 2 - layoutBox.top) * scaleY,
        }
        const curve = index % 2 === 0 ? 12 : -10
        const control = {
          x: (start.x + end.x) / 2 + curve,
          y: (start.y + end.y) / 2 - curve,
        }
        return [{ d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}` }]
      })
      setPaths(nextPaths)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(layout)
    measure()
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [connections])

  return (
    <svg
      ref={layoutRef}
      className="investigation-threads"
      viewBox="0 0 1500 1460"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="investigation-threads__shadow">
        {paths.map((path, index) => <path d={path.d} key={`shadow-${index}`} />)}
      </g>
      <g className="investigation-threads__cord">
        {paths.map((path, index) => <path d={path.d} key={`cord-${index}`} />)}
      </g>
    </svg>
  )
}

function TechnicalChallenges({ study }) {
  return (
    <CasePaper title="Technical Challenges & Solutions" className="case-paper--challenges">
      <p className="case-study-note">
        Recorded handling is shown where documented; unresolved integrations are identified in
        the source notes.
      </p>
      <ol className="challenge-list">
        {study.challenges.map((challenge) => (
          <li key={challenge.title}>
            <h3>{challenge.title}</h3>
            <p>{challenge.detail}</p>
          </li>
        ))}
      </ol>
    </CasePaper>
  )
}

function StudyDossier({ project }) {
  const study = project.caseStudy

  return (
    <div className="case-detail-layout">
      <InvestigationThreads />
      <InvestigationHeader project={project} />
      <IstanbulPhotographs />
      <ProjectIllustration />
      <ProjectOverview study={study} />
      <CoreFeatures study={study} />
      <figure className="supporting-photograph archival-photograph dossier-paper">
        <span className="brass-pin supporting-photograph__pin" aria-hidden="true" />
        <img
          src="/reference/istanbul-ferry-reconstruction.jpg"
          alt="Period-style generated reconstruction of an Istanbul ferry on the Bosphorus."
          width="1456"
          height="1024"
          loading="lazy"
          decoding="async"
        />
        <figcaption>Illustrative reconstruction · A Bosphorus ferry</figcaption>
      </figure>
      <TechnicalStack study={study} />
      <Architecture study={study} />
      <EvidenceCollected project={project} />
      <TechnicalChallenges study={study} />
    </div>
  )
}

function TwitterRecordPaper({ title, className, children }) {
  const key = className.replace(/^twitter-/, '')
  return (
    <CasePaper title={title} className={`twitter-record-paper case-paper--${key} twitter-${key}`}>
      {children}
    </CasePaper>
  )
}

function TwitterPostFragment() {
  return (
    <article className="twitter-post-fragment dossier-paper">
      <span className="brass-pin twitter-post-fragment__pin" aria-hidden="true" />
      <p className="twitter-fragment__label">Printed social record · Exhibit B</p>
      <strong>Tweet record</strong>
      <p>content · author · created_at</p>
      <div className="twitter-fragment__actions" aria-label="Reported tweet interaction fields">
        <span>reply</span><span>retweet</span><span>like</span><span>bookmark</span>
      </div>
    </article>
  )
}

function TwitterNotificationFragment() {
  return (
    <article className="twitter-notification-fragment dossier-paper">
      <span className="brass-pin twitter-notification-fragment__pin" aria-hidden="true" />
      <p className="twitter-fragment__label">Notification record · Exhibit C</p>
      <strong>Social graph events</strong>
      <ul>
        <li>follow event</li>
        <li>like event</li>
        <li>mention event</li>
      </ul>
    </article>
  )
}

function TwitterCloneDossier({ project }) {
  const study = project.caseStudy

  return (
    <div className="twitter-case-layout">
      <InvestigationThreads />
      <header className="dossier-paper dossier-title twitter-case-title">
        <span className="brass-pin dossier-title__pin" aria-hidden="true" />
        <p className="dossier-title__eyebrow">Case #{project.caseNumber.slice(-3)} · Software investigation dossier</p>
        <h1>Twitter Clone</h1>
        <p className="dossier-title__project-name">Social media platform</p>
        <span className="dossier-title__stamp">{project.caseStatus}</span>
      </header>

      <figure className="twitter-interface dossier-paper project-illustration">
        <span className="brass-pin project-illustration__pin" aria-hidden="true" />
        <div className="project-illustration__frame">
          <img
            src="/reference/twitter-social-feed-illustration.png"
            alt="Conceptual sepia technical illustration of a laptop displaying an abstract social-media feed."
            width="1536"
            height="1024"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <figcaption>Exhibit A · Captured interface supplied with the project record.</figcaption>
      </figure>

      <TwitterPostFragment />
      <TwitterNotificationFragment />

      <TwitterRecordPaper title="Project Overview" className="twitter-overview">
        <p>{study.overview}</p>
        <p className="case-study-note">Reported project brief; completion was not independently verified in this portfolio workspace.</p>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Core Features" className="twitter-features">
        <ul className="evidence-list">
          {study.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        <p className="case-study-note">Reported capabilities; the frontend remains an API integration starter/scaffold.</p>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Technology Stack" className="twitter-stack">
        <div className="twitter-stack-lines">
          <p><strong>Backend:</strong> {study.stack.backend.join(', ')}</p>
          <p><strong>Frontend:</strong> {study.stack.frontend.join(', ')}</p>
          <p><strong>Database:</strong> {study.stack.databaseDevOps.join(', ')}</p>
          <p><strong>Integrations:</strong> {study.stack.external.map((service) => service.name).join(', ')}</p>
        </div>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Architecture" className="twitter-architecture">
        <ArchitectureSketch nodes={study.architecture} />
        <p className="case-study-note">Reported architecture path; frontend integration is still a scaffold.</p>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Evidence Collected" className="twitter-evidence">
        <figure className="twitter-evidence__capture">
          <img src={project.image} alt="Captured Twitter Clone interface supplied with the project record." width="1536" height="768" loading="lazy" />
          <figcaption>Captured interface · source record</figcaption>
        </figure>
        <ul className="evidence-list evidence-list--links">
          <li><a href={project.demoUrl} target="_blank" rel="noreferrer">Live project address</a></li>
          <li>Captured interface image</li>
        </ul>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Technical Highlights" className="twitter-highlights">
        <ul className="evidence-list">
          {study.challenges.map((challenge) => <li key={challenge.title}><strong>{challenge.title}:</strong> {challenge.detail}</li>)}
        </ul>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Project Status" className="twitter-status">
        <ul className="evidence-list">
          <li>{study.status.implemented}</li>
          <li>{study.status.caveats}</li>
        </ul>
      </TwitterRecordPaper>

      <TwitterRecordPaper title="Integrations & Services" className="twitter-integrations">
        <ul className="evidence-list">
          {study.stack.external.map((service) => <li key={service.name}><strong>{service.name}:</strong> {service.note}</li>)}
        </ul>
      </TwitterRecordPaper>
    </div>
  )
}

function PendingDossier({ project }) {
  return (
    <CasePaper title="Record Status" className="case-paper--pending">
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
      {project.image ? (
        <figure className="pending-photograph">
          <img src={project.image} alt={`${project.title} project screenshot`} loading="lazy" />
          <figcaption>Project screenshot · Exhibit A</figcaption>
        </figure>
      ) : null}
      <p className="case-study-note">
        The remaining investigation sections will appear once verified notes are supplied.
      </p>
    </CasePaper>
  )
}

const ECOMMERCE_CONNECTIONS = [
  ['.ecommerce-case-title .dossier-title__pin', '.ecommerce-overview .dossier-paper__pin'],
  ['.ecommerce-case-title .dossier-title__pin', '.ecommerce-interface .project-illustration__pin'],
  ['.ecommerce-interface .project-illustration__pin', '.ecommerce-features .dossier-paper__pin'],
  ['.ecommerce-features .dossier-paper__pin', '.ecommerce-stack .dossier-paper__pin'],
  ['.ecommerce-stack .dossier-paper__pin', '.ecommerce-architecture .dossier-paper__pin'],
  ['.ecommerce-architecture .dossier-paper__pin', '.ecommerce-evidence .dossier-paper__pin'],
  ['.ecommerce-evidence .dossier-paper__pin', '.ecommerce-highlights .dossier-paper__pin'],
  ['.ecommerce-highlights .dossier-paper__pin', '.ecommerce-status .dossier-paper__pin'],
]

function EcommerceDossier({ project }) {
  const study = project.caseStudy

  return (
    <div className="ecommerce-case-layout">
      <InvestigationThreads connections={ECOMMERCE_CONNECTIONS} />
      <header className="dossier-paper dossier-title ecommerce-case-title">
        <span className="brass-pin dossier-title__pin" aria-hidden="true" />
        <p className="dossier-title__eyebrow">Case #{project.caseNumber.slice(-3)} · Commerce investigation dossier</p>
        <h1>{study.displayTitle}</h1>
        <p className="dossier-title__project-name">React frontend &amp; API integration</p>
        <span className="dossier-title__stamp">{project.caseStatus}</span>
      </header>

      <figure className="ecommerce-interface dossier-paper project-illustration">
        <span className="brass-pin project-illustration__pin" aria-hidden="true" />
        <div className="project-illustration__frame">
          <img src={project.image} alt="Captured E-Commerce storefront showing the home page and new collection hero." width="1471" height="710" fetchPriority="high" decoding="async" />
        </div>
        <figcaption>Exhibit A · Captured storefront image supplied with the project record.</figcaption>
      </figure>

      <CasePaper title="Project Overview" className="ecommerce-overview">
        <p>{study.overview}</p>
      </CasePaper>

      <CasePaper title="Core Features" className="ecommerce-features">
        <ul className="evidence-list">
          {study.features.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
      </CasePaper>

      <CasePaper title="Technology Stack" className="ecommerce-stack">
        <div className="stack-groups">
          {STACK_GROUPS.map(([title, key]) => (
            <div className="stack-group" key={key}>
              <h3>{title}</h3>
              <ul className="stack-tags" aria-label={`${title} technologies`}>
                {study.stack[key].map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="stack-group stack-group--services">
          <h3>UI libraries</h3>
          <ul className="service-list">
            {study.stack.external.map((service) => <li key={service.name}><strong>{service.name}</strong><span>{service.note}</span></li>)}
          </ul>
        </div>
      </CasePaper>

      <CasePaper title="Architecture" className="ecommerce-architecture">
        <ArchitectureSketch nodes={study.architecture} />
        <p className="architecture-note">Recorded flow: React pages → Redux store → Axios API client → external REST API.</p>
      </CasePaper>

      <CasePaper title="Evidence Collected" className="ecommerce-evidence">
        <ul className="evidence-list evidence-list--links">
          <li><a href={project.demoUrl} target="_blank" rel="noreferrer">Live project record</a></li>
          <li>Captured storefront image</li>
        </ul>
        <p className="case-study-note">The screenshot is retained as supplied storefront evidence.</p>
      </CasePaper>

      <CasePaper title="Technical Highlights" className="ecommerce-highlights">
        <ol className="challenge-list">
          {study.challenges.map((challenge) => <li key={challenge.title}><h3>{challenge.title}</h3><p>{challenge.detail}</p></li>)}
        </ol>
      </CasePaper>

      <CasePaper title="Project Status" className="ecommerce-status">
        <ul className="evidence-list">
          <li>{study.status.implemented}</li>
          <li>{study.status.caveats}</li>
        </ul>
      </CasePaper>
    </div>
  )
}

export default function CaseFileDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const isTwitterCase = project?.caseNumber === 'CASE-002' || project?.slug === 'project-three'
  const isEcommerceCase = project?.caseNumber === 'CASE-003' || project?.slug === 'project-two'

  return (
    <main className={`case-detail-page ${isTwitterCase ? 'case-detail-page--twitter' : ''}${isEcommerceCase ? ' case-detail-page--ecommerce' : ''}`}>
      <div className="case-detail-board">
        <div className="case-detail-board__backdrop" aria-hidden="true" />
        <div className="case-detail-board__inner">
          <Link className="case-detail-page__return" to={ROUTES.caseFiles}>
            <span aria-hidden="true">←</span> Case Files index
          </Link>
          <BoardHeader indexLabel={isTwitterCase ? '02–17' : '03–17'} />
          {project ? (
            isEcommerceCase ? (
              <EcommerceDossier project={project} />
            ) : isTwitterCase ? (
              <TwitterCloneDossier project={project} />
            ) : project.caseStudy ? <StudyDossier project={project} /> : (
              <div className="case-detail-layout case-detail-layout--pending">
                <h1 className="pending-title">
                  {project.caseNumber} · {project.title}
                </h1>
                <PendingDossier project={project} />
              </div>
            )
          ) : (
            <CasePaper title="Case file not found" className="case-paper--missing">
              <p>No project record matches this reference.</p>
              <Link to={ROUTES.caseFiles}>Return to Case Files</Link>
            </CasePaper>
          )}
        </div>
      </div>
    </main>
  )
}
