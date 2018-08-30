// @flow
import { h, Component } from 'preact'

export default WrappedCamera =>
  class WithFailureHandling extends Component {
    state = {
      hasError: false,
    }

    handleFailure = error => {
      this.setState({
        hasError: true,
        cameraError: { name: 'CAMERA_NOT_WORKING', type: 'error' }
      })
    }

    render() {
      return <WrappedCamera {...this.props} onFailure={this.handleFailure} />
    }
  }

