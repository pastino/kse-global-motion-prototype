import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import {
  BELT_WIDTH,
  END,
  PARCEL_HALF_WIDTH,
  PARCEL_HEIGHT,
  SCANNER_PROGRESS,
  START,
  depthScale,
  edgeAt,
  getBeltCueProgress,
  getParcelPose,
  getParcelProgress,
  pointAt,
  points,
  project,
} from './conveyorGeometry'

const CLEAN_PLATE_ASSET = staticFile('assets/generated/conveyor-cleanplate-shallow-v7.webp')
const KSE_LOGO_ASSET = staticFile('assets/kse-logo.png')

function MovingBeltSurface({ frame, durationInFrames }: { frame: number; durationInFrames: number }) {
  return (
    <g clipPath="url(#belt-surface-mask)">
      {Array.from({ length: 16 }, (_, index) => {
        const progress = getBeltCueProgress(index, frame, durationInFrames)
        const rear = Math.max(0, progress - 0.012)
        const front = Math.min(1, progress + 0.012)
        const rearLeft = edgeAt(rear, -1)
        const rearRight = edgeAt(rear, 1)
        const frontLeft = edgeAt(front, -1)
        const frontRight = edgeAt(front, 1)
        const opacity = interpolate(progress, [0, 0.3, 1], [0.2, 0.14, 0.05])

        return (
          <polygon
            key={`belt-band-${index}`}
            points={points(rearLeft, frontLeft, frontRight, rearRight)}
            fill="url(#belt-moving-band)"
            opacity={opacity}
          />
        )
      })}

      {Array.from({ length: 16 }, (_, index) => {
        const progress = getBeltCueProgress(index + 0.5, frame, durationInFrames)
        const left = edgeAt(progress, -0.92)
        const right = edgeAt(progress, 0.92)

        return (
          <line
            key={`belt-seam-${index}`}
            x1={left.x}
            y1={left.y}
            x2={right.x}
            y2={right.y}
            stroke="#dcecf2"
            strokeWidth={interpolate(progress, [0, 1], [3.2, 0.8])}
            opacity={interpolate(progress, [0, 0.7, 1], [0.18, 0.11, 0.04])}
          />
        )
      })}
    </g>
  )
}

function ParcelShadow({ progress }: { progress: number }) {
  const scale = depthScale(progress)
  const halfLength = 0.051
  const halfWidth = 51
  const rearFar = project(progress - halfLength, -halfWidth)
  const rearNear = project(progress - halfLength, halfWidth)
  const frontFar = project(progress + halfLength, -halfWidth)
  const frontNear = project(progress + halfLength, halfWidth)

  return (
    <polygon
      points={points(rearFar, frontFar, frontNear, rearNear)}
      fill="#010509"
      opacity={interpolate(progress, [0, 1], [0.46, 0.2])}
      filter="url(#contact-shadow)"
      transform={`translate(${4 * scale} ${10 * scale})`}
    />
  )
}

function RailBrandDecal() {
  const center = project(0.13, 175)
  const angle = Math.atan2(END.y - START.y, END.x - START.x) * 180 / Math.PI

  return (
    <g transform={`rotate(${angle} ${center.x} ${center.y})`} opacity="0.9">
      <rect x={center.x - 58} y={center.y - 12} width="116" height="24" rx="3" fill="#f8fbfd" stroke="#afc7d4" strokeWidth="1" />
      <image href={KSE_LOGO_ASSET} x={center.x - 51} y={center.y - 7} width="102" height="14" preserveAspectRatio="xMidYMid meet" />
    </g>
  )
}

