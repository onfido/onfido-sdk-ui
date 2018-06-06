import { h, Component } from 'preact'
import { selectors } from '../../core'
import { connect } from 'react-redux'
import randomId from '../utils/randomString'
import { Uploader } from '../Uploader'
import Camera from '../Camera'
import PrivacyStatement from '../PrivacyStatement'
import { functionalSwitch, isDesktop, checkIfHasWebcam } from '../utils'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'
import { postToBackend } from '../utils/sdkBackend'

let hasWebcamStartupValue = true;//asume there is a webcam first,
//assuming it's better to get flicker from webcam to file upload
//than the other way around

checkIfHasWebcam( hasWebcam => hasWebcamStartupValue = hasWebcam )

class Capture extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uploadFallback: false,
      error: null,
      hasWebcam: hasWebcamStartupValue
    }
  }

  componentDidMount(){
    this.webcamChecker = setInterval(this.checkWebcamSupport, 2000);
    this.checkWebcamSupport();
  }

  componentWillUnmount () {
    this.setState({uploadFallback: false})
    clearInterval(this.webcamChecker)
    this.props.useFullScreen(false)
  }

  componentWillReceiveProps(nextProps) {
    const {validCaptures, unprocessedCaptures, allInvalid} = nextProps
    if (validCaptures.length > 0) this.setState({uploadFallback: false})
    if (unprocessedCaptures.length > 0) this.clearErrors()
    if (allInvalid) this.onFileGeneralError()
  }

  acceptTerms = () => {
    this.props.actions.acceptTerms()
  }

  checkWebcamSupport = () => {
    checkIfHasWebcam( hasWebcam => this.setState({hasWebcam}) )
  }

  maxAutomaticCaptures = 3

  createCapture(payload) {
    const { actions, method, side } = this.props
    const capture = {...payload, side}
    actions.createCapture({method, capture, maxCaptures: this.maxAutomaticCaptures})
  }

  validateAndProceed(payload) {
    const { nextStep } = this.props
    const valid = true
    this.validateCaptures(payload, valid)
    nextStep()
  }

  onValidationServiceResponse = (payload, {valid}) => {
    const { nextStep } = this.props
    this.validateCaptures(payload, valid)
    if (valid) nextStep()
  }

  handleCapture = (blob, base64) => {
    if (!blob) {
      console.warn('Cannot handle a null image')
      return;
    }

    const payload = this.initialiseCapturePayload(blob, base64)
    functionalSwitch(this.props.method, {
      document: () => this.handleDocument(payload),
      face: () => this.handleFace(payload)
    })
  }

  initialiseCapturePayload = (blob, base64) => ({id: randomId(), blob, base64})

  validationServicePayload = ({id, base64}) => JSON.stringify({id, image: base64})

  handleAutocapture(payload){
    const { token, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    postToBackend(this.validationServicePayload(payload), token,
      (response) => this.onValidationServiceResponse(payload, response),
      this.onValidationServerError
    )
  }

  handleCaptureFromUploader(payload) {
    this.validateAndProceed(payload)
  }

  createDocumentPayload(payload) {
    const { documentType } = this.props
    return {...payload, documentType }
  }

  handleDocument(payload) {
    const documentPayload = this.createDocumentPayload(payload)
    this.createCapture(documentPayload)
    if (this.props.useWebcam && !this.state.uploadFallback) {
      this.handleAutocapture(documentPayload)
    }
    else {
      this.handleCaptureFromUploader(documentPayload)
    }
  }

  handleFace(payload) {
    this.createCapture(payload)
    this.validateAndProceed(payload)
  }

  onUploadFallback = file => {
    this.setState({uploadFallback: true})
    this.clearErrors()
    this.deleteCaptures()
    this.onImageFileSelected(file)
  }

  onWebcamError = (error) => {
    if (error && error.message === 'Permission denied') {
      this.props.actions.permissionsAsked(true)
      this.props.actions.hasCameraPermissions(false)
    }
    this.setState({uploadFallback: true})
    this.deleteCaptures()
  }

  onUserMedia = () => {
    this.props.actions.permissionsAsked(true)
    this.props.actions.hasCameraPermissions(true)
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
        () => handleFile(file)
      )
    }
  }

  onFileTypeError = () => this.setError('INVALID_TYPE')
  onFileSizeError = () => this.setError('INVALID_SIZE')
  onFileGeneralError = () => this.setError('INVALID_CAPTURE')

  onValidationServerError = () => {
    this.deleteCaptures()
    this.setError('SERVER_ERROR')
  }

  setError = (name) => this.setState({error: {name}})

  deleteCaptures = () => {
    const {method, side, actions: {deleteCaptures}} = this.props
    deleteCaptures({method, side})
  }

  validateCaptures = (payload, valid) => {
    const { actions, method } = this.props
    actions.validateCapture({id: payload.id, valid, method})
  }

  clearErrors = () => {
    this.setState({error: null})
  }

  render ({useWebcam, back, i18n, termsAccepted, useFullScreen, ...other}) {
    const shouldUseWebcam = (!this.state.uploadFallback && useWebcam && this.state.hasWebcam)
    useFullScreen(shouldUseWebcam && this.props.method === 'face')
    return (
      process.env.PRIVACY_FEATURE_ENABLED && !termsAccepted ?
        <PrivacyStatement {...{i18n, back, acceptTerms: this.acceptTerms, ...other}}/> :
        <CaptureMode {...{shouldUseWebcam, i18n,
          onUserMedia: this.onUserMedia,
          onScreenshot: this.onScreenshot,
          onUploadFallback: this.onUploadFallback,
          onImageSelected: this.onImageFileSelected,
          onWebcamError: this.onWebcamError,
          ...other}}/>
    )
  }
}

const CaptureMode = (props) => {
  const { method, documentType, side, shouldUseWebcam, i18n, permissionsAsked,
    hasCameraPermissions, ...other } = props
  const permissionsDenied = permissionsAsked && !hasCameraPermissions
  const copyNamespace = method === 'face' ? 'capture.face' : `capture.${documentType}.${side}`
  const title = (!shouldUseWebcam || permissionsDenied) && i18n.t(`${copyNamespace}.upload_title`) ? i18n.t(`${copyNamespace}.upload_title`)  : i18n.t(`${copyNamespace}.title`)
  const subTitle = shouldUseWebcam && !permissionsDenied && isDesktop ? i18n.t(`${copyNamespace}.webcam`) : null
  const instructions = i18n.t(`${copyNamespace}.instructions`)
  const parentheses = i18n.t('capture_parentheses')
  return (
    (shouldUseWebcam && permissionsDenied) || !shouldUseWebcam ?
      <Uploader {...{i18n, instructions, parentheses, title, subTitle, ...other}}/> :
      <Camera {...{i18n, method, title, subTitle, permissionsDenied, ...other}}/>


  )
}

const mapStateToProps = (state, props) => {
  return {allInvalid: selectors.allInvalidCaptureSelector(state, props),
          validCaptures: selectors.currentValidCaptures(state, props),
          unprocessedCaptures: selectors.unprocessedCaptures(state, props)}
}

export default connect(mapStateToProps)(Capture)
