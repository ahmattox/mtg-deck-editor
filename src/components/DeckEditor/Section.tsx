import './Section.scss'

import React from 'react'
import classNames from 'classnames'
import { Droppable } from 'react-beautiful-dnd'

import * as Core from 'components/core'

import { Section as SectionType } from './types'
import { DeckEditorState } from './useDeckEditorState'

import Column from './Column'

interface Props {
  section: SectionType
  state: DeckEditorState
  index: number
}

const Section: React.FC<Props> = (props) => {
  const { section, state, index } = props

  const cards = state.cardsInSection(section)
  const landCount = cards.filter((card) => card.colorGroup === 'Land').length
  const nonLandCount = cards.length - landCount

  return (
    <div className="DeckEditorSection" key={section.id}>
      <div className="DeckEditorSection-heading">
        <h2 className="DeckEditorSection-title">{section.name}</h2>
        <div className="DeckEditorSection-controls">
          <div>
            {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}, {landCount}{' '}
            Lands, {nonLandCount} Spells
          </div>

          <div>
            <Core.Button
              onClick={() => state.sortSection(section, 'colorGroup')}
            >
              Color
            </Core.Button>
            <Core.Button
              onClick={() => state.sortSection(section, 'manaValue')}
            >
              Mana Value
            </Core.Button>
          </div>
        </div>
      </div>

      <div className="DeckEditorSection-cards">
        <Droppable
          droppableId={section.id}
          direction="horizontal"
          type="column"
        >
          {(provided, snapshot) => (
            <div
              className={classNames('DeckEditorSection-group', {
                'is-hovering': snapshot.isDraggingOver
              })}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {section.columnIDs.map((columnID, columnIndex) => (
                <Column
                  key={columnID}
                  column={state.deckLayout.columns.find(
                    (column) => column.id === columnID
                  )}
                  state={state}
                  index={columnIndex}
                  sectionIndex={index}
                />
              ))}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default Section
