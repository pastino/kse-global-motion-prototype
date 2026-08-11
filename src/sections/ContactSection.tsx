import { ArrowRight, Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (event.currentTarget.checkValidity()) setSubmitted(true)
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="section-shell contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="section-kicker"><span>07</span><span>START YOUR ROUTE</span></p>
          <h2 id="contact-title">다음 시장으로 가는 길,<br />KSE가 함께 설계합니다</h2>
          <p>목적지와 물량을 알려주시면 가장 적합한 풀필먼트와 운송 경로를 제안해 드립니다.</p>
        </div>
        {submitted ? (
          <div className="contact-success" role="status" data-reveal>
            <Check aria-hidden="true" />
            <h3>상담 요청이 준비되었습니다</h3>
            <p>프로토타입에서는 실제로 전송되지 않습니다. 실서비스 연결 시 담당자가 확인 후 연락드리게 됩니다.</p>
            <button type="button" onClick={() => setSubmitted(false)}>다시 입력하기</button>
          </div>
        ) : (
          <form className="quote-form" onSubmit={submit} data-reveal>
            <label>
              <span>목적지</span>
              <select name="destination" required defaultValue="">
                <option value="" disabled>목적지를 선택하세요</option>
                <option>일본</option>
                <option>미주</option>
                <option>유럽</option>
                <option>아시아·오세아니아</option>
              </select>
            </label>
            <label>
              <span>화물 유형</span>
              <select name="cargo" required defaultValue="">
                <option value="" disabled>화물 유형을 선택하세요</option>
                <option>이커머스 상품</option>
                <option>일반 기업화물</option>
                <option>대형·중량화물</option>
                <option>콜드체인</option>
              </select>
            </label>
            <label>
              <span>월 예상 물량</span>
              <input name="volume" type="text" required placeholder="예: 월 3,000건" />
            </label>
            <label>
              <span>이메일</span>
              <input name="email" type="email" required placeholder="name@company.com" />
            </label>
            <button className="button button--primary" type="submit">
              물류 상담 시작하기 <ArrowRight aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
      <footer className="site-footer section-shell">
        <img src="/assets/kse-logo.png" alt="KSE 국제로지스틱" />
        <p>Owned infrastructure in Korea &amp; Japan. Connected to the world.</p>
        <span>Prototype © KSE</span>
      </footer>
    </section>
  )
}
