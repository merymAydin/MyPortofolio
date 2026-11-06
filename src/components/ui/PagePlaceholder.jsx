import '../../styles/components/page.css'

/**
 * Temporary shared shell for section pages until the real designs exist.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow] - Small archive classification label.
 * @param {string} props.title - Page heading.
 * @param {string} [props.description] - Short neutral description.
 * @param {import('react').ReactNode} [props.children] - Optional extra content.
 */
export default function PagePlaceholder({ eyebrow, title, description, children }) {
  return (
    <article className="page">
      {eyebrow ? <p className="page__eyebrow">{eyebrow}</p> : null}
      <h1 className="page__title">{title}</h1>
      {description ? <p className="page__description">{description}</p> : null}
      {children}
      <p className="page__note">This section has not been built yet.</p>
    </article>
  )
}
