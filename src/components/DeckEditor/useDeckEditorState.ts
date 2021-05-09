import React, { useCallback, useEffect, useState } from 'react'
import { uniqueId, flatMap } from 'lodash'

import { fetchCollection } from 'utils/scryfall'
// import { usePersistentState } from 'utils/usePersistentState'

import { groupCardsByColor, groupCardsByManaValue } from './sorting'

import { DeckLayout, Section, Card } from './types'
import { normalizeLayout } from './normalize'

export interface DeckEditorState {
  importCards(cardNames: string[]): void
  cards: { [id: string]: Card }
  deckLayout: DeckLayout
  setDeckLayout: React.Dispatch<React.SetStateAction<DeckLayout>>
  sortByColor(): void
  sortByManaValue(): void
  removeAllCards(): void
  cardsInSection(section: Section): Card[]
}

const emptyLayout: DeckLayout = {
  sections: [
    {
      id: 'section-main',
      name: 'Main Deck',
      columnIDs: []
    },
    {
      id: 'section-sideboard',
      name: 'Sideboard',
      columnIDs: []
    }
  ],
  columns: []
}

export function useDeckEditorState(): DeckEditorState {
  const [cards, setCards] = useState<{ [id: string]: Card }>({})
  const [deckLayout, setDeckLayout] = useState<DeckLayout>(emptyLayout)

  const importCards = useCallback((cardNames: string[]) => {
    fetchCollection(cardNames).then((result) => {
      const newCards = result.map((card) => ({
        ...card,
        id: uniqueId('card-')
      }))

      setDeckLayout(emptyLayout)

      setCards(
        newCards.reduce((cards, card) => ({ ...cards, [card.id]: card }), {})
      )

      const column = {
        id: uniqueId('column-'),
        cardIDs: newCards.map((card) => card.id)
      }

      setDeckLayout(
        normalizeLayout({
          sections: [
            {
              id: 'section-main',
              name: 'Main Deck',
              columnIDs: [column.id]
            },
            {
              id: 'section-sideboard',
              name: 'Sideboard',
              columnIDs: []
            }
          ],
          columns: [column]
        })
      )
    })
  }, [])

  const setColumns = (cardIDs: string[][]) => {
    const columns = cardIDs.map((group) => ({
      id: uniqueId('column-'),
      cardIDs: group
    }))

    setDeckLayout(
      normalizeLayout({
        sections: [
          {
            id: 'section-main',
            name: 'Main Deck',
            columnIDs: columns.map((column) => column.id)
          },
          {
            id: 'section-sideboard',
            name: 'Sideboard',
            columnIDs: []
          }
        ],
        columns
      })
    )
  }

  const sortByColor = useCallback(() => {
    setColumns(groupCardsByColor(Object.values(cards)))
  }, [cards])

  const sortByManaValue = useCallback(() => {
    setColumns(groupCardsByManaValue(Object.values(cards)))
  }, [cards])

  const removeAllCards = useCallback(() => {
    setDeckLayout(emptyLayout)
  }, [])

  const columnsInSection = (section: Section) => {
    return deckLayout.columns.filter((column) =>
      section.columnIDs.includes(column.id)
    )
  }

  const cardsInSection = (section: Section) => {
    return flatMap(columnsInSection(section), (column) =>
      column.cardIDs.map((cardID) => cards[cardID])
    )
  }

  return {
    importCards,
    cards,
    deckLayout,
    setDeckLayout,
    sortByColor,
    sortByManaValue,
    removeAllCards,
    cardsInSection
  }
}
