import './Column.scss'

import React from 'react'
import classNames from 'classnames'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { Column as ColumnType } from './types'
import { DeckEditorState } from './useDeckEditorState'

import Card from './Card'

interface Props {
  column: ColumnType
  state: DeckEditorState
  index: number
  sectionIndex: number
}

const Column: React.FC<Props> = (props) => {
  const { column, index, sectionIndex, state } = props

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="DeckEditorColumn"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className={classNames('DeckEditorColumn-heading', {
              'is-empty': column.cardIDs.length === 0
            })}
            {...provided.dragHandleProps}
          >
            {column.cardIDs.length}{' '}
            {column.cardIDs.length === 1 ? 'Card' : 'Cards'}
          </div>

          <Droppable droppableId={column.id} type="card">
            {(provided, snapshot) => (
              <div
                className={classNames('DeckEditorColumn-cards', {
                  'is-hovering': snapshot.isDraggingOver
                })}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div>
                  {column.cardIDs.map((cardID, cardIndex) => {
                    return (
                      <Card
                        key={cardID}
                        card={state.cards[cardID]}
                        state={state}
                        index={cardIndex}
                        columnIndex={index}
                        sectionIndex={sectionIndex}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}

export default Column
