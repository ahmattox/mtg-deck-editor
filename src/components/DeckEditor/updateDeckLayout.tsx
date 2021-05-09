import { DropResult } from 'react-beautiful-dnd'
import update from 'immutability-helper'

import { DeckLayout } from './types'
import { normalizeLayout } from './normalize'

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
    const sourceParentIndex = deckLayout.columns.findIndex(
      (column) => column.id === source.droppableId
    )
    const destinationParentIndex = deckLayout.columns.findIndex(
      (column) => column.id === destination.droppableId
    )

    const cardID = deckLayout.columns[sourceParentIndex].cardIDs[source.index]

    newLayout = update(
      update(deckLayout, {
        columns: {
          [sourceParentIndex]: { cardIDs: { $splice: [[source.index, 1]] } }
        }
      }),
      {
        columns: {
          [destinationParentIndex]: {
            cardIDs: { $splice: [[destination.index, 0, cardID]] }
          }
        }
      }
    )
  } else if (type === 'column') {
    const sourceParentIndex = deckLayout.sections.findIndex(
      (column) => column.id === source.droppableId
    )
    const destinationParentIndex = deckLayout.sections.findIndex(
      (column) => column.id === destination.droppableId
    )

    const cardID =
      deckLayout.sections[sourceParentIndex].columnIDs[source.index]

    newLayout = update(
      update(deckLayout, {
        sections: {
          [sourceParentIndex]: { columnIDs: { $splice: [[source.index, 1]] } }
        }
      }),
      {
        sections: {
          [destinationParentIndex]: {
            columnIDs: { $splice: [[destination.index, 0, cardID]] }
          }
        }
      }
    )
  }

  return normalizeLayout(newLayout)
}
