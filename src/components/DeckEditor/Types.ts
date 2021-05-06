export interface Card {
  id: string
  name: string
  manaValue: number
  colorIdentity: string
  colors: [string]
  imageURIs: unknown
  manaCost: string
  rarity: string
  typeLine: string
}

export interface DeckLayout {
  columns: { id: string; cardIDs: string[] }[]
}
