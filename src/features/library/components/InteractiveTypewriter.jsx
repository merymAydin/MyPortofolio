import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '../../../app/routePaths.js'

const TYPEWRITER_IMAGE = '/reference/front-facing-typewriter-cutout.png'
const KEY_ROWS = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['], y: 68.5, start: 28.5, step: 4.2 },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"], y: 73.7, start: 29.7, step: 4.35 },
  { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'], y: 79.3, start: 31.4, step: 4.38 },
]
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']

const KEY_CODE_TO_LABEL = {
  Space: 'SPACE',
  Enter: 'ENTER',
  Backspace: 'BACKSPACE',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Semicolon: ';',
  Quote: "'",
  Comma: ',',
  Period: '.',
  Slash: '/',
}

const MAX_LINES = 4
const MAX_COLUMNS = 25

function isEditableTarget(target) {
  return target instanceof Element && Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]'),
  )
}

function mapCodeToLabel(code) {
  if (code.startsWith('Key')) return code.slice(3)
  if (code.startsWith('Digit')) return code.slice(5)
  if (code.startsWith('Numpad')) return code.slice(6)
  return KEY_CODE_TO_LABEL[code]
}

/** Interactive controls aligned to the typewriter already visible in the scene plate. */
const SCENE_KEY_ROWS = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], x: 1213, y: 486, step: 22, width: 18 },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], x: 1204, y: 508, step: 23, width: 19 },
  { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'], x: 1205, y: 530, step: 25, width: 20 },
]

