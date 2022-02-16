import { h, Component } from 'preact'
import Webcam from 'react-webcam-onfido'
import { screenshot } from '~utils/camera'
import { mimeType } from '~utils/blob'
import { getInactiveError } from '~utils/inactiveError'
import { DocumentOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import { sendEvent } from '../../Tracker'
import Spinner from '../Spinner'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import style from './style.scss'

import type { SdkMetadata } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type { HandleCaptureProp, RenderFallbackProp } from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type Props = {
  children?: h.JSX.Element
  className?: string
  containerClassName?: string
  documentType?: DocumentTypes
  isUploadFallbackDisabled: boolean
  onCapture: HandleCaptureProp
  renderFallback: RenderFallbackProp
  renderTitle?: h.JSX.Element
} & WithTrackingProps

type State = {
  hasAllowedCameraAccess: boolean
  hasBecomeInactive: boolean
  hasCameraError: boolean
  isCapturing: boolean
}

const IDEAL_CAMERA_WIDTH_IN_PX = 1080 // Full HD 1080p

export default class DocumentLiveCapture extends Component<Props, State> {
  private webcam?: Webcam

  state = {
    hasAllowedCameraAccess: false,
    hasBecomeInactive: false,
    hasCameraError: false,
    isCapturing: false,
  }

  handleUserMediaReady = (): void => {
    this.setState({ hasAllowedCameraAccess: true })
  }

  handleTimeout = (): void => this.setState({ hasBecomeInactive: true })

  handleCameraError = (): void => this.setState({ hasCameraError: true })

  captureDocument = (blob: Blob, sdkMetadata: SdkMetadata): void => {
    const documentCapture: CapturePayload = {
      blob,
      sdkMetadata,
      filename: `document_capture.${mimeType(blob)}`,
      isPreviewCropped: true,
    }
    this.props.onCapture(documentCapture)
    this.setState({ isCapturing: false })
  }

  captureDocumentPhoto = (): void => {
    if (!this.webcam) {
      return
    }

    this.setState({ isCapturing: true })
    sendEvent('Taking live photo of document')
    screenshot(this.webcam, this.captureDocument, 'image/jpeg')
  }

  componentWillUnmount(): void {
    this.setState({ isCapturing: false })
  }

  render(): h.JSX.Element {
    const {
      children,
      containerClassName,
      documentType,
      isUploadFallbackDisabled,
      renderFallback,
      renderTitle,
      trackScreen,
    } = this.props

    const {
      hasAllowedCameraAccess,
      hasBecomeInactive,
      hasCameraError,
      isCapturing,
    } = this.state

    return (
      <div className={style.container}>
        {this.state.isCapturing ? (
          <Spinner />
        ) : (
          <Camera
            facing="environment"
            docLiveCaptureFrame
            idealCameraWidth={IDEAL_CAMERA_WIDTH_IN_PX}
            containerClassName={containerClassName}
            renderTitle={renderTitle}
            webcamRef={(ref) => ref && (this.webcam = ref)}
            isUploadFallbackDisabled={isUploadFallbackDisabled}
            trackScreen={trackScreen}
            onUserMedia={this.handleUserMediaReady}
            onError={this.handleCameraError}
            renderFallback={renderFallback}
            renderError={
              hasBecomeInactive ? (
                <CameraError
                  {...{ trackScreen, renderFallback }}
                  error={getInactiveError(isUploadFallbackDisabled)}
                  isDismissible
                />
              ) : null
            }
            buttonType="photo"
            onButtonClick={this.captureDocumentPhoto}
            isButtonDisabled={hasCameraError || isCapturing}
            fallbackToDefaultWidth
          >
            {hasAllowedCameraAccess && !hasCameraError && (
              <Timeout seconds={10} onTimeout={this.handleTimeout} />
            )}
            <ToggleFullScreen />
            <DocumentOverlay documentType={documentType} />
            {children}
          </Camera>
        )}
      </div>
    )
  }
}
