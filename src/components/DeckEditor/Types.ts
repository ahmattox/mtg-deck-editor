export interface Card {
  id: string
  name: string
  manaValue: number
  colors: string[]
  colorIdentity: string
  colorGroup: 'W' | 'U' | 'B' | 'R' | 'G' | 'Multicolor' | 'Colorless' | 'Land'
  imageURIs: unknown
  manaCost: string
  rarity: string
  typeLine: string
}

export interface DeckLayout {
  columns: { id: string; cardIDs: string[] }[]
}
