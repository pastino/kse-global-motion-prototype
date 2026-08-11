import { useRef } from 'react'
import { SiteHeader } from './components/SiteHeader'
import { useJourneyMotion } from './motion/useJourneyMotion'
import { ContactSection } from './sections/ContactSection'
import { CustomsSection } from './sections/CustomsSection'
import { FulfillmentSection } from './sections/FulfillmentSection'
import { HeroSection } from './sections/HeroSection'
import { JapanProofSection } from './sections/JapanProofSection'
import { JourneySection } from './sections/JourneySection'
import { NetworkSection } from './sections/NetworkSection'
import { TransportSection } from './sections/TransportSection'

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  useJourneyMotion(rootRef)

  return (
    <div ref={rootRef} className="app-shell">
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <JourneySection />
        <FulfillmentSection />
        <CustomsSection />
        <TransportSection />
        <JapanProofSection />
        <NetworkSection />
        <ContactSection />
      </main>
    </div>
  )
}
