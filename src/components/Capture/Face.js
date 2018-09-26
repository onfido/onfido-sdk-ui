import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Selfie from '../Photo/Selfie'
import Video from '../Video'
import Uploader from '../Uploader'
import Title from '../Title'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withFlowChangeOnDisconnectCamera from './withFlowChangeOnDisconnectCamera'
import { isDesktop } from '../utils'
import { compose } from '../utils/func'
import { randomId } from '../utils/string'
import { fileToLossyBase64Image } from '../utils/file.js'
import CustomFileInput from '../CustomFileInput'
import { localised } from '../../locales'
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

  renderUploadFallback = text =>
    <CustomFileInput onChange={this.handleUpload} accept="image/*" capture="user">
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = text =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps') }>
      {text}
    </span>

  render() {
    const { useWebcam, hasCamera, requestedVariant, translate, isFullScreen } = this.props
    const title = translate('capture.face.title')
    const props = {
      onError: this.handleError,
      ...this.props,
    }

    const cameraProps = {
      renderTitle: <Title {...{title, isFullScreen}} smaller />,
      containerClassName: style.faceContainer,
      renderFallback: isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback,
      ...props,
    }

    return useWebcam && hasCamera ?
      requestedVariant === 'video' ?
        <Video
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
        title={ translate('capture.face.upload_title') || title }
        instructions={ translate('capture.face.instructions') }
      />
  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Face)
