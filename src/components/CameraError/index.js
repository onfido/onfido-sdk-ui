import { h, Component } from 'preact'
import Error from '../Error'
import classNames from 'classnames'
import { parseTags } from '~utils'
import style from './style.scss'

/* type Props = {
  trackScreen: Function,
  error: Object,
  hasBackdrop?: boolean,
  isDismissible?: boolean,
  renderFallback: (string, Function) => React.Node,
}

type State = {
  isDimissed: boolean,
} */

export default class CameraError extends Component {
  state = {
    isDimissed: false,
  }

  componentDidMount() {
    if (this.props.error.type === 'error') {
      this.props.trackScreen('camera_error')
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.error.name !== this.props.error.name) {
      this.setState({ isDimissed: false })
    }
  }

  trackFallbackClick = () => {
    if (this.props.error.type === 'warning') {
      this.props.trackScreen('fallback_triggered')
    }
  }

  handleDismiss = () => this.setState({ isDimissed: true })

  render = () => {
    const { error, hasBackdrop, renderFallback, isDismissible } = this.props
    return (
      !this.state.isDimissed && (
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
              parseTags(str, ({ text }) =>
                renderFallback(text, 'error', this.trackFallbackClick)
              )
            }
          />
        </div>
      )
    )
  }
}
