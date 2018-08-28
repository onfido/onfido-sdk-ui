import { h } from 'preact'

import NavigationBar from '../NavigationBar'
import theme from './style.css'

export const themeWrap = (WrappedComponent) => (props) => {
  const {back, isFullScreen, disableNavigation} = props

  return (
    <div className={theme.step}>
      <NavigationBar {...{back, isFullScreen}} disabled={disableNavigation} className={theme.navigationBar} />
      <div className={theme.content}><WrappedComponent {...props} /></div>
      <div className={theme.footer} />
    </div>
  )
}
