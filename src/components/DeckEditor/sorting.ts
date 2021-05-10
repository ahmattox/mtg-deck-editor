import { groupBy, sortBy } from 'lodash'

import { Card } from './types'

const colorGroupOrder = {
  W: 1,
  U: 2,
  B: 3,
  R: 4,
  G: 5,
  Multicolor: 6,
  Colorless: 7,
  Land: 8
}

export type SortOrder = 'colorGroup' | 'manaValue'

export function groupCardsByColor(cards: Card[]): string[][] {
  const groups = groupBy(cards, 'colorGroup')

  return sortBy(Object.keys(groups), (key) => colorGroupOrder[key]).map(
    (manaValue) => {
      return sortBy(groups[manaValue], 'manaValue').map((card) => card.id)
    }
  )
}

export function groupCardsByManaValue(cards: Card[]): string[][] {
  const groups = groupBy(cards, 'manaValue')
  return Object.keys(groups).map((manaValue) => {
    return sortBy(
      groups[manaValue],
      (card) => colorGroupOrder[card.colorGroup]
    ).map((card) => card.id)
  })
}

export function groupCardsBy(cards: Card[], sortBy: SortOrder) {
  if (sortBy === 'colorGroup') {
    return groupCardsByColor(cards)
  } else if (sortBy === 'manaValue') {
    return groupCardsByManaValue(cards)
  }
}
