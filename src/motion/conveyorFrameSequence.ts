const FRAME_COUNT = 72
const FRAME_DIRECTORY = '/assets/generated/conveyor-sequence'

function frameSource(index: number) {
  return `${FRAME_DIRECTORY}/frame-${String(index).padStart(3, '0')}.webp`
}

function drawCover(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext('2d', { alpha: false })
  if (!context || !image.naturalWidth || !image.naturalHeight) return

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio))
  const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio))

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale

  context.clearRect(0, 0, width, height)
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

export function createConveyorFrameSequence(canvas: HTMLCanvasElement) {
  const images = new Map<number, HTMLImageElement>()
  let requestedFrame = 0
  let active = true

  const drawRequestedFrame = () => {
    if (!active) return

    const loadedFrames = [...images.entries()].filter(([, image]) => image.complete && image.naturalWidth)
    if (!loadedFrames.length) return

    const [, nearestImage] = loadedFrames.reduce((nearest, current) => (
      Math.abs(current[0] - requestedFrame) < Math.abs(nearest[0] - requestedFrame) ? current : nearest
    ))

    drawCover(canvas, nearestImage)
  }

  const loadFrame = (index: number) => {
    if (index < 0 || index >= FRAME_COUNT || images.has(index)) return

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      if (Math.abs(index - requestedFrame) <= 1 || images.size === 1) drawRequestedFrame()
    }
    images.set(index, image)
    image.src = frameSource(index)
  }

  const loadWindow = () => {
    loadFrame(requestedFrame)
    for (let offset = 1; offset <= 5; offset += 1) {
      loadFrame(requestedFrame + offset)
      loadFrame(requestedFrame - offset)
    }

    images.forEach((image, index) => {
      if (Math.abs(index - requestedFrame) <= 7) return
      image.onload = null
      image.onerror = null
      images.delete(index)
    })
  }

  loadWindow()

  const handleResize = () => drawRequestedFrame()
  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(handleResize)
  resizeObserver?.observe(canvas)
  window.addEventListener('resize', handleResize, { passive: true })

  return {
    setProgress(progress: number) {
      requestedFrame = Math.round(Math.min(1, Math.max(0, progress)) * (FRAME_COUNT - 1))
      loadWindow()
      drawRequestedFrame()
    },
    destroy() {
      active = false
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleResize)
      images.forEach((image) => {
        image.onload = null
        image.onerror = null
      })
      images.clear()
    },
  }
}
