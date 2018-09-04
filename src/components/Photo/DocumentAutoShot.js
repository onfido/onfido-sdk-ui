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

export default class AutoShot extends Component {
  webcam = null

  interval: ?Visibility

  state = {
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

  handleCameraShot = (blob, base64) => {
    if (this.unprocessedAttempts().length < maxAttempts) {
      const id = randomId()
      const shot = { id, image: base64 }
      this.setState({
        shots: [shot, ...this.state.shots].slice(0, maxAttempts),
      })
      this.validateShot(id, blob, base64)
    } else {
      console.warn('Server response is slow, waiting for responses before uploading more')
    }
  }

  unprocessedAttempts = () => this.state.shots.filter(({ processed }) => !processed)

  failedAttempts = () => this.state.shots.filter(({ valid, processed }) => processed && !valid)

  setValidShot(id, valid) {
    const { shots } = this.state
    const update = { valid: !!valid, processed: true }
    return shots.map(shot => shot.id === id ? ({ ...shot, ...update }) : shot)
  }

  validateShot = (id, blob, base64) => {
    const { token, onValidShot, onError } = this.props
    postToBackend(JSON.stringify({ id, image: base64 }), token, ({ valid }) => {
      if (valid) {
        onValidShot(blob, base64, id)
      }

      this.setState({shots: this.setValidShot(id, valid) }, () => {
        if (this.unprocessedAttempts().length >= maxAttempts) {
          this.handleValidationError()
        }
      })
    }, this.handleValidationError)
  }

  handleValidationError = () => {
    this.setState({ hasError: true })
    this.props.onError()
  }

  render() {
    const { i18n, trackScreen, changeFlowTo, onUploadFallback } = this.props
    const { hasError } = this.state
    return (
      <div>
        <Camera
          {...this.props}
          webcamRef={ c => this.webcam = c }
          renderError={ hasError ? 
            <CameraError
              error={serverError}
              {...{i18n, trackScreen, changeFlowTo, onUploadFallback}}
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
