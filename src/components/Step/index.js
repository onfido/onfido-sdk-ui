import { h, Component } from 'preact'
import NavigationBar from '../NavigationBar'
import classNames from 'classnames'
import theme from '../Theme/style.css'
import { initializeI18n } from '../../locales'

const defaultI18n = initializeI18n()

export default ({ children, i18n = defaultI18n /* @todo */, disableNavigation = false, isFullScreen = false /* @todo */ }) => (
  <div className={classNames(theme.step, {[theme.fullScreenStep]: isFullScreen  })}>
    <NavigationBar {...{i18n, isFullScreen}} disabled={disableNavigation} className={theme.navigationBar} />
    <div className={classNames(theme.content, {
      [theme.fullScreenContentWrapper]: isFullScreen,
    })}>
      {children}
    </div>
    <div className={theme.footer} />
  </div>
)
