import { SectionIntro } from '../components/SectionIntro'

export function TransportSection() {
  return (
    <section id="transport" className="transport dark-section" aria-labelledby="transport-title">
      <div className="transport-sticky">
        <div className="section-shell transport-heading">
          <SectionIntro
            index="04"
            kicker="MULTIMODAL NETWORK"
            title="속도도, 비용도 한 가지 답만 있지 않습니다"
            description="화물의 크기와 목적지, 필요한 속도에 맞춰 해상·항공·육상 운송을 가장 효율적인 경로로 조합합니다."
            light
          />
        </div>
        <div className="transport-scene" aria-hidden="true">
          <div className="transport-sky" />
          <div className="transport-sea"><span /><span /><span /></div>
          <div className="transport-road" />
          <img data-plane className="vehicle vehicle--plane" src="/assets/generated/cargo-plane.webp" alt="" loading="lazy" decoding="async" />
          <img data-ship className="vehicle vehicle--ship" src="/assets/generated/cargo-ship.webp" alt="" loading="lazy" decoding="async" />
          <img data-truck className="vehicle vehicle--truck" src="/assets/generated/delivery-truck.webp" alt="" loading="lazy" decoding="async" />
          <img data-parcel className="vehicle vehicle--parcel" src="/assets/generated/parcel.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="mode-labels section-shell">
          <div><span>SEA</span><p>큰 화물도 합리적으로</p></div>
          <div><span>AIR</span><p>먼 거리를 더 빠르게</p></div>
          <div><span>ROAD</span><p>마지막 목적지까지</p></div>
        </div>
      </div>
    </section>
  )
}
