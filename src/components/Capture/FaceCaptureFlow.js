import { h, Component } from 'preact'

import VideoIntro from '../Video/Intro'
import FaceCapture from './Face'
import withCameraDetection from './withCameraDetection'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import { compose } from '~utils/func'

class FaceCaptureFlow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      displayView: "intro",
    }
  }

  displayFaceCaptureStep = () => {
    this.setState({
      displayView: "faceCapture"
    })
  }

  render() {
    const { hasCamera, requestedVariant, trackScreen } = this.props
    if (hasCamera === null) return false

    if (hasCamera && requestedVariant === 'video' && this.state.displayView === "intro") {
      return <VideoIntro trackScreen={ trackScreen } continueFlow={ this.displayFaceCaptureStep } />
    }

    return <FaceCapture { ...this.props } />
  }

}

export default compose(
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(FaceCaptureFlow)
