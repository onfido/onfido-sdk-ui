// @flow
import * as React from 'react'
import { h, Component } from 'preact';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs-node';
import { screenshot } from '~utils/camera.js'
import { mimeType } from '~utils/blob.js'
import { sendEvent } from '../../Tracker'
import { FaceOverlay } from '../Overlay'
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
  readyForDetection: boolean,
  faceDetectionWarning: ?string,
  isCameraStreamReady: boolean,
  detections: Array<{expressions: Object}>,
}

type Props = {
  translate: (string, ?{}) => string,
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object,
  useMultipleSelfieCapture: boolean,
  faceDetection: ?boolean,
  snapshotInterval: number

}

export default class Selfie extends Component<Props, State> {
  webcam = null
  snapshotIntervalRef: ?IntervalID = null
  detectFacesIntervalRef: ?IntervalID = null

  state: State = {
    hasBecomeInactive: false,
    hasCameraError: false,
    snapshotBuffer: [],
    readyForDetection: false,
    isCameraStreamReady: false,
    detections: [],
    faceDetectionWarning: null
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  handleSelfie = (blob: Blob, sdkMetadata: Object) => {
    if (this.detectFacesIntervalRef) { clearInterval(this.detectFacesIntervalRef) }
    const selfie = { blob, sdkMetadata, filename: `applicant_selfie.${mimeType(blob)}`}
    /* Attempt to get the 'ready' snapshot. But, if that fails, try to get the fresh snapshot - it's better
       to have a snapshot, even if it's not an ideal one */
    const snapshot = this.state.snapshotBuffer[0] || this.state.snapshotBuffer[1]
    const captureData = this.props.useMultipleSelfieCapture ?
      { snapshot, ...selfie } : selfie
    this.props.onCapture(captureData)
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

  takeSelfie = () => screenshot(this.webcam, this.handleSelfie)

  setupSnapshot = () => {
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
    if (this.state.isCameraStreamReady) {
      // const displaySize = {
      //   width: video.offsetWidth,
      //   height: video.offsetHeight
      // }
      // const canvas = this.canvas.base
      // const matchSize = faceapi.matchDimensions(canvas, displaySize)
      const gpgpu = tf.backend()['gpgpu']
      this.detectFacesIntervalRef = setInterval(() => this.detectFaces().then(() => gpgpu.dispose()), 500)
    }
  }

  onUserMedia = async () => {
    this.setupSnapshot()
    await this.startFaceDetection()
  }

  detectFaces = async () => {
    const video = this.webcam && this.webcam.video
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions()
    this.setState({detections})
    this.handleDetections()
  }

  handleDetections = () => {
    const { detections } = this.state
    if (this.state.faceDetectionWarning) { this.setState({faceDetectionWarning: null}) }
    if (!detections.length) {
      console.log('No face found')
      return this.setState({faceDetectionWarning: 'No face found'})
    }
    if (detections.length > 1) {
      console.log('Multiple faces detected')
      this.setState({faceDetectionWarning: 'Multiple faces detected!'})
      return
    }
    const { expressions } = detections[0]
    let faceExpression = Object.keys(expressions).reduce((acc, val) => expressions[acc] > expressions[val] ? acc : val);
    console.log('faceExpression',faceExpression)
    if (faceExpression !== 'neutral') {
      this.setState({faceDetectionWarning: 'Please keep a neutral face'})
    }
    console.log(this.state.faceDetectionWarning)
    return
    // faceapi.draw.drawDetections(this.canvas.base, resizedDetections)
  }

  isCameraStreamReady() {
    //Every 500ms, check if the video element has loaded
    const intervalID = setInterval(() => {
      console.log('checking readyState')
      if (this.webcam && this.webcam.video && this.webcam.video.readyState >= 3) {
        console.log('ready video')
        this.setState({isCameraStreamReady: true})
        clearInterval(intervalID);
      }
    }, 300)
  }

  componentDidMount() {
    if (this.props.faceDetection) {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(`${process.env.PUBLIC_PATH || ''}/models`),
        faceapi.nets.faceExpressionNet.loadFromUri(`${process.env.PUBLIC_PATH || ''}/models`)
      ]).then(this.setState({readyForDetection: true}))
      this.isCameraStreamReady()
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
  }

  render() {
    const { translate, trackScreen, renderFallback, inactiveError} = this.props
    const { hasBecomeInactive, hasCameraError, faceDetectionWarning } = this.state

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
        { faceDetectionWarning && <div className={style.faceDetection}>{ faceDetectionWarning }</div> }
        { !hasCameraError && <Timeout seconds={ 50 } onTimeout={ this.handleTimeout } /> }
        <ToggleFullScreen />
        <FaceOverlay />
        <div className={style.actions}>
          <button
            type="button"
            aria-label={translate('accessibility.shutter')}
            disabled={hasCameraError}
            onClick={this.takeSelfie}
            className={style.btn}
          />
        </div>
      </Camera>
    )
  }
}
