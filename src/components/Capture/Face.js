import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Selfie from '../Photo/Selfie'
import FaceVideo from '../FaceVideo'
import Uploader from '../Uploader'
import PageTitle from '../PageTitle'
import withCrossDeviceWhenNoCamera from './withCrossDeviceWhenNoCamera'
import GenericError from '../GenericError'
import FallbackButton from '../Button/FallbackButton'
import CustomFileInput from '../CustomFileInput'
import {
  isDesktop,
  addDeviceRelatedProperties,
  getUnsupportedMobileBrowserError,
} from '~utils'
import { compose } from '~utils/func'
import { randomId } from '~utils/string'
import { validateFile } from '~utils/file'
import { getInactiveError } from '~utils/inactiveError'
import { localised } from '~locales'
import withTheme from '../Theme'
import theme from '../Theme/style.scss'
import style from './style.scss'

const defaultPayload = {
  method: 'face',
  variant: 'standard',
  side: null,
}

const WrappedError = withTheme(GenericError)

class Face extends Component {
  static defaultProps = {
    useUploader: false,
    requestedVariant: 'standard',
    uploadFallback: true,
    useMultipleSelfieCapture: true,
    photoCaptureFallback: true,
    snapshotInterval: 500,
  }

  handleCapture = (payload) => {
    const { actions, nextStep, mobileFlow } = this.props
    const id = randomId()
    const faceCaptureData = {
      ...defaultPayload,
      ...payload,
      sdkMetadata: addDeviceRelatedProperties(payload.sdkMetadata, mobileFlow),
      id,
    }
    actions.createCapture(faceCaptureData)
    nextStep()
  }

  handleVideoCapture = (payload) =>
    this.handleCapture({ ...payload, variant: 'video' })

  handleUpload = (blob, imageResizeInfo) =>
    this.handleCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  handleError = (error) => {
    this.props.triggerOnError(error)
    this.props.actions.deleteCapture({ method: 'face' })
  }

  handleFallbackClick = (callback) => {
    this.props.changeFlowTo('crossDeviceSteps')
    callback()
  }

  handleFileSelected = (file) =>
    validateFile(file, this.handleUpload, this.handleError)

  renderUploadFallback = ({ text }) => (
    <CustomFileInput
      className={theme.errorFallbackButton}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture="user"
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = ({ text }, callback) => (
    <FallbackButton
      text={text}
      onClick={() => this.handleFallbackClick(callback)}
    />
  )

  isUploadFallbackDisabled = () => !isDesktop && !this.props.uploadFallback

  render() {
    const {
      hasCamera,
      requestedVariant,
      translate,
      useMultipleSelfieCapture,
      snapshotInterval,
      uploadFallback,
      photoCaptureFallback,
    } = this.props
    const title = translate('selfie_capture.title')
    const props = {
      onError: this.handleError,
      ...this.props,
    }
    const cameraProps = {
      renderTitle: <PageTitle title={title} smaller />,
      cameraClassName: style.faceContainer,
      renderFallback: isDesktop
        ? this.renderCrossDeviceFallback
        : this.renderUploadFallback,
      inactiveError: getInactiveError(this.isUploadFallbackDisabled()),
      isUploadFallbackDisabled: this.isUploadFallbackDisabled(),
      ...props,
    }

    // `hasCamera` is `true`/`false`, or `null` if the logic is still loading
    // its value.
    // We don't want to render while it's loading, otherwise we'll flicker
    // when we finally do get its value
    if (hasCamera === null) return

    const isVideoCompatible = window.MediaRecorder != null

    if (hasCamera && (isVideoCompatible || photoCaptureFallback)) {
      const ariaLabelForSelfieCameraView = translate(
        'selfie_capture.frame_accessibility'
      )
      if (requestedVariant === 'video') {
        return (
          <FaceVideo
            {...cameraProps}
            onVideoCapture={this.handleVideoCapture}
          />
        )
      }

      if (!this.props.useUploader && photoCaptureFallback) {
        return (
          <Selfie
            {...cameraProps}
            onCapture={this.handleCapture}
            useMultipleSelfieCapture={useMultipleSelfieCapture}
            snapshotInterval={snapshotInterval}
            ariaLabel={ariaLabelForSelfieCameraView}
          />
        )
      }
    }

    if (
      !isVideoCompatible &&
      !photoCaptureFallback &&
      requestedVariant === 'video'
    ) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    if ((this.props.useUploader || hasCamera === false) && uploadFallback) {
      return (
        <Uploader
          {...props}
          uploadType="face"
          onUpload={this.handleUpload}
          title={translate('photo_upload.title_selfie') || title}
          instructions={translate('photo_upload.body_selfie')}
        />
      )
    }

    return <GenericError error={{ name: 'INTERRUPTED_FLOW_ERROR' }} />
  }
}

export default compose(
  appendToTracking,
  localised,
  withCrossDeviceWhenNoCamera
)(Face)
