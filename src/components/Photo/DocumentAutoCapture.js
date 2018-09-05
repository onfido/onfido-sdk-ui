// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import { screenshot } from '../utils/camera.js'
import { DocumentOverlay } from '../Overlay'
import Camera from '../Camera'
import CameraError from '../CameraError'
import { randomId } from '../utils/string'
import { postToBackend } from '../utils/sdkBackend';

const maxAttempts = 3

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Capture = {
  id: string,
  base64: string,
  valid?: boolean,
  processed?: boolean,
}

type State = {
  hasError: boolean,
  captures: Capture[],
}

type Props = {
  token: string,
  onValidCapture: Function,
  onError: Function,
  i18n: Object,
  renderFallback: Function,
  trackScreen: Function,
  useFullScreen: Function,
}

export default class DocumentAutoCapture extends Component<Props, State> {
  webcam = null

  interval: ?Visibility

  state: State = {
    hasError: false,
    captures: [],
  }

  componentDidMount () {
    this.start()
  }

  componentWillUnmount () {
    this.stop()
  }

  screenshot = () => screenshot(this.webcam, this.handleScreenshot)

  start() {
    this.stop()
    this.interval = Visibility.every(1000, this.screenshot)
  }

  stop() {
    Visibility.stop(this.interval)
  }

  handleScreenshot = (blob: Blob, base64: string) => {
    if (this.unprocessed().length < maxAttempts) {
      const id = randomId()
      const capture: Capture = { id, base64 }
      this.setState({
        captures: [capture, ...this.state.captures].slice(0, maxAttempts),
      })
      this.validate(base64, id, valid =>
        valid ? this.props.onValidCapture({ blob, base64, id }) : null
      )
    } else {
      console.warn('Server response is slow, waiting for responses before uploading more')
    }
  }

  unprocessed = (): Capture[] => this.state.captures.filter(({ processed }) => !processed)

  failed = (): Capture[] => this.state.captures.filter(({ valid, processed }) => processed && !valid)

  validate = (base64: string, id: string, callback: Function) => {
    const { token } = this.props
    const data = JSON.stringify({ image: base64, id })
    postToBackend(data, token, ({ valid }) => {
      this.setProcessed(id, !!valid)
      callback(valid)
    }, this.handleValidationError)
  }

  setProcessed(id: string, valid: boolean) {
    const { captures } = this.state
    const update = { valid: !!valid, processed: true }
    this.setState({
      captures: captures.map(capture => capture.id === id ? ({ ...capture, ...update }) : capture),
    }, () => {
      if (this.failed().length >= maxAttempts) {
        this.handleValidationError()
      }
    })
  }

  handleValidationError = () => {
    this.setState({ hasError: true })
    this.props.onError()
  }

  render() {
    const { hasError } = this.state
    const { i18n, trackScreen, renderFallback } = this.props
    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderError={ hasError ?
            <CameraError
              error={serverError}
              {...{i18n, trackScreen, renderFallback}}
            /> :
            undefined
          }
        >
          <DocumentOverlay />
        </Camera>
      </div>
    )
  }
}
