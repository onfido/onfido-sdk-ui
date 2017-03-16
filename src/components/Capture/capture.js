import { h, Component } from 'preact'
import { events, selectors } from 'onfido-sdk-core'
import classNames from 'classnames'
import { connect } from 'react-redux'
import randomId from '../utils/randomString'
import { Uploader } from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import isDesktop from '../utils/isDesktop'
import DetectRTC from 'detectrtc'
import style from './style.css'
import { functionalSwitch, impurify } from '../utils'
import { canvasToBase64Images } from '../utils/canvas.js'
import { fileToBase64, base64toFile, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'

class Capture extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasWebcamPermission: false,
      hasWebcam: DetectRTC.hasWebcam,
      DetectRTCLoading: true,
      uploadFallback: false
    }
  }

  componentDidMount () {
    events.on('onMessage', (message) => this.handleMessages(message))
    this.checkWebcamSupport()
  }

  componentWillUnmount () {
    this.setState({uploadFallback: false})
  }

  componentWillReceiveProps(nextProps) {
    const {validCaptures, unprocessedCaptures} = nextProps
    if (validCaptures.length > 0) {
      this.setState({uploadFallback: false})
    }
    if (unprocessedCaptures.length > 0){
      this.setState({fileError: false})
    }
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
  onUserMedia = () => {
    this.setState({
      hasWebcam: true,
      hasWebcamPermission: true,
      DetectRTCLoading: false
    })
  }

  validateCapture = (id, valid) => {
    const { actions, method } = this.props
    actions.validateCapture({ id, valid, method})
  }

  maxAutomaticCaptures = 3

  createCapture(payload) {
    const { actions, method, side } = this.props
    payload.side = side
    actions.createCapture({method, capture: payload, maxCaptures: this.maxAutomaticCaptures})
  }

  handleMessages = (message) => {
    const { actions } = this.props
    const valid = message.valid;
    this.validateCapture(message.id, valid)
  }

  handleBase64 = (lossyBase64, base64) => {
    const file = base64toFile(base64)
    this.handleFile(lossyBase64, file)
  }

  handleFile = (base64ImageLossy, file) => {
    if (!file) {
      console.warn('Cannot handle a null image')
      return;
    }
    const payload = this.createPayload(file, base64ImageLossy)
    functionalSwitch(this.props.method, {
      document: ()=> this.handleDocument(payload),
      face: ()=> this.handleFace(payload)
    })
  }

  createPayload = (file, imageLossy) => ({
    id: randomId(),
    messageType: this.method,
    file, imageLossy
  })

  createSocketPayload = ({id, messageType, imageLossy, file, documentType}) =>
    JSON.stringify({id, messageType, image: imageLossy ? imageLossy : file, documentType})

  handleDocument(payload) {
    const { socket, documentType, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    payload = {...payload, documentType}
    if (this.props.side === 'back') {
      payload = {...payload, valid: true}
    }
    else {
      socket.sendMessage(this.createSocketPayload(payload))
    }
    this.createCapture(payload)
  }

  handleFace(payload) {
    this.createCapture({...payload, valid: true})
  }

  onUploadFallback = file => {
    this.setState({uploadFallback: true})
    this.deleteCaptures()
    this.onImageFileSelected(file)
  }

  onScreenshot = canvas => {
    canvasToBase64Images(canvas, this.handleBase64)
  }

  onImageFileSelected = file => {
    if (!isOfFileType(['jpg','jpeg','png','pdf'], file)){
      this.onFileTypeError()
      return
    }

    if (isOfFileType(['pdf'], file)){
      // TODO: we still need to convert PDFs to base64 in order to send it to the websocket server
      // this code needs to be changed when HTTP protocol is implemented
      const handlePDF = (base64) => this.handleFile(base64, file)
      fileToBase64(file, handlePDF, this.onFileGeneralError)
      return
    }

    if (isOfFileType(['jpg','jpeg','png'], file)){
      //avoid rendering pdfs or other formats to image,
      //due to inconsistencies between different browsers and the back end
      fileToLossyBase64Image(undefined, file,
        lossyBase64 => this.handleFile(lossyBase64, file),
        error => this.handleFile(undefined, file)
      )
    } else {
      this.handleFile(undefined, file)
    }
  }

  onFileTypeError = () => {
    this.setState({fileError: 'INVALID_TYPE'})
  }

  onFileGeneralError = () => {
    this.setState({fileError: 'INVALID_CAPTURE'})
  }

  deleteCaptures = () => {
    const {method, actions: {deleteCaptures}} = this.props
    deleteCaptures({method})
  }

  errorType = (allInvalid) => {
    const {fileError} = this.state
    if (fileError === 'INVALID_TYPE')     return fileError
    if (fileError === 'INVALID_CAPTURE')  return fileError
    if (allInvalid) return "INVALID_CAPTURE"
    return null;
  }

  render ({method, side, validCaptures, allInvalid, useWebcam, unprocessedCaptures, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && this.supportsWebcam() && isDesktop)
    const hasUnprocessedCaptures = unprocessedCaptures.length > 0
    return (
      <CaptureScreen {...{method, side, validCaptures, useCapture,
        onUserMedia: this.onUserMedia,
        onScreenshot: this.onScreenshot,
        onUploadFallback: this.onUploadFallback,
        onImageSelected: this.onImageFileSelected,
        uploading: hasUnprocessedCaptures,
        error: this.errorType(allInvalid),
        ...other}}/>
    )
  }
}

const Title = ({method, side, useCapture}) => functionalSwitch(method, {
    document: () => <DocumentTitle useCapture={useCapture} side={side} />,
    face: ()=> <FaceTitle useCapture={useCapture} />
})

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is pure some components, like Camera,
//will not have the componentWillUnmount method called
const CaptureMode = impurify(({method, side, useCapture, ...other}) => (
  <div>
    <Title {...{method, side, useCapture}}/>
    {useCapture ?
      <Camera {...{method, ...other}}/> :
      <Uploader {...{method,...other}}/>
    }
  </div>
))

const CaptureScreen = ({method, side, validCaptures, useCapture, ...other}) => {
  const hasCapture = validCaptures.length > 0
  return (<div className={classNames({
    [style.camera]: useCapture && !hasCapture,
    [style.uploader]: !useCapture && !hasCapture
  })}>
    {hasCapture ?
      <Confirm {...{ method, validCaptures, ...other}} /> :
      <CaptureMode {...{method, side, useCapture, ...other}} />
    }
  </div>)
}

const mapStateToProps = (state, props) => {
  return {allInvalid: selectors.allInvalidCaptureSelector(state, props),
          validCaptures: selectors.currentValidCaptures(state, props),
          unprocessedCaptures: selectors.unprocessedCaptures(state, props)}
}

export default connect(mapStateToProps)(Capture)