function Parcel({ frame, durationInFrames, mobile, scan }: { frame: number; durationInFrames: number; mobile: boolean; scan: number }) {
  const pose = getParcelPose(frame, durationInFrames, mobile)
  const frontProgress = pose.progress - pose.depthProgress
  const rearProgress = pose.progress + pose.depthProgress
  const halfWidth = PARCEL_HALF_WIDTH
  const boxHeight = PARCEL_HEIGHT
  const withContact = ({ x, y }: { x: number; y: number }) => ({ x, y: y + pose.contactOffset })
  const frontLeft = withContact(project(frontProgress, -halfWidth))
  const frontRight = withContact(project(frontProgress, halfWidth))
  const rearLeft = withContact(project(rearProgress, -halfWidth))
  const rearRight = withContact(project(rearProgress, halfWidth))
  const frontLeftTop = withContact(project(frontProgress, -halfWidth, boxHeight))
  const frontRightTop = withContact(project(frontProgress, halfWidth, boxHeight))
  const rearLeftTop = withContact(project(rearProgress, -halfWidth, boxHeight))
  const rearRightTop = withContact(project(rearProgress, halfWidth, boxHeight))
  const tapeFrontLeft = withContact(project(frontProgress, -12, boxHeight))
  const tapeFrontRight = withContact(project(frontProgress, 12, boxHeight))
  const tapeRearLeft = withContact(project(rearProgress, -12, boxHeight))
  const tapeRearRight = withContact(project(rearProgress, 12, boxHeight))
  const labelLeftTop = withContact(project(frontProgress - 0.001, -41, 75))
  const labelRightTop = withContact(project(frontProgress - 0.001, 41, 75))
  const labelLeftBottom = withContact(project(frontProgress - 0.001, -41, 41))
  const labelRightBottom = withContact(project(frontProgress - 0.001, 41, 41))
  const labelCenter = {
    x: (labelLeftTop.x + labelRightTop.x + labelLeftBottom.x + labelRightBottom.x) / 4,
    y: (labelLeftTop.y + labelRightTop.y + labelLeftBottom.y + labelRightBottom.y) / 4,
  }
  const crossAngle = Math.atan2(frontRight.y - frontLeft.y, frontRight.x - frontLeft.x) * 180 / Math.PI
  const opacity = interpolate(pose.progress, [-0.1, -0.025, 1.04, 1.14], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <g opacity={opacity} filter="url(#parcel-shadow)">
      <polygon points={points(frontRight, rearRight, rearRightTop, frontRightTop)} fill="url(#cardboard-side)" />
      <polygon points={points(frontLeft, frontRight, frontRightTop, frontLeftTop)} fill="url(#cardboard-front)" />
      <polygon points={points(frontLeftTop, frontRightTop, rearRightTop, rearLeftTop)} fill="url(#cardboard-top)" />
      <polyline points={points(frontLeftTop, frontRightTop, rearRightTop)} fill="none" stroke="#f2c98f" strokeWidth={1.3 * pose.scale} opacity="0.58" />
      <polygon points={points(tapeFrontLeft, tapeFrontRight, tapeRearRight, tapeRearLeft)} fill="url(#packing-tape)" opacity="0.82" />
      <polygon points={points(labelLeftTop, labelRightTop, labelRightBottom, labelLeftBottom)} fill="#f5f3ec" opacity="0.96" />
      <svg
        x={labelCenter.x - 17 * pose.scale}
        y={labelCenter.y - 9.2 * pose.scale}
        width={34 * pose.scale}
        height={18.4 * pose.scale}
        viewBox="0 0 150 81"
        overflow="hidden"
        aria-hidden="true"
        transform={`rotate(${crossAngle} ${labelCenter.x} ${labelCenter.y})`}
      >
        <image href={KSE_LOGO_ASSET} x="0" y="0" width="578" height="81" />
      </svg>
      <polygon
        points={points(frontLeftTop, frontRightTop, rearRightTop, rearLeftTop)}
        fill="url(#parcel-scan)"
        opacity={scan * 0.48}
      />
    </g>
  )
}

