const FINAL_FRAME_PADDING = 1 / 24

export function createConveyorVideoScrubber(video: HTMLVideoElement) {
  let requestedProgress = 0
  let animationFrame = 0
  let active = true

  const render = () => {
    animationFrame = 0
    if (!active || video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(video.duration)) return

    const duration = Math.max(0, video.duration - FINAL_FRAME_PADDING)
    const requestedTime = requestedProgress * duration
    if (Math.abs(video.currentTime - requestedTime) < 1 / 60) return
    video.currentTime = requestedTime
  }

  const requestRender = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(render)
  }

  video.pause()
  video.addEventListener('loadedmetadata', requestRender)

  return {
    setProgress(progress: number) {
      requestedProgress = Math.min(1, Math.max(0, progress))
      requestRender()
    },
    destroy() {
      active = false
      video.removeEventListener('loadedmetadata', requestRender)
      if (animationFrame) cancelAnimationFrame(animationFrame)
      video.pause()
    },
  }
}
