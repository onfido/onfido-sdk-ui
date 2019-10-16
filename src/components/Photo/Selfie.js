// @flow
import * as React from 'react'
import { h, Component } from 'preact';
import * as faceapi from 'face-api.js';
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
}

type Props = {
  translate: (string, ?{}) => string,
  onCapture: Function,
  renderFallback: Function,
  trackScreen: Function,
  inactiveError: Object,
  useMultipleSelfieCapture: boolean,
  faceDetection: boolean,
  snapshotInterval: number,
  readyForDetection: boolean,
  isCameraStreamReady: boolean,
  detections: Array
}

const BoundingBox = () => <canvas />


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
    detections: []
  }

  handleTimeout = () => this.setState({ hasBecomeInactive: true })

  handleCameraError = () => this.setState({ hasCameraError: true })

  handleSelfie = (blob: Blob, sdkMetadata: Object) => {
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
      const video = this.webcam.video
      const displaySize = {
        width: video.offsetWidth || 300,
        height: video.offsetHeight || 300
      }
      const canvas = faceapi.createCanvas({width: video.offsetWidth, height: video.offsetHeight});
      video.append(canvas)
      faceapi.matchDimensions(canvas, displaySize)
      setTimeout(this.detectFaces, 100)
      this.detectFacesIntervalRef = setInterval(this.detectFaces, 500)
    }
  }

  onUserMedia = async () => {
    this.setupSnapshot()
    await this.startFaceDetection()
  }

  detectFaces = async () => {
    const detections = await faceapi.detectAllFaces(this.webcam.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 128 }))
    .withFaceExpressions().withAgeAndGender()
    this.setState({detections})
  }

  handleDetections = () => {
    const video = this.webcam.video
    this.state.detections.map((face, i) => {
      console.log('face', face)
      const drawOptions = {
        label: `Age: ${Math.floor(face.detection.age)}`,
        boxColor: 'Red',
        drawLabelOptions: {
          anchorPosition: 'BOTTOM_RIGHT',
          backgroundColor: 'rgba(0, 0, 0, 1)',
          fontColor: 'Yellow'
        }
      }
      const box = {
        x: face.detection.box.x,
        y: face.detection.box.y,
        width: face.detection.box.width,
        height: face.detection.box.height
      }
      console.log(box.x, box.y, box.width, box.height)
    })
  }

  isCameraStreamReady() {
    //Every 500ms, check if the video element has loaded
    const intervalID = setInterval(() => {
      console.log('checking readyState')
      if(this.webcam && this.webcam.video && this.webcam.video.readyState >= 3) {
        console.log('ready video')
        this.setState({isCameraStreamReady: true})
        clearInterval(intervalID);
      }
    }, 500)
  }

  componentDidMount() {
    if (this.props.faceDetection) {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(`${process.env.PUBLIC_PATH}/models`),
        faceapi.nets.faceExpressionNet.loadFromUri(`${process.env.PUBLIC_PATH}/models`),
        faceapi.nets.tinyYolov2.loadFromUri(`${process.env.PUBLIC_PATH}/models`),
        faceapi.nets.ageGenderNet.loadFromUri(`${process.env.PUBLIC_PATH}/models`)
      ]).then(this.setState({readyForDetection: true}))
      this.isCameraStreamReady()
    }
  }

  async componentDidUpdate(previousProps) {
    if (this.props.faceDetection && this.state.isCameraStreamReady) {
      await this.startFaceDetection()
    }
    if (this.state.detections.length) {
      this.handleDetections()
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
    const { hasBecomeInactive, hasCameraError } = this.state

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
        <BoundingBox />
        { !hasCameraError && <Timeout seconds={ 10 } onTimeout={ this.handleTimeout } /> }
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
