import './FlipButton.scss'

import React from 'react'
import classNames from 'classnames'

interface Props {
  isFlipped: boolean
  onCLick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void
}

const FlipButton: React.FC<Props> = (props) => {
  const { isFlipped, onCLick } = props

  return (
    <button
      type="button"
      className={classNames('FlipButton', {
        'FlipButton--flipped': isFlipped
      })}
      onClick={onCLick}
    >
      <svg
        className="FlipButton-icon"
        version="1.1"
        x="0px"
        y="0px"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
      >
        {isFlipped ? (
          <path d="M16.5,8.3c-0.8-1.4-2.2-1.4-3,0L6.9,19.7c-0.8,1.4-0.1,2.6,1.5,2.6h13.2c1.7,0,2.3-1.2,1.5-2.6L16.5,8.3z" />
        ) : (
          <>
            <path d="M12,11.5c-0.8-1.4-2.2-1.4-3,0l-4.1,7.1C4,20,4.7,21.1,6.4,21.1h8.2c1.6,0,2.3-1.2,1.5-2.6L12,11.5z" />

            <path d="M21.1,18.5c-0.8,1.4-2.2,1.4-3,0L14,11.5c-0.8-1.4-0.1-2.6,1.5-2.6h8.2c1.6,0,2.3,1.2,1.5,2.6L21.1,18.5z" />
          </>
        )}
      </svg>
    </button>
  )
}

export default FlipButton
