import './DeckEditor.scss'

import React, { useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import Column from './Column'
import Controls from './Controls'

import { useDeckEditorState } from './useDeckEditorState'
import { updateDeckLayout } from './updateDeckLayout'

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
    const updatedLayout = updateDeckLayout(result, state.deckLayout)

    if (updatedLayout) {
      state.setDeckLayout(updatedLayout)
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
              {(provided) => (
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
