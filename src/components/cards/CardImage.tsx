import './CardImage.scss'

import React from 'react'

import { useImageURLs } from 'utils/scryfall'

interface Props {
  children: string
  set?: string
}

const CardImage: React.FC<Props> = (props) => {
  const { children, set } = props

  const imageURLs = useImageURLs(children, set)

  return (
    <img className="CardImage" src={imageURLs.front} width={100} height={140} />
  )
}

export default CardImage
