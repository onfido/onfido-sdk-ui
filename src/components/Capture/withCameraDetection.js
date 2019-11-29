import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { checkIfHasWebcam } from '~utils'

export default WrappedComponent =>
  class WithCameraDetection extends PureComponent {
    state = {
      hasCamera: null,
    }

    componentDidMount(){
      this.cameraChecker = setInterval(this.checkCameraSupport, 2000)
      this.checkCameraSupport()
    }

    componentWillUnmount () {
      clearInterval(this.cameraChecker)
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
