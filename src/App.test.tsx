import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: () => ({ revert: vi.fn() }),
    utils: { toArray: () => [] },
    timeline: () => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    }),
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

  it('화물이 운송수단 사이에서 이어지는 모션 서사를 제공한다', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /주문이 들어오면/ })).toBeInTheDocument()
    expect(screen.getByText(/두 거점에서 시작해/)).toBeInTheDocument()
    expect(screen.getAllByText('OCEAN').length).toBeGreaterThan(0)
  })

  it('실제 KSE 운영 서비스와 현장 근거를 함께 제공한다', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /전체 운영을 맡깁니다/ })).toBeInTheDocument()
    expect(screen.getByText(/자체 OMS와 WMS/)).toBeInTheDocument()
    expect(screen.getAllByText(/냉장 2–10°C/).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /KSE 한국어 홍보 영상/ })).toHaveAttribute('href', expect.stringContaining('youtube.com'))
  })
})
