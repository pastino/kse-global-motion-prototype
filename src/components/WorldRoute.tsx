import { networkNodes } from '../content/network'

export function WorldRoute() {
  return (
    <div className="world-route" aria-label="한국과 일본의 자체 거점 및 글로벌 파트너 네트워크">
      <svg viewBox="0 0 1000 520" role="img" aria-label="KSE 글로벌 연결 항로">
        <path className="world-silhouette" d="M72 220c58-78 123-103 194-86 39 9 61-22 97-41 47-25 104-13 125 24 25 43 82 26 126-1 56-35 117-33 169-3 58 33 84 92 150 108 32 8 61 40 39 71-28 39-98 24-143 40-63 23-107 92-179 93-69 1-109-62-170-74-57-11-104 34-159 13-42-16-68-59-112-69-52-12-132-8-143-49-3-10-1-18 6-26Z" />
        <path data-route-line className="route-line route-line--owned" d="M760 228 C785 214 802 220 820 239" />
        <path data-route-line className="route-line" d="M770 223 C620 120 410 108 170 222" />
        <path data-route-line className="route-line" d="M775 230 C650 260 550 300 485 350" />
        <path data-route-line className="route-line" d="M785 238 C835 305 870 350 885 410" />
      </svg>
      {networkNodes.map((node) => (
        <div
          key={node.id}
          className={node.owned ? 'network-node network-node--owned' : 'network-node'}
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
    </div>
  )
}
