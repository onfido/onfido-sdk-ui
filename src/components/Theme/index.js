import { h } from 'preact'
import { compose } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.css'

export const themeWrap = (WrappedComponent) => (props) => {
  const {back, disableNavigation, hideOnfidoLogo} = props

  return (
    <div className={classNames(theme.step, {[theme.noLogo]: hideOnfidoLogo})}>
      <NavigationBar back={back} disabled={disableNavigation} className={theme.navigationBar} />
      <div className={theme.content}><WrappedComponent {...props} /></div>
      <div className={theme.footer} />
    </div>
  )
}

const mapStateToProps = (state, ownProps = {}) => ({
  hideOnfidoLogo: state.globals.hideOnfidoLogo,
  ...ownProps
})

export default compose(connect(mapStateToProps), themeWrap)
