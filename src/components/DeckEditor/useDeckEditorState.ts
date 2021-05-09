import React, { useCallback, useEffect, useState } from 'react'
import { uniqueId } from 'lodash'

import { fetchCollection } from 'utils/scryfall'
// import { usePersistentState } from 'utils/usePersistentState'

import { groupCardsByColor, groupCardsByManaValue } from './sorting'

import { Card, DeckLayout } from './types'
import { normalizeLayout } from './normalize'

export interface DeckEditorState {
  importCards(cardNames: string[]): void
  cards: { [id: string]: Card }
  deckLayout: DeckLayout
  setDeckLayout: React.Dispatch<React.SetStateAction<DeckLayout>>
  sortByColor(): void
  sortByManaValue(): void
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

  const sortByColor = () => {
    setColumns(groupCardsByColor(Object.values(cards)))
  }

  const sortByManaValue = () => {
    setColumns(groupCardsByManaValue(Object.values(cards)))
  }

  return {
    importCards,
    cards,
    deckLayout,
    setDeckLayout,
    sortByColor,
    sortByManaValue
  }
}
