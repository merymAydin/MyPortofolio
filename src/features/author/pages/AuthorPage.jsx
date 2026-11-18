import { useCallback, useRef, useState } from 'react'
import PortraitMagnifier from '../components/PortraitMagnifier.jsx'
import './author.css'

const BIOGRAPHY = 'I am an aspiring full-stack developer with a growth mindset to acquire new skills and continuously develop myself with new challenges. I improve myself in front end, back end and CS.'

export default function AuthorPage() {
  const [revealLens, setRevealLens] = useState(null)
  const biographyRef = useRef(null)
  const handleLensMove = useCallback(({ x, y, radius, hasInspected }) => {
    if (!hasInspected) {
      setRevealLens(null)
      return
    }
    const biography = biographyRef.current?.getBoundingClientRect()
    if (!biography) {
      setRevealLens(null)
      return
    }
    const intersectsBiography = x + radius >= biography.left
      && x - radius <= biography.right
      && y + radius >= biography.top
      && y - radius <= biography.bottom
    setRevealLens(intersectsBiography
      ? { x: x - biography.left, y: y - biography.top, radius }
      : null)
  }, [])

  return (
    <article className="author-page" aria-labelledby="author-title">
      <div className="author-frame">
        <section className="author-record">
          <span className="brass-pin brass-pin--top" aria-hidden="true" />
          <div className="author-record__portrait-column">
            <p className="author-record__eyebrow">Archive I · Personal Record</p>
            <div className="author-record__portrait-frame">
              <PortraitMagnifier onLensMove={handleLensMove} />
            </div>
            <p className="author-record__magnifier-hint">Drag the glass across the record to reveal the hidden ink.</p>
            <p className="author-record__caption">Portrait plate · filed in the private archive</p>
            <p className="author-record__index">Record No. 01—A</p>
          </div>

          <div className="author-record__copy">
            <p className="author-record__subtitle">The Author</p>
            <h1 id="author-title">About Me</h1>
            <blockquote
              ref={biographyRef}
              className="author-record__biography"
              style={revealLens ? {
                '--reveal-x': `${revealLens.x}px`,
                '--reveal-y': `${revealLens.y}px`,
                '--reveal-radius': `${revealLens.radius}px`,
              } : undefined}
            >
              <span className="author-record__ink-source">{BIOGRAPHY}</span>
              {revealLens ? <span className="author-record__ink-reveal" aria-hidden="true">{BIOGRAPHY}</span> : null}
            </blockquote>
            <p className="author-record__note">Filed among the forgotten archives · An introduction in ink</p>
          </div>
        </section>
      </div>
    </article>
  )
}
