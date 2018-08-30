import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import AutoShot from '../AutoShot'
import Uploader from '../Uploader'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import compose from '../utils/func'
import randomId from '../utils/randomString'

const defaultPayload = {
  method: 'document',
}

class Document extends Component {
  static defaultProps {
    side: 'front',
  }

  componentWillUpdate(nextProps) {
    const { useWebcam, hasCamera, allowCrossDeviceFlow, changeFlowTo } = this.props
    if (useWebcam && nextProps.hasCamera !== hasCamera && !nextProps.hasCamera && allowCrossDeviceFlow) {
      changeFlowTo('crossDeviceSteps', 0, true)
    }
  }

  createCapture = payload => {
    const { documentType, actions, side } = this.props

    actions.createCapture({
      ...defaultPayload,
      ...payload,
      documentType: documentType === 'poa' ? 'unknown' : documentType,
      side,
      id: payload.id || randomId(),
    })
  }

  handleImage = (blob, base64) => this.createCapture({ blob, base64 })

  handleValidAutoShot = (blob, base64, id) => this.createCapture({ blob, base64, id })

  handleError = () => this.props.actions.deleteCaptures('document', this.props.side)

  render() {
    const { useWebcam, hasCamera } = this.props
    return useWebcam && hasCamera ? 
      <AutoShot onError={ this.handleError } onValidShot={ this.handleValidAutoShot } /> :
      <Uploader onError={ this.handleError } onUpload={ this.handleImage } />
  }
}

export default compose(
  appendToTracking,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Document)
