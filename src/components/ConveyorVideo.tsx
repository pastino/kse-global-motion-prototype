import { useEffect, useRef } from 'react'

const VIDEO_SOURCE = '/assets/generated/conveyor-sequence.mp4'

export function ConveyorVideo({ mobile = false }: { mobile?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (
      !mobile
      || !videoRef.current
      || typeof IntersectionObserver === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const video = videoRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [mobile])

  const video = (
    <video
      ref={videoRef}
      className={mobile ? 'sequence-mobile-conveyor' : undefined}
      data-conveyor-video={mobile ? undefined : true}
      muted
      loop={mobile}
      playsInline
      preload={mobile ? 'metadata' : 'auto'}
      poster={mobile
        ? '/assets/generated/conveyor-sequence-mobile-poster.webp'
        : '/assets/generated/conveyor-sequence-poster.webp'}
      aria-hidden="true"
    >
      <source src={VIDEO_SOURCE} type="video/mp4" />
    </video>
  )

  if (mobile) return video

  return (
    <div className="conveyor-video-stage" data-sorter-backdrop aria-hidden="true">
      {video}
    </div>
  )
}
