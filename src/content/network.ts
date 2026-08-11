export type NetworkNode = {
  id: string
  label: string
  x: number
  y: number
  owned?: boolean
}

export const networkNodes: NetworkNode[] = [
  { id: 'seoul', label: 'SEOUL', x: 76, y: 43, owned: true },
  { id: 'tokyo', label: 'TOKYO', x: 82, y: 46, owned: true },
  { id: 'americas', label: 'AMERICAS', x: 20, y: 42 },
  { id: 'europe', label: 'EUROPE', x: 48, y: 32 },
  { id: 'middle-east', label: 'MIDDLE EAST', x: 60, y: 53 },
  { id: 'southeast-asia', label: 'SOUTHEAST ASIA', x: 72, y: 72 },
  { id: 'oceania', label: 'OCEANIA', x: 87, y: 82 },
]
