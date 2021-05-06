import { groupBy } from 'lodash'

import { Card, DeckLayout } from './types'

export function groupCardsByColor(cards: Card[]): string[][] {
  const groups = groupBy(cards, 'colorIdentity')
  return Object.keys(groups).map((manaValue) => {
    return groups[manaValue].map((card) => card.id)
  })
}

export function groupCardsByManaValue(cards: Card[]): string[][] {
  const groups = groupBy(cards, 'manaValue')
  return Object.keys(groups).map((manaValue) => {
    return groups[manaValue].map((card) => card.id)
  })
}
