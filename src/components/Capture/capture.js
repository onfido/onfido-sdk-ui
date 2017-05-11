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

  handleImage = (lossyBase64, blob) => {
    if (!blob) {
      console.warn('Cannot handle a null image')
      return;
    }

    const handleImageInternal = (lossyBase64, blob, base64) => {
      const payload = this.createPayload(blob, lossyBase64, base64)
      functionalSwitch(this.props.method, {
        document: ()=> this.handleDocument(payload),
        face: ()=> this.handleFace(payload)
      })
    }

    if (!lossyBase64){
      //If a lossy file cannot be generated, then a raw base64 should be
      fileToBase64(blob, base64 =>
        handleImageInternal(undefined, blob, base64), this.onFileGeneralError);
    }
    else {
      handleImageInternal(lossyBase64, blob)
    }
  }

  createPayload = (blob, lossyBase64, base64) => ({
    id: randomId(), blob, lossyBase64, base64
  })

  createSocketPayload = ({id, lossyBase64, base64, documentType}) =>
    JSON.stringify({
      id,
      image: lossyBase64 ? lossyBase64 : base64,
      documentType
    })

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

  onScreenshot = canvas => canvasToBase64Images(canvas, (lossyBase64, base64) => {
    const blob = base64toBlob(base64)
    this.handleImage(lossyBase64, blob)
  })

  onImageFileSelected = file => {
    const imageTypes = ['jpg','jpeg','png']
    const pdfType = ['pdf']
    const allAcceptedTypes = [...imageTypes, ...pdfType]

    if (!isOfFileType(allAcceptedTypes, file)){
      this.onFileTypeError()
      return
    }

    // The Onfido API only accepts files below 4MB
    if (file.size > 4000000) {
      this.onFileSizeError()
      return
    }

    if (isOfFileType(pdfType, file)){
      this.handleImage(undefined, file)
    }

    if (isOfFileType(imageTypes, file)){
      //avoid rendering pdfs or other formats to image,
      //due to inconsistencies between different browsers and the back end
      fileToLossyBase64Image(undefined, file, (lossyBase64) => {
        this.handleImage(lossyBase64, file)
      },
        error => this.handleImage(undefined, file)
      )
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
