import './Section.scss'

import React from 'react'
import classNames from 'classnames'
import { Droppable } from 'react-beautiful-dnd'

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

  return (
    <div className="DeckEditorSection" key={section.id}>
      <h2>
        {section.name} - {cards.length} {cards.length === 1 ? 'Card' : 'Cards'}
      </h2>

      <div className="DeckEditor-deck">
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
