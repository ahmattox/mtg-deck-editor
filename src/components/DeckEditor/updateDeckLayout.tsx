import { DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'

import { DeckLayout } from './types'
import { normalizeLayout } from './normalizeLayout'

export function updateDeckLayout(
  result: DropResult,
  deckLayout: DeckLayout
): DeckLayout {
  const { destination, source, type } = result

  let newLayout = deckLayout

  if (
    !destination ||
    (source.droppableId === destination.droppableId &&
      destination.index === source.index)
  ) {
    return newLayout
  }

  if (type === 'card') {
    const sourceColumnIndex = deckLayout.columns.findIndex(
      (column) => column.id === source.droppableId
    )
    const destinationColumnIndex = deckLayout.columns.findIndex(
      (column) => column.id === destination.droppableId
    )

    const cardID = deckLayout.columns[sourceColumnIndex].cardIDs[source.index]

    newLayout = update(
      update(deckLayout, {
        columns: {
          [sourceColumnIndex]: { cardIDs: { $splice: [[source.index, 1]] } }
        }
      }),
      {
        columns: {
          [destinationColumnIndex]: {
            cardIDs: { $splice: [[destination.index, 0, cardID]] }
          }
        }
      }
    )
  } else if (type === 'column') {
    const column = deckLayout.columns[source.index]

    newLayout = update(
      update(deckLayout, {
        columns: {
          $splice: [[source.index, 1]]
        }
      }),
      {
        columns: {
          $splice: [[destination.index, 0, column]]
        }
      }
    )
  }

  return normalizeLayout(newLayout)
}
