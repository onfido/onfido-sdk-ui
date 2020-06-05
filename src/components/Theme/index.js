import { h } from 'preact'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.css'
import { connect } from 'react-redux'

export const themeWrap = (WrappedComponent) => (props) => {
  const {back, disableNavigation, hideOnfidoLogo} = props

  return (
    <div className={classNames(theme.step, { [theme.noLogo]: hideOnfidoLogo })}>
      <NavigationBar back={back} disabled={disableNavigation} className={theme.navigationBar} />
      <div className={theme.content}><WrappedComponent {...props} /></div>
      <div className={theme.footer} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  hideOnfidoLogo: state.globals.hideOnfidoLogo
})

export default connect(mapStateToProps)(themeWrap)
