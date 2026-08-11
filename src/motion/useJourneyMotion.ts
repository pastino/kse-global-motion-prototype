import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export const FORWARD_MOTION = {
  sideTruck: { entry: -110, settle: -78, exit: 20 },
  topTruck: { entry: 52, settle: 22, exit: -70 },
  ship: { entry: 45, settle: 22, exit: -12 },
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
          scrub: 0.7,
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
        .fromTo('[data-stacker]', { xPercent: -24, scale: 0.86 }, { xPercent: 8, scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
        .to('[data-stacker]', { xPercent: 55, opacity: 0, scale: 1.08, duration: 0.65, ease: 'power2.in' }, 1.05)
        .to('[data-sequence-copy="pickup"]', { y: -70, opacity: 0, duration: 0.48, ease: 'power2.in' }, 0.92)
        .fromTo('[data-truck-side]', { xPercent: FORWARD_MOTION.sideTruck.entry, opacity: 0, scale: 0.94 }, { xPercent: FORWARD_MOTION.sideTruck.settle, scale: 1, duration: 1, ease: 'power2.out' }, 1.25)
        .to('[data-truck-side]', { opacity: 1, duration: 0.5, ease: 'power1.out' }, 1.45)
        .to('.sequence-road--side', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.28)
        .fromTo('[data-sequence-copy="services"]', { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' }, 1.45)
        .fromTo('[data-sequence-services]', { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.75, ease: 'power2.out' }, 1.55)
        .to('[data-truck-side]', { xPercent: FORWARD_MOTION.sideTruck.exit, duration: 2, ease: 'power1.inOut' }, 2.15)
        .to('[data-sequence-services]', { xPercent: -28, duration: 2.55, ease: 'power1.inOut' }, 1.65)
        .to('.sequence-road--side span', { backgroundPositionX: '-420px', duration: 2, ease: 'none' }, 2.15)
        .to('[data-sequence-copy="services"]', { y: -60, opacity: 0, duration: 0.44, ease: 'power2.in' }, 3.72)
        .to('[data-sequence-services]', { opacity: 0, duration: 0.4 }, 3.92)
        .to('[data-truck-side]', { scale: 1.32, opacity: 0, duration: 0.52, ease: 'power2.in' }, 4.02)
        .to('.sequence-road--side', { opacity: 0, duration: 0.42 }, 4.05)
        .fromTo('.sequence-road--top', { opacity: 0, scale: 1.24 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 4.14)
        .fromTo('[data-truck-top]', { opacity: 0, scale: 1.42, yPercent: FORWARD_MOTION.topTruck.entry }, { opacity: 1, scale: 1, yPercent: FORWARD_MOTION.topTruck.settle, duration: 0.76, ease: 'power2.out' }, 4.16)
        .fromTo('[data-sequence-copy="milestone"]', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 4.48)
        .to('[data-truck-top]', { yPercent: FORWARD_MOTION.topTruck.exit, scale: 0.74, duration: 1.45, ease: 'power1.inOut' }, 4.9)
        .to('.sequence-road--top span', { backgroundPositionY: '360px', duration: 1.45, ease: 'none' }, 4.9)
        .to('[data-sequence-copy="milestone"]', { x: -55, opacity: 0, duration: 0.45, ease: 'power2.in' }, 6.02)
        .to('.sequence-road--top', { opacity: 0, duration: 0.55 }, 6.18)
        .to('[data-truck-top]', { opacity: 0, scale: 1.22, duration: 0.45, ease: 'power2.in' }, 6.14)
        .to('.sequence-ocean', { opacity: 1, duration: 0.68, ease: 'power2.out' }, 6.14)
        .fromTo('[data-ship-top]', { opacity: 0, scale: 1.48, yPercent: FORWARD_MOTION.ship.entry }, { opacity: 1, scale: 1.28, yPercent: FORWARD_MOTION.ship.settle, duration: 0.82, ease: 'power2.out' }, 6.28)
        .fromTo('.ocean-wake', { opacity: 0, scaleY: 0.35 }, { opacity: 0.8, scaleY: 1.08, duration: 1.4, ease: 'power2.out' }, 6.5)
        .to('[data-ship-top]', { scale: 0.52, yPercent: FORWARD_MOTION.ship.exit, duration: 2.2, ease: 'power1.inOut' }, 7.06)
        .fromTo('.sequence-cloud', { opacity: 0, scale: 0.72, xPercent: -8 }, { opacity: 0.78, scale: 1.12, xPercent: 7, stagger: 0.12, duration: 0.84, ease: 'power2.out' }, 7.22)
        .fromTo('[data-sequence-copy="ocean"]', { y: 65, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: 'power2.out' }, 8.12)
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
