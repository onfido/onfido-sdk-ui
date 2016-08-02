import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'

import Uploader from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import isDesktop from '../utils/isDesktop'
import DetectRTC from 'detectrtc'

export default class Capture extends Component {

  state = {
    noDocument: false,
    uploading: false,
    hasWebcamPermission: false,
    hasWebcam: DetectRTC.hasWebcam,
    DetectRTCLoading: true
  }

  isUploadValid = (uploading, noDocument) => {
    this.setState({ uploading, noDocument })
  }

  setUploadState = (uploading) => {
    this.setState({ uploading })
  }

  componentDidMount () {
    events.on('onMessage', (message) => this.handleMessages(message))
    this.checkWebcamSupport()
  }

  checkWebcamSupport () {
    DetectRTC.load( _ => {
      this.setState({
        DetectRTCLoading: false,
        hasWebcam: DetectRTC.hasWebcam
      })
    })
  }

  supportsWebcam (){
    const supportNotYetUnknown = DetectRTC.isGetUserMediaSupported && this.state.DetectRTCLoading;
    return supportNotYetUnknown || this.state.hasWebcam;
  }

  //Fired when there is an active webcam feed
  onUserMedia() {
    this.setState({
      hasWebcam: true,
      hasWebcamPermission: true,
      DetectRTCLoading: false
    })
  }

  handleMessages = (message) => {
    const { actions } = this.props
    if (message.is_document) {
      actions.validCapture({
        data:message.id,
        method:'document'
      })
      this.isUploadValid(false, false)
    } else {
      this.isUploadValid(false, true)
    }
  }

  handleImage = (method, payload) => {
    if (!payload.image) {
      console.warn('Cannot handle a null image')
      return;
    }

    const { actions, socket, documentType } = this.props
    const methods = {
      'document': (methodPayload) => {
        const data = methodPayload.data
        data.valid = false
        data.documentType = documentType
        socket.sendMessage(JSON.stringify(data))
        actions.createCapture(methodPayload)
      },
      'face': (methodPayload) => {
        methodPayload.data.valid = true
        actions.createCapture(methodPayload)
      },
      'home': () => null
    }
    return (methods[method] || methods['home'])({method, data: payload})
  }

  renderCaptureTitle = (useCapture) => {
    const { method } = this.props

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

    let cameraProps = {onUserMedia: () => this.onUserMedia(), ...this.props};
    const captureComponent = useCapture ?
      <Camera {...cameraProps} {...actions} {...this.state} /> :
      <Uploader {...this.props} {...actions} {...this.state} />

    return (
      <div>
        {this.renderCaptureTitle(useCapture)}
        {captureComponent}
      </div>
    )
  }

  render () {
    const {
      method,
      documentCaptured,
      faceCaptured,
      useWebcam
    } = this.props

    const useCapture = (useWebcam && this.supportsWebcam() && isDesktop)
    const hasCaptured = {
      'document': documentCaptured,
      'face': faceCaptured
    }
    const classes = classNames({
      'onfido-camera': useCapture && !hasCaptured[method],
      'onfido-uploader': !useCapture && !hasCaptured[method]
    })
    return (
      <div id='onfido-camera' className={classes}>
        {hasCaptured[method] && <Confirm {...this.props} /> || this.renderCapture(useCapture)}
      </div>
    )
  }
}

Capture.defaultProps = {
  useWebcam: true,
  method: 'document'
}
