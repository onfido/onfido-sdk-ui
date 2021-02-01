import { h, Component } from 'preact'
import CameraError from '../CameraError'

/* type State = {
  hasError: boolean,
}

type Props = {
  onError: (?string) => void,
  isUploadFallbackDisabled: ?boolean,
} */

export default (WrappedCamera) =>
  class WithFailureHandling extends Component {
    static defaultProps = {
      onError: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    }

    state = {
      hasError: false,
    }

    handleFailure = (error) => {
      this.setState({ hasError: true })
      this.props.onError(error)
    }

    generalError = () => {
      const name = this.props.isUploadFallbackDisabled
        ? 'CAMERA_NOT_WORKING_NO_FALLBACK'
        : 'CAMERA_NOT_WORKING'
      return { name, type: 'error' }
    }

    render() {
      const { hasError } = this.state

      return (
        <WrappedCamera
          {...this.props}
          {...(hasError
            ? {
                renderError: (
                  <CameraError {...this.props} error={this.generalError()} />
                ),
              }
            : {})}
          onFailure={this.handleFailure}
        />
      )
    }
  }
