import './DeckEditor.scss'

import React, { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'
import { uniqueId } from 'lodash'

import { fetchCollection } from 'utils/scryfall'

import { usePersistentState } from 'utils/usePersistentState'
import { groupCardsByColor, groupCardsByManaValue } from './sorting'

import Column from './Column'

import { Card, DeckLayout } from './types'

const DeckEditor: React.FC = () => {
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

      setCards(
        newCards.reduce((cards, card) => ({ ...cards, [card.id]: card }), {})
      )

      setDeckLayout({
        columns: [
          {
            id: uniqueId('column-'),
            cardIDs: newCards.map((card) => card.id)
          }
        ]
      })
    })
  }, [])

  useEffect(() => {
    const onPaste = (event) => {
      const data: string = event.clipboardData.getData('text')

      const cards = data.split('\n')

      importCards(cards)
    }

    window.addEventListener('paste', onPaste)

    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [importCards])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) {
      return
    }

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'card') {
      const sourceColumnIndex = deckLayout.columns.findIndex(
        (column) => column.id === source.droppableId
      )
      const destinationColumnIndex = deckLayout.columns.findIndex(
        (column) => column.id === destination.droppableId
      )

      const cardID = deckLayout.columns[sourceColumnIndex].cardIDs[source.index]

      const udpatedDeckLayout = update(
        update(deckLayout, {
          columns: {
            [sourceColumnIndex]: { cardIDs: { $splice: [[source.index, 1]] } }
          }
        }),
        {
          columns: {
            [destinationColumnIndex]: {
              cardIDs: { $splice: [[destination.index, 0, cardID]] }
            }
          }
        }
      )

      setDeckLayout(udpatedDeckLayout)
    } else if (type === 'column') {
      const column = deckLayout.columns[source.index]

      const updatedDeckLayout = update(
        update(deckLayout, {
          columns: {
            $splice: [[source.index, 1]]
          }
        }),
        {
          columns: {
            $splice: [[destination.index, 0, column]]
          }
        }
      )

      setDeckLayout(updatedDeckLayout)
    }
  }

  const sortByColor = () => {
    const groupedIDs = groupCardsByColor(Object.values(cards))
    setDeckLayout({
      columns: groupedIDs.map((group) => ({
        id: uniqueId('column-'),
        cardIDs: group
      }))
    })
  }

  const sortByManaValue = () => {
    const groupedIDs = groupCardsByManaValue(Object.values(cards))
    setDeckLayout({
      columns: groupedIDs.map((group) => ({
        id: uniqueId('column-'),
        cardIDs: group
      }))
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="DeckEditor">
        <h2>Deck Editor</h2>

        <h3>Organize By</h3>
        <div>
          <button type="button" onClick={sortByColor}>
            Color
          </button>
          <button type="button" onClick={sortByManaValue}>
            Mana Value
          </button>
        </div>

        <div className="DeckEditor-deck">
          <Droppable droppableId="group-1" direction="horizontal" type="column">
            {(provided, snapshot) => (
              <div
                className="DeckEditor-group"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {deckLayout.columns.map((column, index) => (
                  <Column
                    column={column}
                    cards={cards}
                    key={column.id}
                    index={index}
                  />
                ))}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  )
}

export default DeckEditor
