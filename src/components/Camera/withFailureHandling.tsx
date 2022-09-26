import { h, Component, ComponentType } from 'preact'
import { WebcamProps } from '~webcam/react-webcam'
import CameraError from '../CameraError'

import type { CameraProps } from '~types/camera'
import type { WithFailureHandlingProps, WithTrackingProps } from '~types/hocs'
import type { ErrorProp } from '~types/routers'

type Props = CameraProps & WebcamProps & WithTrackingProps

type State = {
  hasError: boolean
}

export default <P extends Props>(
  WrappedCamera: ComponentType<P>
): ComponentType<P & WithFailureHandlingProps> =>
  class WithFailureHandling extends Component<
    P & WithFailureHandlingProps,
    State
  > {
    state = {
      hasError: false,
    }

    handleFailure = (error: Error) => {
      this.setState({ hasError: true })
      this.props.onError && this.props.onError(error)
    }

    generalError = (): ErrorProp => {
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
