import { useRef } from 'react'
import { SiteHeader } from './components/SiteHeader'
import { useJourneyMotion } from './motion/useJourneyMotion'
import { ContactSection } from './sections/ContactSection'
import { FreightSequenceSection } from './sections/FreightSequenceSection'
import { HeroSection } from './sections/HeroSection'
import { JapanProofSection } from './sections/JapanProofSection'
import { NetworkSection } from './sections/NetworkSection'

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
        <JapanProofSection />
        <NetworkSection />
        <ContactSection />
      </main>
    </div>
  )
}
