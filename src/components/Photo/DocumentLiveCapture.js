// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { getInactiveError } from '~utils/inactiveError.js'
import { DocumentOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import { sendEvent } from '../../Tracker'
import Spinner from '../Spinner'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
  hasCameraError: boolean,
  isCapturing: boolean
}

type Props = {
  translate: (string, ?{}) => string,
  onCapture: Function,
  renderFallback: Function,
  isUploadFallbackDisabled: boolean,
  trackScreen: Function,
  documentType: string,
  className: string,
  containerClassName: string,
  renderTitle: Function,
  renderError: Function
}

export default class DocumentLiveCapture extends Component<Props, State> {
  webcam = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    isCapturing: false
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  captureDocument = (blob: Blob, sdkMetadata: Object) => {
    const documentCapture = {
      blob,
      sdkMetadata,
      filename: `document_capture.${mimeType(blob)}`,
      isPreviewCropped: true
    }
    this.props.onCapture(documentCapture)
    this.setState({ isCapturing: false })
  }

  captureDocumentPhoto = () => {
    this.setState({ isCapturing: true })
    sendEvent('Taking live photo of document')
    screenshot(this.webcam, this.captureDocument, 'image/jpeg')
  }

  componentWillUnmount() {
    this.setState({ isCapturing: false })
  }

  render() {
    const {
      translate,
      trackScreen,
      renderFallback,
      isUploadFallbackDisabled,
      className,
      containerClassName,
      renderTitle,
      renderError,
      documentType
    } = this.props
    const { hasBecomeInactive, hasCameraError, isCapturing } = this.state
    const id1SizeDocuments = new Set([ 'driving_licence', 'national_identity_card' ])
    const documentSize = id1SizeDocuments.has(documentType) ? 'id1Card' : 'id3Card'
    const idealCameraHeightInPixels = 1280
    return (
      <div className={style.container}>
        {this.state.isCapturing ? (
          <Spinner />
        ) : (
          <Camera
            facing={{ exact: 'environment' }}
            idealCameraHeight={idealCameraHeightInPixels}
            className={className}
            containerClassName={containerClassName}
            renderTitle={renderTitle}
            renderError={renderError}
            translate={translate}
            webcamRef={c => (this.webcam = c)}
            isUploadFallbackDisabled={isUploadFallbackDisabled}
            trackScreen={trackScreen}
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
          >
            {!hasCameraError && (
              <Timeout seconds={10} onTimeout={this.handleTimeout} />
            )}
            <ToggleFullScreen />
            <DocumentOverlay isFullScreen={true} documentSize={documentSize} />
          </Camera>
        )}
      </div>
    )
  }
}
