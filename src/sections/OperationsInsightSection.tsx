import { ArrowUpRight } from 'lucide-react'
import { assetUrl } from '../lib/asset-url'

const insights = [
  {
    index: '01',
    label: 'AUTOMATE',
    title: 'RPA 로봇자동화',
    description: '반복 입력과 결과 확인을 자동화해 중요한 판단에 집중합니다.',
    image: assetUrl('assets/official/kse-rpa-automation.webp'),
    alt: 'KSE RPA 로봇자동화 공식 안내 배너',
    href: 'https://www.youtube.com/watch?v=okvrq96bywA',
    cta: 'RPA 자동화 영상 보기',
  },
  {
    index: '02',
    label: 'ONE CLICK',
    title: 'KSE 서비스 원클릭 가이드',
    description: '서비스 선택부터 발송 준비까지 필요한 절차를 한 번에 확인합니다.',
    image: assetUrl('assets/official/kse-one-click-guide.webp'),
    alt: 'KSE 서비스 원클릭 가이드 공식 안내 배너',
    href: 'https://checker-postage-2a7.notion.site/KSE-One-Click-28ea3249db4d80dfb781cc4edf4582e1',
    cta: '원클릭 가이드 보기',
  },
  {
    index: '03',
    label: 'KANDASH GUIDE',
    title: '칸닷슈 가이드',
    description: '한일 발송 절차와 통관 기준을 미리 확인해 시행착오를 줄입니다.',
    image: assetUrl('assets/official/kse-shipping-guide.webp'),
    alt: 'KSE 칸닷슈 서비스 공식 안내 배너',
    href: 'https://kseexpress.imweb.me/japan-delivery-5days',
    cta: '칸닷슈 가이드 보기',
  },
  {
    index: '04',
    label: 'K-COMMUNITY',
    title: 'K-커뮤니티',
    description: '세미나와 현장 투어를 통해 물류 운영의 실제 경험을 공유합니다.',
    image: assetUrl('assets/official/kse-community.webp'),
    alt: 'KSE K-커뮤니티 공식 안내 배너',
    href: 'https://www.youtube.com/watch?v=2zqlWbbg_UQ',
    cta: 'K-커뮤니티 영상 보기',
  },
  {
    index: '05',
    label: 'HAKATA CENTER',
    title: 'KSE 하카타센터',
    description: '한일 해상특송의 현지 거점과 물류 운영 현장을 소개합니다.',
    image: assetUrl('assets/official/kse-hakata-center.webp'),
    alt: 'KSE 하카타센터 공식 안내 배너',
    href: 'https://www.youtube.com/watch?v=y0BnQ2dsQM0',
    cta: '하카타센터 영상 보기',
  },
]

export function OperationsInsightSection() {
  return (
    <section id="guide" className="field-guide" aria-labelledby="field-guide-title">
      <div className="section-shell field-guide-heading" data-reveal>
        <p className="section-kicker"><span>08</span><span>OPERATIONS IN MOTION</span></p>
        <h2 id="field-guide-title">움직이는 물류 뒤에는<br />정리된 운영이 있습니다</h2>
        <p>KSE의 가이드와 자동화, 현장 콘텐츠를 한 화면에서 훑고 필요한 정보로 바로 이동할 수 있습니다.</p>
      </div>

      <div className="section-shell field-guide-grid" data-reveal aria-label="KSE 운영 콘텐츠">
        {insights.map((insight) => (
          <article className="field-guide-card" data-guide-card key={insight.index}>
            <a href={insight.href} target="_blank" rel="noreferrer" aria-label={insight.cta}>
              <div className="field-guide-card-media">
                <img src={insight.image} alt={insight.alt} loading="lazy" decoding="async" />
                <span>{insight.index}</span>
                <ArrowUpRight aria-hidden="true" />
              </div>
              <div className="field-guide-card-copy">
                <p>{insight.label}</p>
                <h3>{insight.title}</h3>
                <span>{insight.description}</span>
                <strong>{insight.cta}<ArrowUpRight aria-hidden="true" /></strong>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
