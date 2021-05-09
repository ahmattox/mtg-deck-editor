import './DeckEditor.scss'

import React, { useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import Controls from './Controls'
import Section from './Section'

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

        {state.deckLayout.sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            state={state}
            index={index}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

export default DeckEditor
