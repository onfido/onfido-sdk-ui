import { h, Component } from 'preact'
import { events } from 'onfido-sdk-core'
import classNames from 'classnames'
import randomId from '../utils/randomString'
import { Uploader, fileToBase64 } from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import isDesktop from '../utils/isDesktop'
import DetectRTC from 'detectrtc'
import style from './style.css'
import {functionalSwitch} from '../utils'

export default class Capture extends Component {
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
    console.log("componentDidMount")
    events.on('onMessage', (message) => this.handleMessages(message))
    this.checkWebcamSupport()
  }

  componentWillUnmount () {
    console.log("componentWillUnmount")
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
    const valid = message.is_document;
    this.validateCapture(message.id, valid)
  }

  handleImage = (base64Image) => {
    if (!base64Image) {
      console.warn('Cannot handle a null image')
      return;
    }
    const payload = this.createPayload(base64Image)
    functionalSwitch(this.props.method, {
      document: ()=> this.handleDocument(payload),
      face: ()=> this.handleFace(payload)
    })
  }

  createPayload = (imageDataBase64) => ({
    id: randomId(),
    messageType: this.method,
    image: imageDataBase64
  })

  handleDocument(payload) {
    const { socket, method, documentType, unprocessedCaptures } = this.props
    const unprocessedDocuments = unprocessedCaptures[method]
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

  onUploadFallback = (file) => {
    this.setState({uploadFallback: true})
    this.deleteCaptures()
    this.onImageFileSelected(file)
  }

  onImageFileSelected = (file) => {
    fileToBase64(file, this.handleImage)
  }

  deleteCaptures = ()=> {
    const {method, actions: {deleteCaptures}} = this.props
    deleteCaptures({method})
  }

  render ({method, isThereAValidCapture, useWebcam, hasUnprocessedCaptures, areAllCapturesInvalid, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && this.supportsWebcam() && isDesktop)
    const hasCaptured = isThereAValidCapture[method]
    //console.log(other)
    return (
      <CaptureScreen {...{method, useCapture, hasCaptured,
        onUserMedia: this.onUserMedia, onScreenshot: this.handleImage,
        onUploadFallback: this.onUploadFallback, onImageSelected: this.onImageFileSelected,
        uploading:hasUnprocessedCaptures[method], noDocument: areAllCapturesInvalid[method],
        ...other}}/>
    )
  }
}

const Title = ({method, useCapture}) => functionalSwitch(method, {
    document: () => <DocumentTitle useCapture={useCapture} />,
    face: ()=> <FaceTitle useCapture={useCapture} />
})

const CaptureMode = ({method, useCapture, ...other}) => (
  <div>
    <Title {...{method, useCapture}}/>
    {useCapture ?
      <Camera {...{method, ...other}}/> :
      <Uploader {...{method,...other}}/>
    }
  </div>
)

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

Capture.defaultProps = {
  useWebcam: true,
  method: 'document'
}
