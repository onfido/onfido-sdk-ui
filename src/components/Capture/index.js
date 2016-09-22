import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'

import { Uploader } from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import isDesktop from '../utils/isDesktop'
import DetectRTC from 'detectrtc'
import style from './style.css'

const functionalSwitch = (key, hash) => (hash[key] || (_=>null))()

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

  validateCapture(id, valid){
    const { actions, method } = this.props
    actions.validateCapture({ id, valid, method})
  }

  maxAutomaticCaptures = 3

  createCapture(payload) {
    const { actions, method } = this.props
    actions.createCapture({method, capture: payload, maxCaptures: this.maxAutomaticCaptures})
  }

  handleMessages = (message) => {
    const { actions } = this.props
    const valid = message.is_document;
    this.validateCapture(message.id, valid)
    this.isUploadValid(false, valid)
  }

  handleImage = (method, payload) => {
    if (!payload.image) {
      console.warn('Cannot handle a null image')
      return;
    }

    functionalSwitch(method, {
      document: ()=> this.handleDocument(payload),
      face: ()=> this.handleFace(payload)
    })
  }

  handleDocument(payload) {
    const { socket, documentType, unprocessedDocuments } = this.props
    if (unprocessedDocuments.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }

    payload = {...payload, documentType}
    socket.sendMessage(JSON.stringify(payload))
    this.createCapture(payload)
  }

  handleFace(payload) {
    this.createCapture({...payload, valid: true})
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
        {functionalSwitch(this.props.method, {
          document: () => <DocumentTitle useCapture={useCapture} />,
          face: ()=> <FaceTitle useCapture={useCapture} />
        })}
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
      [style.camera]: useCapture && !hasCaptured[method],
      [style.uploader]: !useCapture && !hasCaptured[method]
    })
    return (
      <div className={classes}>
        {hasCaptured[method] && <Confirm {...this.props} /> || this.renderCapture(useCapture)}
      </div>
    )
  }
}

Capture.defaultProps = {
  useWebcam: true,
  method: 'document'
}
