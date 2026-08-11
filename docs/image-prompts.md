# GPT Image 2.0 생성 자산 기록

## 참조 자산

- `design-assets/reference/current-hero.png`: 기존 KSE 운송수단과 블루 계열 참고
- `design-assets/reference/current-route.png`: 한일 항로와 서비스 범위 참고
- `design-assets/reference/warehouse.png`: 실제 센터 환경 참고
- `design-assets/reference/current-process.png`: 주문부터 배송까지의 단계 참고

## Hero port

한국 항만과 스마트 물류센터를 하나의 와이드 장면으로 결합했다. 기존 이미지를 재조합하지 않고 코발트·네이비 정체성, 새벽에서 낮으로 전환되는 빛, 왼쪽 카피 여백을 고정했다. 로고·문자·국기·지도 라벨은 제외했다.

## Transport assets

컨테이너선, 화물기, 배송 트럭, 패키지를 동일한 스튜디오 조명과 코발트 컬러로 생성했다. 순수 크로마키 배경으로 생성한 뒤 `remove_chroma_key.py`로 투명 배경을 만들고 네 개의 레이어로 분리했다.

## Warehouse and customs

실제 창고의 랙과 컨베이어를 참고하되, 입고된 패키지가 스캔 게이트로 이어지는 한 방향 원근으로 재구성했다. 과도한 홀로그램 대신 실제 조명과 스캐너 빛만 사용했다.

## Scroll sequence orthographic sprites v2

Built-in GPT Image 2.0 생성 도구에 기존 운송수단 스프라이트 시트를 시각 참조로 제공했다.

> Create a clean 2x2 sprite sheet on a perfectly flat solid #00ff00 chroma-key background. Match the photorealistic studio-cutout style and navy blue/white logistics palette of the reference. Include a side-view reach stacker carrying one white 40-foot container, a side-view semi truck carrying the same container, an exact top-down view of the same truck, and an exact top-down container ship. Keep every subject separated and fully visible. No ground plane, cast shadow, reflections, logos, labels, text, watermark, or people.

크로마키 원본을 로컬에서 알파 이미지로 변환한 뒤 리치 스태커, 측면 트럭, 탑뷰 트럭, 탑뷰 선박의 네 자산으로 분리했다.
