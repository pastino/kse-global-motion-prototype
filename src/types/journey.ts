export type JourneyChapter = {
  id: string
  index: string
  title: string
  description: string
}

export type TransportMode = 'ocean' | 'air' | 'road'

export type NetworkNode = {
  id: string
  label: string
  x: number
  y: number
  owned?: boolean
}
