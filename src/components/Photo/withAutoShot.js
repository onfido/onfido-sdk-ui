// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import Visibility from 'visibilityjs'
import { shoot } from '../utils/camera.js'
import CameraError from '../CameraError'

const maxAttempts = 3

const serverError = { name: 'SERVER_ERROR', type: 'error' }

export default Photo =>
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
      const { i18n, trackScreen, onUploadFallback } = this.props
      const { hasError } = this.state
      return (
        <Photo
          {...this.props}
          renderError={ hasError ? 
            <CameraError
              error={serverError}
              {...{i18n, trackScreen, onUploadFallback}}
            /> :
            null
          }
          onCameraShot={this.handleCameraShot}
          ref={ node => this.camera = node }
        />
      )
    }
  }
