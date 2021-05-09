import './Layout.scss'

import React from 'react'

import Header from 'components/Header'

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = (props) => {
  const { children } = props

  return (
    <div>
      <Header />

      <main>{children}</main>
    </div>
  )
}

export default Layout
