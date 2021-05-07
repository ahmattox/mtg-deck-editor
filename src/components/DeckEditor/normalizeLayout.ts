import update from 'immutability-helper'
import { uniqueId, findLastIndex } from 'lodash'

import { DeckLayout } from './types'

const defaultColumnCount = 6

export function normalizeLayout(deckLayout: DeckLayout): DeckLayout {
  let newLayout = deckLayout

  const lastPopulatedColumn = findLastIndex(
    newLayout.columns,
    (column) => column.cardIDs.length > 0
  )

  let insertColumnNumber = Math.max(
    defaultColumnCount - newLayout.columns.length,
    0
  )
  if (newLayout.columns[newLayout.columns.length - 1].cardIDs.length > 0) {
    insertColumnNumber = Math.max(insertColumnNumber, 1)
  }

  const removeColumnNumber =
    deckLayout.columns.length -
    Math.max(lastPopulatedColumn + 2, defaultColumnCount)

  if (insertColumnNumber > 0) {
    newLayout = update(newLayout, {
      columns: {
        $push: new Array(insertColumnNumber).fill('').map(() => ({
          id: uniqueId('column-'),
          cardIDs: []
        }))
      }
    })
  }

  if (removeColumnNumber > 0) {
    newLayout = update(newLayout, {
      columns: {
        $splice: [
          [newLayout.columns.length - removeColumnNumber, removeColumnNumber]
        ]
      }
    })
  }

  return newLayout
}
