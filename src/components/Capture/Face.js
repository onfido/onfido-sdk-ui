import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Photo from '../Photo'
import Liveness from '../Liveness'
import Uploader from '../Uploader'
import Title from '../Title'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import { compose } from '../utils/func'
import { randomId } from '../utils/string'
import { fileToBlobAndLossyBase64 } from '../utils/file.js'

const defaultPayload = {
  method: 'face',
  side: null,
}

class Face extends Component {
  static defaultProps = {
    useWebcam: true,
    requestedVariant: 'standard',
  }

  componentDidMount() {
    this.props.useFullScreen(true)
  }

  handleCapture = payload => {
    const { actions, nextStep } = this.props
    const id = randomId()
    actions.setCapture({ ...defaultPayload, ...payload, id })
    nextStep()
  }

  handleImage = (blob, base64) => this.handleCapture({ blob, base64, variant: 'standard' })

  handleVideoRecorded = (blob, challengeData) => this.handleCapture({ blob, challengeData, variant: 'video' })

  handleError = () => this.props.actions.deleteCapture()

  handleUploadFallback = file => fileToBlobAndLossyBase64(file,
    (blob, base64) => this.handleCapture({ blob, base64 }),
    () => noop,
  )

  render() {
    const { useWebcam, hasCamera, requestedVariant, i18n, isFullScreen } = this.props
    const title = i18n.t('capture.face.title')
    const props = {
      onError: this.handleError,
      ...this.props,
    }

    const cameraProps = {
      renderTitle: <Title {...{title, isFullScreen}} smaller />,
      containerClassName: style.faceContainer,
      onUploadFallback: this.handleUploadFallback,
      ...props,
    }

    return useWebcam && hasCamera ? 
      requestedVariant === 'standard' ?
        <Photo
          {...cameraProps}
          onCameraShot={ this.handleImage }
          shouldUseFullScreenCamera
        /> :
        <Liveness
          {...cameraProps}
          onVideoRecorded={ this.handleVideoRecorded }
        />
      :
      <Uploader
        {...props}
        title={ i18n.t('capture.face.upload_title') || title }
        instructions={ i18n.t('capture.face.instructions') }
      />
  }
}

export default compose(
  appendToTracking,
  withPrivacyStatement,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Face)


