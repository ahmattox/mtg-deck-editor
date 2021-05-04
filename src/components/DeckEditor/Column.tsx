import './Column.scss'

import React from 'react'
import classNames from 'classnames'

import { Draggable, Droppable } from 'react-beautiful-dnd'

import Card from './Card'

interface Props {
  column: {
    id: string
    cards: {
      name: string
      id: string
    }[]
  }
  index: number
}

const Column: React.FC<Props> = (props) => {
  const { column, index } = props

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
            {column.cards.length} Cards
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
                  {column.cards.map((card, index) => {
                    return <Card card={card} key={card.id} index={index} />
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
