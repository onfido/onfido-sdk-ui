// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import CameraError from '../CameraError'
import { isDesktop } from '../utils/index.js'

const generalError = { name: 'CAMERA_NOT_WORKING', type: 'error' }
const generalErrorNoFallback = { name: 'CAMERA_NOT_WORKING_NO_FALLBACK', type: 'error' }
const renderGeneralError = (noFallback) => {
  return !isDesktop && noFallback ? generalErrorNoFallback : generalError
}

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
              <CameraError {...this.props}
                error={renderGeneralError(this.props.uploadFallbackDisabled)}
              />
            )
          } : {}) }
          onFailure={this.handleFailure}
        />
      )
    }
  }
