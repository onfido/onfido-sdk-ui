import { h, Component } from 'preact'
import classNames from 'classnames'
import { Node } from '../Flow'
import theme from '../Theme/style.css'

export default ({ path, children, isFullScreen = false /* @todo */ }) => (
  <Node path={path}>
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
