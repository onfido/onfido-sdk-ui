import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'

import isDesktop from '../utils/isDesktop'

import Uploader from '../Uploader'
import Camera from '../Camera'
import ActionBar from '../ActionBar'
import Confirm from '../Confirm'

export default class Capture extends Component {

  state = {
    noDocument: false,
    uploading: false
  }

  isUploadValid = (uploading, noDocument) => {
    this.setState({ uploading, noDocument })
  }

  setUploadState = (uploading) => {
    this.setState({ uploading })
  }

  componentDidMount () {
    events.on('onMessage', (message) => this.handleMessages(message))
  }

  handleMessages = (message) => {
    const { actions } = this.props
    if (message.is_document) {
      actions.captureIsValid(message.id)
      actions.setDocumentCaptured(true)
      this.isUploadValid(false, false)
    } else {
      this.isUploadValid(false, true)
    }
  }

  handleImage = (method, payload) => {
    const { actions, socket, documentType } = this.props
    const methods = {
      'document': (payload) => {
        payload.isValid = false
        payload.documentType = documentType
        socket.sendMessage(JSON.stringify(payload))
        actions.documentCapture(payload)
      },
      'face': (payload) => {
        payload.isValid = true
        actions.faceCapture(payload)
        actions.setFaceCaptured(true)
      },
      'home': () => null
    }
    return (methods[method] || methods['home'])(payload)
  }

  renderCapture = (useCapture) => {
    const actions = {
      handleMessages: this.handleMessages,
      handleImage: this.handleImage,
      setUploadState: this.setUploadState
    }
    if (useCapture) {
      return ( <Camera {...this.props} {...actions} {...this.state} /> )
    } else {
      return ( <Uploader {...this.props} {...actions} {...this.state} /> )
    }
  }

  render () {
    const { supportsGetUserMedia, method } = this.props
    const useCapture = (supportsGetUserMedia && isDesktop)
    const hasCaptured = {
      'document': this.props.hasDocumentCaptured,
      'face': this.props.hasFaceCaptured
    }
    const classes = classNames({
      'onfido-camera': useCapture && !hasCaptured[method],
      'onfido-uploader': !useCapture && !hasCaptured[method],
    })
    return (
      <div id='onfido-camera' className={classes}>
        <ActionBar {...this.props} />
        {hasCaptured[method] && <Confirm {...this.props} /> || this.renderCapture(useCapture)}
      </div>
    )
  }

}
