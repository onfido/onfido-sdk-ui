import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { checkIfHasWebcam } from '~utils'

export default WrappedComponent =>
  class WithCameraDetection extends PureComponent {
    state = {
      hasCamera: null,
    }

    componentDidMount(){
      // TODO: lines 15, 20 has been commented out temporarily as workaround for
      //       a bug in Safari 13 that only allows for one call to enumerate devices
      //       see https://bugs.webkit.org/show_bug.cgi?id=209580
      // this.cameraChecker = setInterval(this.checkCameraSupport, 2000)
      this.checkCameraSupport()
    }

    componentWillUnmount () {
      // TODO: lines 15, 20 has been commented out temporarily as workaround (see above TODO)
      // clearInterval(this.cameraChecker)
    }

    checkCameraSupport = () => checkIfHasWebcam(hasCamera => {
      this.props.actions.setDeviceHasCameraSupport(hasCamera)
      this.setState({ hasCamera })
    })

    render() {
      const { hasCamera } = this.state

      // while checking if we have a camera or not, don't render anything
      // otherwise we'll see a flicker, after we do work out what's what
      if (hasCamera === null) return null

      return <WrappedComponent {...this.props} hasCamera={this.state.hasCamera} />
    }
  }
