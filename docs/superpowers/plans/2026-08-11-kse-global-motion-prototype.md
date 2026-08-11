# KSE Global Motion Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 한국·일본 자체 인프라와 글로벌 파트너 네트워크를 하나의 상품 여정으로 설명하는 반응형 KSE 모션 랜딩 페이지를 만든다.

**Architecture:** Vite React 단일 페이지에서 각 물류 단계를 독립 섹션으로 구성하고, 공통 `JourneyProgress` 상태와 CSS 변수로 패키지 이동을 동기화한다. GSAP ScrollTrigger는 점진적 향상으로만 사용하며 감속 모드와 모바일에서는 정적 타임라인으로 대체한다.

**Tech Stack:** Vite, React, TypeScript, GSAP, CSS Modules, Vitest, Testing Library

## Global Constraints

- 핵심 문구: `한국과 일본의 자체 인프라. 전 세계를 연결하는 파트너 네트워크.`
- 직접 운영 거점과 파트너 네트워크를 시각적으로 명확히 구분한다.
- 기존 KSE 로고와 네이비·블루 브랜드 정체성을 유지한다.
- 모든 애니메이션에 `prefers-reduced-motion` 대체 상태를 제공한다.
- 주석은 모두 한국어로 작성한다.
- 생성 이미지에 로고와 텍스트를 넣지 않는다.

---

### Task 1: 프로젝트 기반과 디자인 토큰

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: React 애플리케이션 진입점, 색상·타이포그래피·간격·모션 토큰

- [ ] Vite React TypeScript 의존성과 `dev`, `build`, `test`, `test:run` 스크립트를 정의한다.
- [ ] KSE 네이비·블루·시안과 중립색, 타이포그래피, 컨테이너 폭, 모션 지속시간을 CSS 변수로 정의한다.
- [ ] 기본 포커스 링, 선택 영역, 본문 폭, 버튼 최소 높이 44px를 전역 스타일에 반영한다.
- [ ] 기본 렌더 테스트를 작성하고 실패를 확인한 뒤 앱 셸을 구현한다.
- [ ] `npm run test:run`과 `npm run build`를 실행한다.

### Task 2: 콘텐츠 모델과 페이지 구조

