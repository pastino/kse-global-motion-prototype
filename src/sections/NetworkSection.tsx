import { WorldRoute } from '../components/WorldRoute'
import { SectionIntro } from '../components/SectionIntro'

export function NetworkSection() {
  return (
    <section id="network" className="network dark-section" aria-labelledby="network-title">
      <div className="section-shell">
        <SectionIntro
          index="07"
          kicker="CONNECTED TO THE WORLD"
          title="두 개의 강한 거점에서 세계의 모든 경로로"
          description="한국과 일본의 자체 운영 인프라를 중심으로 글로벌 파트너와 연결해 해상·항공 포워딩과 제3국 운송까지 설계합니다."
          light
        />
        <WorldRoute />
      </div>
    </section>
  )
}
