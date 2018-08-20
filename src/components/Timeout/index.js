// @flow
import * as React from 'react'
import { h, Component } from 'preact'

type Props = {
  seconds: number,
  onTimedout: void => void,
}

type State = {
  hasTimedOut: boolean
}

export default class Timeout extends Component<Props, State> {
  timeoutId = null

  static defaultProps: Props = {
    onTimeout: () => {},
  }

  state: State = {
    hasTimedOut: false,
  }

  componentWillUpdate() {
    if (!this.timeoutId) {
      this.clearInactivityTimeout()
      this.timeoutId = setTimeout(() => this.setState({ hasTimedOut: true }), this.props.seconds * 1000)
    }
  }

  componentWillUnmount() {
    this.clearInactivityTimeout()
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasTimedOut && this.state.hasTimedOut) {
      this.props.onTimeout()
    }
  }

  clearInactivityTimeout = () => clearTimeout(this.timeoutId)

  render() {
    return null
  }
}


