import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'

import isDesktop from '../utils/isDesktop'

import Uploader from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'

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
    if(!payload.image) {
      console.warn('Cannot handle a null image')
      return;
    }

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

  renderCaptureTitle = () => {
    const { supportsGetUserMedia, method } = this.props
    const useCapture = (supportsGetUserMedia && isDesktop)

    const methods = {
      'document': () => <DocumentTitle useCapture={useCapture} />,
      'face': () => <FaceTitle useCapture={useCapture} />,
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  renderCapture = (useCapture) => {
    const actions = {
      handleMessages: this.handleMessages,
      handleImage: this.handleImage,
      setUploadState: this.setUploadState
    }

    const captureComponent = useCapture ?
      <Camera {...this.props} {...actions} {...this.state} /> :
      <Uploader {...this.props} {...actions} {...this.state} />

    return (
      <div>
        {this.renderCaptureTitle()}
        {captureComponent}
      </div>
    )
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
        {hasCaptured[method] && <Confirm {...this.props} /> || this.renderCapture(useCapture)}
      </div>
    )
  }

}
