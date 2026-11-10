const THREAD_PATHS = {
  overview: [
    'M 168 470 C 416 318, 862 314, 1112 456',
    'M 1112 456 C 1048 692, 920 846, 742 1006',
    'M 168 470 C 292 694, 510 884, 742 1006',
  ],
  detail: [
    'M 235 185 C 470 72, 840 62, 1080 84',
    'M 1080 84 C 1080 278, 980 344, 895 492',
    'M 895 492 C 1080 418, 1240 420, 1420 520',
    'M 235 185 C 130 410, 150 620, 238 805',
    'M 238 805 C 390 720, 590 780, 810 860',
    'M 810 860 C 1010 760, 1220 680, 1420 520',
    'M 220 1230 C 430 1120, 700 1125, 980 1240',
    'M 980 1240 C 850 1420, 660 1540, 454 1710',
    'M 454 1710 C 740 1600, 1110 1610, 1400 1740',
    'M 1400 1740 C 1300 1900, 1120 2020, 915 2140',
  ],
}

const DETAIL_MOBILE_PATHS = [
  'M 75 100 C 200 160, 280 250, 330 420',
  'M 330 420 C 245 560, 195 680, 115 830',
  'M 115 830 C 230 930, 300 1050, 330 1240',
  'M 330 1240 C 230 1380, 190 1520, 105 1690',
  'M 105 1690 C 220 1830, 300 1940, 330 2140',
  'M 330 2140 C 230 2290, 190 2440, 105 2610',
  'M 105 2610 C 220 2760, 300 2890, 330 3080',
  'M 330 3080 C 230 3230, 190 3390, 90 3560',
  'M 90 3560 C 190 3710, 260 3870, 210 4020',
]

/**
 * Red evidence thread pinned across the investigation board.
 * Purely decorative, so it is removed from the accessibility tree.
 *
 * @param {Object} props
 * @param {'overview' | 'detail'} [props.variant] - Board composition to fit.
 * @param {string} [props.className] - Additional class names.
 */
export default function InvestigationThreads({ variant = 'overview', className = '' }) {
  const paths = THREAD_PATHS[variant] ?? THREAD_PATHS.overview
  const viewBox = variant === 'detail' ? '0 0 1600 2200' : '0 0 1600 1400'

  if (variant === 'detail') {
    return (
      <>
        <svg
          className={`evidence-threads evidence-threads--detail evidence-threads--detail-desktop ${className}`.trim()}
          viewBox={viewBox}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {paths.map((d) => <g key={d}>
            <path className="evidence-thread evidence-thread--shadow" d={d} />
            <path className="evidence-thread evidence-thread--cord" d={d} />
            <path className="evidence-thread evidence-thread--twist" d={d} />
          </g>)}
        </svg>
        <svg
          className={`evidence-threads evidence-threads--detail evidence-threads--detail-mobile ${className}`.trim()}
          viewBox="0 0 420 4200"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {DETAIL_MOBILE_PATHS.map((d) => <g key={d}>
            <path className="evidence-thread evidence-thread--shadow" d={d} />
            <path className="evidence-thread evidence-thread--cord" d={d} />
            <path className="evidence-thread evidence-thread--twist" d={d} />
          </g>)}
        </svg>
      </>
    )
  }

  return (
    <svg
      className={`evidence-threads evidence-threads--${variant} ${className}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => (
        <g key={d}>
          <path className="evidence-thread evidence-thread--shadow" d={d} />
          <path className="evidence-thread evidence-thread--cord" d={d} />
          <path className="evidence-thread evidence-thread--twist" d={d} />
        </g>
      ))}
    </svg>
  )
}
