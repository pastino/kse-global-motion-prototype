import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = resolve(import.meta.dirname, '..')
const backgroundPath = join(projectRoot, 'public/assets/generated/sorting-conveyor-kse-v2.webp')
const parcelPath = join(projectRoot, 'scripts/assets/conveyor-parcel-sprite-v1.png')
const cacheDirectory = mkdtempSync(join(tmpdir(), 'kse-conveyor-'))
const scaledBackgroundPath = join(cacheDirectory, 'background.webp')
const frameDirectory = join(cacheDirectory, 'frames')
const videoPath = join(projectRoot, 'public/assets/generated/conveyor-sequence.mp4')
const desktopPosterPath = join(projectRoot, 'public/assets/generated/conveyor-sequence-poster.webp')
const mobilePosterPath = join(projectRoot, 'public/assets/generated/conveyor-sequence-mobile-poster.webp')

const frameCount = 72
const outputWidth = 1440
const outputHeight = 810
const sourceWidth = 1672
const outputScale = outputWidth / sourceWidth

const keyframes = [
  { progress: 0, x: -340, y: 700, width: 310, rotation: -5 },
  { progress: 0.15, x: 40, y: 650, width: 260, rotation: -4 },
  { progress: 0.38, x: 430, y: 580, width: 200, rotation: -4 },
  { progress: 0.58, x: 710, y: 515, width: 150, rotation: -3 },
  { progress: 0.76, x: 920, y: 420, width: 108, rotation: -2 },
  { progress: 0.88, x: 1080, y: 365, width: 78, rotation: -1 },
  { progress: 1, x: 1390, y: 292, width: 46, rotation: 0 },
]

