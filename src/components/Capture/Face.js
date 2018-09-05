import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Selfie from '../Photo/Selfie'
import Liveness from '../Liveness'
import Uploader from '../Uploader'
import Title from '../Title'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import { compose } from '../utils/func'
import { randomId } from '../utils/string'
import { fileToLossyBase64Image } from '../utils/file.js'
import style from './style.css'

const defaultPayload = {
  method: 'face',
  variant: 'standard',
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
    actions.createCapture({ ...defaultPayload, ...payload, id })
    nextStep()
  }

  handleVideoCapture = payload => this.handleCapture({ ...payload, variant: 'video' })

  handleUpload = file => fileToLossyBase64Image(file,
    base64 => this.handleCapture({ blob: file, base64 }),
    () => {})

  handleError = () => this.props.actions.deleteCapture()

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
      onUploadFallback: this.handleUpload,
      method: 'face',
      ...props,
    }

    return useWebcam && hasCamera ?
      requestedVariant === 'video' ?
        <Liveness
          {...cameraProps}
          onVideoCapture={ this.handleVideoCapture }
        /> :
        <Selfie
          {...cameraProps}
          onCapture={ this.handleCapture }
        />
      :
      <Uploader
        {...props}
        onUpload={ this.handleUpload }
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
