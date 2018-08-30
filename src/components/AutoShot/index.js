// @flow
import * as React from 'react'
import { h } from 'preact'
import Visibility from 'visibilityjs'

import type { CameraType } from '../Camera/CameraTypes'
import Camera from '../Camera'
import { shoot } from '../utils/camera.js'

const maxAttempts = 3

const serverError = { name: 'SERVER_ERROR', type: 'error' }

export default class AutoShot extends React.Component<CameraType> {
  webcam = null
  interval: ?Visibility

  state = {
    hasError: false,
    shots: [],
  }

  componentDidMount () {
    this.startShooting()
  }

  componentWillUnmount () {
    this.stopShooting()
  }

  startShooting() {
    this.stopShooting()
    this.interval = Visibility.every(1000, () => shoot(this.webcam, this.handleShot))
  }

  stopShooting() {
    Visibility.stop(this.interval)
  }

  handleShot(canvas) {
    canvasToBase64Images(canvas, (base64, lossyBase64) => {
      this.validateShot(base64toBlob(base64), lossyBase64)
    })
  }

  handleValidationError() {
    this.setState({ hasError: true })
    this.props.onError()
  }

  hasExceededAttempts() {
    const { shots } = this.state
    return shots.filter(({ valid }) => valid === false).length >= maxAttempts
  }

  updatedShotValidity(id, valid) {
    const { shots } = this.state
    return shots.map(shot => shot.id === id ? { ...shot, valid: !!valid } : shot)
  }

  validateShot(blob, base64) {
    const { token, onValidShot, onError } = this.props
    const shot = { id, image: base64 }
    const data = JSON.stringify(shot)

    this.setState({
      shots: [...this.state.shots, shot],
    })

    postToBackend(data, token, ({ valid }) => {
      if (valid) {
        onValidShot(blob, base64, id)
      }

      this.setState({ shots: this.updatedShotValidity(id, valid) }, () =>
        if (this.hasExceededAttempts()) {
          this.handleValidationError()
        }
      )
    }, this.handleValidationError)
  }

  render() {
    return (
      <Camera {...this.props}
        {...(hasError ? { cameraError: serverError } : {}) }
        webcamRef={ c => this.webcam = c }
      />
    )
  }
}
