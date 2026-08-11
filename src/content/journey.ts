import type { JourneyChapter, NetworkNode } from '../types/journey'

export const chapters: JourneyChapter[] = [
  {
    id: 'commerce',
    index: '01',
    title: '주문은 하나의 흐름으로',
    description: '흩어진 글로벌 판매채널의 주문과 재고를 KSE OMS에서 한눈에 연결합니다.',
  },
  {
    id: 'fulfillment',
    index: '02',
    title: '오늘 주문을 오늘 움직입니다',
    description: '입고부터 검수, 포장, 출고까지 끊김 없는 풀필먼트 동선으로 리드타임을 줄입니다.',
  },
  {
    id: 'customs',
    index: '03',
    title: '국경에서 멈추지 않도록',
    description: '통관 전문성과 자체 시스템으로 복잡한 절차를 빠르고 정확하게 통과합니다.',
  },
  {
    id: 'transport',
    index: '04',
    title: '화물마다 가장 알맞은 길로',
    description: '해상·항공·육상 네트워크를 조합해 속도와 비용의 균형을 설계합니다.',
  },
]

export const networkNodes: NetworkNode[] = [
  { id: 'seoul', label: 'SEOUL', x: 76, y: 43, owned: true },
  { id: 'tokyo', label: 'TOKYO', x: 82, y: 46, owned: true },
  { id: 'americas', label: 'AMERICAS', x: 20, y: 42 },
  { id: 'europe', label: 'EUROPE', x: 48, y: 32 },
  { id: 'middle-east', label: 'MIDDLE EAST', x: 60, y: 53 },
  { id: 'southeast-asia', label: 'SOUTHEAST ASIA', x: 72, y: 72 },
  { id: 'oceania', label: 'OCEANIA', x: 87, y: 82 },
]
