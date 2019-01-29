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
import { randomId } from '~utils/string'
import CustomFileInput from '../CustomFileInput'
import GenericError from '../crossDevice/GenericError'
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
    uploadFallback: true,
    useMultipleSelfieCapture: false,
    snapshotInterval: 1000,
  }

  handleCapture = payload => {
    const { actions, nextStep } = this.props
    const id = randomId()
    actions.createCapture({ ...defaultPayload, ...payload, id })
    nextStep()
  }

  handleVideoCapture = payload => this.handleCapture({ ...payload, variant: 'video' })

  handleUpload = blob => this.handleCapture({ blob })

  handleError = () => this.props.actions.deleteCapture()

  renderUploadFallback = text =>
    <CustomFileInput onChange={this.handleUpload} accept="image/*" capture="user">
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = text =>
    <span onClick={() => this.props.changeFlowTo('crossDeviceSteps') }>
      {text}
    </span>

  isUploadFallbackDisabled = () => !isDesktop && !this.props.uploadFallback

  inactiveError = () => {
    const name = this.isUploadFallbackDisabled() ? 'CAMERA_INACTIVE_NO_FALLBACK' : 'CAMERA_INACTIVE'
    return { name, type: 'warning' }
  }

  render() {
    const { useWebcam, hasCamera, requestedVariant, translate, useMultipleSelfieCapture, snapshotInterval } = this.props
    const title = translate('capture.face.title')
    const props = {
      onError: this.handleError,
      ...this.props,
    }

    const cameraProps = {
      renderTitle: <Title title={title} smaller />,
      containerClassName: style.faceContainer,
      renderFallback: isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback,
      inactiveError: this.inactiveError(),
      isUploadFallbackDisabled: this.isUploadFallbackDisabled(),
      ...props,
    }

    // `hasCamera` is `true`/`false`, or `null` if the logic is still loading
    // its value.
    // We don't want to render while it's loading, otherwise we'll flicker
    // when we finally do get its value
    if (hasCamera === null) return

    return useWebcam && hasCamera ?
      requestedVariant === 'video' ?
        <Video
          {...cameraProps}
          onVideoCapture={ this.handleVideoCapture }
        /> :
        <Selfie
          {...cameraProps}
          onCapture={ this.handleCapture }
          useMultipleSelfieCapture={ useMultipleSelfieCapture }
          snapshotInterval={ snapshotInterval }
        />
      :
      props.uploadFallback ?
        <Uploader
          {...props}
          onUpload={ this.handleUpload }
          title={ translate('capture.face.upload_title') || title }
          instructions={ translate('capture.face.instructions') }
          />
      :
        <GenericError error={{name: 'GENERIC_CLIENT_ERROR'}}/>

  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withFlowChangeOnDisconnectCamera,
)(Face)
