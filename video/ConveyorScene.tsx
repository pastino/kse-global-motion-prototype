import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

type Point = { x: number; y: number }

const START = { x: -150, y: 690 }
const END = { x: 1570, y: 315 }
const DIRECTION = { x: END.x - START.x, y: END.y - START.y }
const DIRECTION_LENGTH = Math.hypot(DIRECTION.x, DIRECTION.y)
const LATERAL_AXIS = { x: 0.38, y: Math.sqrt(1 - 0.38 ** 2) }
const BELT_WIDTH = 322
const SCANNER_PROGRESS = 0.7

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

function ConveyorBox({ progress, scan }: { progress: number; scan: number }) {
  const halfLength = 78 / DIRECTION_LENGTH
  const halfWidth = 58
  const height = 126
  const rearProgress = progress - halfLength
  const frontProgress = progress + halfLength
  const rearFar = project(rearProgress, -halfWidth)
  const rearNear = project(rearProgress, halfWidth)
  const frontFar = project(frontProgress, -halfWidth)
  const frontNear = project(frontProgress, halfWidth)
  const rearFarTop = project(rearProgress, -halfWidth, height)
  const rearNearTop = project(rearProgress, halfWidth, height)
  const frontFarTop = project(frontProgress, -halfWidth, height)
  const frontNearTop = project(frontProgress, halfWidth, height)
  const labelRearBottom = project(progress - 50 / DIRECTION_LENGTH, halfWidth + 1, 32)
  const labelFrontBottom = project(progress + 50 / DIRECTION_LENGTH, halfWidth + 1, 32)
  const labelFrontTop = project(progress + 50 / DIRECTION_LENGTH, halfWidth + 1, 68)
  const labelRearTop = project(progress - 50 / DIRECTION_LENGTH, halfWidth + 1, 68)
  const labelCenter = project(progress, halfWidth + 2, 50)
  const scale = depthScale(progress)
  const shadowOpacity = interpolate(progress, [0, 1], [0.34, 0.18])

  return (
    <g>
      <polygon points={points(rearFar, frontFar, frontNear, rearNear)} fill="#020a13" opacity={shadowOpacity} filter="url(#contact-shadow)" />
      <polygon points={points(rearFar, rearNear, rearNearTop, rearFarTop)} fill="#c8995e" stroke="#9b7040" strokeWidth={2 * scale} />
      <polygon points={points(rearNear, frontNear, frontNearTop, rearNearTop)} fill="#dcb276" stroke="#9b7040" strokeWidth={2 * scale} />
      <polygon points={points(rearFarTop, rearNearTop, frontNearTop, frontFarTop)} fill="#e9cc9b" stroke="#a57d4b" strokeWidth={2 * scale} />
      <polygon
        points={points(
          project(rearProgress, -10, height + 0.5),
          project(rearProgress, 10, height + 0.5),
          project(frontProgress, 10, height + 0.5),
          project(frontProgress, -10, height + 0.5),
        )}
        fill="#f4e0bc"
        opacity="0.95"
      />
      <polygon points={points(labelRearBottom, labelFrontBottom, labelFrontTop, labelRearTop)} fill="#f7f7f2" opacity="0.96" />
      <text
        x={labelCenter.x}
        y={labelCenter.y + 4 * scale}
        textAnchor="middle"
        fill="#17324a"
        fontFamily="Arial, sans-serif"
        fontSize={13 * scale}
        fontWeight="900"
        letterSpacing={1.8 * scale}
        transform={`rotate(-12.3 ${labelCenter.x} ${labelCenter.y})`}
      >
        KSE CARGO
      </text>
      <polygon points={points(rearNear, frontNear, frontNearTop, rearNearTop)} fill="#5de6ff" opacity={scan * 0.09} />
    </g>
  )
}

