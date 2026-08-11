import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = resolve(import.meta.dirname, '..')
const backgroundPath = join(projectRoot, 'public/assets/generated/sorting-conveyor-kse-v2.webp')
const parcelPath = join(projectRoot, 'public/assets/generated/conveyor-parcel-sprite-v1.png')
const outputDirectory = join(projectRoot, 'public/assets/generated/conveyor-sequence')
const cacheDirectory = mkdtempSync(join(tmpdir(), 'kse-conveyor-'))
const scaledBackgroundPath = join(cacheDirectory, 'background.webp')

const frameCount = 72
const outputWidth = 1440
const outputHeight = 810
const sourceWidth = 1672
const outputScale = outputWidth / sourceWidth

const keyframes = [
  { progress: 0, x: -280, y: 700, width: 310, rotation: -5 },
  { progress: 0.15, x: 40, y: 650, width: 260, rotation: -4 },
  { progress: 0.38, x: 430, y: 580, width: 200, rotation: -4 },
  { progress: 0.58, x: 710, y: 515, width: 150, rotation: -3 },
  { progress: 0.76, x: 920, y: 420, width: 108, rotation: -2 },
  { progress: 0.88, x: 1080, y: 365, width: 78, rotation: -1 },
  { progress: 1, x: 1390, y: 292, width: 46, rotation: 0 },
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

mkdirSync(outputDirectory, { recursive: true })

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

    run('magick', [
      scaledBackgroundPath,
      '(', parcelPath,
      '-resize', `${width}x`,
      '-background', 'none',
      '-rotate', rotation,
      ')',
      '-geometry', `+${x}+${y}`,
      '-composite',
      '-quality', '76',
      '-define', 'webp:method=6',
      join(outputDirectory, fileName),
    ])
  }

  run('ffmpeg', [
    '-y',
    '-framerate', '24',
    '-i', join(outputDirectory, 'frame-%03d.webp'),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '20',
    '-g', '6',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    join(projectRoot, 'public/assets/generated/conveyor-sequence-fallback.mp4'),
  ])
} finally {
  rmSync(cacheDirectory, { recursive: true, force: true })
}
