import { describe, expect, it } from 'vitest'
import { FORWARD_MOTION } from './useJourneyMotion'

describe('물류 여정 전진 방향', () => {
  it('측면 트럭은 운전석이 향한 오른쪽으로 이동한다', () => {
    expect(FORWARD_MOTION.sideTruck.entry).toBeLessThan(FORWARD_MOTION.sideTruck.settle)
    expect(FORWARD_MOTION.sideTruck.settle).toBeLessThan(FORWARD_MOTION.sideTruck.exit)
  })

  it('탑뷰 트럭과 선박은 전면이 향한 위쪽으로 이동한다', () => {
    expect(FORWARD_MOTION.topTruck.entry).toBeGreaterThan(FORWARD_MOTION.topTruck.settle)
    expect(FORWARD_MOTION.topTruck.settle).toBeGreaterThan(FORWARD_MOTION.topTruck.exit)
    expect(FORWARD_MOTION.ship.entry).toBeGreaterThan(FORWARD_MOTION.ship.settle)
    expect(FORWARD_MOTION.ship.settle).toBeGreaterThan(FORWARD_MOTION.ship.exit)
  })
})
