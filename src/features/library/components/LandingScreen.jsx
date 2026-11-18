import { useCallback, useEffect, useRef, useState } from 'react'

import OpenJournalScene from './OpenJournalScene.jsx'
import InteractiveTypewriter from './InteractiveTypewriter.jsx'

const SCENE_IMAGE = '/reference/library-clean-plate.png'
const ORIGINAL_SCENE_IMAGE = '/reference/Vintage Study Desk with Complete Parchment Note.png'

function SoundIcon({ muted = false }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M5 1.5h19l6.5 6.5v16.5L24 31H7l-5.5-5.5V7z" />
      <path d="M9 13h4l5-4v14l-5-4H9z" />
      {muted ? (
        <path d="m21 12 5 7m0-7-5 7" />
      ) : (
        <>
          <path d="M21 12.5a5 5 0 0 1 0 7" />
          <path d="M23.5 10a8.5 8.5 0 0 1 0 12" />
        </>
      )}
    </svg>
  )
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M5 1.5h19l6.5 6.5v16.5L24 31H7l-5.5-5.5V7z" />
      <path d="M11 12V8h4M21 12V8h-4M11 20v4h4M21 20v4h-4" />
      <path d="m11 8 5 5m5-5-5 5m-5 11 5-5m5 5-5-5" />
    </svg>
  )
}

/**
 * The supplied image provides the exact study composition. The title and
 * controls are live HTML elements layered over the scene.
 */
export default function LandingScreen() {
  const stageRef = useRef(null)
  const imageRef = useRef(null)
  const [cover, setCover] = useState(null)
  const [isJournalOpen, setIsJournalOpen] = useState(false)
  const [isTypewriterForeground, setIsTypewriterForeground] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const measureCover = useCallback(() => {
    const stage = stageRef.current
    const image = imageRef.current
    if (!stage || !image?.naturalWidth || !image?.naturalHeight) return

    const { width, height } = stage.getBoundingClientRect()
    const fitScale = isJournalOpen ? Math.min : Math.max
    const scale = fitScale(width / image.naturalWidth, height / image.naturalHeight)

    setCover({
      scale,
      left: (width - image.naturalWidth * scale) / 2,
      top: (height - image.naturalHeight * scale) / 2,
    })
  }, [isJournalOpen])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    const observer = new ResizeObserver(measureCover)
    observer.observe(stage)
    window.addEventListener('resize', measureCover)
    measureCover()

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureCover)
    }
  }, [measureCover])

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const positionOnScene = ([x, y, width, height]) => {
    if (!cover) return undefined

    return {
      left: cover.left + x * cover.scale,
      top: cover.top + y * cover.scale,
      width: width * cover.scale,
      height: height * cover.scale,
    }
  }

  const openJournalCoverStyle = cover
    ? {
      ...positionOnScene([702, 808, 276, 86]),
      backgroundImage: "url('/reference/laboratory-mahogany-desk.png')",
      backgroundSize: `${1536 * 0.6 * cover.scale}px ${1024 * 0.6 * cover.scale}px`,
      backgroundPosition: `${-500 * 0.6 * cover.scale}px ${-430 * 0.6 * cover.scale}px`,
    }
    : undefined

  const openJournal = () => {
    if (isJournalOpen) return

    setIsTypewriterForeground(false)
    setIsJournalOpen(true)
  }

  const toggleSound = () => {
    setSoundEnabled((enabled) => {
      const nextEnabled = !enabled
      window.dispatchEvent(
        new CustomEvent('archives:sound-toggle', { detail: { enabled: nextEnabled } }),
      )
      return nextEnabled
    })
  }

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await stageRef.current?.requestFullscreen()
      }
    } catch {
      // Fullscreen can be unavailable in embedded or restricted browsers.
    }
  }

  return (
    <div
      ref={stageRef}
      className="landing-screen"
      data-journal-state={isJournalOpen ? 'open' : 'closed'}
    >
      {isJournalOpen ? (
        <OpenJournalScene
          imageRef={imageRef}
          onImageLoad={measureCover}
          positionOnScene={positionOnScene}
          cover={cover}
          onClose={() => setIsJournalOpen(false)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : (
        <>
      <img
        ref={imageRef}
        className="landing-screen__scene"
        src={isTypewriterForeground ? SCENE_IMAGE : ORIGINAL_SCENE_IMAGE}
        alt=""
        aria-hidden="true"
        draggable="false"
        onLoad={measureCover}
      />

      <div
        className="landing-screen__scene-cover landing-screen__scene-cover--title"
        style={positionOnScene([28, 12, 270, 104])}
        aria-hidden="true"
      />
      <div
        className="landing-screen__scene-cover landing-screen__scene-cover--controls"
        style={positionOnScene([1544, 18, 104, 58])}
        aria-hidden="true"
      />
      <InteractiveTypewriter
        positionOnScene={positionOnScene}
        onForegroundChange={setIsTypewriterForeground}
      />

      <div
        className="landing-screen__scene-cover landing-screen__scene-cover--open"
        style={openJournalCoverStyle}
        aria-hidden="true"
      />

      <h1 className="landing-screen__mobile-title">
        <span>The Forgotten</span>
        <span>Archives</span>
        <i aria-hidden="true">◇</i>
      </h1>

      <button
        type="button"
        className="landing-screen__hotspot landing-screen__sound"
        style={positionOnScene([1552, 27, 40, 39])}
        aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        aria-pressed={soundEnabled}
        onClick={toggleSound}
      >
        <SoundIcon muted={!soundEnabled} />
      </button>

      <button
        type="button"
        className="landing-screen__hotspot landing-screen__fullscreen"
        style={positionOnScene([1602, 27, 39, 39])}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-pressed={isFullscreen}
        onClick={toggleFullscreen}
      >
        <FullscreenIcon />
      </button>

      <button
        type="button"
        className="landing-screen__hotspot landing-screen__journal"
        style={positionOnScene([644, 488, 450, 310])}
        aria-label="Open the journal"
        onClick={openJournal}
      />
      <span
        className="landing-screen__journal-hint"
        style={positionOnScene([722, 830, 236, 38])}
        aria-hidden="true"
      >
        Click to open
      </span>
        </>
      )}
    </div>
  )
}
