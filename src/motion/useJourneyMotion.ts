import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export const FORWARD_MOTION = {
  sideTruck: { entry: -62, settle: -10, exit: 46 },
  topTruck: { entry: 20, settle: 0, exit: -88 },
  ship: { entry: 14, settle: 4, exit: -44 },
} as const

export function useJourneyMotion(rootRef: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 84%', once: true },
          },
        )
      })

      gsap.to('[data-hero-parallax]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
      })

      const speedElement = rootRef.current?.querySelector<HTMLElement>('[data-sequence-speed]')

      const sequence = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.freight-sequence',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            if (!speedElement) return
            const acceleration = progress < 0.72 ? progress / 0.72 : (1 - progress) / 0.28
            speedElement.textContent = String(Math.max(0, Math.round(acceleration * 52))).padStart(2, '0')
          },
        },
      })

      sequence
        // 전진 방향 계약: 측면 트럭은 오른쪽, 탑뷰 차량과 선박은 위쪽으로 이동한다.
        .to('[data-sequence-progress]', { scaleX: 1, duration: 10 }, 0)
        .fromTo('[data-stacker]', { xPercent: -24, scale: 0.86 }, { xPercent: 8, scale: 1, duration: 1.1 }, 0)
        .to('[data-stacker]', { xPercent: 55, opacity: 0, scale: 1.08, duration: 0.65 }, 1.05)
        .to('[data-sequence-copy="pickup"]', { y: -70, opacity: 0, duration: 0.48 }, 0.92)
        .fromTo('[data-truck-side]', { xPercent: FORWARD_MOTION.sideTruck.entry, opacity: 0, scale: 0.96 }, { xPercent: FORWARD_MOTION.sideTruck.settle, opacity: 1, scale: 1, duration: 0.7 }, 1.1)
        .to('.sequence-road--side', { opacity: 1, duration: 0.45 }, 1.25)
        .fromTo('[data-sequence-copy="services"]', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 1.55)
        .fromTo('[data-sequence-services]', { xPercent: 38, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7 }, 1.72)
        .to('[data-truck-side]', { xPercent: FORWARD_MOTION.sideTruck.exit, duration: 2.25 }, 1.72)
        .to('[data-sequence-services]', { xPercent: -38, duration: 2.25 }, 1.72)
        .to('[data-sequence-copy="services"]', { y: -60, opacity: 0, duration: 0.48 }, 3.7)
        .to('[data-sequence-services]', { opacity: 0, duration: 0.4 }, 3.92)
        .to('[data-truck-side]', { scale: 1.42, opacity: 0, duration: 0.58 }, 4.05)
        .to('.sequence-road--side', { opacity: 0, duration: 0.42 }, 4.05)
        .fromTo('.sequence-road--top', { opacity: 0, scale: 1.24 }, { opacity: 1, scale: 1, duration: 0.62 }, 4.12)
        .fromTo('[data-truck-top]', { opacity: 0, scale: 1.46, yPercent: FORWARD_MOTION.topTruck.entry }, { opacity: 1, scale: 1, yPercent: FORWARD_MOTION.topTruck.settle, duration: 0.62 }, 4.12)
        .fromTo('[data-sequence-copy="milestone"]', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55 }, 4.46)
        .to('[data-truck-top]', { yPercent: FORWARD_MOTION.topTruck.exit, scale: 0.72, duration: 1.75 }, 4.68)
        .to('[data-sequence-copy="milestone"]', { x: -55, opacity: 0, duration: 0.45 }, 6.05)
        .to('.sequence-road--top', { opacity: 0, duration: 0.55 }, 6.18)
        .to('[data-truck-top]', { opacity: 0, scale: 1.28, duration: 0.45 }, 6.18)
        .to('.sequence-ocean', { opacity: 1, duration: 0.62 }, 6.18)
        .fromTo('[data-ship-top]', { opacity: 0, scale: 1.95, yPercent: FORWARD_MOTION.ship.entry }, { opacity: 1, scale: 1.7, yPercent: FORWARD_MOTION.ship.settle, duration: 0.62 }, 6.2)
        .to('[data-ship-top]', { scale: 0.48, yPercent: FORWARD_MOTION.ship.exit, duration: 2.65 }, 6.78)
        .fromTo('.sequence-cloud', { opacity: 0, scale: 0.72 }, { opacity: 0.8, scale: 1.12, stagger: 0.12, duration: 0.7 }, 7.18)
        .fromTo('[data-sequence-copy="ocean"]', { y: 65, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, 8.12)
        .to('.sequence-grid', { opacity: 0, duration: 0.4 }, 6.1)

      gsap.fromTo(
        '[data-route-line]',
        { strokeDashoffset: 760 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '#network', start: 'top 70%', end: 'center 40%', scrub: true },
        },
      )

      gsap.fromTo(
        '[data-route-visual]',
        { y: 60, rotateX: 6, opacity: 0, scale: 0.96 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          scale: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#network', start: 'top 72%', once: true },
        },
      )

      gsap.fromTo(
        '[data-route-node]',
        { scale: 0.35, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
          stagger: 0.09,
          ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '[data-route-visual]', start: 'top 68%', once: true },
        },
      )
    }, rootRef)

    return () => context.revert()
  }, [reducedMotion, rootRef])

  return reducedMotion
}
