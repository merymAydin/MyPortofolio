import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PORTRAIT_SOURCE = '/reference/pfp.png'
const MAGNIFIER_SOURCE = '/reference/antique-magnifying-glass.png'

function getElementGeometry(element) {
  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const matrix = style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform)
  const [originX = 0, originY = 0] = style.transformOrigin.split(' ').map(Number.parseFloat)
  const width = element.offsetWidth
  const height = element.offsetHeight
  const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0
  const transformPoint = (x, y) => ({
    x: matrix.a * (x - originX) + matrix.c * (y - originY) + matrix.e + originX,
    y: matrix.b * (x - originX) + matrix.d * (y - originY) + matrix.f + originY,
  })
  const transformedCorners = [
    transformPoint(0, 0),
    transformPoint(width, 0),
    transformPoint(0, height),
    transformPoint(width, height),
  ]
  const layoutLeft = rect.left - Math.min(...transformedCorners.map(({ x }) => x))
  const layoutTop = rect.top - Math.min(...transformedCorners.map(({ y }) => y))
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c

  return {
    toClient(x, y) {
      const point = transformPoint(x + borderLeft, y + borderTop)
      return { x: layoutLeft + point.x, y: layoutTop + point.y }
    },
    fromClient(clientX, clientY) {
      const x = clientX - layoutLeft - matrix.e - originX
      const y = clientY - layoutTop - matrix.f - originY
      const localX = (matrix.d * x - matrix.c * y) / determinant + originX
      const localY = (-matrix.b * x + matrix.a * y) / determinant + originY
      return { x: localX - borderLeft, y: localY - borderTop }
    },
  }
}

/**
 * A draggable inspection lens for the author portrait.
 * The portrait remains a real image for accessibility; the canvas only adds
 * a clipped, local zoom beneath the glass.
 */
