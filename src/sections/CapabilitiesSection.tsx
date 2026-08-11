import { ArrowUpRight } from 'lucide-react'

const capabilities = [
  {
    name: 'E-COMMERCE & FULFILLMENT',
    title: '주문 수집부터 반품까지',
    description: '자체 OMS와 WMS를 기반으로 입고·보관·피킹·포장·출고·반품을 한 흐름으로 운영합니다.',
    tags: ['OMS 연동', 'WMS 운영', '풀필먼트'],
  },
  {
    name: 'AIR & SEA FORWARDING',
    title: '항공과 해상을 함께 설계',
    description: '해상·항공 포워딩, 수출입 통관, 보세운송과 Sea & Air를 화물 조건에 맞춰 조합합니다.',
    tags: ['AIR', 'SEA', '통관·보세'],
  },
  {
    name: 'COLD CHAIN',
    title: '온도까지 이어지는 운송',
    description: '냉장 2–10°C, 냉동 -18°C 이하의 보관·포장·현지 배송을 하나의 저온 물류망으로 연결합니다.',
    tags: ['냉장 2–10°C', '냉동 ≤ -18°C', '라스트마일'],
  },
  {
    name: 'PROJECT CARGO',
    title: '정형화되지 않은 화물도',
    description: '산업·연구 장비, 중량물, 전시·공연 화물과 해외 이전까지 사전 조사부터 현지 설치 지점까지 설계합니다.',
    tags: ['중량물', '이전 화물', '전시·공연'],
  },
]

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="capabilities" aria-labelledby="capabilities-title">
      <div className="section-shell capabilities-heading" data-reveal>
        <p className="section-kicker"><span>05</span><span>BUILT TO OPERATE</span></p>
        <h2 id="capabilities-title">한 가지 운송이 아니라<br />전체 운영을 맡깁니다</h2>
        <p>글로벌 진출에 필요한 시스템, 창고, 통관, 운송을 따로 조달하지 않도록 KSE가 하나의 운영 구조로 연결합니다.</p>
      </div>

      <div className="section-shell capabilities-proof" data-reveal>
        <figure className="hub-photo">
          <img
            src="/assets/official/kse-japan-hub.webp"
            alt="일본 KSE 물류 거점 앞에 대기 중인 KSE 배송 차량"
            loading="lazy"
            decoding="async"
          />
          <figcaption>직접 운영하는 일본 물류 현장</figcaption>
        </figure>
        <div className="proof-statement">
          <p>SINCE 1990</p>
          <h3>한국과 일본의 자체 인프라가<br />매일 같은 기준으로 움직입니다.</h3>
          <div className="proof-rail" aria-label="KSE 운영 역량">
            <span>한국·일본 자체 거점</span>
            <span>항공·해상 동시 운영</span>
            <span>OMS·WMS 통합</span>
          </div>
        </div>
      </div>

      <div className="section-shell capability-list">
        {capabilities.map((capability, index) => (
          <article key={capability.name} data-reveal>
            <span className="capability-index">0{index + 1}</span>
            <div className="capability-name">{capability.name}</div>
            <div className="capability-copy">
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </div>
            <div className="capability-tags" aria-label={`${capability.title} 주요 기능`}>
              {capability.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </article>
        ))}
      </div>

      <div className="section-shell capabilities-link">
        <a className="text-link text-link--dark" href="https://www.kseexpress.com/global-service" target="_blank" rel="noreferrer">
          KSE 글로벌 서비스 자세히 보기 <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
