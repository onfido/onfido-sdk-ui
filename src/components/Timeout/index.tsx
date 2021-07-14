import { h, Component } from 'preact'

type Props = {
  seconds: number
  onTimeout: () => void
}

type State = {
  hasTimedOut: boolean
}

export default class Timeout extends Component<Props, State> {
  private timeoutId?: number

  state = {
    hasTimedOut: false,
  }

  componentDidMount(): void {
    if (!this.timeoutId) {
      this.clearInactivityTimeout()
      this.timeoutId = window.setTimeout(
        () => this.setState({ hasTimedOut: true }),
        this.props.seconds * 1000
      )
    }
  }

  componentWillUnmount(): void {
    this.clearInactivityTimeout()
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (!prevState.hasTimedOut && this.state.hasTimedOut) {
      this.props.onTimeout()
    }
  }

  clearInactivityTimeout = (): void => clearTimeout(this.timeoutId)

  render(): h.JSX.Element | null {
    return null
  }
}
