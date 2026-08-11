import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

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

      const transport = gsap.timeline({
        scrollTrigger: {
          trigger: '#transport',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      transport
        .fromTo('[data-ship]', { xPercent: -120 }, { xPercent: 70, ease: 'none' }, 0)
        .fromTo('[data-plane]', { xPercent: -60, yPercent: 45 }, { xPercent: 90, yPercent: -40, ease: 'none' }, 0.12)
        .fromTo('[data-truck]', { xPercent: -100 }, { xPercent: 110, ease: 'none' }, 0.4)
        .fromTo('[data-parcel]', { scale: 0.75, y: 20 }, { scale: 1.05, y: -28, ease: 'none' }, 0.15)

      gsap.fromTo(
        '[data-route-line]',
        { strokeDashoffset: 760 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '#network', start: 'top 70%', end: 'center 40%', scrub: true },
        },
      )
    }, rootRef)

    return () => context.revert()
  }, [reducedMotion, rootRef])

  return reducedMotion
}
