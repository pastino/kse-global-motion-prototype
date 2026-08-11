import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

type Point = { x: number; y: number }

const START = { x: -150, y: 690 }
const END = { x: 1570, y: 315 }
const DIRECTION = { x: END.x - START.x, y: END.y - START.y }
const DIRECTION_LENGTH = Math.hypot(DIRECTION.x, DIRECTION.y)
const LATERAL_AXIS = { x: 0.38, y: Math.sqrt(1 - 0.38 ** 2) }
const BELT_WIDTH = 322
const SCANNER_PROGRESS = 0.67
const CLEAN_PLATE_ASSET = staticFile('assets/generated/conveyor-cleanplate-scanner-photoreal-v3.webp')
const PARCEL_ASSET = staticFile('assets/generated/parcel-photoreal-cutout-v2.png')

function pointAt(progress: number): Point {
  return {
    x: START.x + DIRECTION.x * progress,
    y: START.y + DIRECTION.y * progress,
  }
}

function depthScale(progress: number) {
  return 1 - progress * 0.534
}

function project(progress: number, lateral = 0, height = 0): Point {
  const center = pointAt(progress)
  const scale = depthScale(progress)

  return {
    x: center.x + LATERAL_AXIS.x * lateral * scale,
    y: center.y + LATERAL_AXIS.y * lateral * scale - height * scale,
  }
}

function edgeAt(progress: number, side: -1 | 1): Point {
  return project(progress, BELT_WIDTH / 2 * side)
}

function points(...items: Point[]) {
  return items.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

function ParcelShadow({ progress }: { progress: number }) {
  const halfLength = 72 / DIRECTION_LENGTH
  const halfWidth = 54
  const rearFar = project(progress - halfLength, -halfWidth)
  const rearNear = project(progress - halfLength, halfWidth)
  const frontFar = project(progress + halfLength, -halfWidth)
  const frontNear = project(progress + halfLength, halfWidth)
  const scale = depthScale(progress)
  const shadowOpacity = interpolate(progress, [0, 1], [0.42, 0.24])

  return (
    <polygon
      points={points(rearFar, frontFar, frontNear, rearNear)}
      fill="#02070b"
      opacity={shadowOpacity}
      filter="url(#contact-shadow)"
      transform={`translate(${3 * scale} ${12 * scale})`}
    />
  )
}

function PhotorealParcel({ progress, scan }: { progress: number; scan: number }) {
  const center = pointAt(progress)
  const scale = depthScale(progress)
  const width = 258 * scale
  const height = width * 871 / 1181
  const x = center.x - width / 2
  const y = center.y - height + 19 * scale
  const opacity = interpolate(progress, [-0.1, -0.025, 1.025, 1.1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <foreignObject x={x} y={y} width={width} height={height} overflow="visible" opacity={opacity}>
      <div style={{ position: 'relative', width: '100%', height: '100%', filter: `brightness(.9) saturate(.92) contrast(1.04) drop-shadow(0 ${6 * scale}px ${6 * scale}px rgba(0,0,0,.34))` }}>
        <Img src={PARCEL_ASSET} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div style={{
          position: 'absolute',
          left: '50.5%',
          top: '61%',
          width: '40%',
          height: '15%',
          transform: 'translate(-50%, -50%) rotate(-5.5deg) skewX(-3deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#162b39',
          background: 'linear-gradient(180deg, rgba(255,255,252,.96), rgba(224,225,217,.94))',
          boxShadow: '0 1px 2px rgba(45,31,13,.2), inset 0 0 0 1px rgba(105,89,63,.12)',
          fontFamily: 'Arial, sans-serif',
          fontSize: 13 * scale,
          fontWeight: 900,
          letterSpacing: 1.5 * scale,
          whiteSpace: 'nowrap',
        }}>
          KSE CARGO
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(104deg, transparent 33%, rgba(70,231,255,.94) 49%, rgba(45,170,207,.28) 57%, transparent 69%)',
          opacity: scan * 0.32,
          WebkitMaskImage: `url(${PARCEL_ASSET})`,
          WebkitMaskSize: '100% 100%',
          maskImage: `url(${PARCEL_ASSET})`,
          maskSize: '100% 100%',
        }} />
      </div>
    </foreignObject>
  )
}

function scannerGeometry() {
  const height = 260

  return {
    scale: depthScale(SCANNER_PROGRESS),
    beamFarBottom: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 8),
    beamNearBottom: project(SCANNER_PROGRESS, BELT_WIDTH / 2, 8),
    beamNearTop: project(SCANNER_PROGRESS, BELT_WIDTH / 2, height - 18),
    beamFarTop: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, height - 18),
    laserFar: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 76),
    laserNear: project(SCANNER_PROGRESS, BELT_WIDTH / 2, 76),
  }
}

