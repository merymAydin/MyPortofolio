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
    <svg viewBox="0 0 180 140" role="img" aria-label="Engraved antique browser window study">
      <path d="M17 21h146v99H17zM22 26h136v89H22zM17 38h146M23 31h3m5 0h3m5 0h3" />
      <path d="M28 46h28v62H28zM62 47h87v16H62zM62 69h87v39H62z" />
      <path d="M67 52h42m-42 6h28m-28 17h29m-29 6h52m-52 6h43m-43 6h48m-48 6h27" />
      <path d="M111 99h30m-30-7h22m-22-7h28m-20-7v21m8-21v21" />
      <circle cx="135" cy="79" r="4"/><circle cx="115" cy="99" r="1.6"/><circle cx="123" cy="99" r="1.6"/>
      <path d="M15 25c-5-4-5-9 0-13m150 13c5-4 5-9 0-13M15 116c-5 4-5 9 0 13m150-13c5 4 5 9 0 13" />
      <path d="M19 17h142M19 124h142M31 43v68m-4-60h4m-4 8h4m-4 8h4m-4 8h4m-4 8h4m-4 8h4" strokeDasharray="1 3" />
      <circle cx="151" cy="32" r="1.2" /><circle cx="145" cy="32" r="1.2" />
      <g strokeWidth="0.8">
        <path d="M25 20c5 0 6 4 2 7m126-7c-5 0-6 4-2 7M25 121c5 0 6-4 2-7m126 7c-5 0-6-4-2-7" />
        <path d="M11 25c-7 0-9-8-3-12 3-2 7 0 7 3 0 2-3 3-4 1m158 8c7 0 9-8 3-12-3-2-7 0-7 3 0 2 3 3 4 1M11 116c-7 0-9 8-3 12 3 2 7 0 7-3 0-2-3-3-4-1m158-8c7 0 9 8 3 12-3 2-7 0-7-3 0-2 3-3 4-1" />
        <path d="M65 65v45m4-42v42m4-42v42m4-42v42m4-42v42m4-42v42" strokeDasharray="1 3" />
        <path d="M60 42h91m-91 69h91M24 14l8 3m116 99 8 3m-129-3 8-3m116-99 8-3M63 70h31m-31 5h22m-22 5h27" />
        <circle cx="35" cy="31" r="1.5"/><circle cx="145" cy="31" r="1.5"/><circle cx="35" cy="113" r="1.5"/><circle cx="145" cy="113" r="1.5"/>
      </g>
    </svg>
  )
}

function ServerSketch() {
  return (
    <svg viewBox="0 0 180 140" role="img" aria-label="Engraved mechanical server cabinet study">
      <path d="m46 18 79-7 17 8-2 103-83 7-13-8zM46 18l-8 5v101l19 5m83-111 8-1v99l-16 6" />
      <path d="m46 18 79-6v25l-79 7zm0 31 79-6v24l-79 7zm0 30 79-6v24l-79 7zm0 30 79-6v17l-79 7z" />
      <path d="m56 27 49-4m-49 9 31-3m-31 35 49-4m-49 9 31-3m-31 34 49-4m-49 9 31-3m-31 30 49-4" />
      <circle cx="115" cy="25" r="3.5"/><circle cx="115" cy="55" r="3.5"/><circle cx="115" cy="85" r="3.5"/><circle cx="115" cy="115" r="3.5"/>
      <path d="M119 25h7m-7 30h7m-7 30h7m-7 30h7M40 31h5m-5 29h5m-5 29h5m-5 29h5" />
      <path d="m31 31 7-4m-7 11 7-4m-7 34 7-4m-7 11 7-4m-7 34 7-4m-7 11 7-4" strokeDasharray="1 2" />
      <path d="M30 128h115m-93 7h68" />
      <g strokeWidth="0.8">
        <path d="M54 21c14-7 42-8 66-5m-71 17 76-6m-75 36 76-6m-75 36 76-6m-75 35 76-6" />
        <path d="M132 18v103m7-100v96m-5-82h5m-5 7h5m-5 7h5m-5 7h5m-5 7h5m-5 7h5m-5 7h5m-5 7h5m-5 7h5" strokeDasharray="1 2" />
        <path d="M124 20c11-4 16 1 16 10v78c0 8-5 12-16 13m-81-96-9 5v94m5-90v82" />
        <path d="m34 24 4 4-4 4m0 30 4 4-4 4m0 30 4 4-4 4" />
        <circle cx="114" cy="25" r="1"/><circle cx="114" cy="55" r="1"/><circle cx="114" cy="85" r="1"/><circle cx="114" cy="115" r="1"/>
        <circle cx="91" cy="24" r="8"/><path d="M91 18v12m-5-6h10m-8-4 6 8m0-8-6 8" />
        <path d="M78 49h17m-17 3h17m-17 27h17m-17 3h17m-17 27h17m-17 3h17" strokeDasharray="1 2" />
        <path d="M31 122c-5 4-6 9-2 13m112-13c5 4 6 9 2 13m-108 1h104" />
      </g>
    </svg>
  )
}