function scannerGeometry() {
  const outerWidth = BELT_WIDTH / 2 + 24
  const height = 250
  const halfLength = 62 / DIRECTION_LENGTH
  const entranceProgress = SCANNER_PROGRESS - halfLength
  const exitProgress = SCANNER_PROGRESS + halfLength

  return {
    scale: depthScale(SCANNER_PROGRESS),
    entranceFarBase: project(entranceProgress, -outerWidth),
    entranceFarTop: project(entranceProgress, -outerWidth, height),
    entranceNearBase: project(entranceProgress, outerWidth),
    entranceNearTop: project(entranceProgress, outerWidth, height),
    exitFarBase: project(exitProgress, -outerWidth),
    exitFarTop: project(exitProgress, -outerWidth, height),
    exitNearBase: project(exitProgress, outerWidth),
    exitNearTop: project(exitProgress, outerWidth, height),
    beamFarBottom: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 8),
    beamNearBottom: project(SCANNER_PROGRESS, BELT_WIDTH / 2, 8),
    beamNearTop: project(SCANNER_PROGRESS, BELT_WIDTH / 2, height - 18),
    beamFarTop: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, height - 18),
    laserFar: project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 76),
    laserNear: project(SCANNER_PROGRESS, BELT_WIDTH / 2, 76),
  }
}

function ScannerBack({ scan }: { scan: number }) {
  const geometry = scannerGeometry()
  const frameWidth = 21 * geometry.scale
  const frameStroke = {
    fill: 'none',
    stroke: '#607c8c',
    strokeWidth: frameWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <g>
      <polygon points={points(geometry.beamFarBottom, geometry.beamNearBottom, geometry.beamNearTop, geometry.beamFarTop)} fill="url(#scan-beam)" opacity={scan * 0.32} />
      <polyline
        points={points(geometry.entranceFarBase, geometry.entranceFarTop, geometry.entranceNearTop)}
        {...frameStroke}
      />
      <polyline
        points={points(geometry.exitFarBase, geometry.exitFarTop, geometry.exitNearTop)}
        {...frameStroke}
      />
      <polygon
        points={points(geometry.entranceFarTop, geometry.entranceNearTop, geometry.exitNearTop, geometry.exitFarTop)}
        fill="#203b4b"
        fillOpacity="0.82"
        stroke="#7f9aa8"
        strokeWidth={frameWidth * 0.42}
        strokeLinejoin="round"
      />
      <polyline points={points(geometry.entranceFarBase, geometry.entranceFarTop, geometry.entranceNearTop)} fill="none" stroke="#d7e8ef" strokeWidth={frameWidth * 0.24} strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <polyline points={points(geometry.exitFarBase, geometry.exitFarTop, geometry.exitNearTop)} fill="none" stroke="#d7e8ef" strokeWidth={frameWidth * 0.24} strokeLinecap="round" strokeLinejoin="round" opacity="0.72" />
      <line x1={geometry.entranceFarTop.x} y1={geometry.entranceFarTop.y} x2={geometry.exitFarTop.x} y2={geometry.exitFarTop.y} stroke="#b7d1dc" strokeWidth={frameWidth * 0.22} opacity="0.72" />
    </g>
  )
}

