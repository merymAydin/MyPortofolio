import { Link } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ROUTES } from '../../../app/routePaths.js'

const OPEN_SCENE_IMAGE = '/reference/open-journal-interaction-scene-clean-corner.png'
const MAGNIFIER_IMAGE = '/reference/antique-magnifying-glass.png'
const VIAL_IMAGE = '/reference/amber-vial-body.png'
const CORK_IMAGE = '/reference/amber-vial-cork.png'
const SCENE_WIDTH = 1672
const SCENE_HEIGHT = 941
const PAGES = [
  { label: 'The Author', detail: 'About Me', to: ROUTES.author, box: [405, 285, 400, 78] },
  { label: 'The Laboratory', detail: 'Technical Skills', to: ROUTES.laboratory, box: [405, 450, 400, 78] },
  { label: 'Case Files', detail: 'Projects', to: ROUTES.caseFiles, box: [405, 615, 400, 78] },
  { label: 'The Chronicles', detail: 'Education & Experience', to: ROUTES.chronicles, box: [872, 350, 405, 78] },
  { label: 'Correspondence', detail: 'Contact & CV', to: ROUTES.correspondence, box: [872, 535, 405, 78] },
]
const MAG_SIZE = { width: 290, height: 460 }
const VIAL_SIZE = { width: 155, height: 245 }
const INITIAL_MAG = { x: 0, y: 345 }
const INITIAL_VIAL = { x: 1405, y: 130 }

function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9v6h4l5 4V5L7 9H3Z" />
      {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M16 9a5 5 0 0 1 0 6m2-9a8 8 0 0 1 0 12" />}
    </svg>
  )
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
      <path d="M4 4l6 6m10-6-6 6m6 10-6-6M4 20l6-6" />
    </svg>
  )
}

function PageLinks({ positionOnScene }) {
  return (
    <nav className="open-journal-scene__links" aria-label="Portfolio sections">
      {PAGES.map(({ label, detail, to, box }) => (
        <Link key={to} to={to} style={positionOnScene(box)}>
          <span>{label}</span>
          <small className="open-journal-scene__ink-accessible">{detail}</small>
        </Link>
      ))}
    </nav>
  )
}

function clampPosition(position, size) {
  return {
    x: Math.min(Math.max(0, position.x), SCENE_WIDTH - size.width),
    y: Math.min(Math.max(0, position.y), SCENE_HEIGHT - size.height),
  }
}

