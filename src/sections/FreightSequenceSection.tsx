const services = [
  ['01', 'FULFILLMENT', '주문 통합 · 입고 · 검수'],
  ['02', 'CUSTOMS', '수출입 신고 · 통관 대응'],
  ['03', 'ROAD', '거점에서 항만까지 육상 운송'],
  ['04', 'OCEAN', '전 세계 파트너 항로 연결'],
]

function SortingRail({ animated = false, mobile = false }: { animated?: boolean; mobile?: boolean }) {
  return (
    <div className={mobile ? 'sorting-system sorting-system--mobile' : 'sorting-system'} data-sorter={animated ? true : undefined} aria-hidden="true">
      <svg className="sorting-motion-layer" viewBox="0 0 1672 943" preserveAspectRatio="xMidYMid slice">
        <path
          data-conveyor-path={animated ? true : undefined}
          d="M -120 810 C 260 815 585 710 790 620 C 960 545 1080 455 1160 392 C 1305 310 1490 298 1780 325"
          fill="none"
        />
        <g className="sorting-parcel-svg" data-parcel-primary={animated ? true : undefined}>
          <polygon points="-62,-28 0,-54 62,-28 0,-2" />
          <rect x="-62" y="-28" width="124" height="78" rx="5" />
          <polygon points="62,-28 0,-2 0,50 62,25" />
          <path d="M0 -2V50M-62 -28L0 -2L62 -28" />
          <text x="-45" y="18">KSE</text>
        </g>
      </svg>
      <div className="sorting-scan-flash" data-scan-beam={animated ? true : undefined} />
      <div className="sorting-status" data-sorting-status={animated ? true : undefined}>
        <span><i /> OMS ORDER</span>
        <span><i /> WEIGHT OK</span>
        <span><i /> ROUTE READY</span>
      </div>
    </div>
  )
}

export function FreightSequenceSection() {
  return (
    <section id="journey" className="freight-sequence" aria-labelledby="sequence-title">
      <div className="sequence-sticky">
        <div className="sequence-stage" aria-hidden="true">
          <div className="sequence-grid" />
          <div className="sorting-backdrop" data-sorter-backdrop />
          <div className="sequence-road sequence-road--side"><span /><span /><span /></div>
          <div className="sequence-road sequence-road--top"><span /><span /><span /></div>
          <div className="sequence-ocean"><span className="ocean-wake ocean-wake--left" /><span className="ocean-wake ocean-wake--right" /></div>

          <SortingRail animated />
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
          <SortingRail mobile />
        </div>
        <div className="sequence-mobile-scene sequence-mobile-scene--road" data-reveal>
          <div className="section-shell sequence-mobile-copy">
            <span>02 · CUSTOMS & ROAD</span>
            <h3>통관을 지나<br />항만으로.</h3>
            <p>수출 신고와 육상 운송을 하나의 일정으로 연결합니다.</p>
          </div>
          <img src="/assets/generated/freight-truck-side-v2.webp" alt="항만으로 이동하는 화물 트럭" loading="lazy" decoding="async" />
        </div>
        <div className="sequence-mobile-scene sequence-mobile-scene--ocean" data-reveal>
          <div className="section-shell sequence-mobile-copy">
            <span>03 · AIR & OCEAN</span>
            <h3>가장 맞는 경로로<br />전 세계까지.</h3>
            <p>한·일 자체 인프라에서 글로벌 파트너 항로로 이어집니다.</p>
          </div>
          <img src="/assets/generated/cargo-ship-top-v2.webp" alt="국제 항로를 운항하는 화물선" loading="lazy" decoding="async" />
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
