import { useCallback, useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const INITIAL_FIELDS = { name: '', email: '', message: '' }
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim()
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim()
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()

function fieldNameOf(target) {
  return target?.name && Object.hasOwn(INITIAL_FIELDS, target.name) ? target.name : null
}

export default function useTypewriterEmail() {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [statusKind, setStatusKind] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const formRef = useRef(null)
  const activeFieldRef = useRef(null)
  const sendingRef = useRef(false)
  const activeKeyTimer = useRef(null)

  const flashKey = useCallback((key) => {
    setActiveKey(key.toUpperCase())
    window.clearTimeout(activeKeyTimer.current)
    activeKeyTimer.current = window.setTimeout(() => setActiveKey(''), 145)
  }, [])

  useEffect(() => () => window.clearTimeout(activeKeyTimer.current), [])

  const updateField = useCallback((event) => {
    event.target.setCustomValidity('')
    setStatus('')
    setStatusKind('')
    setFields((current) => ({ ...current, [event.target.name]: event.target.value }))
  }, [])

  const focusField = useCallback((name) => {
    const field = formRef.current?.elements.namedItem(name)
    field?.focus()
  }, [])

  const typeKey = useCallback((key) => {
    const focused = fieldNameOf(document.activeElement)
      ? document.activeElement
      : activeFieldRef.current || formRef.current?.elements.namedItem('name')
    const fieldName = fieldNameOf(focused)
    if (!fieldName || sendingRef.current) return

    flashKey(key === ' ' ? 'SPACE' : key)
    focused.setCustomValidity('')
    setStatus('')
    setStatusKind('')

    if (key === 'Enter') {
      if (fieldName === 'message') insertText(focused, '\n', fieldName, setFields)
      else focusField(fieldName === 'name' ? 'email' : 'message')
      return
    }

    if (key === 'Backspace') {
      const value = focused.value
      const start = focused.selectionStart ?? value.length
      const end = focused.selectionEnd ?? value.length
      const from = start === end ? Math.max(0, start - 1) : start
      setFields((current) => ({ ...current, [fieldName]: `${value.slice(0, from)}${value.slice(end)}` }))
      requestAnimationFrame(() => {
        focused.focus()
        focused.setSelectionRange(from, from)
      })
      return
    }

    insertText(focused, key, fieldName, setFields)
  }, [flashKey, focusField])

  const handleKeyDown = useCallback((event) => {
    const key = event.key === ' ' ? 'SPACE'
      : event.key === 'Enter' ? 'ENTER'
        : event.key === 'Backspace' ? 'BACKSPACE'
          : event.key.length === 1 ? event.key.toUpperCase() : ''
    if (key) flashKey(key)

    if (event.key === 'Enter' && event.target?.tagName === 'INPUT') {
      event.preventDefault()
      focusField(event.target.name === 'name' ? 'email' : 'message')
    }
  }, [flashKey, focusField])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    if (sendingRef.current) return

    const form = event.currentTarget
    const inputs = [
      [form.elements.namedItem('name'), 'Please enter your name.'],
      [form.elements.namedItem('email'), 'Please enter your email address.'],
      [form.elements.namedItem('message'), 'Please enter a message.'],
    ]
    const emptyField = inputs.find(([input]) => !input.value.trim())
    if (emptyField) {
      const [input, message] = emptyField
      input.setCustomValidity(message)
      form.reportValidity()
      input.focus()
      return
    }
    if (!form.reportValidity()) return

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
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
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: fields.name.trim(),
          email: fields.email.trim(),
          message: fields.message.trim(),
        },
        { publicKey: PUBLIC_KEY },
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
  }, [fields])

  return {
    activeFieldRef,
    activeKey,
    fields,
    flashKey,
    formRef,
    handleKeyDown,
    handleSubmit,
    isConfigured: Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY),
    sending,
    status,
    statusKind,
    typeKey,
    updateField,
  }
}

function insertText(element, text, fieldName, setFields) {
  const value = element.value
  const start = element.selectionStart ?? value.length
  const end = element.selectionEnd ?? value.length
  const next = `${value.slice(0, start)}${text}${value.slice(end)}`
  const limit = fieldName === 'message' ? 4000 : fieldName === 'email' ? 254 : 100
  if (next.length > limit) return

  setFields((current) => ({ ...current, [fieldName]: next }))
  requestAnimationFrame(() => {
    element.focus()
    element.setSelectionRange(start + text.length, start + text.length)
  })
}
