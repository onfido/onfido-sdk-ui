import { h, Component } from 'preact'
import Node from '../Flow/Node'
import classNames from 'classnames'
import theme from '../Theme/style.css'

export default ({ name, children, isFullScreen = false /* @todo */ }) => (
  <Node name={name}>
    <div className={classNames(theme.step, {[theme.fullScreenStep]: isFullScreen  })}>
      <div className={classNames(theme.content, {
        [theme.fullScreenContentWrapper]: isFullScreen,
      })}>
        {children}
      </div>
      <div className={theme.footer} />
    </div>
  </Node>
)
