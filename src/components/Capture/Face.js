import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Photo from '../Photo'
import Liveness from './Liveness'
import Uploader from '../Uploader'
import randomId from '../utils/randomString'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import compose from '../utils/func'

const defaultPayload = {
  method: 'face',
  side: null,
}

class Face extends Component {
  static defaultProps {
    useWebcam: true,
    requestedVariant: 'standard',
  }

  handleCapture = payload => {
    const { actions, nextStep } = this.props
    const id = randomId()
    actions.createCapture({ ...defaultPayload, ...payload, id })
    actions.validateCapture({ id, true, method: 'face' })
    nextStep()
  }

  handleImage = (blob, base64) => this.handleCapture({ blob, base64, variant: 'standard' })

  handleVideoRecorded = (blob, challengeData) => this.handleCapture({ blob, challengeData, variant: 'video' })

  handleError = () => this.props.actions.deleteCaptures('face', null)

  render() {
    const { useWebcam, hasCamera, requestedVariant } = this.props
    return useWebcam && hasCamera ? 
      requestedVariant === 'standard' ?
        <Photo onError={ this.handleError } onCameraShot={ this.handleImage } /> :
        <Liveness onError={ this.handleError } onVideoRecorded={ this.handleVideoRecorded } />
      :
      <Uploader onError={ this.handleError } onUpload={ this.handleImage } />
  }
}

export default compose(
  appendToTracking,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Document)


