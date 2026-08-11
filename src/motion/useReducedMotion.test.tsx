import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  it('사용자의 모션 감소 설정을 반영한다', () => {
    window.matchMedia = (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
})
