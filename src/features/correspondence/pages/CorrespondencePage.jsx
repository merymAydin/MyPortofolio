import useTypewriterEmail from '../hooks/useTypewriterEmail.js'
import TypewriterMessageForm from '../components/TypewriterMessageForm.jsx'

import './correspondence.css'

const TYPEWRITER_IMAGE = '/reference/front-facing-typewriter-cutout.png'
const KEY_ROWS = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['], y: 68.5, start: 28.5, step: 4.2 },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"], y: 73.7, start: 29.7, step: 4.35 },
  { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'], y: 79.3, start: 31.4, step: 4.38 },
]
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']

export default function CorrespondencePage() {
  const emailForm = useTypewriterEmail()

  const keyButton = (key, extraClass = '', style = {}) => (
    <button
      key={key}
      type="button"
      className={`correspondence-typewriter__key${extraClass ? ` ${extraClass}` : ''}${emailForm.activeKey === (key === ' ' ? 'SPACE' : key === 'Enter' ? 'ENTER' : key === 'Backspace' ? 'BACKSPACE' : key.toUpperCase()) ? ' is-pressed' : ''}`}
      style={style}
      aria-label={key === ' ' ? 'Type a space' : key === 'Enter' ? 'Type a return' : key === 'Backspace' ? 'Delete one character' : `Type ${key}`}
      tabIndex={-1}
      disabled={emailForm.sending}
      onClick={() => emailForm.typeKey(key)}
    />
  )

  return (
    <section className="correspondence-page" aria-labelledby="correspondence-title">
      <header className="correspondence-heading">
        <p>ARCHIVE V · PRIVATE CORRESPONDENCE</p>
        <h1 id="correspondence-title">Correspondence</h1>
        <span aria-hidden="true">A letter for the archivist</span>
      </header>

      <div className="correspondence-typewriter">
        <div className="correspondence-typewriter__machine" aria-label="Antique mechanical typewriter">
          <img src={TYPEWRITER_IMAGE} alt="Antique mechanical typewriter with paper in its carriage" draggable="false" />
          <TypewriterMessageForm controller={emailForm} className="correspondence-typewriter__paper" />

          {NUMBER_KEYS.map((key, index) => keyButton(key, 'is-number', { left: `${26.8 + index * 4.12}%`, top: '63.1%' }))}
          {KEY_ROWS.map((row) => row.keys.map((key, index) => keyButton(key, '', { left: `${row.start + index * row.step}%`, top: `${row.y}%` })))}
          {keyButton(' ', 'is-space', { left: '50%', top: '85.8%' })}
          {keyButton('Enter', 'is-return', { left: '75.8%', top: '32.2%' })}
          {keyButton('Backspace', 'is-backspace', { left: '21.5%', top: '32.2%' })}
        </div>

        <p className={`correspondence-typewriter__status${emailForm.statusKind ? ` is-${emailForm.statusKind}` : ''}`} role={emailForm.statusKind === 'error' ? 'alert' : 'status'} aria-live="polite">
          {emailForm.status}
        </p>
      </div>

      <p className="correspondence-delivery-note">
        {emailForm.isConfigured
          ? 'Letters are sent through the archive correspondence service.'
          : 'Email delivery is not configured. A letter will not be sent until EmailJS settings are provided.'}
      </p>
    </section>
  )
}
