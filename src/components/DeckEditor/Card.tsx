import './Card.scss'

import React from 'react'
import classNames from 'classnames'
import { Draggable } from 'react-beautiful-dnd'

import { Card as CardType } from './types'
import { DeckEditorState } from './useDeckEditorState'

import CardImage from 'components/cards/CardImage'

export interface props {
  card: CardType
  state: DeckEditorState
  index: number
  columnIndex: number
  sectionIndex: number
}

const Card: React.FC<props> = (props) => {
  const { state, card, index } = props

  const onClick = () => {
    state.toggleSideboard(card.id)
  }

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
          onClick={onClick}
        >
          <CardImage>{card.name}</CardImage>
        </div>
      )}
    </Draggable>
  )
}

export default Card
