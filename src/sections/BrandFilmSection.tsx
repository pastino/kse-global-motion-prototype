import { Play } from 'lucide-react'

export function BrandFilmSection() {
  return (
    <section className="brand-film" aria-labelledby="brand-film-title">
      <div className="brand-film-media">
        <img
          src="/assets/official/kse-brand-film.webp"
          alt="KSE 물류센터 앞에 나란히 선 배송 차량"
          loading="lazy"
          decoding="async"
        />
        <div className="brand-film-shade" />
        <div className="section-shell brand-film-content" data-reveal>
          <div>
            <p>30+ YEARS IN MOTION</p>
            <h2 id="brand-film-title">현장에서 쌓은 시간은<br />운영의 차이가 됩니다</h2>
          </div>
          <a
            className="film-button"
            href="https://www.youtube.com/watch?v=2G4-7xoTpIc"
            target="_blank"
            rel="noreferrer"
            aria-label="KSE 한국어 홍보 영상 새 창에서 보기"
          >
            <Play aria-hidden="true" fill="currentColor" />
            <span><strong>브랜드 필름 보기</strong><small>공식 한국어 영상 · YouTube</small></span>
          </a>
        </div>
      </div>
    </section>
  )
}
