import { h, Component } from 'preact'
import { checkIfHasWebcam } from '../utils'

export default WrappedComponent =>
  class WithCameraDetection extends Component {
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