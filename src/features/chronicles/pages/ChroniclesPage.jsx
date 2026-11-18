import './chronicles.css'

function PaperDocument({ className, children, pin = 'top' }) {
  return (
    <article className={`chronicle-document ${className}`}>
      <span className="chronicle-document__wear" aria-hidden="true" />
      <span className={`chronicle-document__pin chronicle-document__pin--${pin}`} aria-hidden="true" />
      <div className="chronicle-document__frame" aria-hidden="true" />
      {children}
    </article>
  )
}

export default function ChroniclesPage() {
  return (
    <article className="chronicles-page" aria-labelledby="chronicles-title">
      <header className="chronicles-heading">
        <p className="chronicles-heading__label">ARCHIVE IV · PERSONAL HISTORY</p>
        <h1 id="chronicles-title">The Chronicles</h1>
        <div className="chronicles-heading__rule" aria-hidden="true" />
        <p className="chronicles-heading__subtitle">EDUCATION &amp; EXPERIENCE</p>
      </header>

      <section className="chronicles-records" aria-label="Education and professional experience">
        <PaperDocument className="chronicle-document--education" pin="lower">
          <header className="chronicle-document__heading">
            <span>01 —</span>
            <h2>Education</h2>
          </header>
          <div className="chronicle-document__divider" aria-hidden="true" />
          <div className="education-record">
            <figure className="education-record__engraving">
              <img src="/reference/university-engraving.png" width="225" height="116" alt="Sepia engraving of a university facade" />
            </figure>
            <h3>Istanbul Topkapi University</h3>
            <div className="education-record__ornament" aria-hidden="true"><span /></div>
            <p className="education-record__degree">Management<br />Information Systems</p>
            <p className="education-record__language">English-taught</p>
            <p className="education-record__dates">2023 – 2027</p>
          </div>
        </PaperDocument>

        <PaperDocument className="chronicle-document--experience" pin="top">
          <header className="chronicle-document__heading">
            <span>02 —</span>
            <h2>Professional Experience</h2>
          </header>
          <div className="chronicle-document__divider" aria-hidden="true" />

          <div className="experience-record">
            <div className="experience-record__identity">
              <div className="experience-record__company">
                <h3>Belbim Elektronik Para ve Ödeme Hizmetleri A.Ş.</h3>
                <p className="experience-record__location"><span aria-hidden="true">⌖</span> Istanbul, Türkiye</p>
                <p className="experience-record__role">Software Developer Intern</p>
                <p className="experience-record__dates"><span aria-hidden="true">▦</span> August 2026 – September 2026</p>
              </div>
              <figure className="experience-record__engraving">
                <img src="/reference/istanbul-engraving.png" width="222" height="195" alt="Sepia engraving of a historical Istanbul tram and Galata Tower" />
              </figure>
            </div>

            <div className="experience-record__ornament" aria-hidden="true"><span /></div>
            <div className="experience-record__evidence">
              <ul className="experience-record__details">
                <li>Developed a full-stack IstanbulKart platform using React, Java, and Spring Boot.</li>
                <li>Implemented frontend components and backend REST APIs.</li>
                <li>Integrated Stripe payment processing and Google Cloud Vision API for identity verification.</li>
                <li>Worked with Docker, Kubernetes, and Microsoft Azure for deployment.</li>
              </ul>
              <figure className="experience-record__kart-engraving">
                <img src="/reference/istanbulkart-engraving.png" width="208" height="146" alt="IstanbulKart card presented as a separate archival artifact" />
              </figure>
            </div>
          </div>
        </PaperDocument>
      </section>
    </article>
  )
}
