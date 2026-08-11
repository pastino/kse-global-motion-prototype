import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: () => ({ revert: vi.fn() }),
    utils: { toArray: () => [] },
    timeline: () => ({ fromTo: vi.fn().mockReturnThis() }),
    to: vi.fn(),
    fromTo: vi.fn(),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

describe('KSE 글로벌 프로토타입', () => {
  it('핵심 포지셔닝과 상담 전환을 렌더링한다', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /한국과 일본의.*자체 인프라/ })).toBeInTheDocument()
    expect(screen.getByText('전 세계를 연결하는 파트너 네트워크.')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /글로벌 물류 상담|물류 상담/ }).length).toBeGreaterThan(0)
  })

  it('일본을 대표 성공 노선으로 구분한다', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /한일 노선에서 증명했습니다/ })).toBeInTheDocument()
    expect(screen.getByText(/일본 도착보장 대표 서비스 기준/)).toBeInTheDocument()
  })
})