function ScannerBeam({ scan }: { scan: number }) {
  const farBottom = project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 4)
  const nearBottom = project(SCANNER_PROGRESS, BELT_WIDTH / 2, 4)
  const farTop = project(SCANNER_PROGRESS, -BELT_WIDTH / 2, 225)
  const nearTop = project(SCANNER_PROGRESS, BELT_WIDTH / 2, 225)

  return (
    <>
      <polygon
        points={points(farBottom, nearBottom, nearTop, farTop)}
        fill="url(#scan-beam)"
        opacity={scan * 0.28}
      />
      <line
        x1={farBottom.x}
        y1={farBottom.y - 40 * depthScale(SCANNER_PROGRESS)}
        x2={nearBottom.x}
        y2={nearBottom.y - 40 * depthScale(SCANNER_PROGRESS)}
        stroke="#83f1ff"
        strokeWidth={2 + scan * 3}
        opacity={scan}
        filter="url(#cyan-glow)"
      />
    </>
  )
}

export function ConveyorScene({ mobile = false }: { mobile?: boolean }) {
  const frame = useCurrentFrame()
  const { durationInFrames, height, width } = useVideoConfig()
  const normalizedFrame = frame / Math.max(1, durationInFrames - 1)
  const parcelProgress = getParcelProgress(frame, durationInFrames, mobile)
  const scan = interpolate(Math.abs(parcelProgress - SCANNER_PROGRESS), [0.018, 0.1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const cameraScale = interpolate(normalizedFrame, [0, 0.55, 1], [1.015, 1.045, 1.025])
  const mobileFocusX = pointAt(parcelProgress).x
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
        transformOrigin: mobile ? '0 0' : '58% 55%',
      }}>
        <Img src={CLEAN_PLATE_ASSET} style={{ position: 'absolute', inset: 0, width: 1440, height: 810 }} />
        <svg
          width="1440"
          height="810"
          viewBox="0 0 1440 810"
          role="img"
          aria-label="KSE 자동 분류 컨베이어 위의 화물이 검사대를 통과하는 장면"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <clipPath id="belt-surface-mask">
              <polygon points="0,642 400,810 1335,303 1295,286" />
            </clipPath>
            <linearGradient id="belt-moving-band" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#eaf6fb" stopOpacity="0" />
              <stop offset="0.48" stopColor="#eaf6fb" stopOpacity="0.72" />
              <stop offset="1" stopColor="#eaf6fb" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cardboard-front" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c58a46" />
              <stop offset="0.55" stopColor="#a96c32" />
              <stop offset="1" stopColor="#885024" />
            </linearGradient>
            <linearGradient id="cardboard-side" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#925624" />
              <stop offset="1" stopColor="#603518" />
            </linearGradient>
            <linearGradient id="cardboard-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e0ae6d" />
              <stop offset="0.6" stopColor="#c58843" />
              <stop offset="1" stopColor="#a96730" />
            </linearGradient>
            <linearGradient id="packing-tape" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ead8b6" />
              <stop offset="0.5" stopColor="#f0dfbf" />
              <stop offset="1" stopColor="#c8ad7d" />
            </linearGradient>
            <linearGradient id="parcel-scan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#68e9ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#68e9ff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#68e9ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="scan-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5de7ff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#5de7ff" stopOpacity="0.72" />
              <stop offset="1" stopColor="#5de7ff" stopOpacity="0" />
            </linearGradient>
            <filter id="contact-shadow"><feGaussianBlur stdDeviation="5" /></filter>
            <filter id="cyan-glow"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="parcel-shadow" x="-30%" y="-30%" width="160%" height="170%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#02060a" floodOpacity="0.42" />
            </filter>
          </defs>

          <MovingBeltSurface frame={frame} durationInFrames={durationInFrames} />
          <RailBrandDecal />
          <ParcelShadow progress={parcelProgress} />
          <Parcel frame={frame} durationInFrames={durationInFrames} mobile={mobile} scan={scan} />
          <ScannerBeam scan={scan} />
        </svg>
      </div>
      <AbsoluteFill style={{
        background: 'linear-gradient(90deg, rgba(3,12,24,.68) 0%, rgba(3,12,24,.34) 38%, transparent 66%), linear-gradient(0deg, rgba(2,9,18,.18), transparent 50%)',
      }} />
    </AbsoluteFill>
  )
}
