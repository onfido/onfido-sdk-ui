// @flow
import { h, Component } from 'preact'
import CameraError from '../CameraError'

const generalError = { name: 'CAMERA_NOT_WORKING', type: 'error' }

export default WrappedCamera =>
  class WithFailureHandling extends Component {
    state = {
      hasError: false,
    }

    handleFailure = error => {
      this.setState({ hasError: true })
      this.props.onError()
    }

    render() {
      const { i18n, trackScreen, onUploadFallback } = this.props
      const { hasError } = this.state

      return (
        <WrappedCamera
          {...this.props}
          {...(hasError ? {
            renderError: (
              <CameraError
                {...{i18n, trackScreen, onUploadFallback}}
                error={generalError}
              />
            )
          } : {}) }
          onFailure={this.handleFailure}
        />
      )
    }
  }