**Files:**
- Create: `src/content/journey.ts`
- Create: `src/types/journey.ts`
- Create: `src/App.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SectionIntro.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `JourneyChapter`, `TransportMode`, `NetworkNode` 타입과 8개 장면 데이터

- [ ] 8개 장면의 제목, 본문, 증거 문구, CTA를 데이터로 정의한다.
- [ ] 헤더 내 로고, 섹션 내비게이션, 상담 CTA를 시맨틱 마크업으로 구현한다.
- [ ] 모든 핵심 콘텐츠가 GSAP 없이 DOM에 존재하는지 테스트한다.
- [ ] 일본을 대표 성공 노선으로 표현하고 전 세계 자체 거점으로 오해할 카피가 없는지 문자열 테스트를 추가한다.
- [ ] 테스트와 빌드를 실행한다.

### Task 3: GPT Image 2.0 자산 생성과 최적화

**Files:**
- Create: `public/assets/generated/hero-port.webp`
- Create: `public/assets/generated/cargo-ship.webp`
- Create: `public/assets/generated/cargo-plane.webp`
- Create: `public/assets/generated/delivery-truck.webp`
- Create: `public/assets/generated/parcel.webp`
- Create: `public/assets/generated/warehouse.webp`
- Create: `public/assets/generated/customs-gate.webp`
- Create: `public/assets/generated/mobile-poster.webp`
- Create: `docs/image-prompts.md`

**Interfaces:**
- Produces: 로고와 글자가 없는 일관된 장면·오브젝트 자산

- [ ] 기존 KSE 이미지에서 선박, 창고, 차량, 브랜드 색상을 참고 요소로 정리한다.
- [ ] 장면별 프롬프트에 카메라 높이, 빛 방향, 렌즈감, 피사체 비율을 고정한다.
- [ ] GPT Image 2.0으로 데스크톱 배경과 핵심 운송수단을 생성한다.
- [ ] 결과를 시각 검토하고 브랜드 색상·방향·비율이 맞지 않는 자산을 재생성한다.
- [ ] 최종 자산을 WebP로 최적화하고 생성 프롬프트를 문서화한다.

### Task 4: Hero와 글로벌 네트워크 장면

**Files:**
- Create: `src/sections/HeroSection.tsx`
- Create: `src/sections/NetworkSection.tsx`
- Create: `src/components/WorldRoute.tsx`
- Create: `src/styles/hero.module.css`
- Create: `src/styles/network.module.css`
- Test: `src/sections/HeroSection.test.tsx`

**Interfaces:**
- Produces: `WorldRoute({ progress, reducedMotion })`

- [ ] 히어로 카피와 글로벌 상담 CTA의 접근성 테스트를 작성한다.
- [ ] 한국·일본 실선 노드와 파트너 점선 노드를 구분하는 SVG 경로를 구현한다.
- [ ] 배경, 항만, 패키지, 경로를 독립 레이어로 배치한다.
- [ ] 감속 모드에서는 완성된 네트워크 정지 상태를 렌더링한다.
- [ ] 테스트와 빌드를 실행한다.

### Task 5: 주문·풀필먼트·통관 장면

**Files:**
- Create: `src/sections/CommerceSection.tsx`
- Create: `src/sections/FulfillmentSection.tsx`
- Create: `src/sections/CustomsSection.tsx`
- Create: `src/components/Parcel.tsx`
- Create: `src/components/EvidenceStat.tsx`
- Create: `src/styles/process.module.css`
- Test: `src/sections/ProcessSections.test.tsx`

**Interfaces:**
- Produces: `Parcel({ stage, progress, reducedMotion })`

- [ ] 주문 신호가 한 흐름으로 합쳐지는 시맨틱 리스트와 시각 레이어를 구현한다.
- [ ] 입고·검수·포장·출고를 하나의 컨베이어 동선으로 구현한다.
- [ ] 통관 게이트와 일본 자체 통관 역량을 증거 중심으로 구성한다.
- [ ] 각 단계가 키보드와 스크린리더에서 순서대로 읽히는지 테스트한다.
- [ ] 테스트와 빌드를 실행한다.

### Task 6: 복합운송과 일본 성공 노선

**Files:**
- Create: `src/sections/TransportSection.tsx`
- Create: `src/sections/JapanProofSection.tsx`
- Create: `src/components/TransportLayer.tsx`
- Create: `src/styles/transport.module.css`
- Test: `src/sections/TransportSection.test.tsx`

**Interfaces:**
- Produces: `TransportLayer({ mode, progress, active })`

- [ ] 선박, 항공기, 트럭 경로가 화물 조건에 따라 분기되는 구성을 구현한다.
- [ ] 일본 구간에 `D+3/D+4`와 당일 처리 흐름을 대표 사례로 배치한다.
- [ ] 수치가 일본 노선에만 해당한다는 보조 문구를 포함한다.
- [ ] 모바일에서는 운송수단이 겹치지 않는 세로 진행 구조로 전환한다.
- [ ] 테스트와 빌드를 실행한다.

### Task 7: 스크롤 오케스트레이션과 감속 모드

**Files:**
- Create: `src/motion/useJourneyMotion.ts`
- Create: `src/motion/useReducedMotion.ts`
- Create: `src/motion/journeyTimeline.ts`
- Test: `src/motion/useReducedMotion.test.tsx`

**Interfaces:**
- Produces: `useJourneyMotion(rootRef)`, `useReducedMotion()`

- [ ] 미디어 쿼리 변화를 반영하는 감속 모드 훅 테스트를 작성한다.
- [ ] GSAP 컨텍스트 내부에서 섹션별 진입·고정·인계 타임라인을 구성한다.
- [ ] 언마운트와 반응형 전환 시 ScrollTrigger와 인라인 스타일을 정리한다.
- [ ] 스크롤 재생 중 레이아웃 속성을 변경하지 않고 transform·opacity만 애니메이션한다.
- [ ] 감속 모드에서는 GSAP 등록을 생략하는지 테스트한다.

### Task 8: 상담 전환과 최종 통합

**Files:**
- Create: `src/sections/ContactSection.tsx`
- Create: `src/components/QuoteForm.tsx`
- Create: `src/styles/contact.module.css`
- Test: `src/components/QuoteForm.test.tsx`

**Interfaces:**
- Produces: 목적지·화물 유형·월 물량을 검증하는 프로토타입 상담 폼

- [ ] 필수 입력, 오류 연결, 성공 상태 테스트를 먼저 작성한다.
- [ ] 폼 제출 시 네트워크 호출 없이 성공 상태를 보여준다.
- [ ] 전체 섹션과 헤더 내비게이션을 App에 통합한다.
- [ ] 키보드 포커스 이동과 오류 메시지 연결을 검증한다.
- [ ] 전체 테스트와 빌드를 실행한다.

### Task 9: 브라우저 디자인 리뷰와 성능 검증

**Files:**
- Modify: 시각 검토에서 발견된 관련 컴포넌트와 스타일
- Create: `docs/reviews/visual-qa.md`

**Interfaces:**
- Produces: 데스크톱·태블릿·모바일 검증 기록과 수정 결과

- [ ] 1440px, 1024px, 390px에서 전체 페이지 스크린샷을 검토한다.
- [ ] impeccable 기준으로 AI풍 카드, 불필요한 배지, 과도한 효과, 반복 카피를 제거한다.
- [ ] ui-ux-pro-max 기준으로 대비, 터치 영역, 반응형, 감속 모드, 이미지 지연 로딩을 검증한다.
- [ ] 콘솔 오류, 가로 스크롤, 이미지 깨짐, 애니메이션 정리 누락을 수정한다.
- [ ] `npm run test:run`과 `npm run build`를 최종 실행하고 결과를 기록한다.

