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
    actions.setCapture({ ...defaultPayload, ...payload, id })
    nextStep()
  }

  handleImage = (blob, base64) => this.handleCapture({ blob, base64, variant: 'standard' })

  handleVideoRecorded = (blob, challengeData) => this.handleCapture({ blob, challengeData, variant: 'video' })

  handleError = () => this.props.actions.deleteCapture('face')

  render() {
    const { useWebcam, hasCamera, requestedVariant } = this.props
    const title = i18n.t('capture.face.title')
    const moreProps = { onError: this.handleError, title, ...this.props }

    return useWebcam && hasCamera ? 
      requestedVariant === 'standard' ?
        <Photo {...moreProps} onCameraShot={ this.handleImage } /> :
        <Liveness {...moreProps} onVideoRecorded={ this.handleVideoRecorded } />
      :
      <Uploader
        {...moreProps}
        title={ i18n.t('capture.face.upload_title') || title }
        instructions={ i18n.t('capture.face.instructions') }
      />
  }
}

export default compose(
  appendToTracking,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Document)


