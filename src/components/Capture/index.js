import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'
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
import { getFile, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'

const StatelessDocumentCapture = options =>
  <Capture method='document' autoCapture={true} {...options} />

StatelessDocumentCapture.defaultProps = {
  useWebcam: false
}

const StatelessFaceCapture = options =>
  <Capture method='face' autoCapture={false} {...options} />

StatelessFaceCapture.defaultProps = {
  useWebcam: true
}

//TODO investigate this workaround of wrapping stateless components.
// It may be to do with preact vs react.
export const DocumentCapture = impurify(StatelessDocumentCapture)
export const FaceCapture = impurify(StatelessFaceCapture)

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

  componentWillReceiveProps({isThereAValidCapture, method, hasUnprocessedCaptures}) {
    if (isThereAValidCapture[method]){
      this.setState({uploadFallback: false})
    }
    if (hasUnprocessedCaptures[method]){
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
    const { actions, method } = this.props
    actions.createCapture({method, capture: payload, maxCaptures: this.maxAutomaticCaptures})
  }

  handleMessages = (message) => {
    const { actions } = this.props
    const valid = message.valid;
    this.validateCapture(message.id, valid)
  }

  handleImage = (base64ImageLossy, image) => {
    if (!image) {
      console.warn('Cannot handle a null image')
      return;
    }
    const payload = this.createPayload(image, base64ImageLossy)
    functionalSwitch(this.props.method, {
      document: ()=> this.handleDocument(payload),
      face: ()=> this.handleFace(payload)
    })
  }

  createPayload = (image, imageLossy) => {
    const file = getFile(image)
    return {
      id: randomId(),
      messageType: this.method,
      image: file,
      imageLossy
    }
  }

  createSocketPayload = ({id, messageType, imageLossy, image, documentType}) =>
    JSON.stringify({id, messageType, image: imageLossy ? imageLossy : image, documentType})

  handleDocument(payload) {
    const { socket, method, documentType, unprocessedCaptures } = this.props
    const unprocessedDocuments = unprocessedCaptures[method]
    if (unprocessedDocuments.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }

    payload = {...payload, documentType}
    socket.sendMessage(this.createSocketPayload(payload))
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
    canvasToBase64Images(canvas, (lossyBase64, base64) => {
      this.handleImage(lossyBase64, base64)
    })
  }

  onImageFileSelected = file => {
    if (!isOfFileType(['jpg','jpeg','png','pdf'], file)){
      this.onFileTypeError()
      return
    }

    if (isOfFileType(['jpg','jpeg','png'], file)){
      //avoid rendering pdfs or other formats to image,
      //due to inconsistencies between different browsers and the back end
      fileToLossyBase64Image(undefined, file,
        lossyBase64 => this.handleImage(lossyBase64, file),
        error => this.handleImage(undefined, file)
      )
    }
    else {
      this.handleImage(undefined, file)
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

  errorType = ({areAllCapturesInvalid,method}) => {
    const {fileError} = this.state
    if (fileError === 'INVALID_TYPE')     return fileError
    if (fileError === 'INVALID_CAPTURE')  return fileError
    if (areAllCapturesInvalid[method])    return "INVALID_CAPTURE"
    return null;
  }

  render ({method, isThereAValidCapture, useWebcam, hasUnprocessedCaptures, areAllCapturesInvalid, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && this.supportsWebcam() && isDesktop)
    const hasCaptured = isThereAValidCapture[method]
    return (
      <CaptureScreen {...{method, useCapture, hasCaptured,
        onUserMedia: this.onUserMedia,
        onScreenshot: this.onScreenshot,
        onUploadFallback: this.onUploadFallback,
        onImageSelected: this.onImageFileSelected,
        uploading:hasUnprocessedCaptures[method],
        error: this.errorType({areAllCapturesInvalid, method}),
        ...other}}/>
    )
  }
}

const Title = ({method, useCapture}) => functionalSwitch(method, {
    document: () => <DocumentTitle useCapture={useCapture} />,
    face: ()=> <FaceTitle useCapture={useCapture} />
})

//TODO move to react instead of preact, since preact has issues handling pure components
//IF this component is pure some components, like Camera,
//will not have the componentWillUnmount method called
const CaptureMode = impurify(({method, useCapture, ...other}) => (
  <div>
    <Title {...{method, useCapture}}/>
    {useCapture ?
      <Camera {...{method, ...other}}/> :
      <Uploader {...{method,...other}}/>
    }
  </div>
))

const CaptureScreen = ({method, useCapture, hasCaptured, ...other})=> (
  <div className={classNames({
    [style.camera]: useCapture && !hasCaptured,
    [style.uploader]: !useCapture && !hasCaptured
  })}>
    {hasCaptured ?
      <Confirm {...{ method, ...other}} /> :
      <CaptureMode {...{method, useCapture, ...other}} />
    }
  </div>
)
