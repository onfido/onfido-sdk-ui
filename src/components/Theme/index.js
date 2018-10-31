import { h } from 'preact'

import NavigationBar from '../NavigationBar'
import theme from './style.css'

export const themeWrap = (WrappedComponent) => (props) => {
  const {back, disableNavigation} = props

  return (
    <div className={theme.step}>
      <NavigationBar back={back} disabled={disableNavigation} className={theme.navigationBar} />
      <div className={theme.content}><WrappedComponent {...props} /></div>
      <div className={theme.footer} />
    </div>
  )
}
