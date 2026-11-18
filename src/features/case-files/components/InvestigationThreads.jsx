import { useLayoutEffect, useRef, useState } from 'react'

const THREAD_PATHS = {
  detail: [
    'M 256 185 C 470 80, 830 55, 1080 84',
    'M 1080 84 C 1050 250, 950 370, 840 500',
    'M 840 500 C 1010 425, 1210 430, 1380 520',
    'M 256 185 C 300 460, 350 690, 410 890',
    'M 410 890 C 650 770, 940 780, 1160 900',
    'M 1160 900 C 1240 740, 1320 650, 1380 520',
    'M 220 1230 C 450 1120, 760 1120, 1080 1240',
    'M 1080 1240 C 900 1430, 670 1570, 454 1710',
    'M 454 1710 C 730 1600, 1100 1600, 1400 1740',
    'M 1400 1740 C 1270 1910, 1100 2040, 915 2140',
  ],
}

const OVERVIEW_CONNECTIONS = [
  ['.case-card--1 .case-card__pin', '.case-card--2 .case-card__pin'],
  ['.case-card--2 .case-card__pin', '.case-card--3 .case-card__pin'],
  ['.case-card--3 .case-card__pin', '.case-card--1 .case-card__pin'],
]

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

const DETAIL_PIN_POINTS = [
  [256, 185], [1080, 84], [840, 500], [1380, 520], [410, 890],
  [1160, 900], [220, 1230], [1080, 1240], [454, 1710], [1400, 1740], [915, 2140],
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
  const layoutRef = useRef(null)
  const [overview, setOverview] = useState({ width: 1, height: 1, paths: [] })
  const viewBox = variant === 'detail' ? '0 0 1600 2200' : `0 0 ${overview.width} ${overview.height}`

  if (variant === 'detail') {
    const paths = THREAD_PATHS.detail
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
          <g className="evidence-thread__pins">
            {DETAIL_PIN_POINTS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" />)}
          </g>
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

  return <OverviewThreads layoutRef={layoutRef} data={overview} setData={setOverview} className={className} />
}

function OverviewThreads({ layoutRef, data, setData, className }) {
  useLayoutEffect(() => {
    const board = layoutRef.current?.parentElement
    if (!board) return undefined

    const measure = () => {
      const boardBox = board.getBoundingClientRect()
      const width = Math.max(1, boardBox.width)
      const height = Math.max(1, board.scrollHeight, boardBox.height)
      const paths = OVERVIEW_CONNECTIONS.flatMap(([fromSelector, toSelector], index) => {
        const from = board.querySelector(fromSelector)?.getBoundingClientRect()
        const to = board.querySelector(toSelector)?.getBoundingClientRect()
        if (!from || !to) return []

        const start = {
          x: from.left + from.width / 2 - boardBox.left,
          y: from.top + from.height / 2 - boardBox.top,
        }
        const end = {
          x: to.left + to.width / 2 - boardBox.left,
          y: to.top + to.height / 2 - boardBox.top,
        }
        const dx = end.x - start.x
        const dy = end.y - start.y
        const length = Math.hypot(dx, dy) || 1
        const curve = Math.min(54, length * 0.07) * (index % 2 === 0 ? -1 : 1)
        const control = {
          x: (start.x + end.x) / 2 - (dy / length) * curve,
          y: (start.y + end.y) / 2 + (dx / length) * curve,
        }
        return [{ d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${control.x.toFixed(1)} ${control.y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}` }]
      })

      setData((current) => ({ ...current, width, height, paths }))
    }

    const observer = new ResizeObserver(measure)
    observer.observe(board)
    board.querySelectorAll('.case-card__pin').forEach((pin) => observer.observe(pin))
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [layoutRef, setData])

  return (
    <svg
      ref={layoutRef}
      className={`evidence-threads evidence-threads--overview ${className}`.trim()}
      viewBox={`0 0 ${data.width} ${data.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {data.paths.map((path) => (
        <g key={path.d}>
          <path className="evidence-thread evidence-thread--shadow" d={path.d} />
          <path className="evidence-thread evidence-thread--cord" d={path.d} />
          <path className="evidence-thread evidence-thread--twist" d={path.d} />
        </g>
      ))}
    </svg>
  )
}
