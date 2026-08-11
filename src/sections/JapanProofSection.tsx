import { ArrowRight } from 'lucide-react'

export function JapanProofSection() {
  return (
    <section id="japan-proof" className="japan-proof" aria-labelledby="japan-proof-title">
      <div className="section-shell japan-grid">
        <div className="japan-copy" data-reveal>
          <p className="section-kicker"><span>05</span><span>PROVEN IN JAPAN</span></p>
          <h2 id="japan-proof-title">글로벌을 말하기 전에<br />한일 노선에서 증명했습니다</h2>
          <p>한국의 풀필먼트와 일본의 자체 인프라를 직접 연결해 빠른 크로스보더 배송을 현실로 만들었습니다.</p>
          <a className="text-link text-link--dark" href="#contact">한일 특송 상담 <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="japan-route" data-reveal>
          <div className="route-cities">
            <div><strong>BUSAN</strong><span>한국 물류센터</span></div>
            <div><strong>HAKATA</strong><span>일본 현지 거점</span></div>
          </div>
          <div className="route-bridge">
            <span className="route-pulse" />
            <img src="/assets/generated/cargo-ship.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="proof-numbers">
            <div><strong>D+3</strong><span>부산센터 기준</span></div>
            <div><strong>D+4</strong><span>서울·경기센터 기준</span></div>
            <p>※ 일본 도착보장 대표 서비스 기준이며 지역과 운영 조건에 따라 달라질 수 있습니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
