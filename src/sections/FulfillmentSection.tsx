import { SectionIntro } from '../components/SectionIntro'

export function FulfillmentSection() {
  return (
    <section id="fulfillment" className="fulfillment dark-section" aria-labelledby="fulfillment-title">
      <div className="fulfillment-visual" role="img" aria-label="스마트 물류센터의 컨베이어와 통관 스캔 게이트" />
      <div className="fulfillment-overlay" />
      <div className="section-shell fulfillment-content">
        <SectionIntro
          index="02"
          kicker="SMART FULFILLMENT"
          title="물류센터에서 이미 배송은 시작됩니다"
          description="입고, 검수, 재고, 포장, 출고 데이터가 하나로 이어질 때 해외 배송은 더 빨라집니다."
          light
        />
        <div className="evidence-rail" data-reveal>
          <div><strong>당일</strong><span>주문·포장·출항 연결</span></div>
          <div><strong>ONE</strong><span>OMS 기반 통합 운영</span></div>
          <div><strong>24/7</strong><span>물류 흐름 가시성</span></div>
        </div>
      </div>
    </section>
  )
}
