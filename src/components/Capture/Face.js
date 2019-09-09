import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Selfie from '../Photo/Selfie'
import Video from '../Video'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import withPrivacyStatement from './withPrivacyStatement'
import withCameraDetection from './withCameraDetection'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import GenericError from '../GenericError'
import FallbackButton from '../Button/FallbackButton'
import { isDesktop } from '~utils'
import { compose } from '~utils/func'
import { randomId } from '~utils/string'
import CustomFileInput from '../CustomFileInput'
import { localised } from '../../locales'
import style from './style.css'

const defaultPayload = {
  method: 'face',
  variant: 'standard',
  side: null
}

class Face extends Component {
  static defaultProps = {
    useWebcam: true,  // FIXME: remove code dependency on useWebcam once PR #762 for UI tests refactor is merged into 'development' branch
    requestedVariant: 'standard',
    uploadFallback: true,
    useMultipleSelfieCapture: false,
    snapshotInterval: 1000
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

  handleFallbackClick = (callback) => {
    this.props.changeFlowTo('crossDeviceSteps')
    callback()
  }

  renderUploadFallback = text =>
    <CustomFileInput onChange={this.handleUpload} accept="image/*" capture="user">
      {text}
    </CustomFileInput>

  renderCrossDeviceFallback = (text, callback) =>
    <FallbackButton text={text} onClick={() => this.handleFallbackClick(callback)} />

  isUploadFallbackDisabled = () => !isDesktop && !this.props.uploadFallback

  inactiveError = () => {
    const name = this.isUploadFallbackDisabled() ? 'CAMERA_INACTIVE_NO_FALLBACK' : 'CAMERA_INACTIVE'
    return { name, type: 'warning' }
  }

  render() {
    const { hasCamera, requestedVariant, translate, useMultipleSelfieCapture, snapshotInterval, uploadFallback } = this.props
    const title = translate('capture.face.title')
    const props = {
      onError: this.handleError,
      ...this.props
    }
    const cameraProps = {
      renderTitle: <PageTitle title={title} smaller />,
      containerClassName: style.faceContainer,
      renderFallback: isDesktop ? this.renderCrossDeviceFallback : this.renderUploadFallback,
      inactiveError: this.inactiveError(),
      isUploadFallbackDisabled: this.isUploadFallbackDisabled(),
      ...props
    }

    // `hasCamera` is `true`/`false`, or `null` if the logic is still loading
    // its value.
    // We don't want to render while it's loading, otherwise we'll flicker
    // when we finally do get its value
    if (hasCamera === null) return

    if (hasCamera) {
      if (requestedVariant === 'video') {
        return (
          <Video
            {...cameraProps}
            onVideoCapture={ this.handleVideoCapture }
          />
        )
      }

      // FIXME: remove code dependency on useWebcam once PR #762 for UI tests refactor is merged into 'development' branch
      //        (useWebcam is meant to be used to enable document autocapture feature that is still in beta)
      if (this.props.useWebcam === true) {
        return (
          <Selfie
            {...cameraProps}
            onCapture={ this.handleCapture }
            useMultipleSelfieCapture={ useMultipleSelfieCapture }
            snapshotInterval={ snapshotInterval }
          />
        )
      }
    }

    if ((!this.props.useWebcam || hasCamera === false) && uploadFallback) {
      return (
        <Uploader
          {...props}
          onUpload={ this.handleUpload }
          title={ translate('capture.face.upload_title') || title }
          instructions={ translate('capture.face.instructions') }
          />
      )
    }

    return <GenericError error={{name: 'INTERRUPTED_FLOW_ERROR'}} />
  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(Face)
