import { h } from 'preact'
import { PureComponent } from 'preact-compat'
import { checkIfHasWebcam } from '../utils'

export default WrappedComponent =>
  class WithCameraDetection extends PureComponent {
    state = {
      hasCamera: undefined,
    }

    componentDidMount(){
      this.cameraChecker = setInterval(this.checkCameraSupport, 2000)
      this.checkCameraSupport()
    }

    componentWillUnmount () {
      clearInterval(this.cameraChecker)
    }

    checkCameraSupport = () => checkIfHasWebcam(hasCamera => this.setState({ hasCamera }))

    render() {
      return <WrappedComponent {...this.props} hasCamera={this.state.hasCamera} />
    }
  }