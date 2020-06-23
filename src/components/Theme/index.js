import { h } from 'preact'
import { compose } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import NavigationBar from '../NavigationBar'
import theme from './style.css'

export const themeWrap = (WrappedComponent) => (props) => {
  const { back, disableNavigation, hideOnfidoLogo, cobrand } = props
  return (
    <div
      className={classNames(theme.step, {
        [theme.noLogo]: hideOnfidoLogo,
        [theme.cobrandLogo]: cobrand,
      })}
    >
      <NavigationBar
        back={back}
        disabled={disableNavigation}
        className={theme.navigationBar}
      />
      <div className={theme.content}>
        <WrappedComponent {...props} />
      </div>
      <div className={classNames({ [theme.cobrandContainer]: cobrand })}>
        {cobrand && <div className={theme.cobrandName}>{`${cobrand.text} powered by`}</div>}
        <div className={theme.footer} />
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps = {}) => ({
  hideOnfidoLogo: state.globals.hideOnfidoLogo,
  cobrand: state.globals.cobrand,
  ...ownProps
})

export default compose(connect(mapStateToProps), themeWrap)
