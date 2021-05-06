import './DeckEditor.scss'

import React, { useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'

import Column from './Column'
import Controls from './Controls'

import { useDeckEditorState } from './useDeckEditorState'

const DeckEditor: React.FC = () => {
  const state = useDeckEditorState()

  const { importCards } = state

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
      const sourceColumnIndex = state.deckLayout.columns.findIndex(
        (column) => column.id === source.droppableId
      )
      const destinationColumnIndex = state.deckLayout.columns.findIndex(
        (column) => column.id === destination.droppableId
      )

      const cardID =
        state.deckLayout.columns[sourceColumnIndex].cardIDs[source.index]

      const udpatedDeckLayout = update(
        update(state.deckLayout, {
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

      state.setDeckLayout(udpatedDeckLayout)
    } else if (type === 'column') {
      const column = state.deckLayout.columns[source.index]

      const updatedDeckLayout = update(
        update(state.deckLayout, {
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

      state.setDeckLayout(updatedDeckLayout)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="DeckEditor">
        <Controls state={state} />

        <div className="DeckEditor-content">
          <div className="DeckEditor-deck">
            <Droppable
              droppableId="group-1"
              direction="horizontal"
              type="column"
            >
              {(provided, snapshot) => (
                <div
                  className="DeckEditor-group"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {state.deckLayout.columns.map((column, index) => (
                    <Column
                      column={column}
                      cards={state.cards}
                      key={column.id}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

export default DeckEditor
