import { h, ComponentType } from 'preact'
import { PureComponent } from 'preact/compat'
import { checkIfHasWebcam, isSafari131 } from '~utils'

import type { WithCameraDetectionProps } from '~types/hocs'
import type { ReduxProps } from 'components/App/withConnect'

export default function withCameraDetection<P extends ReduxProps>(
  WrappedComponent: ComponentType<WithCameraDetectionProps>
): ComponentType<P> {
  return class WithCameraDetection extends PureComponent<P> {
    state: WithCameraDetectionProps = {
      hasCamera: null,
    }

    private cameraCheckerIntervalId?: number = null

    componentDidMount() {
      // HACK: use of isSafari131 util function is a workaround specifically for
      //       Safari 13.1 bug that incorrectly returns a "videoinput" as "audioinput"
      //       on subsequent calls to enumerateDevices
      //       see https://bugs.webkit.org/show_bug.cgi?id=209580
      if (!isSafari131()) {
        this.cameraCheckerIntervalId = window.setInterval(
          this.checkCameraSupport,
          2000
        )
      }
      this.checkCameraSupport()
    }

    componentWillUnmount() {
      if (this.cameraCheckerIntervalId) {
        clearInterval(this.cameraCheckerIntervalId)
      }
    }

    checkCameraSupport = () =>
      checkIfHasWebcam((hasCamera: boolean) => {
        this.props.actions.setDeviceHasCameraSupport(hasCamera)
        this.setState({ hasCamera })
      })

    render() {
      const { hasCamera } = this.state

      // while checking if we have a camera or not, don't render anything
      // otherwise we'll see a flicker, after we do work out what's what
      if (hasCamera === null) return null

      return (
        <WrappedComponent {...this.props} hasCamera={this.state.hasCamera} />
      )
    }
  }
}
