import React, { useCallback, useState } from 'react'
import { uniqueId, flatMap } from 'lodash'
import update from 'immutability-helper'

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
  toggleSideboard(cardID: string): void
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

  const toggleSideboard = (cardID: string) => {
    // TODO: this is a good indicator this data structure isn't great. Having
    // both element ids and indexes in type-specific arrays is annoying.
    const sourceColumnIndex = deckLayout.columns.findIndex((column) =>
      column.cardIDs.includes(cardID)
    )
    const sourceColumn = deckLayout.columns[sourceColumnIndex]
    const sourceCardPositionInColumn = sourceColumn.cardIDs.findIndex(
      (id) => id === cardID
    )
    const sourceSection = deckLayout.sections.find((section) =>
      section.columnIDs.includes(sourceColumn.id)
    )
    const sourceColumnPositionInSection = sourceSection.columnIDs.findIndex(
      (id) => id === sourceColumn.id
    )

    const destinationSection = deckLayout.sections.find(
      (section) => section !== sourceSection
    )
    const destinationColumnID =
      destinationSection.columnIDs[sourceColumnPositionInSection]
    const destinationColumnIndex = deckLayout.columns.findIndex(
      (column) => column.id === destinationColumnID
    )

    setDeckLayout(
      update(
        update(deckLayout, {
          columns: {
            [sourceColumnIndex]: {
              cardIDs: { $splice: [[sourceCardPositionInColumn, 1]] }
            }
          }
        }),
        {
          columns: {
            [destinationColumnIndex]: {
              cardIDs: { $push: [cardID] }
            }
          }
        }
      )
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
    toggleSideboard,
    cardsInSection
  }
}
