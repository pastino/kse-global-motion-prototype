import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = join(projectRoot, 'public/assets/generated')
const cacheDirectory = mkdtempSync(join(tmpdir(), 'kse-conveyor-remotion-'))
const rawVideoPath = join(cacheDirectory, 'conveyor-raw.mp4')
const rawMobileVideoPath = join(cacheDirectory, 'conveyor-mobile-raw.mp4')
const desktopPosterSource = join(cacheDirectory, 'conveyor-poster-desktop.png')
const mobilePosterSource = join(cacheDirectory, 'conveyor-poster-mobile.png')
const videoPath = join(outputDirectory, 'conveyor-sequence.mp4')
const mobileVideoPath = join(outputDirectory, 'conveyor-sequence-mobile.mp4')
const desktopPosterPath = join(outputDirectory, 'conveyor-sequence-poster.webp')
const mobilePosterPath = join(outputDirectory, 'conveyor-sequence-mobile-poster.webp')

function run(command, args) {
  const result = spawnSync(command, args, { cwd: projectRoot, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${command} 실행에 실패했습니다.`)
}

mkdirSync(outputDirectory, { recursive: true })

try {
  run('npx', [
    'remotion', 'render',
    'video/index.ts',
    'KseConveyor',
    rawVideoPath,
    '--codec=h264',
    '--crf=18',
    '--pixel-format=yuv420p',
    '--concurrency=4',
    '--log=info',
  ])

  // 스크롤 역재생에서도 즉시 프레임을 찾을 수 있도록 모든 프레임을 키프레임으로 인코딩한다.
  run('ffmpeg', [
    '-y',
    '-i', rawVideoPath,
    '-an',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '20',
    '-g', '1',
    '-keyint_min', '1',
    '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    videoPath,
  ])

  run('npx', [
    'remotion', 'render',
    'video/index.ts',
    'KseConveyorMobile',
    rawMobileVideoPath,
    '--codec=h264',
    '--crf=18',
    '--pixel-format=yuv420p',
    '--concurrency=4',
    '--log=info',
  ])

  run('ffmpeg', [
    '-y',
    '-i', rawMobileVideoPath,
    '-an',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '22',
    '-g', '48',
    '-keyint_min', '24',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mobileVideoPath,
  ])

  run('ffmpeg', [
    '-y',
    '-ss', '0.18',
    '-i', videoPath,
    '-frames:v', '1',
    desktopPosterSource,
  ])
  run('magick', [desktopPosterSource, '-quality', '82', desktopPosterPath])

  run('ffmpeg', [
    '-y',
    '-ss', '1.65',
    '-i', mobileVideoPath,
    '-frames:v', '1',
    mobilePosterSource,
  ])
  run('magick', [mobilePosterSource, '-quality', '82', mobilePosterPath])
} finally {
  rmSync(cacheDirectory, { recursive: true, force: true })
}
