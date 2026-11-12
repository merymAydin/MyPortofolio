import { projects } from '../../../data/projects.js'
import CaseFileCard from '../components/CaseFileCard.jsx'
import InvestigationThreads from '../components/InvestigationThreads.jsx'
import './case-files.css'

export default function CaseFilesPage() {
  return (
    <main className="case-files-page">
      <div className="case-board">
        <div className="case-board__backdrop" aria-hidden="true" />

        <div className="case-board__inner">
          <header className="board-heading">
            <span className="board-heading__pin brass-pin" aria-hidden="true" />
            <p className="board-heading__eyebrow">Archive III · Project Dossiers</p>
            <h1 id="case-files-title">Case Files</h1>
            <p className="board-heading__subline">Selected investigations · Evidence index</p>
            <span className="board-heading__stamp" aria-hidden="true">
              Private
            </span>
          </header>

          <InvestigationThreads variant="overview" />

          <section className="case-board__grid" aria-labelledby="case-files-title">
            {projects.map((project, index) => (
              <CaseFileCard key={project.slug} project={project} position={index + 1} />
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
