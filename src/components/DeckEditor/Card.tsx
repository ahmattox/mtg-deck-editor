import './Card.scss'

import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

import CardImage from 'components/cards/CardImage'
import classNames from 'classnames'

export interface props {
  card: {
    id: string
    name: string
  }
  index: number
}

const Card: React.FC<props> = (props) => {
  const { card, index } = props

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={classNames('DeckEditorCard', {
            'DeckEditorCard--dragging': snapshot.isDragging
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <CardImage>{card.name}</CardImage>
        </div>
      )}
    </Draggable>
  )
}

export default Card
