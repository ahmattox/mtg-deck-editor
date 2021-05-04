import './CardHover.scss'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { useIsTouchDevice } from 'utils/useIsTouchDevice'
import { useImageURLs } from 'utils/scryfall'

interface Props {
  card: string
  set?: string
  children: React.ReactNode
}

/**
 * Hook to add a card hover, showing an image of a card when mousing over an
 * element. Pass all the returned props to an element and render the "portal"
 * somewhere adjacent to it.
 *
 * Front and back faces will be fetched for cards with "//" in the name.
 */
export const useCardHover = (card: string, set?: string) => {
  const [visible, setVisible] = useState(false)
  const [cursorPosition, setCursorPosition] = useState([0, 0])
  const [clientCursorPosition, setClientCursorPosition] = useState([0, 0])

  const isTouchDevice = useIsTouchDevice(true)

  const imageURLs = useImageURLs(card, set)
  const isDoubleFaced = imageURLs.back != null

  const renderCardImage =
    typeof document !== 'undefined' &&
    visible &&
    (isTouchDevice || (cursorPosition[0] > 0 && cursorPosition[1] > 0))

  const portal = renderCardImage
    ? ReactDOM.createPortal(
        isTouchDevice ? (
          <div
            className={classNames('CardHover-modal', {
              'CardHover-modal--doubleFaced': isDoubleFaced
            })}
            onClick={(event) => {
              event.preventDefault()
              setVisible(false)
            }}
          >
            <img className="CardHover-modalImage" src={imageURLs.front} />
            {imageURLs.back && (
              <img className="CardHover-modalImage" src={imageURLs.back} />
            )}
          </div>
        ) : (
          <div
            className={classNames('CardHover-hover', {
              'CardHover-hover--doubleFaced': isDoubleFaced
            })}
            style={{ top: cursorPosition[1], left: cursorPosition[0] }}
          >
            <div
              className={classNames('CardHover-hoverContent', {
                'CardHover-hoverContent--up':
                  clientCursorPosition[1] > window.innerHeight - 300,
                'CardHover-hoverContent--left':
                  clientCursorPosition[0] >
                  window.innerWidth - (imageURLs.back ? 480 : 240)
              })}
            >
              <img className="CardHover-hoverImage" src={imageURLs.front} />
              {imageURLs.back && (
                <img className="CardHover-hoverImage" src={imageURLs.back} />
              )}
            </div>
          </div>
        ),
        document.getElementById('card-hover-overlay')!
      )
    : null

  return {
    hoverProps: isTouchDevice
      ? {
          onClick: () => setVisible(true)
        }
      : {
          onMouseEnter: () => setVisible(true),
          onMouseLeave: () => setVisible(false),
          onMouseMove: (event: React.MouseEvent) => {
            setCursorPosition([event.pageX, event.pageY])
            setClientCursorPosition([event.clientX, event.clientY])
          }
        },
    portal
  }
}

export const UnstyledCardHover: React.FC<Props> = (props) => {
  const { card, set, children } = props

  const { hoverProps, portal } = useCardHover(card, set)

  return (
    <>
      <div {...hoverProps}>{children}</div>
      {portal}
    </>
  )
}

const CardHover: React.FC<Props> = (props) => {
  const { card, set, children } = props

  const { hoverProps, portal } = useCardHover(card, set)

  return (
    <>
      <span className="CardHover" {...hoverProps}>
        {children}
      </span>
      {portal}
    </>
  )
}

export default CardHover
