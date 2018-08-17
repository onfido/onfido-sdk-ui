// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import type { CameraType } from './CameraTypes'

type Props = {
  onTimedOut: void => void,
} & CameraType

type State = {
  hasTimedOut: boolean
}

type Options = {
  seconds: number,
  error: Object,
  renderAction: ?(void => React.node),
  hasBackdrop: ?boolean,
}

const defaultError = { name: 'CAMERA_INACTIVE', type: 'warning' }

const withInactivityCheck = (WrappedComponent, { seconds = 10, error = defaultError, renderAction, hasBackdrop }: Options = {}) =>
  class CameraWithInactivityCheck extends Component<Props, State> {
    timeoutId = null

    static defaultProps: Props = {
      onTimedOut: () => {},
    }

    state: State = {
      hasTimedOut: false,
    }

    componentWillUpdate() {
      const { hasGrantedPermission } = this.props;
      if (hasGrantedPermission && !this.timeoutId) {
        this.clearInactivityTimeout()
        this.timeoutId = setTimeout(() => this.setState({hasTimedOut: true}), seconds * 1000)
      }
    }

    clearInactivityTimeout = () => clearTimeout(this.timeoutId)

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...(!this.props.hasError && this.state.hasTimedOut ? {
            hasError: true,
            cameraError: error,
            cameraErrorRenderAction: () => renderAction(this.props),
            cameraErrorHasBackdrop: hasBackdrop,
          } : {}) }
        />
      )
    }
  }

export default withInactivityCheck

