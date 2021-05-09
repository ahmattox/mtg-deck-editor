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

export interface Section {
  id: string
  name: string
  columnIDs: string[]
}

export interface Column {
  id: string
  cardIDs: string[]
}

export interface DeckLayout {
  sections: Section[]
  columns: Column[]
}
