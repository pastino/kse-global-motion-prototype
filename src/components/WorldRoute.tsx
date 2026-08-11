import { useRef, type PointerEvent } from 'react'
import { networkNodes } from '../content/network'

export function WorldRoute() {
  const routeRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = routeRef.current
    if (!element || event.pointerType === 'touch') return

    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    element.style.setProperty('--route-shift-x', `${x * 12}px`)
    element.style.setProperty('--route-shift-y', `${y * 8}px`)
  }

  const resetPointerShift = () => {
    routeRef.current?.style.setProperty('--route-shift-x', '0px')
    routeRef.current?.style.setProperty('--route-shift-y', '0px')
  }

  return (
    <div
      ref={routeRef}
      className="world-route"
      data-route-visual
      aria-label="한국과 일본의 자체 거점 및 글로벌 파트너 네트워크"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerShift}
    >
      <div className="route-status" aria-hidden="true">
        <span><i />NETWORK IN MOTION</span>
        <span>2 OWNED HUBS</span>
        <span>4 GLOBAL CORRIDORS</span>
      </div>

      <svg viewBox="0 0 1000 520" role="img" aria-label="서울과 도쿄에서 미주, 유럽, 중동, 동남아시아, 오세아니아로 연결되는 KSE 글로벌 항로">
        <defs>
          <radialGradient id="route-ocean" cx="74%" cy="44%" r="72%">
            <stop offset="0" stopColor="#114e80" stopOpacity=".5" />
            <stop offset=".52" stopColor="#071f3e" stopOpacity=".2" />
            <stop offset="1" stopColor="#020c1c" stopOpacity="0" />
          </radialGradient>
          <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <ellipse className="route-ocean-glow" cx="510" cy="255" rx="468" ry="232" fill="url(#route-ocean)" />
        <g className="route-grid" aria-hidden="true">
          <ellipse cx="500" cy="260" rx="442" ry="205" />
          <ellipse cx="500" cy="260" rx="330" ry="205" />
          <ellipse cx="500" cy="260" rx="190" ry="205" />
          <path d="M58 260h884M91 170h818M91 350h818" />
        </g>
        <path className="world-silhouette" d="M72 220c58-78 123-103 194-86 39 9 61-22 97-41 47-25 104-13 125 24 25 43 82 26 126-1 56-35 117-33 169-3 58 33 84 92 150 108 32 8 61 40 39 71-28 39-98 24-143 40-63 23-107 92-179 93-69 1-109-62-170-74-57-11-104 34-159 13-42-16-68-59-112-69-52-12-132-8-143-49-3-10-1-18 6-26Z" />
        <path id="route-owned" data-route-line className="route-line route-line--owned" d="M760 228 C785 214 802 220 820 239" />
        <path id="route-americas" data-route-line className="route-line" d="M770 223 C620 120 410 108 170 222" />
        <path id="route-europe" data-route-line className="route-line" d="M770 223 C685 164 580 148 480 166" />
        <path id="route-south" data-route-line className="route-line" d="M775 230 C650 260 550 300 485 350" />
        <path id="route-oceania" data-route-line className="route-line" d="M785 238 C835 305 870 350 885 410" />

        <g className="route-traffic" filter="url(#route-glow)" aria-hidden="true">
          <circle r="4"><animateMotion dur="6.5s" repeatCount="indefinite"><mpath href="#route-americas" /></animateMotion></circle>
          <circle r="3"><animateMotion dur="4.8s" begin="-2.2s" repeatCount="indefinite"><mpath href="#route-south" /></animateMotion></circle>
          <circle r="3"><animateMotion dur="5.4s" begin="-1.4s" repeatCount="indefinite"><mpath href="#route-oceania" /></animateMotion></circle>
        </g>
      </svg>
      {networkNodes.map((node) => (
        <div
          key={node.id}
          className={node.owned ? 'network-node network-node--owned' : 'network-node'}
          data-route-node
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <span className="node-dot" />
          <span className="node-label">{node.label}</span>
        </div>
      ))}
      <div className="network-legend">
        <span><i className="legend-dot legend-dot--owned" />자체 운영 거점</span>
        <span><i className="legend-dot" />파트너 네트워크</span>
      </div>
      <p className="route-caption">MOVE YOUR CURSOR · 노선 위를 움직여 글로벌 연결망을 살펴보세요</p>
    </div>
  )
}
