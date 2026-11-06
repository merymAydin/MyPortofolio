import { useEffect, useState } from 'react'

function SoundIcon({ muted }) {
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

function JournalFrame() {
  return (
    <svg
      className="library-interface__open-frame"
      viewBox="0 0 236 66"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 1H222l13 13v38l-13 13H14L1 52V14z" />
      <path d="M20 5H216l9 9v34l-9 9H20l-9-9V14z" />
      <path d="m118 1 5 5-5 5-5-5zM118 55l5 5-5 5-5-5z" />
    </svg>
  )
}

export default function LibraryInterface({ onJournalOpen, isOpening, fullscreenTarget }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

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
        await fullscreenTarget.current?.requestFullscreen()
      }
    } catch {
      // Fullscreen can be unavailable in embedded or restricted browsers.
    }
  }

  return (
    <div className="library-interface">
      <h1 className="library-interface__title">
        <span>The Forgotten</span>
        <span>Archives</span>
        <i aria-hidden="true">◇</i>
      </h1>

      <div className="library-interface__toolbar" aria-label="Scene controls">
        <button
          type="button"
          className="library-interface__control"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          <SoundIcon muted={!soundEnabled} />
        </button>
        <button
          type="button"
          className="library-interface__control"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={isFullscreen}
          onClick={toggleFullscreen}
        >
          <FullscreenIcon />
        </button>
      </div>

      <button
        type="button"
        className="library-interface__open"
        aria-label="Open the Journal"
        aria-busy={isOpening}
        onClick={onJournalOpen}
      >
        <span>Open the Journal</span>
        <JournalFrame />
      </button>

      <p className="library-interface__status" role="status" aria-live="polite">
        {isOpening ? 'The journal is opening.' : ''}
      </p>
    </div>
  )
}
