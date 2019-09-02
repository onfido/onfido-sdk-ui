// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { sendEvent } from '../../Tracker'
import { DocumentOverlay } from '../Overlay'
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

  addSnapshotToBuffer = (blob: Blob, sdkMetadata: Object) => {
    // Always try to get the older snapshot to ensure
    // it's different enough from the user initiated capture
    this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
      snapshotBuffer: [newestSnapshot, { blob, sdkMetadata, filename: `document_snapshot.${mimeType(blob)}` }]
    }))
  }

  takeSnapshot = () => {
    this.webcam && screenshot(this.webcam, this.addSnapshotToBuffer)
  }

  captureDocumentPhoto = () => screenshot(this.webcam, this.captureDocument)

  startTakingSnapshots = () => {
    sendEvent('Starting Live Document Capture')
    const snapshotInterval = 1000
    setTimeout(this.takeSnapshot, snapshotInterval / 4)
    this.snapshotIntervalRef = setInterval(
      this.takeSnapshot,
      snapshotInterval
    )
  }

  stopTakingSnapshots = () => {
    if (this.snapshotIntervalRef) {
      clearInterval(this.snapshotIntervalRef)
    }
  }

  componentDidUpdate() {
    if (this.state.hasBecomeInactive) {
      this.stopTakingSnapshots()
    }
  }

  componentWillUnmount() {
    this.stopTakingSnapshots()
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
    const { hasBecomeInactive, hasCameraError } = this.state
    const id1SizeDocuments = new Set([ 'driving_licence', 'national_identity_card' ])
    const documentSize = id1SizeDocuments.has(documentType) ? 'id1Card' : 'id3Card'
    const heightAt1080p = 1080
    return (
      <div>
        <Camera
          facing='environment'
          idealCameraHeight={ heightAt1080p }
          className={ className }
          containerClassName={ containerClassName }
          renderTitle={ renderTitle }
          renderError={ renderError }
          translate={ translate }
          webcamRef={ c => this.webcam = c }
          onUserMedia={ this.startTakingSnapshots }
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
          <DocumentOverlay documentSize={documentSize} />
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
