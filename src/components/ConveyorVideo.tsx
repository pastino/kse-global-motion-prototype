import { useEffect, useRef } from 'react'
import { assetUrl } from '../lib/asset-url'

const DESKTOP_VIDEO_SOURCE = assetUrl('assets/generated/conveyor-sequence.mp4')
const MOBILE_VIDEO_SOURCE = assetUrl('assets/generated/conveyor-sequence-mobile.mp4')

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
          if (video.ended) video.currentTime = 0
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
      data-motion-render="remotion"
      muted
      playsInline
      preload={mobile ? 'metadata' : 'auto'}
      poster={mobile
        ? assetUrl('assets/generated/conveyor-sequence-mobile-poster.webp')
        : assetUrl('assets/generated/conveyor-sequence-poster.webp')}
      aria-hidden="true"
    >
      <source src={mobile ? MOBILE_VIDEO_SOURCE : DESKTOP_VIDEO_SOURCE} type="video/mp4" />
    </video>
  )

  if (mobile) return video

  return (
    <div className="conveyor-video-stage" data-sorter-backdrop aria-hidden="true">
      {video}
    </div>
  )
}
