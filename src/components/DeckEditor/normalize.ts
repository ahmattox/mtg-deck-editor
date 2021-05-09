import update from 'immutability-helper'
import { uniqueId, findLastIndex, last, takeRight } from 'lodash'

import { DeckLayout, Section, Column } from './types'

const defaultColumnCount = 6

function columnsForIDs(layout: DeckLayout, columnIDs: string[]): Column[] {
  return layout.columns.filter((column) => columnIDs.includes(column.id))
}

function makeColumn(): Column {
  return {
    id: uniqueId('column-'),
    cardIDs: []
  }
}

function makeColumns(count: number): Column[] {
  return new Array(count).fill('').map(() => makeColumn())
}

function normalizeSection(section: Section, layout: DeckLayout) {
  const columns = columnsForIDs(layout, section.columnIDs)

  const lastPopulatedColumn = findLastIndex(
    columns,
    (column) => column.cardIDs.length > 0
  )

  const desiredLength = Math.max(defaultColumnCount, lastPopulatedColumn + 2)
  const adjustLength = desiredLength - columns.length

  const sectionIndex = layout.sections.findIndex((s) => s.id === section.id)

  if (adjustLength > 0) {
    const newColumns = makeColumns(adjustLength)

    const updatedLayout = update(layout, {
      sections: {
        [sectionIndex]: {
          columnIDs: {
            $push: newColumns.map((column) => column.id)
          }
        }
      }
    })

    updatedLayout.columns = [...layout.columns, ...newColumns]

    return updatedLayout
  } else if (adjustLength < 0) {
    const removeColumnIDs = takeRight(section.columnIDs, adjustLength)

    const updatedLayout = update(layout, {
      sections: {
        [sectionIndex]: {
          columnIDs: {
            $splice: [[section.columnIDs.length + adjustLength]]
          }
        }
      }
    })
    updatedLayout.columns = layout.columns.filter(
      (column) => !removeColumnIDs.includes(column.id)
    )

    return updatedLayout
  }

  return layout
}

export function normalizeLayout(deckLayout: DeckLayout): DeckLayout {
  return deckLayout.sections.reduce(
    (layout, section) => normalizeSection(section, layout),
    deckLayout
  )
}
