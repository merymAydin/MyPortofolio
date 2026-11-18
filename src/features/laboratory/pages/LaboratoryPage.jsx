import './laboratory.css'

const PANELS = [
  {
    number: '01',
    title: 'Frontend Engineering',
    illustration: <BrowserSketch />,
    skills: ['JavaScript', 'React.js', 'Hooks', 'Context API', 'Redux', 'Axios', 'Yup', 'HTML', 'CSS', 'Tailwind CSS'],
  },
  {
    number: '02',
    title: 'Backend Engineering',
    illustration: <ServerSketch />,
    skills: ['Java', 'OOP', 'Spring Core', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'Maven', 'SQL', 'PostgreSQL'],
  },
  {
    number: '03',
    title: 'Testing & Quality',
    illustration: <ScalesSketch />,
    skills: ['Jest', 'Cypress', 'JUnit', 'Mockito', 'Debugging'],
  },
  {
    number: '04',
    title: 'Computer Science & Tools',
    illustration: <BooksSketch />,
    skills: ['Data Structures', 'Algorithms', 'Design Patterns', 'Git', 'Deployment', 'Problem Solving', 'Figma', 'Teamwork'],
  },
]

function BrowserSketch() {
  return (
    <svg viewBox="0 0 150 120" role="img" aria-label="Vintage browser window sketch">
      <rect x="12" y="18" width="126" height="88" rx="3" />
      <path d="M12 34h126M26 26h2M36 26h2M46 26h2" />
      <path d="m30 48 90 0M30 58h70M30 70h74M30 82h46M30 94h58" />
      <path d="m103 74 11 11 17-23" />
    </svg>
  )
}

function ServerSketch() {
  return (
    <svg viewBox="0 0 150 120" role="img" aria-label="Antique filing server sketch">
      <rect x="23" y="17" width="100" height="27" rx="3" />
      <rect x="23" y="47" width="100" height="27" rx="3" />
      <rect x="23" y="77" width="100" height="27" rx="3" />
      <path d="M34 29h42M34 59h42M34 89h42M105 28h6M105 58h6M105 88h6" />
    </svg>
  )
}

function ScalesSketch() {
  return (
    <svg viewBox="0 0 150 120" role="img" aria-label="Testing scales sketch">
      <path d="M75 18v73M58 99h34M49 106h52M35 30h80M75 18l-26 12m26-12 26 12" />
      <path d="M35 30 20 63h30L35 30ZM115 30 100 63h30l-15-33ZM20 63c2 12 28 12 30 0M100 63c2 12 28 12 30 0" />
      <circle cx="75" cy="18" r="5" />
    </svg>
  )
}

function BooksSketch() {
  return (
    <svg viewBox="0 0 150 120" role="img" aria-label="Stack of old books sketch">
      <path d="M22 91h105v14H22zM28 75h99v14H28zM18 58h109v14H18zM30 41h96v14H30z" />
      <path d="M34 45h42M23 62h48M34 79h54M28 96h48" />
      <path d="m18 58 10-7M28 75l9-7M22 91l11-7" />
    </svg>
  )
}

function LaboratoryPanel({ number, title, illustration, skills }) {
  return (
    <article className="laboratory-panel">
      <span className="laboratory-panel__paperwear" aria-hidden="true" />
      <span className="laboratory-panel__pin" aria-hidden="true" />
      <header className="laboratory-panel__header">
        <span>{number}</span>
        <h2>{title}</h2>
      </header>
      <div className="laboratory-panel__rule" aria-hidden="true" />
      <div className="laboratory-panel__body">
        <div className="laboratory-panel__illustration">{illustration}</div>
        <ul className="laboratory-panel__skills" aria-label={`${title} skills`}>
          {skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </div>
    </article>
  )
}

export default function LaboratoryPage() {
  return (
    <article className="laboratory-page" aria-labelledby="laboratory-title">
      <header className="laboratory-page__heading">
        <p>ARCHIVE II · TECHNICAL INVENTORY</p>
        <h1 id="laboratory-title">The Laboratory</h1>
        <div className="laboratory-page__heading-rule" aria-hidden="true" />
        <h2>SKILLS</h2>
      </header>

      <section className="laboratory-grid" aria-label="Technical skills inventory">
        {PANELS.map((panel) => <LaboratoryPanel key={panel.number} {...panel} />)}
      </section>
    </article>
  )
}
