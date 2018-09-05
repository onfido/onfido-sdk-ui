// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '../utils'
import style from './style.css'

type FlowNameType = 'crossDeviceSteps' | 'captureSteps'

type Props = {
  trackScreen: Function,
  i18n: Object,
  error: Object,
  hasBackdrop?: boolean,
  renderFallback: string => React.Node,
}

export default class CameraError extends Component<Props> {

  componentDidMount () {
    if (this.props.error.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  handleFallbackClick = () => {
    if (this.props.error.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  render = () => {
    const { error, hasBackdrop, i18n, renderFallback } = this.props
    return (
      <div className={classNames(style.errorContainer, style[`${error.type}ContainerType`], {
        [style.errorHasBackdrop]: hasBackdrop,
      })}>
        <Error
          className={style.errorMessage}
          i18n={i18n}
          error={error}
          renderInstruction={ str => parseTags(str,
            ({text}) =>
            <span onClick={this.handleFallbackClick} className={style.fallbackLink}>
              {renderFallback(text)}
            </span>
          )}
        />
      </div>
    )
  }
}