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
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'

class Capture extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hasWebcamPermission: false,
      hasWebcam: DetectRTC.hasWebcam,
      DetectRTCLoading: true,
      uploadFallback: false,
      fileError: false
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
    const {validCaptures, unprocessedCaptures, allInvalid} = nextProps
    if (validCaptures.length > 0) this.setState({uploadFallback: false})
    if (unprocessedCaptures.length > 0) this.setState({fileError: false})
    if (allInvalid) this.onFileGeneralError()
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
    const blob = base64toBlob(base64)
    this.handleImage(lossyBase64, blob, base64)
  }

  handleImage = (base64ImageLossy, image, base64) => {
    if (!image) {
      console.warn('Cannot handle a null image')
      return;
    }
    const payload = this.createPayload(image, base64ImageLossy, base64)
    functionalSwitch(this.props.method, {
      document: ()=> this.handleDocument(payload),
      face: ()=> this.handleFace(payload)
    })
  }

  createPayload = (image, imageLossy, base64) => ({
    id: randomId(), image, imageLossy, base64
  })

  createSocketPayload = ({id, imageLossy, image, documentType}) =>
    JSON.stringify({id, image: imageLossy ? imageLossy : image, documentType})

  handleDocument(payload) {
    const { socket, documentType, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    payload = {...payload, documentType}
    if (this.props.side === 'back' && !this.props.useWebcam) {
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

    // The Onfido API only accepts files below 4MB
    if (file.size > 4000000) {
      this.onFileSizeError()
      return
    }

    if (isOfFileType(['pdf'], file)){
      // TODO: we still need to convert PDFs to base64 in order to send it to the websocket server
      // this code needs to be changed when HTTP protocol is implemented
      fileToBase64(file, (base64) => this.handleImage(base64, file), this.onFileGeneralError);
    }

    if (isOfFileType(['jpg','jpeg','png'], file)){
      //avoid rendering pdfs or other formats to image,
      //due to inconsistencies between different browsers and the back end
      fileToLossyBase64Image(undefined, file, (lossyBase64) => {
        this.handleImage(lossyBase64, file)
      },
        error => this.handleImage(undefined, file)
      )

    } else {
      this.handleImage(undefined, file)
    }
  }

  onFileTypeError = () => {
    this.setState({fileError: 'INVALID_TYPE'})
  }

  onFileSizeError = () => {
    this.setState({fileError: 'INVALID_SIZE'})
  }

  onFileGeneralError = () => {
    this.setState({fileError: 'INVALID_CAPTURE'})
  }

  deleteCaptures = () => {
    const {method, side, actions: {deleteCaptures}} = this.props
    deleteCaptures({method, side})
  }

  render ({method, side, validCaptures, useWebcam, unprocessedCaptures, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && this.supportsWebcam() && isDesktop)
    const hasUnprocessedCaptures = unprocessedCaptures.length > 0
    return (
      <CaptureScreen {...{method, side, validCaptures, useCapture,
        onUserMedia: this.onUserMedia,
        onScreenshot: this.onScreenshot,
        onUploadFallback: this.onUploadFallback,
        onImageSelected: this.onImageFileSelected,
        uploading: hasUnprocessedCaptures,
        error: this.state.fileError,
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
      <Confirm {...{ method, side, validCaptures, ...other}} /> :
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
