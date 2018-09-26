// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '../utils'
import style from './style.css'

type Props = {
  trackScreen: Function,
  i18n: Object,
  error: Object,
  hasBackdrop?: boolean,
  isDismissible?: boolean,
  renderFallback: string => React.Node,
}

type State = {
  isDimissed: boolean,
}

export default class CameraError extends Component<Props, State> {
  state = {
    isDimissed: false,
  }

  componentDidMount () {
    if (this.props.error.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.error.name !== this.props.error.name) {
      this.setState({ isDimissed: false })
    }
  }

  handleFallbackClick = () => {
    if (this.props.error.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  handleDismiss = () => this.setState({ isDimissed: true })

  render = () => {
    const { error, hasBackdrop, i18n, renderFallback, isDismissible } = this.props
    return !this.state.isDimissed && (
      <div className={classNames(style.errorContainer, style[`${error.type}ContainerType`], {
        [style.errorHasBackdrop]: hasBackdrop,
      })}>
        <Error
          className={style.errorMessage}
          i18n={i18n}
          error={error}
          isDismissible={isDismissible}
          onDismiss={this.handleDismiss}
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