import './DeckEditor.scss'

import React, { useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

import Column from './Column'
import Controls from './Controls'

import { useDeckEditorState } from './useDeckEditorState'
import { updateDeckLayout } from './updateDeckLayout'
import classNames from 'classnames'

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

        {state.deckLayout.sections.map((section) => (
          <div className="DeckEditor-section" key={section.id}>
            <h2>{section.name}</h2>

            <div className="DeckEditor-deck">
              <Droppable
                droppableId={section.id}
                direction="horizontal"
                type="column"
              >
                {(provided, snapshot) => (
                  <div
                    className={classNames('DeckEditor-group', {
                      'is-hovering': snapshot.isDraggingOver
                    })}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {section.columnIDs.map((columnID, index) => (
                      <Column
                        column={state.deckLayout.columns.find(
                          (column) => column.id === columnID
                        )}
                        cards={state.cards}
                        key={columnID}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}

export default DeckEditor
