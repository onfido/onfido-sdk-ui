// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { sendEvent } from '../../Tracker'
import { FaceOverlay } from '../Overlay'
import { ToggleFullScreen } from '../FullScreen'
import Timeout from '../Timeout'
import Camera from '../Camera'
import CameraError from '../CameraError'
import CameraButton from '../Button/CameraButton'
import style from './style.css'

type State = {
  hasBecomeInactive: boolean,
  hasCameraError: boolean,
  snapshotBuffer: Array<{
    blob: Blob
  }>,
  isCapturing: boolean,
  readyForDetection: boolean,
  faceDetectionWarning: ?string,
  isCameraStreamReady: boolean,
  detectingFaces: boolean
}

type Props = {
  translate: (string, ?{}) => string,
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object,
  useMultipleSelfieCapture: boolean,
  snapshotInterval: number,
  faceDetection: ?boolean
}

export default class SelfieCapture extends Component<Props, State> {
  webcam = null
  snapshotIntervalRef: ?IntervalID = null
  detectFacesIntervalRef: ?IntervalID = null
  checkCameraStream: ?IntervalID = null
  model: Object = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
    isCapturing: false,
    readyForDetection: false,
    isCameraStreamReady: false,
    faceDetectionWarning: null,
    detectingFaces: false,
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  handleSelfie = (blob: Blob, sdkMetadata: Object) => {
    const selfie = { blob, sdkMetadata, filename: `applicant_selfie.${mimeType(blob)}` }
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot = this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = this.props.useMultipleSelfieCapture ?
      { snapshot, ...selfie } : selfie
    this.props.onCapture(captureData)
    this.setState({ isCapturing: false })
  }

  handleSnapshot = (blob: Blob, sdkMetadata: Object) => {
    // Always try to get the older snapshot to ensure
    // it's different enough from the user initiated selfie
    this.setState(({ snapshotBuffer: [, newestSnapshot] }) => ({
      snapshotBuffer: [newestSnapshot, { blob, sdkMetadata, filename: `applicant_snapshot.${mimeType(blob)}` }]
    }))
  }

  takeSnapshot = () =>
    this.webcam && screenshot(this.webcam, this.handleSnapshot)

  takeSelfie = () => {
    this.setState({ isCapturing: true })
    screenshot(this.webcam, this.handleSelfie)
  }


  setupSnapshots = () => {
    if (this.props.useMultipleSelfieCapture) {
      sendEvent('Starting Multiple Selfie Capture')
      setTimeout(this.takeSnapshot, this.props.snapshotInterval / 4)
      this.snapshotIntervalRef = setInterval(
        this.takeSnapshot,
        this.props.snapshotInterval
      );
    }
  }

  startFaceDetection = async () => {
    if (this.state.readyForDetection && !this.state.detectingFaces) {
      this.detectFacesIntervalRef = setInterval(this.detectFaces, 1000)
      this.setState({detectingFaces: true})
    }
  }

  onUserMedia = async () => {
    this.setupSnapshots()
    await this.startFaceDetection()
  }

  detectFaces = async () => {
    const video = this.webcam && this.webcam.video

    if (this.model) {
      await this.model.detect(video)
        .then((results) => this.handleDetections(results))
    }
  }

  setDetectionWarning = (faceDetectionWarning: ?string) => {
    this.setState({faceDetectionWarning})
  }

  handleDetections = (detections: Array<{class: string, score: number}>) => {
    if (!detections || detections.length < 1) {
      return this.setDetectionWarning('No face found')
    }

    const faces = detections.filter(detection => detection.class === 'person' && detection.score >= 0.55).length;
    
    if (faces > 1) {
      return this.setDetectionWarning('Multiple faces detected')
    } else if (faces === 0) {
      return this.setDetectionWarning('No face found')
    }

    this.setDetectionWarning(null)
  }

  checkCameraStreamReady() {
    //Every 500ms, check if the video element has loaded
    this.checkCameraStream = setInterval(() => {
      if (this.webcam && this.webcam.video && this.webcam.video.readyState >= 3) {
        this.setState({isCameraStreamReady: true})
        clearInterval(this.checkCameraStream);
      }
    }, 300)
  }

  componentDidMount() {
    if (this.props.faceDetection) {
      this.checkCameraStreamReady()
      cocoSsd.load()
        .then(model => {
          this.model = model
          this.setState({readyForDetection: true})
      })
    }
  }

  async componentDidUpdate() {
    if (this.props.faceDetection && this.state.isCameraStreamReady) {
      await this.startFaceDetection()
    }
  }

  componentWillUnmount() {
    if (this.snapshotIntervalRef) {
      clearInterval(this.snapshotIntervalRef)
    }
    if (this.detectFacesIntervalRef) {
      clearInterval(this.detectFacesIntervalRef)
    }
    if (this.checkCameraStream) {
      clearInterval(this.checkCameraStream)
    }
  }

  render() {
    const { translate, trackScreen, renderFallback, inactiveError } = this.props
    const { hasBecomeInactive, hasCameraError, isCapturing, faceDetectionWarning } = this.state

    return (
      <Camera
        {...this.props}
        webcamRef={ c => this.webcam = c }
        onUserMedia={ this.onUserMedia }
        onError={ this.handleCameraError }
        renderError={ hasBecomeInactive ?
          <CameraError
            {...{trackScreen, renderFallback}}
            error={inactiveError}
            isDismissible
          /> : null
        }
      >
        { !hasCameraError && <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> }
        <ToggleFullScreen />
        <FaceOverlay />
        <div className={style.actions}>
        { faceDetectionWarning && <div className={style.faceDetection}>{ faceDetectionWarning }</div> }
          <CameraButton
            ariaLabel={translate('accessibility.shutter')}
            disabled={hasCameraError || isCapturing}
            onClick={this.takeSelfie}
            className={style.btn}
          />
        </div>
      </Camera>
    )
  }
}
