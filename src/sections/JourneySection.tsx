import { Boxes, CircleCheckBig, PackageCheck, ScanLine } from 'lucide-react'
import { chapters } from '../content/journey'
import { SectionIntro } from '../components/SectionIntro'

const steps = [
  { icon: Boxes, label: '주문 통합', detail: '멀티 스토어 주문·재고 연결' },
  { icon: CircleCheckBig, label: '입고·검수', detail: '당일 입고와 정확한 검수' },
  { icon: PackageCheck, label: '포장·출고', detail: '상품별 최적 포장과 출고' },
  { icon: ScanLine, label: '통관·운송', detail: '서류부터 현지 배송까지' },
]

export function JourneySection() {
  return (
    <section id="journey" className="journey section-shell" aria-labelledby="journey-title">
      <SectionIntro
        index="01"
        kicker="ONE SHIPMENT, ONE WORLD"
        title="한 번의 주문이 세계에 도착하기까지"
        description="KSE는 각 단계를 따로 넘기지 않습니다. 주문이 들어온 순간부터 현지 고객이 상품을 받는 순간까지 하나의 흐름으로 연결합니다."
      />
      <div className="journey-flow" data-reveal>
        <div className="flow-track" aria-hidden="true"><span /></div>
        <img className="flow-parcel" src="/assets/generated/parcel.webp" alt="" loading="lazy" decoding="async" />
        {steps.map(({ icon: Icon, label, detail }, index) => (
          <article className="flow-step" key={label}>
            <span className="flow-index">0{index + 1}</span>
            <Icon aria-hidden="true" />
            <h3>{label}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <div className="chapter-list">
        {chapters.map((chapter) => (
          <div className="chapter-row" key={chapter.id} data-reveal>
            <span>{chapter.index}</span>
            <h3>{chapter.title}</h3>
            <p>{chapter.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
