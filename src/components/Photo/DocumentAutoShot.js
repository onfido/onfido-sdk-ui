// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import { shoot } from '../utils/camera.js'
import { DocumentOverlay } from '../Overlay'
import Camera from '../Camera'
import CameraError from '../CameraError'
import { randomId } from '../utils/string'
import { postToBackend } from '../utils/sdkBackend';

const maxAttempts = 3

const serverError = { name: 'SERVER_ERROR', type: 'error' }

type Shot = {
  id: string,
  base64: string,
  valid?: boolean,
  processed?: boolean,
}

type State = {
  hasError: boolean,
  shots: Shot[],
}

type Props = {
  token: string,
  onValidShot: (blob: Blob, base64: string, id: string) => void,
  onError: Function,

  // @todo, remove
  i18n: Object,
  onUploadFallback: Function,
  changeFlowTo: Function,
  method: string,
  trackScreen: Function,
  useFullScreen: Function,
}

export default class AutoShot extends Component<Props, State> {
  webcam = null

  interval: ?Visibility

  state: State = {
    hasError: false,
    shots: [],
  }

  componentDidMount () {
    this.start()
  }

  componentWillUnmount () {
    this.stop()
  }

  shoot = () => shoot(this.webcam, this.handleCameraShot)

  start() {
    this.stop()
    this.interval = Visibility.every(1000, this.shoot)
  }

  stop() {
    Visibility.stop(this.interval)
  }

  handleCameraShot = (blob: Blob, base64: string) => {
    if (this.unprocessed().length < maxAttempts) {
      const id = randomId()
      const shot: Shot = { id, base64 }
      this.setState({
        shots: [shot, ...this.state.shots].slice(0, maxAttempts),
      })
      this.validate(base64, id, valid =>
        valid ? this.props.onValidShot(blob, base64, id) : null
      )
    } else {
      console.warn('Server response is slow, waiting for responses before uploading more')
    }
  }

  unprocessed = (): Shot[] => this.state.shots.filter(({ processed }) => !processed)

  failed = (): Shot[] => this.state.shots.filter(({ valid, processed }) => processed && !valid)

  validate = (base64: string, id: string, callback: Function) => {
    const { token } = this.props
    const data = JSON.stringify({ image: base64, id })
    postToBackend(data, token, ({ valid }) => {
      this.setProcessed(id, !!valid)
      callback(valid)
    }, this.handleValidationError)
  }

  setProcessed(id: string, valid: boolean) {
    const { shots } = this.state
    const update = { valid: !!valid, processed: true }
    this.setState({
      shots: shots.map(shot => shot.id === id ? ({ ...shot, ...update }) : shot),
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
    const { i18n, trackScreen, changeFlowTo, onUploadFallback, method } = this.props
    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderError={ hasError ?
            <CameraError
              error={serverError}
              {...{i18n, trackScreen, changeFlowTo, onUploadFallback, method}}
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
