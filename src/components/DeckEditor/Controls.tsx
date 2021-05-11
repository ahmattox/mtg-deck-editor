import './Controls.scss'

import React from 'react'

import * as Core from 'components/core'

import { DeckEditorState } from './useDeckEditorState'

interface Props {
  state: DeckEditorState
}

const Controls: React.FC<Props> = (props) => {
  const { sortBy, removeAllCards } = props.state

  const cards = Object.values(props.state.cards)

  return (
    <div className="DeckEditorControls">
      <h1>Lucky Paper: Deck Editor</h1>

      <div className="DeckEditorControls-details">
        <div>
          <div>{cards.length} Cards</div>
        </div>

        <div className="DeckEditorControls-sortButtons">
          <Core.Button onClick={removeAllCards}>Remove All</Core.Button>
          |&nbsp;
          <Core.Button onClick={() => sortBy('colorGroup')}>Color</Core.Button>
          <Core.Button onClick={() => sortBy('colorGroup')}>
            Mana Value
          </Core.Button>
        </div>
      </div>
    </div>
  )
}

export default Controls
