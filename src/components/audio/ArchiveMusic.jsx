import { useEffect, useRef } from 'react'

const MUSIC_SOURCE = '/audio/music.m4a'

/** Keeps the archive's ambient music alive while routed pages change. */
export default function ArchiveMusic() {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const handleToggle = (event) => {
      if (event.detail?.enabled) {
        const playback = audio.play()
        playback?.catch(() => {
          // Playback is only attempted after the user's button interaction.
        })
      } else {
        audio.pause()
      }
    }

    window.addEventListener('archives:sound-toggle', handleToggle)
    return () => window.removeEventListener('archives:sound-toggle', handleToggle)
  }, [])

  return (
    <audio
      ref={audioRef}
      src={MUSIC_SOURCE}
      loop
      preload="metadata"
      volume={0.12}
      aria-hidden="true"
    />
  )
}
