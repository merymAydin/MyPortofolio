import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PORTRAIT_SOURCE = '/reference/pfp.png'
const MAGNIFIER_SOURCE = '/reference/antique-magnifying-glass.png'

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
  const [surfaceRect, setSurfaceRect] = useState(null)
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
    const surfaceRect = surface.getBoundingClientRect()
    const stageRect = stage.getBoundingClientRect()
    return { surfaceRect, stageRect }
  }, [surfaceRef])

  const drawLens = useCallback(() => {
    const stage = stageRef.current
    const portrait = portraitRef.current
    const canvas = canvasRef.current
    if (!stage || !portrait || !canvas || !portrait.complete) return

    const rect = stage.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const ratio = window.devicePixelRatio || 1
    const pixelWidth = Math.round(rect.width * ratio)
    const pixelHeight = Math.round(rect.height * ratio)
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)

    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(rect.width)
    const stageOffsetX = surfaceRect ? rect.left - surfaceRect.left : 0
    const stageOffsetY = surfaceRect ? rect.top - surfaceRect.top : 0
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
      && lensCenter.x - radius < rect.width
      && lensCenter.y + radius > 0
      && lensCenter.y - radius < rect.height
    onLensMove({
      x: rect.left + lensCenter.x,
      y: rect.top + lensCenter.y,
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
    ctx.ellipse(rect.width / 2, rect.height / 2, rect.width * 0.385, rect.height * 0.41, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(portrait, 0, 0, rect.width, rect.height)
    ctx.restore()
  }, [lensPosition, onLensMove, surfaceRect])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      const surface = surfaceRef?.current?.getBoundingClientRect()
      if (!surface) return
      setStageSize({ width: rect.width, height: rect.height })
      setSurfaceRect(surface)
      setSurfaceNode(surfaceRef.current)
      const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(rect.width)
      const bounds = getMovementBounds(surface, magnifierWidth, magnifierHeight)
      setLensPosition((current) => {
        if (!hasInitialisedRef.current) {
          hasInitialisedRef.current = true
          return {
            // Start beside the portrait; the user deliberately drags the
            // glass over it when they want to inspect the silhouette.
            x: Math.min(
              bounds.maxX,
              Math.max(bounds.minX, rect.left - surface.left + rect.width - magnifierWidth),
            ),
            y: Math.min(
              bounds.maxY,
              Math.max(bounds.minY, rect.top - surface.top + Math.max(8, rect.height * 0.06)),
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
    return () => observer.disconnect()
  }, [surfaceRef])

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
    const { surfaceRect, stageRect: rect } = metrics
    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(rect.width)
    const bounds = getMovementBounds(surfaceRect, magnifierWidth, magnifierHeight)
    setLensPosition({
      x: Math.min(Math.max(bounds.minX, clientX - surfaceRect.left - drag.offsetX), bounds.maxX),
      y: Math.min(Math.max(bounds.minY, clientY - surfaceRect.top - drag.offsetY), bounds.maxY),
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
    const { surfaceRect } = metrics
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - surfaceRect.left - lensPosition.x,
      offsetY: event.clientY - surfaceRect.top - lensPosition.y,
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
    const surface = surfaceRef?.current?.getBoundingClientRect()
    const bounds = surface
      ? getMovementBounds(surface, magnifierWidth, magnifierHeight)
      : { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    setLensPosition((current) => ({
      x: Math.min(Math.max(bounds.minX, current.x + dx), bounds.maxX),
      y: Math.min(Math.max(bounds.minY, current.y + dy), bounds.maxY),
    }))
  }

  const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(stageSize.width || 200)

  const handle = surfaceRect && surfaceNode
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
