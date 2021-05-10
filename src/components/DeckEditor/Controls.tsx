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
      <h2>Deck Editor</h2>

      <div>
        <div>{cards.length} Cards</div>
      </div>

      <h3>Organize By</h3>
      <div>
        <Core.Button onClick={() => sortBy('colorGroup')}>Color</Core.Button>
        <Core.Button onClick={() => sortBy('colorGroup')}>
          Mana Value
        </Core.Button>
        |&nbsp;
        <Core.Button onClick={removeAllCards}>Remove All</Core.Button>
      </div>
    </div>
  )
}

export default Controls
