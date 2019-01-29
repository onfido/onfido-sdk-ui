import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { checkIfHasWebcam } from '../utils'

// It's unlikely that whether or not our device has a camera will change, so we
// speed ourselves up slightly by assuming that the result was whatever our
// previous value was (but we still actually check, and update the value correctly)
// If we are incorrect, then the user will simply see a flicker of a fallback,
// or an empty camera stream, before the correct screen once more
let previousHasCameraCheck = null

export default WrappedComponent =>
  class WithCameraDetection extends PureComponent {
    state = {
      hasCamera: previousHasCameraCheck,
    }

    componentDidMount(){
      this.cameraChecker = setInterval(this.checkCameraSupport, 2000)
      this.checkCameraSupport()
    }

    componentWillUnmount () {
      clearInterval(this.cameraChecker)
    }

    checkCameraSupport = () => checkIfHasWebcam(hasCamera => {
      previousHasCameraCheck = hasCamera
      this.setState({ hasCamera })
    })

    render() {
      return <WrappedComponent {...this.props} hasCamera={this.state.hasCamera} />
    }
  }
