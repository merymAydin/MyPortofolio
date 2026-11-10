/**
 * A pinned parchment section on the case-study board.
 *
 * @param {Object} props
 * @param {string} [props.id] - Optional anchor id.
 * @param {string} props.title - Section heading.
 * @param {string} [props.className] - Layout and rotation class names.
 * @param {import('react').ReactNode} props.children - Section content.
 */
export default function CasePaper({ id, title, className = '', children }) {
  return (
    <section id={id} className={`case-paper ${className}`.trim()}>
      <span className="case-paper__pin brass-pin" aria-hidden="true" />
      <h2 className="case-paper__heading">{title}</h2>
      <div className="case-paper__body">{children}</div>
    </section>
  )
}
