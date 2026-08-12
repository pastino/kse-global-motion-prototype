import { useRef } from 'react'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { useJourneyMotion } from './motion/useJourneyMotion'
import { BrandFilmSection } from './sections/BrandFilmSection'
import { CapabilitiesSection } from './sections/CapabilitiesSection'
import { FreightSequenceSection } from './sections/FreightSequenceSection'
import { HeroSection } from './sections/HeroSection'
import { JapanProofSection } from './sections/JapanProofSection'
import { NetworkSection } from './sections/NetworkSection'
import { OperationsInsightSection } from './sections/OperationsInsightSection'

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  useJourneyMotion(rootRef)

  return (
    <div ref={rootRef} className="app-shell">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <FreightSequenceSection />
        <CapabilitiesSection />
        <JapanProofSection />
        <NetworkSection />
        <OperationsInsightSection />
        <BrandFilmSection />
      </main>
      <SiteFooter />
    </div>
  )
}
