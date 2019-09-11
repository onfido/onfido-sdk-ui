// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { DocumentOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
  hasCameraError: boolean,
  snapshotBuffer: Array<{
    blob: Blob
  }>,
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

const screenshotQuality: number = 0.95

export default class DocumentLiveCapture extends Component<Props, State> {
  webcam = null
  snapshotIntervalRef: ?IntervalID = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  inactiveError = () => ({
    name: this.props.isUploadFallbackDisabled ? 'CAMERA_INACTIVE_NO_FALLBACK' : 'CAMERA_INACTIVE',
    type: 'warning'
  })

  captureDocument = (blob: Blob, sdkMetadata: Object) => {
    const document = {
      blob,
      sdkMetadata,
      filename: `document_capture.${mimeType(blob)}`
    }
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot = this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = { snapshot, ...document }
    this.props.onCapture(captureData)
  }

  captureDocumentPhoto = () => screenshot(this.webcam, this.captureDocument, screenshotQuality)

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
    const { hasBecomeInactive, hasCameraError } = this.state
    const id1SizeDocuments = new Set([ 'driving_licence', 'national_identity_card' ])
    const documentSize = id1SizeDocuments.has(documentType) ? 'id1Card' : 'id3Card'
    const cameraHeight4K = 2160
    return (
      <div>
        <Camera
          facing='environment'
          idealCameraHeight={ cameraHeight4K }
          className={ className }
          containerClassName={ containerClassName }
          renderTitle={ renderTitle }
          renderError={ renderError }
          translate={ translate }
          webcamRef={ c => this.webcam = c }
          isUploadFallbackDisabled={ isUploadFallbackDisabled }
          trackScreen={ trackScreen }
          onError={ this.handleCameraError }
          renderError={ hasBecomeInactive ?
            <CameraError
              {...{trackScreen, renderFallback}}
              error={this.inactiveError()}
              isDismissible
            /> : null
          }
        >
          { !hasCameraError && <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> }
          <ToggleFullScreen />
          <DocumentOverlay isFullScreen={true} documentSize={documentSize} />
          <div className={style.actions}>
            <button
              type='button'
              aria-label={translate('accessibility.shutter')}
              disabled={hasCameraError}
              onClick={this.captureDocumentPhoto}
              className={style.btn}
            />
          </div>
        </Camera>
      </div>
    )
  }
}
