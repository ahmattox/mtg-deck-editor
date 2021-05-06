import './Column.scss'

import React from 'react'
import classNames from 'classnames'

import { Draggable, Droppable } from 'react-beautiful-dnd'

import Card from './Card'
import { Card as CardType } from './types'

interface Props {
  column: {
    id: string
    cardIDs: string[]
  }
  cards: { [id: string]: CardType }
  index: number
}

const Column: React.FC<Props> = (props) => {
  const { column, index, cards } = props

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="DeckEditorColumn"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className="DeckEditorColumn-heading"
            {...provided.dragHandleProps}
          >
            {column.cardIDs.length} Cards
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
                  {column.cardIDs.map((cardID, index) => {
                    return (
                      <Card card={cards[cardID]} key={cardID} index={index} />
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