function ScannerFront({ scan }: { scan: number }) {
  const geometry = scannerGeometry()
  const frameWidth = 21 * geometry.scale
  const lightPosition = project(SCANNER_PROGRESS + 62 / DIRECTION_LENGTH, BELT_WIDTH / 2 + 24, 176)

  return (
    <g>
      <line
        x1={geometry.entranceNearBase.x}
        y1={geometry.entranceNearBase.y}
        x2={geometry.entranceNearTop.x}
        y2={geometry.entranceNearTop.y}
        stroke="#607c8c"
        strokeWidth={frameWidth}
        strokeLinecap="round"
      />
      <line
        x1={geometry.exitNearBase.x}
        y1={geometry.exitNearBase.y}
        x2={geometry.exitNearTop.x}
        y2={geometry.exitNearTop.y}
        stroke="#607c8c"
        strokeWidth={frameWidth}
        strokeLinecap="round"
      />
      <line
        x1={geometry.entranceNearBase.x}
        y1={geometry.entranceNearBase.y}
        x2={geometry.entranceNearTop.x}
        y2={geometry.entranceNearTop.y}
        stroke="#d7e8ef"
        strokeWidth={frameWidth * 0.28}
        strokeLinecap="round"
        opacity="0.82"
      />
      <line x1={geometry.exitNearBase.x} y1={geometry.exitNearBase.y} x2={geometry.exitNearTop.x} y2={geometry.exitNearTop.y} stroke="#d7e8ef" strokeWidth={frameWidth * 0.28} strokeLinecap="round" opacity="0.76" />
      <line x1={geometry.entranceNearTop.x} y1={geometry.entranceNearTop.y} x2={geometry.exitNearTop.x} y2={geometry.exitNearTop.y} stroke="#a9c8d5" strokeWidth={frameWidth * 0.38} strokeLinecap="round" />
      <line
        x1={geometry.laserFar.x}
        y1={geometry.laserFar.y}
        x2={geometry.laserNear.x}
        y2={geometry.laserNear.y}
        stroke="#71efff"
        strokeWidth={(3 + scan * 5) * geometry.scale}
        opacity={0.1 + scan * 0.9}
        filter="url(#cyan-glow)"
      />
      <circle cx={lightPosition.x} cy={lightPosition.y} r={7 * geometry.scale} fill={scan > 0.35 ? '#5df2ab' : '#587080'} />
    </g>
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
  const rollerRotation = normalizedFrame * 1800
  const scan = interpolate(Math.abs(boxProgress - SCANNER_PROGRESS), [0.015, 0.12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cameraScale = interpolate(normalizedFrame, [0, 0.5, 1], [1.025, 1.055, 1.035])
  const mobileFocusX = pointAt(boxProgress).x
  const mobileScale = height / 810 * cameraScale
  const mobileOffsetX = width / 2 - mobileFocusX * mobileScale
  const nearBack = edgeAt(0, -1)
  const nearFront = edgeAt(0, 1)
  const farBack = edgeAt(1, -1)
  const farFront = edgeAt(1, 1)

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
        <svg width="1440" height="810" viewBox="0 0 1440 810" role="img" aria-label="KSE 자동 분류 컨베이어에서 화물이 이동하는 장면">
          <defs>
            <linearGradient id="warehouse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0c2538" />
              <stop offset="0.56" stopColor="#091824" />
              <stop offset="1" stopColor="#050d15" />
            </linearGradient>
            <linearGradient id="belt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2d4e60" />
              <stop offset="0.52" stopColor="#183545" />
              <stop offset="1" stopColor="#0e2532" />
            </linearGradient>
            <linearGradient id="rail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a9c4d2" />
              <stop offset="0.2" stopColor="#526f7f" />
              <stop offset="1" stopColor="#182d3b" />
            </linearGradient>
            <linearGradient id="scan-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5de7ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#5de7ff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#5de7ff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="light" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#65dfff" stopOpacity="0.24" />
              <stop offset="1" stopColor="#65dfff" stopOpacity="0" />
            </radialGradient>
            <filter id="contact-shadow"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="cyan-glow"><feGaussianBlur stdDeviation="7" /></filter>
            <pattern id="floor-grid" width="90" height="90" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)">
              <path d="M90 0H0V90" fill="none" stroke="#7fc6df" strokeOpacity="0.075" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1440" height="810" fill="url(#warehouse)" />
          <ellipse cx="960" cy="275" rx="690" ry="420" fill="url(#light)" />
          <rect y="465" width="1440" height="345" fill="#071019" />
          <rect y="465" width="1440" height="345" fill="url(#floor-grid)" />

          {[120, 430, 740, 1050, 1360].map((x) => (
            <g key={x} opacity="0.55">
              <rect x={x} y="0" width="18" height="500" fill="#102c3f" />
              <rect x={x + 5} y="0" width="4" height="500" fill="#8dc2d3" opacity="0.26" />
            </g>
          ))}
          {[230, 570, 910, 1250].map((x) => (
            <g key={x}>
              <line x1={x} y1="0" x2={x - 130} y2="465" stroke="#17384d" strokeWidth="8" opacity="0.48" />
              <ellipse cx={x} cy="62" rx="78" ry="18" fill="#b7efff" opacity="0.14" />
              <line x1={x} y1="0" x2={x} y2="56" stroke="#7ba5b4" strokeWidth="3" opacity="0.42" />
            </g>
          ))}

          <polygon points={points(nearBack, farBack, farFront, nearFront)} fill="url(#belt)" stroke="#6c91a2" strokeWidth="3" />
          <polygon points={points(nearFront, farFront, { x: farFront.x, y: farFront.y + 54 }, { x: nearFront.x, y: nearFront.y + 88 })} fill="url(#rail)" />
          <polygon points={points(nearBack, farBack, { x: farBack.x, y: farBack.y - 22 }, { x: nearBack.x, y: nearBack.y - 30 })} fill="#7895a3" />

          {Array.from({ length: 24 }, (_, index) => {
            const progress = (index / 24 + beltTravel) % 1
            const left = edgeAt(progress, -1)
            const right = edgeAt(progress, 1)
            return <line key={index} x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#8fb0bd" strokeWidth={interpolate(progress, [0, 1], [4, 1.4])} opacity="0.28" />
          })}

          {Array.from({ length: 13 }, (_, index) => {
            const progress = (index / 13 + beltTravel) % 1
            const tip = project(progress + 14 / DIRECTION_LENGTH)
            const left = project(progress - 9 / DIRECTION_LENGTH, -13)
            const right = project(progress - 9 / DIRECTION_LENGTH, 13)
            return (
              <polyline
                key={index}
                points={points(left, tip, right)}
                fill="none"
                stroke="#5fe2ff"
                strokeWidth={3 * depthScale(progress)}
                opacity="0.22"
              />
            )
          })}

          {Array.from({ length: 17 }, (_, index) => {
            const progress = index / 16
            const center = edgeAt(progress, 1)
            const radius = interpolate(progress, [0, 1], [20, 8])
            return (
              <g key={index} transform={`translate(${center.x} ${center.y + radius + 20}) rotate(${rollerRotation})`}>
                <circle r={radius} fill="#203d4d" stroke="#89a9b7" strokeWidth="2" />
                <line x1={-radius * 0.74} y1="0" x2={radius * 0.74} y2="0" stroke="#b7d2dc" strokeWidth="2" opacity="0.65" />
                <line x1="0" y1={-radius * 0.74} x2="0" y2={radius * 0.74} stroke="#b7d2dc" strokeWidth="2" opacity="0.65" />
              </g>
            )
          })}

          {[0.08, 0.34, 0.66, 0.9].map((progress) => {
            const back = edgeAt(progress, -1)
            const front = edgeAt(progress, 1)
            const legHeight = interpolate(progress, [0, 1], [132, 58])
            return (
              <g key={progress} stroke="#4f6a78" strokeWidth={interpolate(progress, [0, 1], [13, 6])}>
                <line x1={back.x} y1={back.y + 18} x2={back.x - 8} y2={back.y + legHeight} />
                <line x1={front.x} y1={front.y + 42} x2={front.x + 8} y2={front.y + legHeight} />
              </g>
            )
          })}

          <ScannerBack scan={scan} />
          <ConveyorBox progress={boxProgress} scan={scan} />
          <ScannerFront scan={scan} />

          <rect x="0" y="0" width="1440" height="810" fill="none" stroke="#78dfff" strokeOpacity="0.08" strokeWidth="24" />
        </svg>
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(2,10,20,.55) 0%, rgba(2,10,20,.12) 43%, transparent 68%), linear-gradient(0deg, rgba(2,9,18,.24), transparent 48%)' }} />
    </AbsoluteFill>
  )
}
