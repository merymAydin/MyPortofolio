/**
 * A pinned parchment section on a case-study board.
 *
 * @param {Object} props
 * @param {string} [props.id] - Optional anchor id.
 * @param {string} props.title - Section heading.
 * @param {string} [props.className] - Layout and rotation class names.
 * @param {import('react').ReactNode} props.children - Section content.
 */
export default function CasePaper({ id, title, className = '', children }) {
  return (
    <section id={id} className={`dossier-paper ${className}`.trim()}>
      <span className="brass-pin dossier-paper__pin" aria-hidden="true" />
      <h2 className="dossier-paper__heading">{title}</h2>
      <div className="dossier-paper__body">{children}</div>
    </section>
  )
}
