import { ArrowDown, ArrowUpRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-background" data-hero-parallax />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="hero-kicker">GLOBAL CROSS-BORDER LOGISTICS</p>
        <h1 id="hero-title">
          한국과 일본의<br />
          <span>자체 인프라.</span>
        </h1>
        <p className="hero-lead">전 세계를 연결하는 파트너 네트워크.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="https://www.kseexpress.com/155" target="_blank" rel="noreferrer">
            글로벌 물류 상담 <ArrowUpRight aria-hidden="true" />
          </a>
          <a className="text-link" href="#journey">
            하나의 배송 여정 보기 <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-orbit" aria-hidden="true">
        <span className="orbit-dot orbit-dot--korea" />
        <span className="orbit-dot orbit-dot--japan" />
      </div>
      <div className="hero-caption">
        <span>KOREA</span>
        <span className="caption-line" />
        <span>JAPAN</span>
        <span className="caption-dashed" />
        <span>WORLD</span>
      </div>
    </section>
  )
}