export default function PortraitMagnifier({ onLensMove = () => {}, surfaceRef }) {
  const stageRef = useRef(null)
  const portraitRef = useRef(null)
  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const dragListenersRef = useRef(null)
  const hasInitialisedRef = useRef(false)
  const hasInspectedRef = useRef(false)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 20 })
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [surfaceNode, setSurfaceNode] = useState(null)

  const getMagnifierSize = (width) => {
    const magnifierWidth = Math.min(160, Math.max(112, width * 0.48))
    return { width: magnifierWidth, height: magnifierWidth * 1.586 }
  }

  const getMovementBounds = (surface, magnifierWidth, magnifierHeight) => ({
    minX: 0,
    minY: 0,
    maxX: Math.max(0, surface.width - magnifierWidth),
    maxY: Math.max(0, surface.height - magnifierHeight),
  })

  const getSurfaceMetrics = useCallback(() => {
    const surface = surfaceRef?.current
    const stage = stageRef.current
    if (!surface || !stage) return null
    const geometry = getElementGeometry(surface)
    const stageRect = stage.getBoundingClientRect()
    const stageCenter = geometry.fromClient(
      stageRect.left + stageRect.width / 2,
      stageRect.top + stageRect.height / 2,
    )
    return {
      surface: { width: surface.clientWidth, height: surface.clientHeight },
      stageSize: { width: stage.clientWidth, height: stage.clientHeight },
      stagePosition: {
        x: stageCenter.x - stage.clientWidth / 2,
        y: stageCenter.y - stage.clientHeight / 2,
      },
      toSurfacePoint: geometry.fromClient,
      toClientPoint: geometry.toClient,
    }
  }, [surfaceRef])

  const drawLens = useCallback(() => {
    const stage = stageRef.current
    const portrait = portraitRef.current
    const canvas = canvasRef.current
    if (!stage || !portrait || !canvas || !portrait.complete) return

    const metrics = getSurfaceMetrics()
    if (!metrics) return
    const { width, height } = metrics.stageSize
    if (!width || !height) return

    const ratio = window.devicePixelRatio || 1
    const pixelWidth = Math.round(width * ratio)
    const pixelHeight = Math.round(height * ratio)
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(width)
    const { x: stageOffsetX, y: stageOffsetY } = metrics.stagePosition
    const localLensPosition = {
      x: lensPosition.x - stageOffsetX,
      y: lensPosition.y - stageOffsetY,
    }
    const lensCenter = {
      x: localLensPosition.x + magnifierWidth * 0.57,
      y: localLensPosition.y + magnifierHeight * 0.26,
    }
    const radius = magnifierWidth * 0.285
    const zoom = 1.5

    // The canvas is transparent when the independently movable tool is away
    // from the portrait, so the portrait returns to its normal appearance.
    const overlapsPortrait = lensCenter.x + radius > 0
      && lensCenter.x - radius < width
      && lensCenter.y + radius > 0
      && lensCenter.y - radius < height
    const screenLensCenter = metrics.toClientPoint(
      lensPosition.x + magnifierWidth * 0.57,
      lensPosition.y + magnifierHeight * 0.26,
    )
    onLensMove({
      x: screenLensCenter.x,
      y: screenLensCenter.y,
      radius,
      overlapsPortrait,
      hasInspected: hasInspectedRef.current,
    })
    if (!overlapsPortrait) return

    ctx.save()
    ctx.beginPath()
    ctx.arc(lensCenter.x, lensCenter.y, radius, 0, Math.PI * 2)
    ctx.clip()
    ctx.translate(lensCenter.x - lensCenter.x * zoom, lensCenter.y - lensCenter.y * zoom)
    ctx.scale(zoom, zoom)
    ctx.beginPath()
    ctx.ellipse(width / 2, height / 2, width * 0.385, height * 0.41, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(portrait, 0, 0, width, height)
    ctx.restore()
  }, [getSurfaceMetrics, lensPosition, onLensMove])

  useEffect(() => {
    const stage = stageRef.current
    const surface = surfaceRef?.current
    if (!stage || !surface) return undefined

    const resize = () => {
      const metrics = getSurfaceMetrics()
      if (!metrics) return
      setStageSize(metrics.stageSize)
      setSurfaceNode(surface)
      const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(metrics.stageSize.width)
      const bounds = getMovementBounds(metrics.surface, magnifierWidth, magnifierHeight)
      setLensPosition((current) => {
        if (!hasInitialisedRef.current) {
          hasInitialisedRef.current = true
          return {
            // Start beside the portrait; the user deliberately drags the
            // glass over it when they want to inspect the silhouette.
            x: Math.min(
              bounds.maxX,
              Math.max(bounds.minX, metrics.stagePosition.x + metrics.stageSize.width - magnifierWidth),
            ),
            y: Math.min(
              bounds.maxY,
              Math.max(bounds.minY, metrics.stagePosition.y + Math.max(8, metrics.stageSize.height * 0.06)),
            ),
          }
        }
        return {
          x: Math.min(Math.max(bounds.minX, current.x), bounds.maxX),
          y: Math.min(Math.max(bounds.minY, current.y), bounds.maxY),
        }
      })
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    observer.observe(surface)
    return () => observer.disconnect()
  }, [getSurfaceMetrics, surfaceRef])

  useEffect(() => {
    drawLens()
  }, [drawLens, stageSize])

  const moveLens = useCallback((clientX, clientY) => {
    const stage = stageRef.current
    const drag = dragRef.current
    if (!stage || !drag) return
    hasInspectedRef.current = true
    const metrics = getSurfaceMetrics()
    if (!metrics) return
    const point = metrics.toSurfacePoint(clientX, clientY)
    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(metrics.stageSize.width)
    const bounds = getMovementBounds(metrics.surface, magnifierWidth, magnifierHeight)
    setLensPosition({
      x: Math.min(Math.max(bounds.minX, point.x - drag.offsetX), bounds.maxX),
      y: Math.min(Math.max(bounds.minY, point.y - drag.offsetY), bounds.maxY),
    })
  }, [getSurfaceMetrics])

  const stopWindowDrag = useCallback((event) => {
    const drag = dragRef.current
    if (!drag || (event && drag.pointerId !== event.pointerId)) return
    dragRef.current = null
    const listeners = dragListenersRef.current
    if (!listeners) return
    window.removeEventListener('pointermove', listeners.move)
    window.removeEventListener('pointerup', listeners.end)
    window.removeEventListener('pointercancel', listeners.end)
    dragListenersRef.current = null
  }, [])

  useEffect(() => () => stopWindowDrag(), [stopWindowDrag])

  const beginDrag = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (dragRef.current) return
    event.preventDefault()
    event.stopPropagation()
    const stage = stageRef.current
    if (!stage) return
    const metrics = getSurfaceMetrics()
    if (!metrics) return
    const point = metrics.toSurfacePoint(event.clientX, event.clientY)
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: point.x - lensPosition.x,
      offsetY: point.y - lensPosition.y,
    }
    const move = (nativeEvent) => {
      if (nativeEvent.pointerId !== event.pointerId) return
      nativeEvent.preventDefault()
      moveLens(nativeEvent.clientX, nativeEvent.clientY)
    }
    const end = (nativeEvent) => stopWindowDrag(nativeEvent)
    dragListenersRef.current = { move, end }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture is unavailable in some embedded browser contexts.
    }
  }

  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    stopWindowDrag(event)
    event.stopPropagation()
  }

  const moveByKeyboard = (event) => {
    const step = event.shiftKey ? 28 : 14
    let dx = 0
    let dy = 0
    if (event.key === 'ArrowLeft') dx = -step
    if (event.key === 'ArrowRight') dx = step
    if (event.key === 'ArrowUp') dy = -step
    if (event.key === 'ArrowDown') dy = step
    if (!dx && !dy) return
    hasInspectedRef.current = true
    event.preventDefault()
    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(stageSize.width)
    const metrics = getSurfaceMetrics()
    const bounds = metrics
      ? getMovementBounds(metrics.surface, magnifierWidth, magnifierHeight)
      : { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    setLensPosition((current) => ({
      x: Math.min(Math.max(bounds.minX, current.x + dx), bounds.maxX),
      y: Math.min(Math.max(bounds.minY, current.y + dy), bounds.maxY),
    }))
  }

  const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(stageSize.width || 200)

  const handle = surfaceNode
    ? createPortal(
      <button
        type="button"
        className="portrait-magnifier__handle"
        style={{ left: lensPosition.x, top: lensPosition.y, width: magnifierWidth, height: magnifierHeight }}
        aria-label="Drag the magnifying glass across the portrait to inspect it"
        onPointerDown={beginDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onKeyDown={moveByKeyboard}
      >
        <img src={MAGNIFIER_SOURCE} alt="" draggable="false" />
      </button>,
      surfaceNode,
    )
    : null

  return (
    <div className="portrait-magnifier" ref={stageRef}>
      <img
        ref={portraitRef}
        className="portrait-magnifier__portrait"
        src={PORTRAIT_SOURCE}
        alt="Antique silhouette portrait of the author"
        onLoad={drawLens}
      />
      <canvas ref={canvasRef} className="portrait-magnifier__lens" aria-hidden="true" />
      {handle}
    </div>
  )
}
