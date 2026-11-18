import { useCallback, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

import './correspondence.css'

const TYPEWRITER_IMAGE = '/reference/front-facing-typewriter-cutout.png'
const INITIAL_FIELDS = { name: '', email: '', message: '' }
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim()
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim()
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()
const KEY_ROWS = [
  { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '['], y: 68.5, start: 28.5, step: 4.2 },
  { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"], y: 73.7, start: 29.7, step: 4.35 },
  { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'], y: 79.3, start: 31.4, step: 4.38 },
]
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=']

function fieldFromTarget(target) {
  return target?.name && Object.hasOwn(INITIAL_FIELDS, target.name) ? target.name : null
}

function insertAtSelection(element, value, setFields) {
  if (!element) return
  const name = fieldFromTarget(element)
  if (!name) return

  const current = element.value
  const start = element.selectionStart ?? current.length
  const end = element.selectionEnd ?? current.length
  const next = `${current.slice(0, start)}${value}${current.slice(end)}`
  const limit = name === 'message' ? 4000 : name === 'email' ? 254 : 100
  if (next.length > limit) return

  setFields((fields) => ({ ...fields, [name]: next }))
  requestAnimationFrame(() => {
    element.focus()
    element.setSelectionRange(start + value.length, start + value.length)
  })
}

export default function CorrespondencePage() {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [activeKey, setActiveKey] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [statusKind, setStatusKind] = useState('')
  const formRef = useRef(null)
  const activeFieldRef = useRef(null)
  const activeKeyTimer = useRef(null)
  const sendingRef = useRef(false)

  const updateField = (event) => {
    event.target.setCustomValidity('')
    setStatus('')
    setStatusKind('')
    setFields((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const flashKey = useCallback((key) => {
    setActiveKey(key.toUpperCase())
    window.clearTimeout(activeKeyTimer.current)
    activeKeyTimer.current = window.setTimeout(() => setActiveKey(''), 140)
  }, [])

  const typeKey = useCallback((key) => {
    const focused = fieldFromTarget(document.activeElement)
      ? document.activeElement
      : activeFieldRef.current || formRef.current?.elements.namedItem('name')
    const fieldName = fieldFromTarget(focused)
    if (!fieldName) return
    flashKey(key === ' ' ? 'SPACE' : key)

    if (key === 'Backspace') {
      const value = focused.value
      const start = focused.selectionStart ?? value.length
      const end = focused.selectionEnd ?? value.length
      const from = start === end ? Math.max(0, start - 1) : start
      const to = end
      const next = `${value.slice(0, from)}${value.slice(to)}`
      setFields((fields) => ({ ...fields, [fieldName]: next }))
      requestAnimationFrame(() => {
        focused.focus()
        focused.setSelectionRange(from, from)
      })
      return
    }

    if (key === 'Enter') {
      if (fieldName === 'message') insertAtSelection(focused, '\n', setFields)
      else {
        const nextName = fieldName === 'name' ? 'email' : 'message'
        formRef.current?.elements.namedItem(nextName)?.focus()
      }
      return
    }

    insertAtSelection(focused, key, setFields)
  }, [flashKey])

  const submitMessage = async (event) => {
    event.preventDefault()
    if (sendingRef.current) return

    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name')
    const emailInput = form.elements.namedItem('email')
    const messageInput = form.elements.namedItem('message')
    const emptyRequiredField = [
      [nameInput, 'Please enter your name.'],
      [emailInput, 'Please enter your email address.'],
      [messageInput, 'Please enter a message.'],
    ].find(([input]) => !input.value.trim())

    if (emptyRequiredField) {
      const [input, message] = emptyRequiredField
      input.setCustomValidity(message)
      form.reportValidity()
      input.focus()
      return
    }

    if (!form.reportValidity()) return

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatusKind('error')
      setStatus('No message was sent. Email delivery is not configured; please try again later.')
      return
    }

    sendingRef.current = true
    setSending(true)
    setStatus('')
    setStatusKind('')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      )
      setStatusKind('success')
      setStatus('Your letter has been sent successfully.')
      setFields(INITIAL_FIELDS)
    } catch {
      setStatusKind('error')
      setStatus('The email service could not send your letter. Please check your connection and try again.')
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  const onPhysicalKeyDown = (event) => {
    const key = event.key === ' '
      ? 'SPACE'
      : event.key === 'Enter'
        ? 'ENTER'
        : event.key === 'Backspace'
          ? 'BACKSPACE'
          : event.key.toUpperCase()
    if (key.length === 1 || ['BACKSPACE', 'ENTER', 'SPACE'].includes(key)) flashKey(key)
    if (event.key === 'Enter' && event.target?.tagName === 'INPUT') {
      event.preventDefault()
      const nextName = event.target?.name === 'name' ? 'email' : 'message'
      formRef.current?.elements.namedItem(nextName)?.focus()
    }
  }

  const keyButton = (key, extraClass = '', style = {}) => (
    <button
      key={key}
      type="button"
      className={`correspondence-typewriter__key${extraClass ? ` ${extraClass}` : ''}${activeKey === (key === ' ' ? 'SPACE' : key === 'Enter' ? 'ENTER' : key === 'Backspace' ? 'BACKSPACE' : key.toUpperCase()) ? ' is-pressed' : ''}`}
      style={style}
      aria-label={key === ' ' ? 'Type a space' : key === 'Enter' ? 'Type a return' : key === 'Backspace' ? 'Delete one character' : `Type ${key}`}
      tabIndex={-1}
      disabled={sending}
      onClick={() => typeKey(key)}
    />
  )

  return (
    <section className="correspondence-page" aria-labelledby="correspondence-title">
      <header className="correspondence-heading">
        <p>ARCHIVE V · PRIVATE CORRESPONDENCE</p>
        <h1 id="correspondence-title">Correspondence</h1>
        <span aria-hidden="true">A letter for the archivist</span>
      </header>

      <div className="correspondence-typewriter" onKeyDownCapture={onPhysicalKeyDown}>
        <div className="correspondence-typewriter__machine" aria-label="Antique mechanical typewriter">
          <img src={TYPEWRITER_IMAGE} alt="Antique mechanical typewriter with paper in its carriage" draggable="false" />
          <form ref={formRef} className="correspondence-typewriter__paper" onSubmit={submitMessage}>
            <label className="correspondence-typewriter__field">
              <span>Name</span>
              <input name="name" autoComplete="name" required maxLength={100} value={fields.name} onFocus={(event) => { activeFieldRef.current = event.currentTarget }} onChange={updateField} />
            </label>
            <label className="correspondence-typewriter__field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required maxLength={254} value={fields.email} onFocus={(event) => { activeFieldRef.current = event.currentTarget }} onChange={updateField} />
            </label>
            <label className="correspondence-typewriter__field correspondence-typewriter__field--message">
              <span>Message</span>
              <textarea name="message" required rows={2} maxLength={4000} value={fields.message} onFocus={(event) => { activeFieldRef.current = event.currentTarget }} onChange={updateField} />
            </label>
            <button className="correspondence-typewriter__send" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          {NUMBER_KEYS.map((key, index) => keyButton(key, 'is-number', { left: `${26.8 + index * 4.12}%`, top: '63.1%' }))}
          {KEY_ROWS.map((row) => row.keys.map((key, index) => keyButton(key, '', { left: `${row.start + index * row.step}%`, top: `${row.y}%` })))}
          {keyButton(' ', 'is-space', { left: '50%', top: '85.8%' })}
          {keyButton('Enter', 'is-return', { left: '75.8%', top: '32.2%' })}
          {keyButton('Backspace', 'is-backspace', { left: '21.5%', top: '32.2%' })}
        </div>

        <p className={`correspondence-typewriter__status${statusKind ? ` is-${statusKind}` : ''}`} role={statusKind === 'error' ? 'alert' : 'status'} aria-live="polite">
          {status}
        </p>
      </div>

      <p className="correspondence-delivery-note">
        {EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
          ? 'Letters are sent through the archive correspondence service.'
          : 'Email delivery is not configured. A letter will not be sent until EmailJS settings are provided.'}
      </p>
    </section>
  )
}
