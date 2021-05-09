import './Controls.scss'

import React from 'react'

import { DeckEditorState } from './useDeckEditorState'

interface Props {
  state: DeckEditorState
}

const Controls: React.FC<Props> = (props) => {
  const { sortByColor, sortByManaValue, removeAllCards } = props.state

  const cards = Object.values(props.state.cards)

  return (
    <div className="DeckEditorControls">
      <h2>Deck Editor</h2>

      <div>
        <div>{cards.length} Cards</div>
      </div>

      <h3>Organize By</h3>
      <div>
        <button
          className="DeckEditorControls-button"
          type="button"
          onClick={sortByColor}
        >
          Color
        </button>
        <button
          className="DeckEditorControls-button"
          type="button"
          onClick={sortByManaValue}
        >
          Mana Value
        </button>
        |&nbsp;
        <button
          className="DeckEditorControls-button"
          type="button"
          onClick={removeAllCards}
        >
          Remove All
        </button>
      </div>
    </div>
  )
}

export default Controls
