import './DeckEditor.scss'

import React, { useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'
import { uniqueId } from 'lodash'

import { usePersistentState } from 'utils/usePersistentState'

import Column from './Column'

const initialCards = [
  {
    id: uniqueId('column-'),
    cards: [
      { name: 'Plains', id: uniqueId('card-') },
      { name: 'Island', id: uniqueId('card-') },
      { name: 'Swamp', id: uniqueId('card-') },
      { name: 'Mountain', id: uniqueId('card-') },
      { name: 'forest', id: uniqueId('card-') }
    ]
  },
  {
    id: uniqueId('column-'),
    cards: [
      { name: 'Unsummon', id: uniqueId('card-') },
      { name: 'Shock', id: uniqueId('card-') }
    ]
  },
  {
    id: uniqueId('column-'),
    cards: [
      { name: 'Counterspell', id: uniqueId('card-') },
      { name: 'Young Pyromancer', id: uniqueId('card-') }
    ]
  }
]

const DeckEditor: React.FC = () => {
  const [cards, setCards] = usePersistentState(
    'deck-editor-cards',
    initialCards
  )

  useEffect(() => {
    const onPaste = (event) => {
      const data: string = event.clipboardData.getData('text')

      const cards = data.split('\n')

      setCards([
        {
          id: uniqueId('column-'),
          cards: cards.map((card) => ({ name: card, id: uniqueId('card-') }))
        },
        {
          id: uniqueId('column-'),
          cards: []
        },
        {
          id: uniqueId('column-'),
          cards: []
        },
        {
          id: uniqueId('column-'),
          cards: []
        },
        {
          id: uniqueId('column-'),
          cards: []
        }
      ])
    }

    window.addEventListener('paste', onPaste)

    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [setCards])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

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
      const sourceColumnIndex = cards.findIndex(
        (column) => column.id === source.droppableId
      )
      const destinationColumnIndex = cards.findIndex(
        (column) => column.id === destination.droppableId
      )

      const card = cards[sourceColumnIndex].cards[source.index]

      const updatedCards = update(
        update(cards, {
          [sourceColumnIndex]: { cards: { $splice: [[source.index, 1]] } }
        }),
        {
          [destinationColumnIndex]: {
            cards: { $splice: [[destination.index, 0, card]] }
          }
        }
      )

      setCards(updatedCards)
    } else if (type === 'column') {
      const column = cards[source.index]

      const updatedCards = update(
        update(cards, {
          $splice: [[source.index, 1]]
        }),
        {
          $splice: [[destination.index, 0, column]]
        }
      )

      setCards(updatedCards)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="DeckEditor">
        <h2>Deck Editor</h2>

        <Droppable droppableId="group-1" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <div
              className="DeckEditor-group"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((column, index) => (
                <Column column={column} key={column.id} index={index} />
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default DeckEditor
