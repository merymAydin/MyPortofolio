import { useState } from 'react'

import '../../../styles/components/page.css'
import './correspondence.css'

const INITIAL_FIELDS = { name: '', email: '', message: '' }

export default function CorrespondencePage() {
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [submitted, setSubmitted] = useState(false)

  const updateField = (event) => {
    setSubmitted(false)
    setFields((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitMessage = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setSubmitted(true)
  }

  return (
    <article className="page correspondence-page">
      <p className="page__eyebrow">Archive V</p>
      <h1 className="page__title">Correspondence</h1>
      <p className="page__description">Send a message using the form below.</p>

      <form className="correspondence-form" onSubmit={submitMessage}>
        <label htmlFor="correspondence-name">Name</label>
        <input
          id="correspondence-name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          value={fields.name}
          onChange={updateField}
        />

        <label htmlFor="correspondence-email">Email address</label>
        <input
          id="correspondence-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={fields.email}
          onChange={updateField}
        />

        <label htmlFor="correspondence-message">Message</label>
        <textarea
          id="correspondence-message"
          name="message"
          required
          rows={7}
          maxLength={4000}
          value={fields.message}
          onChange={updateField}
        />

        <button type="submit">Prepare Message</button>
        <p className="correspondence-form__status" role="status" aria-live="polite">
          {submitted ? 'Your message is ready. Delivery is not configured in this preview.' : ''}
        </p>
      </form>
    </article>
  )
}
