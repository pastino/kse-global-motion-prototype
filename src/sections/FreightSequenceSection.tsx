import { ConveyorVideo } from '../components/ConveyorVideo'
import { assetUrl } from '../lib/asset-url'

function KseMark({ className = '' }: { className?: string }) {
  return (
    <span className={`kse-mark ${className}`} aria-hidden="true">
      <img src={assetUrl('assets/kse-logo.png')} alt="" />
    </span>
  )
}

function VehicleLogo({ className = '' }: { className?: string }) {
  return <img className={`vehicle-logo ${className}`} src={assetUrl('assets/kse-logo.png')} alt="" aria-hidden="true" />
}

const services = [
  ['01', 'FULFILLMENT', '주문 통합 · 입고 · 검수'],
  ['02', 'CUSTOMS', '수출입 신고 · 통관 대응'],
  ['03', 'ROAD', '거점에서 항만까지 육상 운송'],
  ['04', 'AIR / OCEAN', '항공·해상 포워딩과 글로벌 파트너 항로'],
]

export function FreightSequenceSection() {
  return (
    <section id="journey" className="freight-sequence" aria-labelledby="sequence-title">
      <div className="sequence-sticky">
        <div className="sequence-stage" aria-hidden="true">
          <div className="sequence-grid" />
          <ConveyorVideo />
          <div className="sequence-road sequence-road--side"><span /><span /><span /></div>
          <div className="sequence-road sequence-road--top"><span /><span /><span /></div>
          <div className="sequence-ocean">
            <span className="corridor-trail corridor-trail--sea" />
            <span className="corridor-trail corridor-trail--air" />
            <span className="ocean-wake ocean-wake--left" />
            <span className="ocean-wake ocean-wake--right" />
            <span className="air-contrail air-contrail--left" />
            <span className="air-contrail air-contrail--right" />
          </div>

          <div className="sorting-status" data-sorting-status>
            <span><i /> ORDER IN</span>
            <span><i /> SCAN CLEAR</span>
            <span><i /> OUTBOUND READY</span>
          </div>
          <div data-truck-side className="sequence-vehicle sequence-truck-side">
            <img className="vehicle-art" src={assetUrl('assets/generated/freight-truck-side-v2.webp')} alt="" decoding="async" />
            <VehicleLogo className="vehicle-logo--truck-side" />
          </div>
          <div data-truck-top className="sequence-vehicle sequence-truck-top">
            <img className="vehicle-art" src={assetUrl('assets/generated/freight-truck-top-v2.webp')} alt="" decoding="async" />
            <KseMark className="vehicle-logo--truck-top" />
          </div>
          <div data-ship-top className="sequence-vehicle sequence-ship-top">
            <img className="vehicle-art" src={assetUrl('assets/generated/cargo-ship-top-v2.webp')} alt="" decoding="async" />
            <KseMark className="vehicle-logo--ship" />
          </div>
          <div data-plane-top className="sequence-vehicle sequence-plane-top">
            <img className="vehicle-art" src={assetUrl('assets/generated/cargo-plane-top-v1.png')} alt="" decoding="async" />
            <KseMark className="vehicle-logo--plane" />
          </div>

          <div className="sequence-hub sequence-hub--korea" data-sequence-hub>
            <KseMark />
            <span>KOREA HUB</span>
          </div>
          <div className="sequence-hub sequence-hub--japan" data-sequence-hub>
            <KseMark />
            <span>JAPAN HUB</span>
          </div>

          <div className="sequence-cloud sequence-cloud--one" />
          <div className="sequence-cloud sequence-cloud--two" />
          <div className="sequence-cloud sequence-cloud--three" />
        </div>

        <div className="sequence-ui section-shell">
          <div className="sequence-meta">
            <span data-scroll-hint>SCROLL TO MOVE</span>
            <span>FLOW <strong data-sequence-speed>00</strong>%</span>
          </div>

          <div className="sequence-copy sequence-copy--pickup" data-sequence-copy="pickup">
            <p>01 / OMS TO OUTBOUND</p>
            <h2 id="sequence-title">주문이 들어오면<br />물류가 바로 움직입니다.</h2>
            <span>OMS 주문 수집부터 분류·검수·출고까지 같은 레일 위에서 이어집니다.</span>
          </div>

          <div className="sequence-copy sequence-copy--services" data-sequence-copy="services">
            <p>02 / ONE OPERATOR</p>
            <h2>모든 물류 단계가<br />하나로 이어집니다.</h2>
            <span>여러 업체를 쫓지 않아도 KSE가 전 과정을 연결합니다.</span>
          </div>

          <div className="sequence-services" data-sequence-services>
            {services.map(([index, title, description]) => (
              <article key={title}>
                <span>{index}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="sequence-copy sequence-copy--milestone" data-sequence-copy="milestone">
            <p>03 / EVERY MILESTONE</p>
            <h2>화물의 위치와 다음 단계가<br />항상 보이도록.</h2>
            <span>한국과 일본의 자체 인프라가 물류의 기준점을 만듭니다.</span>
          </div>

          <div className="sequence-copy sequence-copy--ocean" data-sequence-copy="ocean">
            <p>04 / BEYOND THE HUBS</p>
            <h2>두 거점에서 시작해<br />전 세계로.</h2>
            <span>검증된 파트너 네트워크로 주요 글로벌 항로를 연결합니다.</span>
          </div>

          <div className="sequence-progress"><span data-sequence-progress /></div>
        </div>
      </div>

      <div className="sequence-mobile" aria-label="KSE 물류 여정">
        <div className="section-shell sequence-mobile-intro" data-reveal>
          <p>ONE SHIPMENT, ONE WORLD</p>
          <h2>핵심 인계 장면만<br />빠르게 이어집니다.</h2>
          <span>스크롤할 때마다 같은 화물이 다음 운송 단계로 넘어갑니다.</span>
        </div>
        <div className="sequence-mobile-scene sequence-mobile-scene--warehouse" data-reveal>
          <div className="section-shell sequence-mobile-copy">
            <span>01 · FULFILLMENT</span>
            <h3>주문이 모이면<br />출고가 시작됩니다.</h3>
            <p>OMS 주문 수집부터 입고·검수·피킹·포장까지.</p>
          </div>
          <ConveyorVideo mobile />
        </div>
        <div className="sequence-mobile-scene sequence-mobile-scene--road" data-reveal>
          <div className="section-shell sequence-mobile-copy">
            <span>02 · CUSTOMS & ROAD</span>
            <h3>통관을 지나<br />항만으로.</h3>
            <p>수출 신고와 육상 운송을 하나의 일정으로 연결합니다.</p>
          </div>
          <div className="sequence-mobile-vehicle sequence-mobile-truck">
            <img className="vehicle-art" src={assetUrl('assets/generated/freight-truck-side-v2.webp')} alt="항만으로 이동하는 KSE 화물 트럭" loading="lazy" decoding="async" />
            <VehicleLogo className="vehicle-logo--truck-side" />
          </div>
        </div>
        <div
          className="sequence-mobile-scene sequence-mobile-scene--ocean"
          data-reveal
          role="img"
          aria-label="한국과 일본 거점에서 KSE 선박과 항공기가 동시에 출발하는 장면"
        >
          <div className="section-shell sequence-mobile-copy">
            <span>03 · AIR & OCEAN</span>
            <h3>가장 맞는 경로로<br />전 세계까지.</h3>
            <p>한·일 자체 인프라에서 글로벌 파트너 항로로 이어집니다.</p>
          </div>
          <div className="sequence-mobile-hubs" aria-hidden="true">
            <span><KseMark />KOREA HUB</span>
            <span><KseMark />JAPAN HUB</span>
          </div>
          <div className="sequence-mobile-vehicle sequence-mobile-ship" data-mobile-ship>
            <img className="vehicle-art" src={assetUrl('assets/generated/cargo-ship-top-v2.webp')} alt="국제 해상 루트를 운항하는 KSE 화물선" loading="lazy" decoding="async" />
            <KseMark className="vehicle-logo--ship" />
          </div>
          <div className="sequence-mobile-vehicle sequence-mobile-plane" data-mobile-plane>
            <img className="vehicle-art" src={assetUrl('assets/generated/cargo-plane-top-v1.png')} alt="국제 항공 루트를 운항하는 KSE 화물기" loading="lazy" decoding="async" />
            <KseMark className="vehicle-logo--plane" />
          </div>
        </div>
      </div>

      <div className="sequence-fallback section-shell">
        <p>ONE SHIPMENT, ONE WORLD</p>
        <h2>입고에서 현지 배송까지, 하나의 화물이 끊김 없이 이어집니다.</h2>
        <div className="fallback-steps">
          {services.map(([index, title, description]) => (
            <article key={title}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
