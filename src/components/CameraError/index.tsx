import { h, Component } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '~utils'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'
import type { ErrorProp, RenderFallbackProp } from '~types/routers'

type Props = {
  error: ErrorProp
  hasBackdrop?: boolean
  isDismissible?: boolean
  renderFallback: RenderFallbackProp
} & WithTrackingProps

type State = {
  isDimissed: boolean
}

export default class CameraError extends Component<Props, State> {
  state = {
    isDimissed: false,
  }

  componentDidMount(): void {
    if (this.props.error.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.error.name !== this.props.error.name) {
      this.setState({ isDimissed: false })
    }
  }

  trackFallbackClick = (): void => {
    if (this.props.error.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  handleDismiss = (): void => this.setState({ isDimissed: true })

  render(): h.JSX.Element | null {
    const { error, hasBackdrop, renderFallback, isDismissible } = this.props

    if (this.state.isDimissed) {
      return null
    }

    return (
      <div
        className={classNames(
          style.errorContainer,
          style[`${error.type}ContainerType`],
          {
            [style.errorHasBackdrop]: hasBackdrop,
          }
        )}
      >
        <Error
          role="alertdialog"
          className={style.errorMessage}
          error={error}
          focusOnMount={true}
          isDismissible={isDismissible}
          onDismiss={this.handleDismiss}
          renderInstruction={(str) =>
            parseTags(str, ({ text, type }) =>
              renderFallback({ text, type }, this.trackFallbackClick)
            )
          }
        />
      </div>
    )
  }
}
