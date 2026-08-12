export type Point = { x: number; y: number }
export type ParcelPose = Point & {
  progress: number
  scale: number
  contactOffset: number
  contactAmplitude: number
  depthProgress: number
  skewY: number
  perspectiveScaleX: number
}

export const START: Point = { x: 200, y: 726 }
export const END: Point = { x: 1315, y: 294.5 }
export const SCANNER_PROGRESS = 0.79
export const BELT_WIDTH = 400
export const PARCEL_HALF_WIDTH = 78
export const PARCEL_HEIGHT = 117
export const PARCEL_DEPTH_FACTOR = 0.0425

const NEAR_LEFT: Point = { x: 0, y: 642 }
const NEAR_RIGHT: Point = { x: 400, y: 810 }
const FAR_LEFT: Point = { x: 1295, y: 286 }
const FAR_RIGHT: Point = { x: 1335, y: 303 }

export function pointAt(progress: number): Point {
  return {
    x: START.x + (END.x - START.x) * progress,
    y: START.y + (END.y - START.y) * progress,
  }
}

export function depthScale(progress: number) {
  const nearWidth = NEAR_RIGHT.x - NEAR_LEFT.x
  const farWidth = FAR_RIGHT.x - FAR_LEFT.x
  return (nearWidth + (farWidth - nearWidth) * progress) / nearWidth
}

export function project(progress: number, lateral = 0, height = 0): Point {
  const left = edgeAt(progress, -1)
  const right = edgeAt(progress, 1)
  const scale = depthScale(progress)
  const ratio = (lateral / (BELT_WIDTH / 2) + 1) / 2

  return {
    x: left.x + (right.x - left.x) * ratio,
    y: left.y + (right.y - left.y) * ratio - height * scale,
  }
}

export function edgeAt(progress: number, side: number): Point {
  const left = {
    x: NEAR_LEFT.x + (FAR_LEFT.x - NEAR_LEFT.x) * progress,
    y: NEAR_LEFT.y + (FAR_LEFT.y - NEAR_LEFT.y) * progress,
  }
  const right = {
    x: NEAR_RIGHT.x + (FAR_RIGHT.x - NEAR_RIGHT.x) * progress,
    y: NEAR_RIGHT.y + (FAR_RIGHT.y - NEAR_RIGHT.y) * progress,
  }
  const ratio = (side + 1) / 2

  return {
    x: left.x + (right.x - left.x) * ratio,
    y: left.y + (right.y - left.y) * ratio,
  }
}

export function points(...items: Point[]) {
  return items.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

export function getBeltCueProgress(index: number, frame: number, durationInFrames: number) {
  const normalizedFrame = frame / Math.max(1, durationInFrames - 1)
  return (index / 16 + normalizedFrame * 1.9) % 1
}

export function getParcelProgress(frame: number, durationInFrames: number, mobile: boolean) {
  const normalizedFrame = frame / Math.max(1, durationInFrames - 1)
  const [start, end] = mobile ? [0.02, 0.98] : [-0.06, 1.06]
  return start + (end - start) * normalizedFrame
}

export function getParcelPose(frame: number, durationInFrames: number, mobile: boolean): ParcelPose {
  const progress = getParcelProgress(frame, durationInFrames, mobile)
  const visibleProgress = Math.min(1, Math.max(0, progress))
  const scale = depthScale(progress)
  const center = pointAt(progress)
  const contactAmplitude = Math.max(0.18, 0.55 * scale)
  const contactOffset = Math.sin(frame * 0.48) * contactAmplitude

  return {
    ...center,
    y: center.y + contactOffset,
    progress,
    scale,
    contactOffset,
    contactAmplitude,
    depthProgress: PARCEL_DEPTH_FACTOR * Math.max(0.08, scale),
    skewY: 0,
    perspectiveScaleX: 1 - visibleProgress * 0.01,
  }
}
