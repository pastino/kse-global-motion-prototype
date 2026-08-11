import { BadgeCheck, FileCheck2, ScanBarcode } from 'lucide-react'
import { SectionIntro } from '../components/SectionIntro'

export function CustomsSection() {
  return (
    <section id="customs" className="customs section-shell" aria-labelledby="customs-title">
      <SectionIntro
        index="03"
        kicker="CUSTOMS INTELLIGENCE"
        title="국경은 장벽이 아니라 통과 지점이 됩니다"
        description="복잡한 서류와 국가별 규정을 KSE의 통관 전문성과 시스템으로 정리해 화물이 멈추는 시간을 줄입니다."
      />
      <div className="customs-stage" data-reveal>
        <div className="customs-gate" aria-hidden="true">
          <span className="scanner scanner--one" />
          <span className="scanner scanner--two" />
          <img src="/assets/generated/parcel.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="customs-proof">
          <article>
            <ScanBarcode aria-hidden="true" />
            <h3>자체 통관 시스템</h3>
            <p>화물 정보와 통관 흐름을 연결해 빠르고 정확하게 처리합니다.</p>
          </article>
          <article>
            <BadgeCheck aria-hidden="true" />
            <h3>일본 자체 통관면허</h3>
            <p>일본 현지의 직접 운영 역량으로 대표 노선의 안정성을 높였습니다.</p>
          </article>
          <article>
            <FileCheck2 aria-hidden="true" />
            <h3>30년 운영 노하우</h3>
            <p>품목과 운송 조건에 맞는 실무적인 통관 방안을 제시합니다.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
