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
