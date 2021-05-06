import { useMemo } from 'react'

enum CardFace {
  Front = 'front',
  Back = 'back'
}

export function imageURL(cardName: string, set?: string, face?: CardFace) {
  const params = {
    exact: cardName,
    format: 'image',
    version: 'normal'
  } as {
    [key: string]: string
  }

  if (set) {
    params.set = set
  }

  if (face) {
    params.face = face
  }

  return `https://api.scryfall.com/cards/named?${new URLSearchParams(
    params
  ).toString()}`
}

export function imageURLs(
  cardName: string,
  set?: string
): { front: string; back?: string } {
  const faces = {
    front: imageURL(cardName, set)
  } as {
    front: string
    back?: string
  }

  if (cardName?.match(/\/\//)) {
    faces.back = imageURL(cardName, set, CardFace.Back)
  }

  return faces
}

export function useImageURLs(cardName: string, set?: string) {
  return useMemo(() => imageURLs(cardName, set), [cardName, set])
}

function colorGroup(card: { colors: string[]; type_line: string }): string {
  if (card.type_line.match(/\bLand\b/)) {
    return 'Land'
  }
  if (card.colors.length > 1) {
    return 'Multicolor'
  }
  if (card.colors.length === 0) {
    return 'Colorless'
  }
  return card.colors[0]
}

export async function fetchCollection(
  cardNames: string[]
): Promise<
  {
    name: string
    manaValue: number
    colors: [string]
    colorIdentity: string
    colorGroup: string
    imageURIs: unknown
    manaCost: string
    rarity: string
    typeLine: string
  }[]
> {
  const data = {
    identifiers: cardNames.map((cardName) => ({ name: cardName }))
  }

  const response = await fetch('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    cache: 'force-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const json = await response.json()

  return json.data.map((row) => ({
    name: row.name,
    manaValue: row.cmc,
    colors: row.colors,
    colorIdentity: row.color_identity,
    colorGroup: colorGroup(row),
    imageURIs: row.image_uris,
    manaCost: row.mana_cost,
    rarity: row.rarity,
    typeLine: row.type_line
  }))
}