const beltKeyframes = [
  { progress: 0, x: -80, y: 850, width: 170 },
  { progress: 0.18, x: 250, y: 780, width: 150 },
  { progress: 0.38, x: 560, y: 690, width: 130 },
  { progress: 0.58, x: 820, y: 580, width: 95 },
  { progress: 0.78, x: 1050, y: 435, width: 55 },
  { progress: 1, x: 1470, y: 305, width: 20 },
]

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${command} 실행에 실패했습니다.`)
}

function interpolate(progress) {
  const nextIndex = keyframes.findIndex((frame) => frame.progress >= progress)
  if (nextIndex <= 0) return keyframes[0]

  const previous = keyframes[nextIndex - 1]
  const next = keyframes[nextIndex]
  const localProgress = (progress - previous.progress) / (next.progress - previous.progress)
  const easedProgress = localProgress * localProgress * (3 - 2 * localProgress)

  return {
    x: previous.x + (next.x - previous.x) * easedProgress,
    y: previous.y + (next.y - previous.y) * easedProgress,
    width: previous.width + (next.width - previous.width) * easedProgress,
    rotation: previous.rotation + (next.rotation - previous.rotation) * easedProgress,
  }
}

function interpolateBelt(progress) {
  const nextIndex = beltKeyframes.findIndex((frame) => frame.progress >= progress)
  if (nextIndex <= 0) return beltKeyframes[0]

  const previous = beltKeyframes[nextIndex - 1]
  const next = beltKeyframes[nextIndex]
  const localProgress = (progress - previous.progress) / (next.progress - previous.progress)

  return {
    x: previous.x + (next.x - previous.x) * localProgress,
    y: previous.y + (next.y - previous.y) * localProgress,
    width: previous.width + (next.width - previous.width) * localProgress,
  }
}

function beltSeam(progress) {
  const center = interpolateBelt(progress)
  const before = interpolateBelt(Math.max(0, progress - 0.01))
  const after = interpolateBelt(Math.min(1, progress + 0.01))
  const tangentX = after.x - before.x
  const tangentY = after.y - before.y
  const tangentLength = Math.hypot(tangentX, tangentY) || 1
  const normalX = -tangentY / tangentLength
  const normalY = tangentX / tangentLength
  const halfWidth = center.width / 2

  return {
    x1: (center.x - normalX * halfWidth) * outputScale,
    y1: (center.y - normalY * halfWidth) * outputScale,
    x2: (center.x + normalX * halfWidth) * outputScale,
    y2: (center.y + normalY * halfWidth) * outputScale,
    highlightX: (tangentX / tangentLength) * 2,
    highlightY: (tangentY / tangentLength) * 2,
    strokeWidth: Math.max(0.7, (1.2 + center.width / 260) * outputScale),
  }
}

const beltClipSegments = beltKeyframes.map(({ progress }) => beltSeam(progress))
const beltClipPoints = [
  ...beltClipSegments.map(({ x1, y1 }) => `${x1.toFixed(1)},${y1.toFixed(1)}`),
  ...beltClipSegments.toReversed().map(({ x2, y2 }) => `${x2.toFixed(1)},${y2.toFixed(1)}`),
].join(' ')

mkdirSync(frameDirectory, { recursive: true })

try {
  run('magick', [
    backgroundPath,
    '-resize', `${outputWidth}x${outputHeight}!`,
    '-quality', '82',
    scaledBackgroundPath,
  ])

  for (let index = 0; index < frameCount; index += 1) {
    const progress = index / (frameCount - 1)
    const frame = interpolate(progress)
    const x = Math.round(frame.x * outputScale)
    const y = Math.round(frame.y * outputScale)
    const width = Math.max(20, Math.round(frame.width * outputScale))
    const rotation = frame.rotation.toFixed(2)
    const fileName = `frame-${String(index).padStart(3, '0')}.webp`
    const seamLines = []

    for (let seamIndex = 0; seamIndex < 8; seamIndex += 1) {
      const seamProgress = (progress + seamIndex / 8) % 1
      const seam = beltSeam(seamProgress)
      seamLines.push(
        `<line x1="${seam.x1.toFixed(1)}" y1="${seam.y1.toFixed(1)}" x2="${seam.x2.toFixed(1)}" y2="${seam.y2.toFixed(1)}" stroke="#030910" stroke-opacity="0.13" stroke-width="${seam.strokeWidth.toFixed(2)}" />`,
        `<line x1="${(seam.x1 + seam.highlightX).toFixed(1)}" y1="${(seam.y1 + seam.highlightY).toFixed(1)}" x2="${(seam.x2 + seam.highlightX).toFixed(1)}" y2="${(seam.y2 + seam.highlightY).toFixed(1)}" stroke="#b0cbda" stroke-opacity="0.04" stroke-width="${Math.max(0.55, seam.strokeWidth * 0.48).toFixed(2)}" />`,
      )
    }

    const beltOverlayPath = join(cacheDirectory, `belt-${String(index).padStart(3, '0')}.svg`)
    writeFileSync(beltOverlayPath, `
      <svg xmlns="http://www.w3.org/2000/svg" width="1440" height="810" viewBox="0 0 1440 810">
        <defs>
          <clipPath id="belt-surface">
            <polygon points="${beltClipPoints}" />
          </clipPath>
        </defs>
        <g clip-path="url(#belt-surface)">${seamLines.join('')}</g>
      </svg>
    `)

    run('magick', [
      scaledBackgroundPath,
      '(',
      '-background', 'none',
      beltOverlayPath,
      ')',
      '-composite',
      '(', parcelPath,
      '-resize', `${width}x`,
      '-background', 'none',
      '-rotate', rotation,
      ')',
      '-geometry', `+${x}+${y}`,
      '-composite',
      '-quality', '76',
      '-define', 'webp:method=6',
      join(frameDirectory, fileName),
    ])
  }

  copyFileSync(join(frameDirectory, 'frame-000.webp'), desktopPosterPath)
  copyFileSync(join(frameDirectory, 'frame-036.webp'), mobilePosterPath)

  run('ffmpeg', [
    '-y',
    '-framerate', '24',
    '-i', join(frameDirectory, 'frame-%03d.webp'),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '22',
    '-g', '1',
    '-keyint_min', '1',
    '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    videoPath,
  ])
} finally {
  rmSync(cacheDirectory, { recursive: true, force: true })
}
