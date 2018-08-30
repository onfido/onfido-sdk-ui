import { h, Component } from 'preact'
import { selectors } from '../../core'
import { connect } from 'react-redux'
<<<<<<< HEAD

=======
import { randomId } from '../utils/string'
>>>>>>> development
import { Uploader } from '../Uploader'
import Camera from '../Camera'
import PrivacyStatement from '../PrivacyStatement'
import { functionalSwitch, isDesktop, checkIfHasWebcam } from '../utils'
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'
import { postToBackend } from '../utils/sdkBackend'

class Capture extends Component {
  static defaultProps = {
    onWebcamSupportChange: () => {},
  }

  constructor (props) {
    super(props)
    this.state = {
      uploadFallback: false,
      error: null,
      hasWebcam: undefined,
    }
  }

  componentDidMount(){
    this.webcamChecker = setInterval(this.checkWebcamSupport, 2000);
    this.checkWebcamSupport();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.hasWebcam !== this.state.hasWebcam) {
      this.props.onWebcamSupportChange(nextState.hasWebcam)
    }
  }

  componentWillUnmount () {
    this.setState({uploadFallback: false})
    clearInterval(this.webcamChecker)
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

  onVideoRecorded = (blob, challengeData) => {
    const payload = {blob, variant: 'video', challengeData}
    this.createCapture(payload)
    this.validateAndProceed(payload)
  }

  onScreenshot = this.handleCapture

  onFileSelected = this.handleCapture

  handleCapture = (blob, base64) => {
    if (!blob) {
      console.warn('Cannot handle a null image')
      return;
    }

    const payload = { id: randomId(), blob, base64 }
    functionalSwitch(this.props.method, {
      document: () => this.handleDocument(payload),
      face: () => this.handleFace({ ...payload, variant: 'standard' })
    })
  }

  handleDocument(payload) {
    const { documentType } = this.props
    const expectedDocumentType = documentType === 'poa' ? 'unknown' : documentType
    const documentPayload = { ...payload, documentType: expectedDocumentType }

    this.createCapture(documentPayload)
    if (this.props.useWebcam && !this.state.uploadFallback) {
      this.handleAutocapture(documentPayload)
    }
    else {
      this.handleCaptureFromUploader(documentPayload)
    }
  }

  handleAutocapture(payload){
    const { token, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    postToBackend(JSON.stringify({
      id: payload.id,
      image: payload.base64
    }), token,
      ({ valid }) => {
        const { nextStep } = this.props
        this.validateCaptures(payload, valid)
        if (valid) nextStep()
      },
      () => {
        this.deleteCaptures()
        this.setError('SERVER_ERROR')
      })
    )
  }

  handleCaptureFromUploader(payload) {
    this.validateAndProceed(payload)
  }

  handleFace(payload) {
    this.createCapture(payload)
    this.validateAndProceed(payload)
  }

  onUpload = (blob, base64) => {
    this.setState({uploadFallback: true})
    this.clearErrors()
    this.deleteCaptures()
    this.onFileSelected(blob, base64)
  }

  onWebcamError = () => {
    this.deleteCaptures()
  }

  
  onFileTypeError = () => this.setError('INVALID_TYPE')
  onFileSizeError = () => this.setError('INVALID_SIZE')
  onFileGeneralError = () => this.setError('INVALID_CAPTURE')

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

  render ({useWebcam, back, i18n, termsAccepted, ...other}) {
    const canUseWebcam = this.state.hasWebcam && !this.state.uploadFallback
    const shouldUseWebcam = useWebcam && (this.props.method === 'face' || isDesktop)
    const useCapture = canUseWebcam && shouldUseWebcam

    return (
      process.env.PRIVACY_FEATURE_ENABLED && !termsAccepted ?
        <PrivacyStatement {...{i18n, back, acceptTerms: this.acceptTerms, ...other}}/> :
        <CaptureMode {...{useCapture, i18n,
          onScreenshot: this.onScreenshot,
          onVideoRecorded: this.onVideoRecorded,
          onUpload: this.onUpload,
          onImageSelected: this.onImageFileSelected,
          onFailure: this.onWebcamError,
          error: this.state.error,
          ...other}}/>
    )
  }
}

const CaptureMode = ({method, documentType, side, useCapture, i18n, ...other}) => {
  const copyNamespace = method === 'face' ? 'capture.face' : `capture.${documentType}.${side}`
<<<<<<< HEAD
  return (
    useCapture ?
      <Camera
        title={i18n.t(`${copyNamespace}.title`)}
        {...{i18n, method, ...other}}
      /> :
      <Uploader
        title={i18n.t(`${copyNamespace}.upload_title`) || i18n.t(`${copyNamespace}.title`)}
        {...{i18n, method, ...other}}
      />
=======
  const title = !useCapture && i18n.t(`${copyNamespace}.upload_title`) ? i18n.t(`${copyNamespace}.upload_title`)  : i18n.t(`${copyNamespace}.title`)
  const instructions = i18n.t(`${copyNamespace}.instructions`)
  return (
    useCapture ?
      <Camera {...{i18n, method, title, ...other}}/> :
      <Uploader {...{i18n, instructions, documentType, title, ...other}}/>
>>>>>>> development
    )
}

const mapStateToProps = (state, props) => {
  return {allInvalid: selectors.allInvalidCaptureSelector(state, props),
          validCaptures: selectors.currentValidCaptures(state, props),
          unprocessedCaptures: selectors.unprocessedCaptures(state, props)}
}

export default connect(mapStateToProps)(Capture)
