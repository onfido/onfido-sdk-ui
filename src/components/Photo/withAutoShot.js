// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import Camera from '../Camera'
import { shoot } from '../utils/camera.js'

const maxAttempts = 3

const serverError = { name: 'SERVER_ERROR', type: 'error' }

export default Camera =>
  class PhotoWithAutoShot extends Component {
    camera = null
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

    start() {
      this.stop()
      this.interval = Visibility.every(1000, this.camera.shoot)
    }

    stop() {
      Visibility.stop(this.interval)
    }

    updatedShot(id, valid) {
      const { shots } = this.state
      const update = { valid: !!valid, processed: true }
      return shots.map(shot => shot.id === id ? { ...shot, ...update } : shot)
    }

    unprocessedAttempts = () => this.state.shots.filter(({ processed }) => !processed)

    failedAttempts = () => this.state.shots.filter(({ valid }) => valid === false)

    handleCameraShot(blob, base64) {
      if (this.unprocessedAttempts().length < maxAttempts) {
        const shot = { id, image: base64 }
        this.setState({ shots: [...this.state.shots, shot] })
        this.validateShot(id, blob, base64)
      } else {
        console.warn('Server response is slow, waiting for responses before uploading more')
      }
    }

    validateShot(id, blob, base64) {
      const { token, onValidShot, onError } = this.props
      postToBackend(JSON.stringify({ id, image: base64 }), token, ({ valid }) => {
        if (valid) {
          onValidShot(blob, base64, id)
        }

        this.setState({ shots: this.updatedShot(id, valid) }, () => {
          if (this.failedAttempts().length >= maxAttempts) {
            this.handleValidationError()
          }
        })
      }, this.handleValidationError)
    }

    handleValidationError() {
      this.setState({ hasError: true })
      this.props.onError()
    }

    render() {
      return (
        <Camera
          {...this.props}
          {...(this.state.hasError ? { cameraError: serverError } : {}) }
          onCameraShot={this.handleCameraShot}
          ref={ node => this.camera = node }
        />
      )
    }
  }
