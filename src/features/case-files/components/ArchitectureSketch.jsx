/**
 * A hand-drawn three-stage architecture sketch for the dossier.
 *
 * @param {Object} props
 * @param {Array<{ title: string, detail: string }>} props.nodes - Ordered architecture stages.
 */
export default function ArchitectureSketch({ nodes }) {
  const label = nodes.map((node) => `${node.title}: ${node.detail}`).join('. ')

  return (
    <div className="architecture-sketch" role="img" aria-label={label}>
      <svg viewBox="0 0 900 180" aria-hidden="true" focusable="false">
        <defs>
          <marker
            id="case-study-arrow"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L10,4 L0,8 Z" fill="currentColor" />
          </marker>
        </defs>
        <path d="M275 88 H345 M555 88 H625" markerEnd="url(#case-study-arrow)" />
        <path d="M345 104 H275 M625 104 H555" markerEnd="url(#case-study-arrow)" />
      </svg>

      {nodes.map((node, index) => (
        <div className={`architecture-node architecture-node--${index + 1}`} key={node.title}>
          <span className="architecture-node__number">0{index + 1}</span>
          <h3>{node.title}</h3>
          <p>{node.detail}</p>
        </div>
      ))}
    </div>
  )
}
