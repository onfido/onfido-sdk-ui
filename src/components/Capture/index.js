import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'

import screenWidth from '../utils/screenWidth'

import Uploader from '../Uploader'
import Camera from '../Camera'
import CameraNavigation from '../CameraNavigation'
import Previews from '../Previews'

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

  renderPreviews = (method) => {
    const { documentCaptures, faceCaptures, actions } = this.props
    const { setDocumentCaptured, setFaceCaptured } = actions
    const captured = this.hasCaptured(method)
    const methods = {
      'document': () => (
        captured ? <Previews method={method} captures={documentCaptures} action={setDocumentCaptured} /> : null
      ),
      'face': () => (
        captured ? <Previews method={method} captures={faceCaptures} action={setFaceCaptured} /> : null
      ),
      'home': () => null
    }
    return (methods[method] || methods['home'])()
  }

  hasCaptured = (method) => {
    const methods = {
      'document': this.props.hasDocumentCaptured,
      'face': this.props.hasFaceCaptured,
      'home': null
    }
    return (methods[method] || methods['home'])
  }

  handleMessages = (message) => {
    const { changeView, actions } = this.props
    if (message.is_document) {
      actions.captureIsValid(message.id)
      actions.setDocumentCaptured(true)
      this.isUploadValid(false, false)
      changeView()
    } else {
      this.isUploadValid(false, true)
    }
  }

  handleImage = (method, payload) => {
    const { actions, socket, documentType, changeView } = this.props
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
        changeView()
      },
      'home': () => null
    }
    return (methods[method] || methods['home'])(payload)
  }

  renderCapture = (useCapture) => {
    const actions = {
      handleMessages: this.handleMessages,
      handleImage: this.handleImage,
      setUploadState: this.setUploadState,
      hasCaptured: this.hasCaptured
    }
    if (useCapture) {
      return (<Camera {...this.props} {...actions} {...this.state} />)
    } else {
      return (<Uploader {...this.props} {...actions} {...this.state} />)
    }
  }

  render () {
    const { supportsGetUserMedia, changeView, method } = this.props
    const useCapture = (supportsGetUserMedia && (screenWidth > 800))
    const captured = this.hasCaptured(method)
    const classes = classNames({
      'onfido-camera': useCapture,
      'onfido-uploader': !useCapture
    })
    return (
      <div id='onfido-camera' className={classes}>
        <CameraNavigation changeView={changeView} />
        {captured && this.renderPreviews(method)}
        {!captured && this.renderCapture(useCapture)}
      </div>
    )
  }

}
