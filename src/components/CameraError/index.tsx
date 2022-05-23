import { h, Component } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '~utils'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'
import type { ErrorProp, RenderFallbackProp } from '~types/routers'
import {
  AnalyticsEventProperties,
  ErrorNameToUIAlertMapping,
} from '~types/tracker'

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

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.error.name !== this.props.error.name) {
      this.setState({ isDimissed: false })
    }
  }

  trackFallbackClick = (): void => {
    const { type, name } = this.props.error
    if (type === 'warning') {
      const uiAlertName = ErrorNameToUIAlertMapping[name]
      const properties: AnalyticsEventProperties = uiAlertName
        ? { ui_alerts: { [uiAlertName]: type } }
        : {}
      this.props.trackScreen('fallback_triggered', properties)
    }
  }

  handleDismiss = (): void => this.setState({ isDimissed: true })

  render(): h.JSX.Element | null {
    const {
      error,
      hasBackdrop,
      renderFallback,
      isDismissible,
      trackScreen,
    } = this.props

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
          trackScreen={trackScreen}
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
