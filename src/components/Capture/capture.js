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
import { functionalSwitch, isDesktop, checkIfHasWebcam } from '../utils'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'
import { postToBackend } from '../utils/sdkBackend'
import { uploadDocument, uploadLivePhoto } from '../utils/onfidoApi'
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
      error: {},
      captureId: null,
      onfidoId: null,
      hasWebcam: hasWebcamStartupValue,
      documentValidations: true,
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
    if (unprocessedCaptures.length > 0) this.clearErrors()
    if (allInvalid) this.onFileGeneralError()
  }

  checkWebcamSupport = () => {
    checkIfHasWebcam( hasWebcam => this.setState({hasWebcam}) )
  }

  maxAutomaticCaptures = 3

  uploadCaptureToOnfido = () => {
    this.setState({uploadInProgress: true})
    const {validCaptures, method, side, token} = this.props
    const {blob, documentType, id} = validCaptures[0]
    this.setState({captureId: id})

    if (method === 'document') {
      const data = { file: blob, type: documentType, side}
      if (this.state.documentValidations) {
        const validations = {'detect_document': 'error', 'detect_glare': 'warn'}
        data['sdk_validations'] = validations
      }
      uploadDocument(data, token, this.onApiSuccess, this.onApiError)
    }
    else if  (method === 'face') {
      const data = { file: blob }
      uploadLivePhoto(data, token, this.onApiSuccess, this.onApiError)
    }
  }

  confirmAndProceed = () => {
    const {method, side, nextStep, actions: {confirmCapture}} = this.props
    this.clearErrors()
    confirmCapture({method, id: this.state.captureId, onfidoId: this.state.onfidoId})
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
      this.setState({documentValidations: false})
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

  onApiSuccess = (apiResponse) => {
    this.setState({onfidoId: apiResponse.id})
    const warnings = apiResponse.sdk_warnings
    if (warnings && !warnings.detect_glare.valid) {
      this.onGlareWarning()
    }
    else {
      this.confirmAndProceed(apiResponse)
    }
    this.setState({uploadInProgress: false})
  }

  onfidoErrorFieldMap = ([key, val]) => {
    if (key === 'document_detection') return 'INVALID_CAPTURE'
    // on corrupted PDF or other unsupported file types
    if (key === 'file') return 'INVALID_TYPE'
    // hit on PDF/invalid file type submission for face detection
    if (key === 'attachment' || key === 'attachment_content_type') return 'UNSUPPORTED_FILE'
    if (key === 'face_detection') {
      return val.indexOf('Multiple faces') === -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
    }
  }

  onfidoErrorReduce = ({fields}) => {
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first
  }

  onApiError = ({status, response}) => {
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

  onGlareWarning = () => {
    this.setWarning('GLARE_DETECTED')
  }

  setError = (name) => this.setState({error: {name, type: 'error'}})
  setWarning = (name) => this.setState({error: {name, type: 'warn'}})

  deleteCaptures = () => {
    const {method, side, actions: {deleteCaptures}} = this.props
    deleteCaptures({method, side})
  }

  clearErrors = () => {
    this.setState({error: {}})
  }

  render ({method, side, validCaptures, useWebcam, unprocessedCaptures, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && isDesktop && this.state.hasWebcam)
    const hasUnprocessedCaptures = unprocessedCaptures.length > 0
    const uploadInProgress = this.state.uploadInProgress
    const onConfirm = this.state.error.type === 'warn' ?
      this.confirmAndProceed : this.uploadCaptureToOnfido

    return (
      uploadInProgress ?
        <ProcessingApiRequest /> :
        <CaptureScreen {...{method, side, validCaptures, useCapture,
          onScreenshot: this.onScreenshot,
          onUploadFallback: this.onUploadFallback,
          onImageSelected: this.onImageFileSelected,
          onWebcamError: this.onWebcamError,
          onRetake: this.clearErrors,
          onConfirm,
          error: this.state.error,
          ...other}}/>
    )
  }
}

const Title = ({method, side, useCapture}) => functionalSwitch(method, {
    document: () => <DocumentTitle useCapture={useCapture} side={side} />,
    face: ()=> <FaceTitle useCapture={useCapture} />
})

const CaptureMode = ({method, side, useCapture, error, ...other}) => (
  <div>
    <Title {...{method, side, useCapture}}/>
    {useCapture ?
      <Camera {...{method, ...other}}/> :
      <Uploader {...{method, error, ...other}}/>
    }
  </div>
)

const CaptureScreen = ({validCaptures, useCapture, error, onRetake, ...other}) => {
  const hasCapture = validCaptures.length > 0
  return (
    <div
      className={classNames({
        [style.camera]: useCapture && !hasCapture,
        [style.uploader]: !useCapture && !hasCapture})}
    >
    { hasCapture ?
      <Confirm {...{validCaptures, error, onRetake, ...other}} /> :
      <CaptureMode {...{useCapture, error, ...other}} />
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
