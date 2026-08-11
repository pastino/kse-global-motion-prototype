import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'

type Point = { x: number; y: number }

const START = { x: -150, y: 690 }
const END = { x: 1570, y: 315 }
const DIRECTION = { x: END.x - START.x, y: END.y - START.y }
const DIRECTION_LENGTH = Math.hypot(DIRECTION.x, DIRECTION.y)
const NORMAL = { x: -DIRECTION.y / DIRECTION_LENGTH, y: DIRECTION.x / DIRECTION_LENGTH }

function pointAt(progress: number): Point {
  return {
    x: START.x + DIRECTION.x * progress,
    y: START.y + DIRECTION.y * progress,
  }
}

function widthAt(progress: number) {
  return 322 - progress * 172
}

function edgeAt(progress: number, side: -1 | 1): Point {
  const center = pointAt(progress)
  const halfWidth = widthAt(progress) / 2
  return {
    x: center.x + NORMAL.x * halfWidth * side,
    y: center.y + NORMAL.y * halfWidth * side,
  }
}

function points(...items: Point[]) {
  return items.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

function ConveyorBox({ progress, scan }: { progress: number; scan: number }) {
  const position = pointAt(progress)
  const scale = interpolate(progress, [0, 1], [1.32, 0.6])
  const bounce = Math.sin(progress * Math.PI * 18) * 1.8
  const shadowOpacity = interpolate(progress, [0, 1], [0.34, 0.18])

  return (
    <g transform={`translate(${position.x} ${position.y + bounce}) rotate(-12.3) scale(${scale})`}>
      <ellipse cx="0" cy="23" rx="92" ry="24" fill="#020a13" opacity={shadowOpacity} filter="url(#soft-shadow)" />
      <g transform="translate(0 -58)">
        <polygon points="-78,-36 22,-68 83,-30 -17,3" fill="#e7c797" />
        <polygon points="-78,-36 -17,3 -17,83 -78,40" fill="#c79c60" />
        <polygon points="-17,3 83,-30 83,49 -17,83" fill="#dcb578" />
        <polygon points="-5,-59 15,-65 75,-28 56,-22" fill="#f2dfbd" opacity="0.92" />
        <path d="M-17 3L83-30M-17 3L-78-36M-17 3V83" fill="none" stroke="#9c7544" strokeWidth="2" opacity="0.72" />
        <g transform="translate(13 29) skewY(-18)">
          <rect x="0" y="0" width="58" height="29" rx="3" fill="#f8f7f2" opacity="0.92" />
          <text x="7" y="13" fill="#d51d2d" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900">K</text>
          <text x="17" y="13" fill="#27a45d" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900">S</text>
          <text x="27" y="13" fill="#1879d1" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="900">E</text>
          <text x="7" y="23" fill="#15324b" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="800" letterSpacing="1">GLOBAL CARGO</text>
        </g>
        <path d="M-59 13h25M-59 22h17M-59 31h21" stroke="#6c4f2d" strokeWidth="3" opacity="0.54" />
      </g>
      <rect x="-94" y="-166" width="188" height="235" fill="#5de6ff" opacity={scan * 0.08} />
    </g>
  )
}

function Scanner({ scan }: { scan: number }) {
  const progress = 0.58
  const center = pointAt(progress)
  const width = widthAt(progress)
  const angle = Math.atan2(DIRECTION.y, DIRECTION.x) * 180 / Math.PI
  const scale = interpolate(progress, [0, 1], [1.1, 0.68])

  return (
    <g transform={`translate(${center.x} ${center.y}) rotate(${angle}) scale(${scale})`}>
      <path
        d={`M${-width / 2 - 18} 74V-178Q${-width / 2 - 18} -214 ${-width / 2 + 18} -214H${width / 2 - 18}Q${width / 2 + 18} -214 ${width / 2 + 18} -178V74`}
        fill="none"
        stroke="#7b93a5"
        strokeWidth="22"
      />
      <path
        d={`M${-width / 2 - 18} 74V-178Q${-width / 2 - 18} -214 ${-width / 2 + 18} -214H${width / 2 - 18}Q${width / 2 + 18} -214 ${width / 2 + 18} -178V74`}
        fill="none"
        stroke="#d5e7ef"
        strokeWidth="5"
        opacity="0.8"
      />
      <rect x={-width / 2 + 16} y="-203" width={width - 32} height="42" rx="8" fill="#102b3d" />
      <text x="0" y="-176" textAnchor="middle" fill="#a6efff" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="800" letterSpacing="4">KSE SMART SCAN</text>
      <rect x={-width / 2 + 3} y="-158" width={width - 6} height="218" fill="url(#scan-beam)" opacity={scan * 0.58} />
      <line x1={-width / 2} y1="-40" x2={width / 2} y2="-40" stroke="#71efff" strokeWidth={3 + scan * 5} opacity={0.12 + scan * 0.88} filter="url(#cyan-glow)" />
      <circle cx={-width / 2 - 18} cy="-152" r="7" fill={scan > 0.35 ? '#5df2ab' : '#587080'} />
    </g>
  )
}

export function ConveyorScene({ mobile = false }: { mobile?: boolean }) {
  const frame = useCurrentFrame()
  const { durationInFrames, height, width } = useVideoConfig()
  const normalizedFrame = frame / (durationInFrames - 1)
  const boxProgress = interpolate(normalizedFrame, [0, 1], [-0.1, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const beltTravel = normalizedFrame * 1.2
  const rollerRotation = normalizedFrame * 1800
  const scan = interpolate(Math.abs(boxProgress - 0.58), [0.015, 0.12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cameraScale = interpolate(normalizedFrame, [0, 0.5, 1], [1.025, 1.055, 1.035])
  const mobileFocusX = interpolate(boxProgress, [-0.1, 0.3, 0.58, 1.1], [390, 570, 830, 1080], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
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
            <filter id="soft-shadow"><feGaussianBlur stdDeviation="11" /></filter>
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
            const center = pointAt(progress)
            const markerScale = interpolate(progress, [0, 1], [1.25, 0.5])
            return (
              <path
                key={index}
                d="M-14 7L0-7L14 7"
                fill="none"
                stroke="#5fe2ff"
                strokeWidth="3"
                opacity="0.22"
                transform={`translate(${center.x} ${center.y}) rotate(-12.3) scale(${markerScale})`}
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

          <Scanner scan={scan} />
          <ConveyorBox progress={boxProgress} scan={scan} />

          <g transform="translate(1038 110)">
            <rect width="310" height="74" rx="12" fill="#071522" fillOpacity="0.8" stroke="#8adff3" strokeOpacity="0.22" />
            <circle cx="28" cy="25" r="5" fill="#5cefa6" />
            <text x="45" y="30" fill="#bcefff" fontSize="13" fontWeight="800" letterSpacing="2.2">LIVE SORTING LINE</text>
            <text x="28" y="55" fill="#6e92a5" fontSize="11" fontWeight="700" letterSpacing="1.6">BELT + CARGO / SYNCED MOTION</text>
          </g>
          <rect x="0" y="0" width="1440" height="810" fill="none" stroke="#78dfff" strokeOpacity="0.08" strokeWidth="24" />
        </svg>
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(2,10,20,.55) 0%, rgba(2,10,20,.12) 43%, transparent 68%), linear-gradient(0deg, rgba(2,9,18,.24), transparent 48%)' }} />
    </AbsoluteFill>
  )
}