export default function InteractiveTypewriter({ positionOnScene, onForegroundChange }) {
  const [typedText, setTypedText] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [activeKey, setActiveKey] = useState('')
  const [isForeground, setIsForeground] = useState(false)
  const releaseTimer = useRef(null)
  const pressedRef = useRef(new Set())

  const press = useCallback((key, code) => {
    if (code) setActiveKey(mapCodeToLabel(code) || key.toUpperCase())
    else setActiveKey(key.toUpperCase())
    window.clearTimeout(releaseTimer.current)
    releaseTimer.current = window.setTimeout(() => setActiveKey(''), 145)

    if (key === 'Enter') {
      setHasStarted(true)
      setTypedText((current) => {
        const lines = current.split('\n')
        return lines.length < MAX_LINES ? `${current}\n` : current
      })
    } else if (key === 'Backspace') {
      setHasStarted(true)
      setTypedText((current) => Array.from(current).slice(0, -1).join(''))
    } else if (key === ' ') {
      setHasStarted(true)
      setTypedText((current) => {
        const lines = current.split('\n')
        return lines.at(-1).length < MAX_COLUMNS ? `${current} ` : current
      })
    } else if (key.length === 1 && !key.startsWith('Dead')) {
      setHasStarted(true)
      setTypedText((current) => {
        const lines = current.split('\n')
        return lines.length <= MAX_LINES && lines.at(-1).length < MAX_COLUMNS
          ? `${current}${key}`
          : current
      })
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isEditableTarget(event.target) || event.altKey || event.ctrlKey || event.metaKey) return
      const label = mapCodeToLabel(event.code)
      if (!label) return

      if (['Space', 'Enter', 'Backspace'].includes(event.code)) event.preventDefault()
      // Physical keys animate even when held, while text is inserted once per press.
      setActiveKey(label)
      if (event.repeat || pressedRef.current.has(event.code)) return
      pressedRef.current.add(event.code)
      press(event.key, event.code)
    }

    const onKeyUp = (event) => {
      pressedRef.current.delete(event.code)
      if (mapCodeToLabel(event.code) === activeKey) setActiveKey('')
    }
    const onBlur = () => {
      pressedRef.current.clear()
      setActiveKey('')
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      window.clearTimeout(releaseTimer.current)
    }
  }, [activeKey, press])

  const handleKeyClick = (key) => press(key, key === ' ' ? 'Space' : key === 'Enter' ? 'Enter' : key === 'Backspace' ? 'Backspace' : undefined)

  const openForeground = () => {
    setIsForeground(true)
    onForegroundChange(true)
  }
  const closeForeground = () => {
    setIsForeground(false)
    onForegroundChange(false)
  }
  const visualStyle = positionOnScene(isForeground ? [324, 129, 1024, 683] : [1138, 315, 420, 280])

  return (
    <div className="landing-typewriter" aria-label="Interactive typewriter">
      {!isForeground && (
        <div className="landing-typewriter__scene-layer">
          <button
            className="landing-typewriter__scene-open"
            type="button"
            style={positionOnScene([1195, 315, 302, 282])}
            aria-label="Bring the typewriter forward"
            aria-expanded="false"
            onClick={openForeground}
          />
          <div
            className={`landing-typewriter__paper landing-typewriter__paper--scene${typedText.length ? ' is-typing' : ''}`}
            style={positionOnScene([1305, 337, 150, 74])}
            aria-live="polite"
          >
            <span className="landing-typewriter__prompt" aria-hidden={Boolean(typedText.length)}>
              SEND ME A MESSAGE
            </span>
            <span className="landing-typewriter__typed">{typedText || '\u00a0'}</span>
          </div>
          {SCENE_KEY_ROWS.map((row) => row.keys.map((key, index) => (
            <button
              key={`scene-${key}`}
              type="button"
              className={`landing-typewriter__scene-key${activeKey === key ? ' is-pressed' : ''}`}
              style={positionOnScene([row.x + index * row.step, row.y, row.width, 16])}
              aria-label={`Type ${key}`}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          )))}
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key, index) => (
            <button
              key={`scene-number-${key}`}
              type="button"
              className={`landing-typewriter__scene-key${activeKey === key ? ' is-pressed' : ''}`}
              style={positionOnScene([1211 + index * 23.1, 472, 17, 13])}
              aria-label={`Type ${key}`}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            className={`landing-typewriter__scene-key landing-typewriter__scene-key--wide${activeKey === 'SPACE' ? ' is-pressed' : ''}`}
            style={positionOnScene([1240, 548, 128, 16])}
            aria-label="Type a space"
            onClick={() => handleKeyClick(' ')}
          />
          <button
            type="button"
            className={`landing-typewriter__scene-key${activeKey === 'ENTER' ? ' is-pressed' : ''}`}
            style={positionOnScene([1400, 523, 28, 17])}
            aria-label="Start a new line"
            onClick={() => handleKeyClick('Enter')}
          />
          <button
            type="button"
            className={`landing-typewriter__scene-key${activeKey === 'BACKSPACE' ? ' is-pressed' : ''}`}
            style={positionOnScene([1400, 477, 29, 17])}
            aria-label="Delete the last character"
            onClick={() => handleKeyClick('Backspace')}
          />
          {hasStarted && (
            <Link
              className="landing-typewriter__continue landing-typewriter__continue--scene"
              style={positionOnScene([1300, 400, 150, 15])}
              to={ROUTES.correspondence}
            >
              Continue to Correspondence ↗
            </Link>
          )}
        </div>
      )}

      <div
        className={`landing-typewriter__visual${isForeground ? ' is-foreground' : ''}`}
        style={visualStyle}
        aria-label="Front-facing antique mechanical typewriter"
      >
        <img className="landing-typewriter__machine" src={TYPEWRITER_IMAGE} alt="" draggable="false" />

        <div className={`landing-typewriter__paper${typedText.length ? ' is-typing' : ''}`} aria-live="polite">
          <span className="landing-typewriter__prompt" aria-hidden={Boolean(typedText.length)}>
            SEND ME A MESSAGE
          </span>
          <span className="landing-typewriter__typed">{typedText || '\u00a0'}</span>
        </div>

        {NUMBER_KEYS.map((key, index) => (
          <button
            key={`number-${key}`}
            type="button"
            className={`landing-typewriter__key landing-typewriter__key--number${activeKey === key ? ' is-pressed' : ''}`}
            style={{ left: `${26.8 + index * 4.12}%`, top: '63.1%' }}
            aria-label={`Type ${key}`}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}

        {KEY_ROWS.map((row) => row.keys.map((key, index) => (
          <button
            key={`letter-${key}`}
            type="button"
            className={`landing-typewriter__key${activeKey === key.toUpperCase() ? ' is-pressed' : ''}`}
            style={{ left: `${row.start + index * row.step}%`, top: `${row.y}%` }}
            aria-label={`Type ${key}`}
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        )))}

        <button
          type="button"
          className={`landing-typewriter__key landing-typewriter__key--space${activeKey === 'SPACE' ? ' is-pressed' : ''}`}
          style={{ left: '50%', top: '85.8%', width: '39%' }}
          aria-label="Type a space"
          onClick={() => handleKeyClick(' ')}
        />
        <button
          type="button"
          className={`landing-typewriter__key landing-typewriter__key--return${activeKey === 'ENTER' ? ' is-pressed' : ''}`}
          style={{ left: '75.8%', top: '32.2%' }}
          aria-label="Start a new line"
          onClick={() => handleKeyClick('Enter')}
        />
        <button
          type="button"
          className={`landing-typewriter__key landing-typewriter__key--backspace${activeKey === 'BACKSPACE' ? ' is-pressed' : ''}`}
          style={{ left: '21.5%', top: '32.2%' }}
          aria-label="Delete the last character"
          onClick={() => handleKeyClick('Backspace')}
        />

        {hasStarted && (
          <Link className="landing-typewriter__continue" to={ROUTES.correspondence}>
            Continue to Correspondence ↗
          </Link>
        )}
      </div>

      {isForeground && (
        <button type="button" className="landing-typewriter__close" onClick={closeForeground}>
          Return to the Study
        </button>
      )}
      <span className="landing-screen__status" aria-live="polite">
        {hasStarted ? `Typed ${typedText.length} characters.` : 'Type on the keyboard to begin.'}
      </span>
    </div>
  )
}