function ScalesSketch() {
  return (
    <svg viewBox="0 0 180 140" role="img" aria-label="Engraved Victorian balance scales for testing and quality">
      <path d="M90 20v91m-20 7h40m-51 9h62m-73 8h84M52 34h76M90 20l-38 14m38-14 38 14" />
      <path d="M52 34 33 76h38L52 34Zm76 0-19 42h38l-19-42Z" />
      <path d="M33 76c2 15 36 15 38 0m38 0c2 15 36 15 38 0" />
      <path d="M25 76h54m47 0h54M90 24l-4 8h8zm-7 86 7-7 7 7m-36 8 36-4 36 4" />
      <circle cx="90" cy="20" r="5"/><circle cx="90" cy="20" r="2"/>
      <path d="M47 42 37 66m81-24-10 24M78 128l5-5m14 0 5 5" strokeDasharray="1 3" />
      <path d="M79 16c4-7 18-7 22 0M83 12l7-8 7 8" />
      <g strokeWidth="0.8">
        <path d="M52 31 40 57m8-25L36 55m88-24-12 26m8-27-12 25M31 72c5 8 17 10 25 7m73-7c5 8 17 10 25 7" strokeDasharray="1 2" />
        <path d="M73 35c5-5 9-8 17-9m17 9c-5-5-9-8-17-9M86 38v44m8-44v44M86 87c2 4 6 4 8 0m-19 21h30" />
        <circle cx="52" cy="34" r="2.2"/><circle cx="128" cy="34" r="2.2"/><circle cx="90" cy="118" r="3"/>
        <path d="M43 81c5 5 14 7 22 6m49-6c5 5 14 7 22 6M58 126l6-5m52 5-6-5" />
      </g>
    </svg>
  )
}

function BooksSketch() {
  return (
    <svg viewBox="0 0 180 140" role="img" aria-label="Engraved stack of antique technical volumes">
      <path d="m29 35 94-12q8-1 13 8l-2 25q-1 7-9 8l-90 8q-8 1-10-8l-1-19q0-7 5-10zm6 8 88-11m-87 8 1 20m91-27-1 21m-75-10 56-7" />
      <path d="m19 68 116-8q9-1 11 9l-4 25q-1 7-10 7L28 108q-8 1-9-8l-4-21q-1-8 4-11zm8 7 108-8m-108 8 2 20m111-28-2 24m-82-9 63-5" />
      <path d="m28 105 112-4q8 0 10 8l-2 20q-1 7-9 8l-99 4q-8 0-10-8l-3-17q-1-8 1-11zm8 6 103-3m-102 4 1 17m106-20-1 18m-75-9 58-2" />
      <path d="M33 48h15m-13 34 17-1m-8 38 16-1m-28-53 8 3m-7 36 9 3" />
      <path d="m36 31 4-5 4 4 4-6 5 4m-28 44 5-5 5 4 5-5m-2 39 5-5 5 4 5-5" />
      <path d="M20 130h132m-125 4 14-2m94-2 12 2" strokeDasharray="1 3" />
      <g strokeWidth="0.8">
        <path d="m31 38 84-10m-83 28 80-9m-87 29 97-7m-96 22 94-7m-94 27 96-3m-95 18 96-3" />
        <path d="M44 40v21m-3-18 3-3 3 3m-3 13 3 3-3 3m-9-17 7-1m-8 8 7-1m-7 7 7-1" />
        <path d="M48 44h52v10H48zm39 35h39v10H87zm-17 31h49v9H70z" />
        <path d="M53 47h42m-42 3h31m8 32h27m-27 4h19m-44 31h37m-37 4h28" strokeDasharray="1 2" />
        <path d="m124 27 5 4-4 4m11 39 5 4-4 4m-3 25 5 4-4 4" />
        <path d="M28 36c-4 2-6 5-5 10m116-19c5 0 8 2 10 7M18 70c-4 4-4 8 0 13m130-14c5 2 7 6 5 11M27 107c-4 2-6 6-4 10m120-11c4 1 7 4 7 8" />
        <path d="M53 55h44m-47 2h42m-61 36 92-7m-91 3 91-7m-79 43 75-2" strokeDasharray="1 2" />
      </g>
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
