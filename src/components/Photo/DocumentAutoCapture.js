import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import { screenshot } from '~utils/camera'
import { blobToLossyBase64 } from '~utils/blob'
import { randomId } from '~utils/string'
import { DocumentOverlay } from '../Overlay'
import Camera from '../Camera'
import CameraError from '../CameraError'
import { postToBackend } from '~utils/sdkBackend'

const maxAttempts = 3

const requestError = { name: 'REQUEST_ERROR', type: 'error' }

/* type State = {
  hasError: boolean,
}

type Props = {
  urls: Object,
  token: string,
  onValidCapture: Function,
  onError: Function,
  triggerOnError: Function,
  renderFallback: Function,
  trackScreen: Function,
} */

export default class DocumentAutoCapture extends Component {
  webcam = null

  interval

  captureIds = []

  state = {
    hasError: false,
  }

  componentDidMount() {
    this.start()
  }

  componentWillUnmount() {
    this.stop()
  }

  screenshot = () => {
    if (this.captureIds.length < maxAttempts) {
      screenshot(this.webcam, (blob, sdkMetadata) =>
        this.handleScreenshotBlob(blob, sdkMetadata)
      )
    } else {
      console.warn(
        'Screenshotting is slow, waiting for responses before uploading more'
      )
    }
  }

  start() {
    this.stop()
    this.interval = Visibility.every(1000, this.screenshot)
  }

  stop() {
    Visibility.stop(this.interval)
  }

  handleScreenshotBlob = (blob, sdkMetadata) =>
    blobToLossyBase64(
      blob,
      (base64) => this.handleScreenshot(blob, base64, sdkMetadata),
      (error) => console.error('Error converting screenshot to base64', error),
      { maxWidth: 200 }
    )

  handleScreenshot = (blob, base64, sdkMetadata) => {
    if (base64) {
      const id = randomId()
      this.captureIds.push(id)
      this.validate(base64, id, (valid) =>
        valid
          ? this.props.onValidCapture({ blob, base64, id, sdkMetadata })
          : null
      )
    }
  }

  validate = (base64, id, callback) => {
    const { urls, token } = this.props
    const url = urls.detect_document_url
    const data = JSON.stringify({ image: base64, id })
    postToBackend(
      data,
      url,
      token,
      ({ valid }) => {
        this.setProcessed(id)
        callback(valid)
      },
      this.handleValidationError
    )
  }

  setProcessed(id) {
    this.captureIds = this.captureIds.filter((captureId) => captureId === id)
  }

  handleValidationError = (error) => {
    this.setState({ hasError: true })
    this.props.triggerOnError(error)
    this.props.onError()
  }

  render() {
    const { hasError } = this.state
    const { trackScreen, renderFallback } = this.props
    return (
      <Camera
        {...this.props}
        docAutoCaptureFrame={true}
        webcamRef={(c) => (this.webcam = c)}
        renderError={
          hasError ? (
            <CameraError
              error={requestError}
              {...{ trackScreen, renderFallback }}
            />
          ) : undefined
        }
      >
        <DocumentOverlay />
      </Camera>
    )
  }
}
