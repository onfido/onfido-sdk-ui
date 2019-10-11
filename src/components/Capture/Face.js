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
import CustomFileInput from '../CustomFileInput'
import { isDesktop } from '~utils'
import { compose } from '~utils/func'
import { randomId, upperCase } from '~utils/string'
import { getMobileOSName } from '~utils/detectMobileOS'
import { getInactiveError } from '~utils/inactiveError.js'
import { localised } from '../../locales'
import style from './style.css'

const defaultPayload = {
  method: 'face',
  variant: 'standard',
  side: null
}

class Face extends Component {
  static defaultProps = {
    useWebcam: true,  // FIXME: remove UI tests dependency on useWebcam
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

  handleError = (error) => {
    this.props.triggerOnError(error)
    this.props.actions.deleteCapture()
  }

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
      inactiveError: getInactiveError(this.isUploadFallbackDisabled()),
      isUploadFallbackDisabled: this.isUploadFallbackDisabled(),
      ...props
    }

    // `hasCamera` is `true`/`false`, or `null` if the logic is still loading
    // its value.
    // We don't want to render while it's loading, otherwise we'll flicker
    // when we finally do get its value
    if (hasCamera === null) return

    if (hasCamera) {
      const ariaLabelForSelfieCameraView = translate('accessibility.selfie_camera_view');
      if (requestedVariant === 'video') {
        return (
          <Video
            {...cameraProps}
            onVideoCapture={ this.handleVideoCapture }
            ariaLabel={ ariaLabelForSelfieCameraView }
          />
        )
      }

      // FIXME: remove UI tests dependency on useWebcam
      //        (useWebcam is meant to be used to enable document autocapture feature that is still in beta)
      if (this.props.useWebcam === true) {
        return (
          <Selfie
            {...cameraProps}
            onCapture={ this.handleCapture }
            useMultipleSelfieCapture={ useMultipleSelfieCapture }
            snapshotInterval={ snapshotInterval }
            ariaLabel={ ariaLabelForSelfieCameraView }
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

    if (hasCamera === false && !uploadFallback) {
      return <GenericError error={{ name: `UNSUPPORTED_${upperCase(getMobileOSName())}_BROWSER` }} />
    }

    return <GenericError error={{ name: 'INTERRUPTED_FLOW_ERROR' }} />
  }
}

export default compose(
  appendToTracking,
  localised,
  withPrivacyStatement,
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(Face)
