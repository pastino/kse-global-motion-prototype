# KSE Global Motion Design System

## Theme

항만의 새벽에서 맑은 낮으로 이동하는 물류의 시간감을 기본 장면으로 사용한다. 짙은 네이비는 운영의 안정성과 야간 물류를, 코발트와 시안은 이동·연결·스캔 같은 능동 상태를 표현한다. 일본은 별도 색상으로 분리하지 않고 KSE 글로벌 네트워크의 가장 강한 실선 구간으로 표현한다.

## Color

| Token | Value | Usage |
|---|---:|---|
| Ink 950 | `#061225` | 어두운 섹션과 모션 무대 |
| Ink 900 | `#0A1C35` | 깊이와 보조 배경 |
| Ink 800 | `#123052` | 경계와 운송 장면 |
| Blue 700 | `#0757D2` | 핵심 경로, 아이콘, 포커스 |
| Blue 600 | `#0873EE` | 활성 노드와 진행 상태 |
| Cyan 400 | `#26C8FF` | CTA, 스캔, 연결 강조 |
| Cyan 200 | `#A5ECFF` | 어두운 배경의 보조 강조 |
| Paper | `#F5F8FC` | 밝은 정보 섹션 |
| White | `#FFFFFF` | 카드와 주요 대비 텍스트 |

색상만으로 의미를 구분하지 않는다. 자체 운영 거점은 채워진 큰 노드와 실선, 파트너 네트워크는 작은 노드와 점선을 함께 사용한다.

## Typography

- Font stack: Pretendard → Noto Sans KR → Apple SD Gothic Neo → system sans-serif
- Hero: `clamp(54px, 7.1vw, 108px)`, line-height `0.96`
- Section heading: `clamp(44px, 5.5vw, 78px)`, line-height `1.04`
- Body: 16–18px, line-height 1.7–1.75
- Headings use `text-wrap: balance` and `word-break: keep-all` to prevent Korean orphan characters.
- Uppercase English labels are short and use increased letter spacing only for navigation cues.

## Layout

- Desktop container: viewport minus 96px, maximum 1280px
- Tablet container: viewport minus 56px
- Mobile container: viewport minus 40px
- Section vertical spacing: 140–150px desktop, 100px mobile
- Marketing content uses one strong visual stage per section instead of repeated card grids.
- Mobile converts horizontal routes and step rows into a vertical narrative.

## Components

### Header

Official KSE logo, three section links, one rounded consultation CTA. Mobile uses a 44px menu control and full-width stacked navigation.

### Section intro

Circular chapter number, compact English context label, balanced Korean headline, one explanatory paragraph. Eyebrow labels are used only at chapter boundaries.

### Evidence rail

Operational proof appears as a horizontal text rail on desktop and a divided list on mobile. It is not rendered as independent cards.

### Route map

Korea and Japan use solid luminous routes. Other regions use dashed partner routes. City labels outside direct operating locations are prohibited unless verified.

### Consultation form

Two-column desktop form and one-column mobile form. Every control has a visible label, 52px height, clear focus state, native validation, and a local-only prototype success state.

## Motion

- GSAP ScrollTrigger controls reveal, parallax, transport motion, and route drawing.
- Remotion renders the conveyor frame, belt slats, rollers, scanner, and parcel from one deterministic motion timeline.
- Animate only transform, opacity, and SVG dash offset during scroll.
- Transport stage keeps at most the parcel plus one dominant vehicle visually active.
- `prefers-reduced-motion` skips GSAP setup and shows completed static states.
- Desktop scrubs an all-keyframe 1440×810 video in both scroll directions.
- Mobile removes pinned scrub motion and plays a dedicated 750×1334 camera-follow video only while the scene is visible.

## Imagery

- GPT Image 2.0 assets use consistent dawn-neutral lighting, cobalt transport equipment, and realistic Korean logistics environments.
- Generated images never contain logos, labels, flags, or UI text.
- Official KSE logo remains a separate real asset.
- Hero and warehouse scenes use optimized WebP; transport objects use transparent WebP layers.

## Avoid

- Gradient text, black-and-gold luxury styling, glass-card grids
- Generic world-globe stock visuals without operational meaning
- Unverified city nodes or claims of direct global facilities
- Continuous bouncing, scroll hijacking, and decorative motion
- Single-character Korean line breaks