function ScannerBeamBack({ scan }: { scan: number }) {
  const geometry = scannerGeometry()

  return (
    <polygon
      points={points(geometry.beamFarBottom, geometry.beamNearBottom, geometry.beamNearTop, geometry.beamFarTop)}
      fill="url(#scan-beam)"
      opacity={scan * 0.3}
    />
  )
}

function ScannerBeamFront({ scan }: { scan: number }) {
  const geometry = scannerGeometry()

  return (
    <line
      x1={geometry.laserFar.x}
      y1={geometry.laserFar.y}
      x2={geometry.laserNear.x}
      y2={geometry.laserNear.y}
      stroke="#79efff"
      strokeWidth={(2 + scan * 5) * geometry.scale}
      opacity={0.08 + scan * 0.92}
      filter="url(#cyan-glow)"
    />
  )
}

function ScannerForeground() {
  const clips = [
    'inset(195px 210px 495px 875px)',
    'inset(248px 500px 130px 885px)',
    'inset(245px 315px 115px 1060px)',
  ]

  return (
    <>
      {clips.map((clipPath) => (
        <Img
          key={clipPath}
          src={CLEAN_PLATE_ASSET}
          style={{ position: 'absolute', inset: 0, width: 1440, height: 810, clipPath, pointerEvents: 'none' }}
        />
      ))}
    </>
  )
}

export function ConveyorScene({ mobile = false }: { mobile?: boolean }) {
  const frame = useCurrentFrame()
  const { durationInFrames, height, width } = useVideoConfig()
  const normalizedFrame = frame / (durationInFrames - 1)
  const boxProgress = interpolate(normalizedFrame, [0, 1], mobile ? [0.16, 0.84] : [-0.1, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const beltTravel = normalizedFrame * (mobile ? 1 : 1.2)
  const scan = interpolate(Math.abs(boxProgress - SCANNER_PROGRESS), [0.015, 0.12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cameraScale = interpolate(normalizedFrame, [0, 0.5, 1], [1.025, 1.055, 1.035])
  const mobileFocusX = pointAt(boxProgress).x
  const mobileScale = height / 810 * cameraScale
  const mobileOffsetX = width / 2 - mobileFocusX * mobileScale

  return (
    <AbsoluteFill style={{ backgroundColor: '#07131f', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1440,
        height: 810,
        transform: mobile
          ? `translateX(${mobileOffsetX}px) scale(${mobileScale})`
          : `scale(${cameraScale})`,
        transformOrigin: mobile ? '0 0' : '54% 56%',
      }}>
        <Img
          src={CLEAN_PLATE_ASSET}
          style={{ position: 'absolute', inset: 0, width: 1440, height: 810, objectFit: 'cover' }}
        />
        <svg
          width="1440"
          height="810"
          viewBox="0 0 1440 810"
          role="img"
          aria-label="KSE 자동 분류 컨베이어에서 화물이 이동하는 장면"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <linearGradient id="scan-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5de7ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#5de7ff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#5de7ff" stopOpacity="0" />
            </linearGradient>
            <filter id="contact-shadow"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="cyan-glow"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          {Array.from({ length: 9 }, (_, index) => {
            const progress = (index / 9 + beltTravel) % 1
            const left = edgeAt(progress, -1)
            const right = edgeAt(progress, 1)
            return <line key={index} x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#d6e6eb" strokeWidth={interpolate(progress, [0, 1], [4, 1.4])} opacity="0.075" />
          })}

          {Array.from({ length: 7 }, (_, index) => {
            const progress = (index / 7 + beltTravel) % 1
            const tip = project(progress + 14 / DIRECTION_LENGTH)
            const left = project(progress - 9 / DIRECTION_LENGTH, -13)
            const right = project(progress - 9 / DIRECTION_LENGTH, 13)
            return (
              <polyline
                key={index}
                points={points(left, tip, right)}
                fill="none"
                stroke="#9cd4df"
                strokeWidth={2.4 * depthScale(progress)}
                opacity="0.11"
              />
            )
          })}

          <ScannerBeamBack scan={scan} />
          <ParcelShadow progress={boxProgress} />
          <PhotorealParcel progress={boxProgress} scan={scan} />
          <ScannerBeamFront scan={scan} />

          <rect x="0" y="0" width="1440" height="810" fill="none" stroke="#061019" strokeOpacity="0.28" strokeWidth="24" />
        </svg>
        <ScannerForeground />
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(2,10,20,.55) 0%, rgba(2,10,20,.12) 43%, transparent 68%), linear-gradient(0deg, rgba(2,9,18,.24), transparent 48%)' }} />
    </AbsoluteFill>
  )
}
