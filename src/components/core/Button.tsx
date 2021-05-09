import './Button.scss'

import React from 'react'

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const Button: React.FC<Props> = (props) => {
  const { ...buttonProps } = props

  return <button className="Button" type="button" {...buttonProps} />
}

export default Button
