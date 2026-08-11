const services = [
  ['01', 'FULFILLMENT', '주문 통합 · 입고 · 검수'],
  ['02', 'CUSTOMS', '수출입 신고 · 통관 대응'],
  ['03', 'ROAD', '거점에서 항만까지 육상 운송'],
  ['04', 'OCEAN', '전 세계 파트너 항로 연결'],
]

export function FreightSequenceSection() {
  return (
    <section id="journey" className="freight-sequence" aria-labelledby="sequence-title">
      <div className="sequence-sticky">
        <div className="sequence-stage" aria-hidden="true">
          <div className="sequence-grid" />
          <div className="sequence-road sequence-road--side"><span /><span /><span /></div>
          <div className="sequence-road sequence-road--top"><span /><span /><span /></div>
          <div className="sequence-ocean"><span className="ocean-wake ocean-wake--left" /><span className="ocean-wake ocean-wake--right" /></div>

          <img data-stacker className="sequence-vehicle sequence-stacker" src="/assets/generated/reach-stacker-v2.webp" alt="" decoding="async" />
          <img data-truck-side className="sequence-vehicle sequence-truck-side" src="/assets/generated/freight-truck-side-v2.webp" alt="" decoding="async" />
          <img data-truck-top className="sequence-vehicle sequence-truck-top" src="/assets/generated/freight-truck-top-v2.webp" alt="" decoding="async" />
          <img data-ship-top className="sequence-vehicle sequence-ship-top" src="/assets/generated/cargo-ship-top-v2.webp" alt="" decoding="async" />

          <div className="sequence-cloud sequence-cloud--one" />
          <div className="sequence-cloud sequence-cloud--two" />
          <div className="sequence-cloud sequence-cloud--three" />
        </div>

        <div className="sequence-ui section-shell">
          <div className="sequence-meta">
            <span>SCROLL TO MOVE</span>
            <span><strong data-sequence-speed>00</strong> KM/H</span>
          </div>

          <div className="sequence-copy sequence-copy--pickup" data-sequence-copy="pickup">
            <p>01 / ONE CONTINUOUS FLOW</p>
            <h2 id="sequence-title">한 번 맡긴 화물은<br />멈추지 않습니다.</h2>
            <span>입고부터 선적까지 같은 흐름 안에서 움직입니다.</span>
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
