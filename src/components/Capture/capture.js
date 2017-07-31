import { h, Component } from 'preact'
import { events, selectors } from '../../core'
import classNames from 'classnames'
import { connect } from 'react-redux'
import randomId from '../utils/randomString'
import { Uploader } from '../Uploader'
import Spinner from '../Spinner'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import style from './style.css'
import theme from '../Theme/style.css'
import { functionalSwitch, impurify, isDesktop, checkIfHasWebcam } from '../utils'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'
import { postToBackend } from '../utils/sdkBackend'
import { postToOnfido } from '../utils/onfidoApi'
import { sendError } from '../../Tracker'

const ProcessingApiRequest = () =>
  <div className={theme.center}>
    <Spinner />
  </div>

let hasWebcamStartupValue = true;//asume there is a webcam first,
//assuming it's better to get flicker from webcam to file upload
//than the other way around

checkIfHasWebcam( hasWebcam => hasWebcamStartupValue = hasWebcam )

class Capture extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uploadFallback: false,
      error: false,
      hasWebcam: hasWebcamStartupValue,
      advancedValidation: true,
      uploadInProgress: false
    }
  }

  componentDidMount(){
    this.webcamChecker = setInterval(this.checkWebcamSupport, 2000);
    this.checkWebcamSupport();
  }

  componentWillUnmount () {
    this.setState({uploadFallback: false})
    clearInterval(this.webcamChecker);
  }

  componentWillReceiveProps(nextProps) {
    const {validCaptures, unprocessedCaptures, allInvalid} = nextProps
    if (validCaptures.length > 0) this.setState({uploadFallback: false})
    if (unprocessedCaptures.length > 0) this.setState({error: false})
    if (allInvalid) this.onFileGeneralError()
  }

  checkWebcamSupport = () => {
    checkIfHasWebcam( hasWebcam => this.setState({hasWebcam}) )
  }

  maxAutomaticCaptures = 3

  uploadCaptureToOnfido = () => {
    this.setState({uploadInProgress: true})
    const {validCaptures, method, side, token} = this.props
    const capture = validCaptures[0]

    postToOnfido(capture, method, token, this.state.advancedValidation,
      (apiResponse) => this.confirmAndProceed(apiResponse, capture.id),
      this.onApiError
    )
  }

  confirmAndProceed = (apiResponse, id) => {
    const {method, side, nextStep, actions: {confirmCapture}} = this.props
    confirmCapture({method, id, onfidoId: apiResponse.id})
    this.confirmEvent(method, side)
    nextStep()
  }

  confirmEvent = (method, side) => {
    if (method === 'document') {
      if (side === 'front') events.emit('documentCapture')
      else if (side === 'back') events.emit('documentBackCapture')
    }
    else if (method === 'face') events.emit('faceCapture')
  }

  createCapture(payload) {
    const { actions, method, side } = this.props
    payload.side = side
    actions.createCapture({method, capture: payload, maxCaptures: this.maxAutomaticCaptures})
  }

  onValidationServiceResponse = (id, {valid}) => {
    const { actions, method } = this.props
    actions.validateCapture({id, valid, method})
  }

  handleCapture = (blob, base64) => {
    if (!blob) {
      console.warn('Cannot handle a null image')
      return;
    }

    const payload = this.createPayload(blob, base64)
    functionalSwitch(this.props.method, {
      document: () => this.handleDocument(payload),
      face: () => this.handleFace(payload)
    })
  }

  createPayload = (blob, base64) => ({id: randomId(), blob, base64})

  createJSONPayload = ({id, base64}) => JSON.stringify({id, image: base64})

  handleDocument(payload) {
    const { token, documentType, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    payload = {...payload, documentType}
    if (this.props.useWebcam) {
      postToBackend(this.createJSONPayload(payload), token,
        (response) => this.onValidationServiceResponse(payload.id, response),
        this.onValidationServerError
      )
      this.setState({advancedValidation: false})
    }
    else {
      payload = {...payload, valid: true}
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

  onWebcamError = () => {
    this.setState({uploadFallback: true})
    this.deleteCaptures()
  }

  onScreenshot = canvas => canvasToBase64Images(canvas, (lossyBase64, base64) => {
    const blob = base64toBlob(base64)
    this.handleCapture(blob, lossyBase64)
  })

  onImageFileSelected = file => {
    const imageTypes = ['jpg','jpeg','png']
    const pdfType = ['pdf']
    const allAcceptedTypes = [...imageTypes, ...pdfType]

    if (!isOfFileType(allAcceptedTypes, file)){
      this.onFileTypeError()
      return
    }

    // The Onfido API only accepts files below 10 MB
    if (file.size > 10000000) {
      this.onFileSizeError()
      return
    }

    const handleFile = file => fileToBase64(file,
        base64 => this.handleCapture(file, base64),
        this.onFileGeneralError);

    if (isOfFileType(pdfType, file)){
      //avoid rendering pdfs, due to inconsistencies between different browsers
      handleFile(file)
    }
    else if (isOfFileType(imageTypes, file)){
      fileToLossyBase64Image(file,
        lossyBase64 => this.handleCapture(file, lossyBase64),
        error => handleFile(file)
      )
    }
  }

  onfidoErrorFieldMap = ([key, val]) => {
    if (key === 'document_detection') return 'INVALID_CAPTURE'
    // This error is hit on corrupted PDF or PDF submission for face detection
    if (key === 'file' || key === 'attachment' || key === 'attachment_content_type') return 'INVALID_TYPE'
    if (key === 'face_detection') {
      return val.indexOf('Multiple faces') === -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
    }
  }

  onfidoErrorReduce = ({fields}) => {
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first
  }

  onApiError = ({status, response}) => {
    this.deleteCaptures()
    let errorKey;
    if (status === 422){
      errorKey = this.onfidoErrorReduce(response.error)
    }
    else {
      sendError(`${status} - ${response}`)
      errorKey = 'SERVER_ERROR'
    }

    this.setState({uploadInProgress: false})
    this.setError(errorKey)
  }

  onFileTypeError = () => this.setError('INVALID_TYPE')
  onFileSizeError = () => this.setError('INVALID_SIZE')
  onFileGeneralError = () => this.setError('INVALID_CAPTURE')

  onValidationServerError = () => {
    this.deleteCaptures()
    this.setError('SERVER_ERROR')
  }

  setError = (error) => {
    this.props.trackScreen(`error`, {error})
    this.setState({error})
  }


  deleteCaptures = () => {
    const {method, side, actions: {deleteCaptures}} = this.props
    deleteCaptures({method, side})
  }

  render ({method, side, validCaptures, useWebcam, unprocessedCaptures, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && isDesktop && this.state.hasWebcam)
    const hasUnprocessedCaptures = unprocessedCaptures.length > 0
    const uploadInProgress = this.state.uploadInProgress
    return (
      uploadInProgress ?
        <ProcessingApiRequest /> :
        <CaptureScreen {...{method, side, validCaptures, useCapture,
          onScreenshot: this.onScreenshot,
          onUploadFallback: this.onUploadFallback,
          onImageSelected: this.onImageFileSelected,
          onWebcamError: this.onWebcamError,
          onConfirm: this.uploadCaptureToOnfido,
          advancedValidation: this.state.advancedValidation,
          error: this.state.error,
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
      <Uploader {...{method, ...other}}/>
    }
  </div>
))

const CaptureScreen = ({validCaptures, useCapture, ...other}) => {
  const hasCapture = validCaptures.length > 0
  return (
    <div
      className={classNames({
        [style.camera]: useCapture && !hasCapture,
        [style.uploader]: !useCapture && !hasCapture})}
    >
    { hasCapture ?
      <Confirm {...{validCaptures, ...other}} /> :
      <CaptureMode {...{useCapture, ...other}} />
    }
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {allInvalid: selectors.allInvalidCaptureSelector(state, props),
          validCaptures: selectors.currentValidCaptures(state, props),
          unprocessedCaptures: selectors.unprocessedCaptures(state, props)}
}

export default connect(mapStateToProps)(Capture)
