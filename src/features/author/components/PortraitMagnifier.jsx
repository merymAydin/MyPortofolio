import { useCallback, useEffect, useRef, useState } from 'react'

const PORTRAIT_SOURCE = '/reference/pfp.png'
const MAGNIFIER_SOURCE = '/reference/antique-magnifying-glass.png'

/**
 * A draggable inspection lens for the author portrait.
 * The portrait remains a real image for accessibility; the canvas only adds
 * a clipped, local zoom beneath the glass.
 */
export default function PortraitMagnifier({ onLensMove = () => {} }) {
  const stageRef = useRef(null)
  const portraitRef = useRef(null)
  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const hasInitialisedRef = useRef(false)
  const hasInspectedRef = useRef(false)
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 20 })
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  const getMagnifierSize = (width) => {
    const magnifierWidth = Math.min(160, Math.max(112, width * 0.48))
    return { width: magnifierWidth, height: magnifierWidth * 1.586 }
  }

  const getMovementBounds = (rect, magnifierWidth, magnifierHeight) => {
    const documentWidth = document.documentElement?.scrollWidth || window.innerWidth
    const documentHeight = document.documentElement?.scrollHeight || window.innerHeight
    return {
      maxX: Math.max(rect.width + magnifierWidth * 2, documentWidth - rect.left + magnifierWidth),
      maxY: Math.max(rect.height + magnifierHeight * 2, documentHeight - rect.top + magnifierHeight),
    }
  }

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
    const lensCenter = {
      x: lensPosition.x + magnifierWidth * 0.57,
      y: lensPosition.y + magnifierHeight * 0.26,
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
  }, [lensPosition, onLensMove])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      setStageSize({ width: rect.width, height: rect.height })
      const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(rect.width)
      setLensPosition((current) => {
        if (!hasInitialisedRef.current) {
          hasInitialisedRef.current = true
          return {
            // Start beside the portrait; the user deliberately drags the
            // glass over it when they want to inspect the silhouette.
            x: rect.width - magnifierWidth * 0.4,
            y: Math.max(8, rect.height * 0.06),
          }
        }
        const bounds = getMovementBounds(rect, magnifierWidth, magnifierHeight)
        return {
          x: Math.min(Math.max(-magnifierWidth * 0.4, current.x), bounds.maxX),
          y: Math.min(Math.max(-magnifierHeight * 0.12, current.y), bounds.maxY),
        }
      })
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    drawLens()
  }, [drawLens, stageSize])

  const moveLens = useCallback((clientX, clientY) => {
    const stage = stageRef.current
    const drag = dragRef.current
    if (!stage || !drag) return
    hasInspectedRef.current = true
    const rect = stage.getBoundingClientRect()
    const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(rect.width)
    const bounds = getMovementBounds(rect, magnifierWidth, magnifierHeight)
    setLensPosition({
      x: Math.min(Math.max(-magnifierWidth * 0.4, clientX - rect.left - drag.offsetX), bounds.maxX),
      y: Math.min(Math.max(-magnifierHeight * 0.12, clientY - rect.top - drag.offsetY), bounds.maxY),
    })
  }, [])

  const beginDrag = (event) => {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left - lensPosition.x,
      offsetY: event.clientY - rect.top - lensPosition.y,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const continueDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    moveLens(event.clientX, event.clientY)
  }

  const endDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
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
    const rect = stageRef.current?.getBoundingClientRect()
    const bounds = rect ? getMovementBounds(rect, magnifierWidth, magnifierHeight) : {
      maxX: stageSize.width + magnifierWidth * 2,
      maxY: stageSize.height + magnifierHeight * 2,
    }
    setLensPosition((current) => ({
      x: Math.min(Math.max(-magnifierWidth * 0.4, current.x + dx), bounds.maxX),
      y: Math.min(Math.max(-magnifierHeight * 0.12, current.y + dy), bounds.maxY),
    }))
  }

  const { width: magnifierWidth, height: magnifierHeight } = getMagnifierSize(stageSize.width || 200)

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
      <button
        type="button"
        className="portrait-magnifier__handle"
        style={{ left: lensPosition.x, top: lensPosition.y, width: magnifierWidth, height: magnifierHeight }}
        aria-label="Drag the magnifying glass across the portrait to inspect it"
        onPointerDown={beginDrag}
        onPointerMove={continueDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={moveByKeyboard}
      >
        <img src={MAGNIFIER_SOURCE} alt="" draggable="false" />
      </button>
    </div>
  )
}
