import { describe, expect, it } from 'vitest'
import * as conveyorGeometry from './conveyorGeometry'
import {
  depthScale,
  edgeAt,
  getBeltCueProgress,
  getParcelPose,
  getParcelProgress,
  pointAt,
  PARCEL_HALF_WIDTH,
  END,
  SCANNER_PROGRESS,
  START,
} from './conveyorGeometry'

describe('컨베이어 장면 좌표', () => {
  it('상자 폭은 전경 벨트 폭의 40% 이내로 유지된다', () => {
    const geometry = conveyorGeometry as typeof conveyorGeometry & { PARCEL_HALF_WIDTH?: number }

    expect(geometry.PARCEL_HALF_WIDTH).toBeTypeOf('number')
    expect(geometry.PARCEL_HALF_WIDTH! * 2 / geometry.BELT_WIDTH).toBeLessThanOrEqual(0.4)
  })

  it('재생 프레임이 바뀌면 벨트 표면 표시도 진행 방향으로 이동한다', () => {
    const start = getBeltCueProgress(0, 0, 96)
    const next = getBeltCueProgress(0, 12, 96)

    expect(next).toBeGreaterThan(start)
  })

  it('상자는 검사대 중심을 지나 같은 진행 방향으로 이동한다', () => {
    const before = getParcelProgress(40, 96, false)
    const after = getParcelProgress(74, 96, false)

    expect(before).toBeLessThan(SCANNER_PROGRESS)
    expect(after).toBeGreaterThan(SCANNER_PROGRESS)
    expect(pointAt(after).y).toBeLessThan(pointAt(before).y)
  })

  it('상자 중심선은 직선 레일의 소실점과 끝까지 일치한다', () => {
    const quarter = pointAt(0.25)
    const middle = pointAt(0.5)
    const threeQuarter = pointAt(0.75)

    expect(middle.x - quarter.x).toBeCloseTo(threeQuarter.x - middle.x, 5)
    expect(middle.y - quarter.y).toBeCloseTo(threeQuarter.y - middle.y, 5)
  })

  it('레일 진행축은 화면에서 24도보다 완만하다', () => {
    const angle = Math.abs(Math.atan2(END.y - START.y, END.x - START.x) * 180 / Math.PI)

    expect(angle).toBeGreaterThan(15)
    expect(angle).toBeLessThan(24)
  })

  it('벨트 단면은 배경 레일과 같은 각도로 소실점을 향해 좁아진다', () => {
    const nearLeft = edgeAt(0, -1)
    const nearRight = edgeAt(0, 1)
    const farLeft = edgeAt(1, -1)
    const farRight = edgeAt(1, 1)

    const nearSlope = (nearRight.y - nearLeft.y) / (nearRight.x - nearLeft.x)
    const farSlope = (farRight.y - farLeft.y) / (farRight.x - farLeft.x)

    expect(nearSlope).toBeCloseTo(farSlope, 1)
    expect(farRight.x - farLeft.x).toBeLessThan(nearRight.x - nearLeft.x)
  })

  it('상자는 이동 구간 전체에서 양쪽 레일 안에 들어간다', () => {
    for (const frame of [18, 42, 66, 84]) {
      const pose = getParcelPose(frame, 96, false)
      const left = edgeAt(pose.progress, -1)
      const right = edgeAt(pose.progress, 1)
      const parcelHalfWidth = PARCEL_HALF_WIDTH * depthScale(pose.progress) * pose.perspectiveScaleX

      expect(pose.x - parcelHalfWidth).toBeGreaterThanOrEqual(left.x)
      expect(pose.x + parcelHalfWidth).toBeLessThanOrEqual(right.x)
    }
  })

  it('상자는 평면 왜곡 없이 레일 투영 좌표로 렌더링된다', () => {
    const pose = getParcelPose(42, 96, false)

    expect(Math.abs(pose.skewY)).toBeLessThan(1)
  })

  it('상자의 깊이 진행량도 거리에 따라 폭과 함께 좁아진다', () => {
    const near = getParcelPose(24, 96, false) as ReturnType<typeof getParcelPose> & { depthProgress?: number }
    const far = getParcelPose(84, 96, false) as ReturnType<typeof getParcelPose> & { depthProgress?: number }

    expect(near.depthProgress).toBeTypeOf('number')
    expect(far.depthProgress).toBeTypeOf('number')
    expect(far.depthProgress!).toBeLessThan(near.depthProgress!)
  })

  it('상자는 횡방향으로 이탈하지 않고 레일 중심점 위에서만 미세 진동한다', () => {
    const near = getParcelPose(18, 96, false)
    const far = getParcelPose(78, 96, false)
    const nearCenter = pointAt(near.progress)
    const farCenter = pointAt(far.progress)

    expect(far.scale).toBeLessThan(near.scale)
    expect(far.contactAmplitude).toBeLessThan(near.contactAmplitude)
    expect(near.x).toBeCloseTo(nearCenter.x, 5)
    expect(far.x).toBeCloseTo(farCenter.x, 5)
  })
})
