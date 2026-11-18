export default function TypewriterMessageForm({
  controller,
  className,
  autoFocusName = false,
  statusOnPaper = false,
}) {
  const {
    activeFieldRef,
    fields,
    formRef,
    handleKeyDown,
    handleSubmit,
    sending,
    status,
    statusKind,
    updateField,
  } = controller
  const displayedStatus = statusOnPaper && status
    ? statusKind === 'success' ? 'Letter sent successfully.' : 'Could not send. Please try again.'
    : status

  return (
    <form
      ref={formRef}
      className={`typewriter-message-form ${className}`}
      onSubmit={handleSubmit}
      onKeyDownCapture={handleKeyDown}
    >
      <label className="correspondence-typewriter__field">
        <span>Name</span>
        <input
          name="name"
          autoComplete="name"
          autoFocus={autoFocusName}
          required
          maxLength={100}
          value={fields.name}
          onFocus={(event) => { activeFieldRef.current = event.currentTarget }}
          onChange={updateField}
        />
      </label>
      <label className="correspondence-typewriter__field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={fields.email}
          onFocus={(event) => { activeFieldRef.current = event.currentTarget }}
          onChange={updateField}
        />
      </label>
      <label className="correspondence-typewriter__field correspondence-typewriter__field--message">
        <span>Message</span>
        <textarea
          name="message"
          required
          rows={2}
          maxLength={4000}
          value={fields.message}
          onFocus={(event) => { activeFieldRef.current = event.currentTarget }}
          onChange={updateField}
        />
      </label>
      <button className="correspondence-typewriter__send" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send Message'}
      </button>
      {statusOnPaper && displayedStatus && (
        <p className={`typewriter-message-form__status is-${statusKind}`} role={statusKind === 'error' ? 'alert' : 'status'} aria-live="polite">
          {displayedStatus}
        </p>
      )}
    </form>
  )
}
