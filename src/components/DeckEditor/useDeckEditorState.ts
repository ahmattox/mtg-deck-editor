import React, { useCallback, useEffect, useState } from 'react'
import { uniqueId } from 'lodash'

import { fetchCollection } from 'utils/scryfall'
// import { usePersistentState } from 'utils/usePersistentState'

import { groupCardsByColor, groupCardsByManaValue } from './sorting'

import { Card, DeckLayout } from './types'
import { normalizeLayout } from './normalizeLayout'

export interface DeckEditorState {
  importCards(cardNames: string[]): void
  cards: { [id: string]: Card }
  deckLayout: DeckLayout
  setDeckLayout: React.Dispatch<React.SetStateAction<DeckLayout>>
  sortByColor(): void
  sortByManaValue(): void
}

export function useDeckEditorState(): DeckEditorState {
  const [cards, setCards] = useState<{ [id: string]: Card }>({})
  const [deckLayout, setDeckLayout] = useState<DeckLayout>({
    columns: [{ id: 'new-column', cardIDs: [] }]
  })

  const importCards = useCallback((cardNames: string[]) => {
    fetchCollection(cardNames).then((result) => {
      const newCards = result.map((card) => ({
        ...card,
        id: uniqueId('card-')
      }))

      setDeckLayout({ columns: [] })

      setCards(
        newCards.reduce((cards, card) => ({ ...cards, [card.id]: card }), {})
      )

      setDeckLayout(
        normalizeLayout({
          columns: [
            {
              id: uniqueId('column-'),
              cardIDs: newCards.map((card) => card.id)
            }
          ]
        })
      )
    })
  }, [])

  const sortByColor = () => {
    const groupedIDs = groupCardsByColor(Object.values(cards))
    setDeckLayout(
      normalizeLayout({
        columns: groupedIDs.map((group) => ({
          id: uniqueId('column-'),
          cardIDs: group
        }))
      })
    )
  }

  const sortByManaValue = () => {
    const groupedIDs = groupCardsByManaValue(Object.values(cards))
    setDeckLayout(
      normalizeLayout({
        columns: groupedIDs.map((group) => ({
          id: uniqueId('column-'),
          cardIDs: group
        }))
      })
    )
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
