// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import CameraError from '../CameraError'

const generalError = { name: 'CAMERA_NOT_WORKING', type: 'error' }

type State = {
  hasError: boolean,
}

type Props = {
  onError: ?string => void,
}

export default <WrappedProps: *>(
  WrappedCamera: React.ComponentType<WrappedProps>
): React.ComponentType<WrappedProps & Props> =>
  class WithFailureHandling extends Component<WrappedProps, State> {
    static defaultProps = {
      onError: () => {},
    }

    state = {
      hasError: false,
    }

    handleFailure = (error) => {
      this.setState({ hasError: true })
      this.props.onError(error)
    }

    render() {
      const { hasError } = this.state

      return (
        <WrappedCamera
          {...this.props}
          {...(hasError ? {
            renderError: (
              <CameraError
                {...this.props}
                error={generalError}
              />
            )
          } : {}) }
          onFailure={this.handleFailure}
        />
      )
    }
  }
