import { Component, h } from 'preact'
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
import { randomId } from '~utils/string'
import { ImageValidationTypes, validateFile } from '~utils/file'
import { getInactiveError } from '~utils/inactiveError'
import { localised } from '~locales'
import withTheme from '../Theme'
import theme from '../Theme/style.scss'
import style from './style.scss'
import {
  WithLocalisedProps,
  WithPageIdProps,
  WithTrackingProps,
} from '~types/hocs'
import { StepComponentFaceProps } from '~types/routers'
import { CapturePayload } from '~types/redux'
import { ImageResizeInfo } from '~types/commons'
import { ParsedTag } from '~types/locales'
import { CameraProps } from '~types/camera'

const defaultPayload = {
  method: 'face',
  variant: 'standard',
  side: null,
}

const WrappedError = withTheme(GenericError)

type FaceProps = {
  useMultipleSelfieCapture: boolean
  snapshotInterval: number
} & StepComponentFaceProps &
  WithLocalisedProps &
  WithTrackingProps &
  WithPageIdProps

class Face extends Component<FaceProps> {
  static defaultProps: Partial<FaceProps> = {
    useUploader: false,
    requestedVariant: 'standard',
    uploadFallback: true,
    useMultipleSelfieCapture: true,
    photoCaptureFallback: true,
    pageId: undefined,
  }

  handleCapture = (payload: CapturePayload) => {
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

  handleVideoCapture = (payload: CapturePayload) =>
    this.handleCapture({ ...payload, variant: 'video' })

  handleUpload = (blob: Blob, imageResizeInfo?: ImageResizeInfo) =>
    this.handleCapture({
      blob,
      sdkMetadata: { captureMethod: 'html5', imageResizeInfo },
    })

  handleError = (error: ImageValidationTypes) => {
    this.props.triggerOnError({ response: { message: error } })
    this.props.actions.deleteCapture({ method: 'face' })
  }

  handleFallbackClick = (callback?: () => void) => {
    this.props.changeFlowTo('crossDeviceSteps')
    callback && callback()
  }

  handleFileSelected = (file: Blob) =>
    validateFile(file, this.handleUpload, this.handleError)

  renderUploadFallback = ({ text }: ParsedTag) => (
    <CustomFileInput
      className={theme.errorFallbackButton}
      onChange={this.handleFileSelected}
      accept="image/*"
      capture="user"
    >
      {text}
    </CustomFileInput>
  )

  renderCrossDeviceFallback = ({ text }: ParsedTag, callback?: () => void) => (
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
      uploadFallback,
      photoCaptureFallback,
      pageId,
    } = this.props
    const title = translate('selfie_capture.title')

    const cameraProps: Omit<CameraProps, 'buttonType'> = {
      ...this.props,
      renderTitle: <PageTitle title={title} smaller />,
      renderFallback: isDesktop
        ? this.renderCrossDeviceFallback
        : this.renderUploadFallback,
      isUploadFallbackDisabled: this.isUploadFallbackDisabled(),
    }

    const withLocalisedProps: WithLocalisedProps = {
      ...this.props,
    }

    const withTrackingProps: WithTrackingProps = {
      ...this.props,
    }

    const stepComponentFaceProps: StepComponentFaceProps = {
      ...this.props,
    }

    // `hasCamera` is `true`/`false`, or `null` if the logic is still loading
    // its value.
    // We don't want to render while it's loading, otherwise we'll flicker
    // when we finally do get its value
    if (hasCamera === null) return

    const isVideoCompatible = window.MediaRecorder != null

    if (hasCamera && (isVideoCompatible || photoCaptureFallback)) {
      if (requestedVariant === 'video') {
        return (
          <FaceVideo
            {...cameraProps}
            {...withLocalisedProps}
            {...withTrackingProps}
            {...stepComponentFaceProps}
            cameraClassName={style.faceContainer}
            onVideoCapture={this.handleVideoCapture}
            inactiveError={getInactiveError(this.isUploadFallbackDisabled())}
            onRedo={console.log}
          />
        )
      }

      if (!this.props.useUploader && photoCaptureFallback) {
        return (
          <Selfie
            {...cameraProps}
            {...withLocalisedProps}
            {...withTrackingProps}
            onCapture={this.handleCapture}
            useMultipleSelfieCapture={useMultipleSelfieCapture}
            inactiveError={getInactiveError(this.isUploadFallbackDisabled())}
            pageId={pageId}
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
          {...this.props}
          onError={this.handleError}
          uploadType="face"
          onUpload={this.handleUpload}
          title={translate('photo_upload.title_selfie') || title}
          instructions={translate('photo_upload.body_selfie')}
          pageId={'SelfieUpload'}
        />
      )
    }

    return <GenericError error={{ name: 'INTERRUPTED_FLOW_ERROR' }} />
  }
}

export default appendToTracking(localised(withCrossDeviceWhenNoCamera(Face)))