/** Full-screen overhead scene with persistent physical-object interactions. */
export default function OpenJournalScene({
  imageRef,
  onImageLoad,
  positionOnScene,
  cover,
  onClose,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
}) {
  const [inspectionEnabled, setInspectionEnabled] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState(INITIAL_MAG)
  const [vialPosition, setVialPosition] = useState(INITIAL_VIAL)
  const [corkPosition] = useState({ x: INITIAL_VIAL.x - 14, y: INITIAL_VIAL.y - 57 })
  const [corkOpened, setCorkOpened] = useState(false)
  const [vialSelected, setVialSelected] = useState(false)
  const [pourStarted, setPourStarted] = useState(false)
  const [pouring, setPouring] = useState(false)
  const [vialAngle, setVialAngle] = useState(0)
  const [pourPoint, setPourPoint] = useState(null)
  const [sceneBounds, setSceneBounds] = useState(null)
  const sceneRef = useRef(null)
  const revealCanvasRef = useRef(null)
  const inspectionCanvasRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const inkCanvasRef = useRef(null)
  const drawRevealedInkRef = useRef(() => {})
  const dragRef = useRef(null)
  const didDragRef = useRef(false)

  const toScenePoint = useCallback((clientX, clientY) => {
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect || !cover) return null
    return {
      x: Math.min(SCENE_WIDTH, Math.max(0, (clientX - rect.left - cover.left) / cover.scale)),
      y: Math.min(SCENE_HEIGHT, Math.max(0, (clientY - rect.top - cover.top) / cover.scale)),
    }
  }, [cover])

  const drawRevealedInk = useCallback(() => {
    const mask = maskCanvasRef.current
    const ink = inkCanvasRef.current
    const canvas = revealCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!mask || !ink || !canvas || !ctx || !cover) return

    const inkCtx = ink.getContext('2d')
    inkCtx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT)
    inkCtx.fillStyle = '#28170d'
    inkCtx.textAlign = 'center'
    inkCtx.textBaseline = 'middle'
    PAGES.forEach(({ detail, box }) => {
      inkCtx.font = '700 44px "Cormorant Garamond", Georgia, serif'
      inkCtx.fillText(detail, box[0] + box[2] / 2, box[1] + 58, box[2] - 35)
    })
    inkCtx.globalCompositeOperation = 'destination-in'
    inkCtx.drawImage(mask, 0, 0)
    inkCtx.globalCompositeOperation = 'source-over'

    const rect = sceneRef.current.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
    }
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.drawImage(ink, cover.left, cover.top, SCENE_WIDTH * cover.scale, SCENE_HEIGHT * cover.scale)
  }, [cover])
  useEffect(() => {
    drawRevealedInkRef.current = drawRevealedInk
  }, [drawRevealedInk])

  const addRevealPoint = useCallback((point) => {
    const onPage = point.y >= 105 && point.y <= 810 && (
      (point.x >= 345 && point.x <= 822) || (point.x >= 852 && point.x <= 1318)
    )
    if (!onPage) return
    const mask = maskCanvasRef.current
    if (!mask) return
    const ctx = mask.getContext('2d')
    const gradient = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, 78)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.58, 'rgba(255,255,255,0.94)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(point.x, point.y, 78, 0, Math.PI * 2)
    ctx.fill()
    drawRevealedInk()
  }, [drawRevealedInk])

  const addRevealSegment = useCallback((start, end) => {
    const mask = maskCanvasRef.current
    if (!mask) return
    const dx = end.x - start.x
    const dy = end.y - start.y
    const distance = Math.hypot(dx, dy)
    const steps = Math.max(1, Math.ceil(distance / 20))
    const ctx = mask.getContext('2d')
    let painted = false

    for (let step = 1; step <= steps; step += 1) {
      const point = { x: start.x + dx * step / steps, y: start.y + dy * step / steps }
      const onPage = point.y >= 105 && point.y <= 810 && (
        (point.x >= 345 && point.x <= 822) || (point.x >= 852 && point.x <= 1318)
      )
      if (!onPage) continue
      const gradient = ctx.createRadialGradient(point.x, point.y, 2, point.x, point.y, 78)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.58, 'rgba(255,255,255,0.94)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, 78, 0, Math.PI * 2)
      ctx.fill()
      painted = true
    }
    if (painted) drawRevealedInk()
  }, [drawRevealedInk])

  useEffect(() => {
    const mask = document.createElement('canvas')
    mask.width = SCENE_WIDTH
    mask.height = SCENE_HEIGHT
    const ink = document.createElement('canvas')
    ink.width = SCENE_WIDTH
    ink.height = SCENE_HEIGHT
    maskCanvasRef.current = mask
    inkCanvasRef.current = ink
    const resize = () => {
      const rect = sceneRef.current?.getBoundingClientRect()
      if (rect) setSceneBounds({ width: rect.width, height: rect.height })
      drawRevealedInkRef.current()
    }
    resize()
    const observer = new ResizeObserver(resize)
    if (sceneRef.current) observer.observe(sceneRef.current)
    window.addEventListener('resize', resize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  const startDrag = (kind, size) => (event) => {
    if (kind === 'vial' && !corkOpened) {
      setVialSelected(true)
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const pointer = toScenePoint(event.clientX, event.clientY)
    if (!pointer) return
    const position = kind === 'vial' ? vialPosition : magnifierPosition
    const pivotX = kind === 'vial' ? size.width * 0.31 : 0
    const pivotY = kind === 'vial' ? size.height * 0.13 : 0
    const radians = kind === 'vial' ? vialAngle * Math.PI / 180 : 0
    const offsetX = pointer.x - position.x - pivotX
    const offsetY = pointer.y - position.y - pivotY
    dragRef.current = {
      kind,
      pointerId: event.pointerId,
      offsetX: pivotX + offsetX * Math.cos(radians) + offsetY * Math.sin(radians),
      offsetY: pivotY - offsetX * Math.sin(radians) + offsetY * Math.cos(radians),
      startX: pointer.x,
      startY: pointer.y,
      lastX: pointer.x,
      lastY: pointer.y,
      startPosition: position,
      size,
    }
    didDragRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
    if (kind === 'vial') {
      setVialSelected(true)
      setPouring(false)
    }
  }

  const handleScenePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    const point = toScenePoint(event.clientX, event.clientY)
    if (!point) return
    if (drag.kind === 'magnifier') {
      const position = clampPosition({ x: point.x - drag.offsetX, y: point.y - drag.offsetY }, drag.size)
      setMagnifierPosition(position)
      if (Math.hypot(point.x - drag.startX, point.y - drag.startY) > 5) didDragRef.current = true
      drag.lastX = point.x
      drag.lastY = point.y
      return
    }

    const dx = point.x - drag.startX
    const dy = point.y - drag.startY
    if (Math.hypot(dx, dy) > 5) didDragRef.current = true
    const angle = Math.max(-62, Math.min(62, dx * 0.36 - dy * 0.12))
    const pivotX = drag.size.width * 0.31
    const pivotY = drag.size.height * 0.13
    const localX = drag.offsetX - pivotX
    const localY = drag.offsetY - pivotY
    const radians = angle * Math.PI / 180
    const rotatedX = localX * Math.cos(radians) - localY * Math.sin(radians)
    const rotatedY = localX * Math.sin(radians) + localY * Math.cos(radians)
    const position = clampPosition({
      x: point.x - pivotX - rotatedX,
      y: point.y - pivotY - rotatedY,
    }, drag.size)
    setVialPosition(position)
    setVialAngle(angle)
    const mouth = { x: position.x + drag.size.width * 0.31, y: position.y + drag.size.height * 0.13 }
    const contact = { x: mouth.x, y: mouth.y + 36 }
    const isOnPage = contact.y > 100 && contact.y < 815 && (
      (contact.x > 345 && contact.x < 822) || (contact.x > 852 && contact.x < 1318)
    )
    const shouldPour = Math.abs(angle) > 19 && isOnPage
    setPouring(shouldPour)
    setPourPoint(shouldPour ? contact : null)
    if (shouldPour) {
      setPourStarted(true)
      const previousPoint = drag.lastPourPoint
      if (previousPoint && Math.hypot(contact.x - previousPoint.x, contact.y - previousPoint.y) < 250) {
        addRevealSegment(previousPoint, contact)
      } else {
        addRevealPoint(contact)
      }
      drag.lastPourPoint = contact
    } else {
      drag.lastPourPoint = null
    }
    drag.lastX = point.x
    drag.lastY = point.y
  }

  const endDrag = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return
    dragRef.current = null
    setPouring(false)
    setVialAngle(0)
    setPourPoint(null)
  }

  const openCork = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setVialSelected(true)
    setCorkOpened(true)
  }

  const startCorkRelease = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    setVialSelected(true)
    setCorkOpened(true)
  }

  const toggleInspection = (event) => {
    event.stopPropagation()
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    setInspectionEnabled((active) => {
      const next = !active
      if (!next) {
        const ctx = inspectionCanvasRef.current?.getContext('2d')
        ctx?.clearRect(0, 0, inspectionCanvasRef.current.width, inspectionCanvasRef.current.height)
      }
      return next
    })
  }

  const moveByKeyboard = (setPosition, position, size, event) => {
    const step = event.shiftKey ? 24 : 10
    const directions = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    setPosition(clampPosition({ x: position.x + direction[0], y: position.y + direction[1] }, size))
  }

  const magStyle = positionOnScene([magnifierPosition.x, magnifierPosition.y, MAG_SIZE.width, MAG_SIZE.height])
  const vialStyle = positionOnScene([vialPosition.x, vialPosition.y, VIAL_SIZE.width, VIAL_SIZE.height])
  const corkHitStyle = positionOnScene([corkPosition.x, corkPosition.y, 116, 118])
  const pageHover = (event) => {
    const lens = inspectionCanvasRef.current
    const ctx = lens?.getContext('2d')
    if (!inspectionEnabled || !cover) {
      if (ctx && lens) ctx.clearRect(0, 0, lens.width, lens.height)
      return
    }
    const pointer = toScenePoint(event.clientX, event.clientY)
    const activeDrag = dragRef.current?.kind === 'magnifier' ? dragRef.current : null
    const framePosition = activeDrag && pointer
      ? clampPosition({ x: pointer.x - activeDrag.offsetX, y: pointer.y - activeDrag.offsetY }, MAG_SIZE)
      : magnifierPosition
    const focus = { x: framePosition.x + 165, y: framePosition.y + 119 }
    const insideScene = focus.x >= 0 && focus.x <= SCENE_WIDTH && focus.y >= 0 && focus.y <= SCENE_HEIGHT
    if (!insideScene || !ctx || !sceneBounds) {
      if (ctx) ctx.clearRect(0, 0, lens.width, lens.height)
      return
    }
    const rect = sceneRef.current.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    if (lens.width !== Math.round(rect.width * ratio) || lens.height !== Math.round(rect.height * ratio)) {
      lens.width = Math.round(rect.width * ratio)
      lens.height = Math.round(rect.height * ratio)
    }
    lens.style.width = `${rect.width}px`
    lens.style.height = `${rect.height}px`
    // The inspection magnification stays clipped to the brass lens on the draggable object.
    const bounds = rect
    const lensCenterX = focus.x * cover.scale + cover.left
    const lensCenterY = focus.y * cover.scale + cover.top
    const radius = 90 * cover.scale
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, bounds.width, bounds.height)
    ctx.save()
    ctx.beginPath()
    ctx.arc(lensCenterX, lensCenterY, radius, 0, Math.PI * 2)
    ctx.clip()
    const zoom = 1.35
    const focalX = focus.x * cover.scale + cover.left
    const focalY = focus.y * cover.scale + cover.top
    ctx.translate(lensCenterX - focalX * zoom, lensCenterY - focalY * zoom)
    ctx.scale(zoom, zoom)
    ctx.drawImage(imageRef.current, cover.left, cover.top, SCENE_WIDTH * cover.scale, SCENE_HEIGHT * cover.scale)
    if (revealCanvasRef.current) {
      ctx.drawImage(revealCanvasRef.current, 0, 0, bounds.width, bounds.height)
    }
    PAGES.forEach(({ label, detail, box }) => {
      const labelX = cover.left + (box[0] + box[2] / 2) * cover.scale
      const labelY = cover.top + (box[1] + 39) * cover.scale
      ctx.fillStyle = '#49331f'
      ctx.font = `600 ${Math.max(12, 18 * cover.scale)}px Georgia, serif`
      ctx.textAlign = 'center'
      ctx.fillText(label, labelX, labelY)
      const detailX = box[0] + box[2] / 2
      const detailY = box[1] + 58
      const inkIsVisible = maskCanvasRef.current
        ?.getContext('2d')
        .getImageData(Math.round(detailX), Math.round(detailY), 1, 1).data[3] > 32
      if (inkIsVisible) {
        ctx.fillStyle = '#412a18'
        ctx.font = `italic ${Math.max(12, 20 * cover.scale)}px Georgia, serif`
        ctx.textAlign = 'center'
        ctx.fillText(detail, cover.left + detailX * cover.scale, cover.top + detailY * cover.scale)
      }
    })
    const vialImage = sceneRef.current.querySelector('.open-journal-scene__vial img')
    if (vialImage?.complete && vialImage.naturalWidth > 0) {
      const pivotX = VIAL_SIZE.width * 0.31 * cover.scale
      const pivotY = VIAL_SIZE.height * 0.13 * cover.scale
      ctx.save()
      ctx.translate(
        cover.left + (vialPosition.x + VIAL_SIZE.width * 0.31) * cover.scale,
        cover.top + (vialPosition.y + VIAL_SIZE.height * 0.13) * cover.scale,
      )
      ctx.rotate(vialAngle * Math.PI / 180)
      ctx.drawImage(
        vialImage,
        -pivotX,
        -pivotY,
        VIAL_SIZE.width * cover.scale,
        VIAL_SIZE.height * cover.scale,
      )
      ctx.restore()
    }
    const corkImage = sceneRef.current.querySelector('.open-journal-scene__cork-visual img')
    if (corkImage?.complete && corkImage.naturalWidth > 0) {
      const corkRect = corkImage.getBoundingClientRect()
      ctx.drawImage(
        corkImage,
        corkRect.left - rect.left,
        corkRect.top - rect.top,
        corkRect.width,
        corkRect.height,
      )
    }
    ctx.restore()
  }

  return (
    <section
      ref={sceneRef}
      className={`open-journal-scene${inspectionEnabled ? ' open-journal-scene--inspection' : ''}${pouring ? ' open-journal-scene--pouring' : ''}`}
      aria-label="Open journal"
      onPointerMove={(event) => { handleScenePointerMove(event); pageHover(event) }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => { if (!dragRef.current) pageHover({ clientX: -1000, clientY: -1000 }) }}
    >
      <img ref={imageRef} className="open-journal-scene__image" src={OPEN_SCENE_IMAGE} alt="An open antique journal on an overhead Victorian investigation desk" draggable="false" onLoad={onImageLoad} />
      <canvas ref={revealCanvasRef} className="open-journal-scene__reveal-canvas" aria-hidden="true" />
      <canvas ref={inspectionCanvasRef} className="open-journal-scene__inspection-canvas" aria-hidden="true" />
      <PageLinks positionOnScene={positionOnScene} />

      <button
        type="button"
        className={`open-journal-scene__object open-journal-scene__magnifier${inspectionEnabled ? ' is-active' : ''}`}
        style={magStyle}
        aria-label={inspectionEnabled ? 'Magnifier inspection on; use arrow keys to move, press Enter to turn off' : 'Turn on magnifier inspection; drag or use arrow keys to move'}
        aria-pressed={inspectionEnabled}
        onClick={toggleInspection}
        onPointerDown={startDrag('magnifier', MAG_SIZE)}
        onKeyDown={(event) => moveByKeyboard(setMagnifierPosition, magnifierPosition, MAG_SIZE, event)}
      >
        <img src={MAGNIFIER_IMAGE} alt="" draggable="false" />
      </button>

      <button
        type="button"
        className={`open-journal-scene__object open-journal-scene__vial${vialSelected ? ' is-selected' : ''}${pouring ? ' is-pouring' : ''}`}
        style={{ ...vialStyle, transform: `rotate(${vialAngle}deg)` }}
        aria-label={corkOpened ? 'Open vial; drag and tilt over the pages to reveal ink' : 'Select the chemical vial'}
        aria-pressed={vialSelected}
        onClick={(event) => { event.stopPropagation(); setVialSelected(true) }}
        onPointerDown={startDrag('vial', VIAL_SIZE)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setVialSelected(true)
          if (!corkOpened) return
          if (event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            event.preventDefault()
            const nextAngle = Math.max(-62, Math.min(62, vialAngle + (event.key === 'ArrowRight' ? 8 : -8)))
            const mouth = { x: vialPosition.x + VIAL_SIZE.width * 0.31, y: vialPosition.y + VIAL_SIZE.height * 0.13 }
            const contact = { x: mouth.x, y: mouth.y + 36 }
            const onPage = contact.y > 100 && contact.y < 815 && (
              (contact.x > 345 && contact.x < 822) || (contact.x > 852 && contact.x < 1318)
            )
            setVialAngle(nextAngle)
            setPouring(Math.abs(nextAngle) > 19 && onPage)
            setPourPoint(Math.abs(nextAngle) > 19 && onPage ? contact : null)
            if (Math.abs(nextAngle) > 19 && onPage) {
              setPourStarted(true)
              addRevealPoint(contact)
            }
            return
          }
          moveByKeyboard(setVialPosition, vialPosition, VIAL_SIZE, event)
        }}
        onKeyUp={(event) => {
          if (event.key.startsWith('Arrow')) {
            setVialAngle(0)
            setPouring(false)
            setPourPoint(null)
          }
        }}
      >
        <img src={VIAL_IMAGE} alt="" draggable="false" />
      </button>
      <div className="open-journal-scene__vial-guidance" aria-live="polite">
        <span
          className={`open-journal-scene__hint${corkOpened ? ' is-dismissed' : ''}`}
          style={positionOnScene([1370, 370, 235, 32])}
          aria-hidden={corkOpened}
        >
          OPEN THE VIAL
        </span>
        <span
          className={`open-journal-scene__hint open-journal-scene__hint--pour${!corkOpened || pourStarted ? ' is-dismissed' : ''}`}
          style={positionOnScene([1240, 370, 405, 42])}
          aria-hidden={!corkOpened || pourStarted}
        >
          POUR THE LIQUID TO REVEAL THE HIDDEN WORDS
        </span>
      </div>
      {pouring && pourPoint && (
      <span className="open-journal-scene__liquid-contact" style={positionOnScene([pourPoint.x - 26, pourPoint.y + 2, 12, 76])} aria-hidden="true" />
      )}
      <button
        type="button"
        className={`open-journal-scene__cork-hit${corkOpened ? ' is-open' : ''}`}
        style={corkHitStyle}
        aria-label={corkOpened ? 'Cork removed' : 'Remove vial cork'}
        aria-pressed={corkOpened}
        onClick={openCork}
        onPointerDown={startCorkRelease}
      >
        <span className="open-journal-scene__cork-visual">
          <img src={CORK_IMAGE} alt="" draggable="false" />
        </span>
      </button>

      <div className="open-journal-scene__controls" aria-label="Journal controls">
        <button type="button" aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'} aria-pressed={!soundEnabled} onClick={onToggleSound}><SoundIcon muted={!soundEnabled} /></button>
        <button type="button" className="open-journal-scene__close" onClick={onClose}>Close Journal</button>
        <button type="button" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-pressed={isFullscreen} onClick={onToggleFullscreen}><FullscreenIcon /></button>
      </div>
    </section>
  )
}
