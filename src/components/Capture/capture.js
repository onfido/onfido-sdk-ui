import { h, Component } from 'preact'
import { events, selectors } from '../../core'
import classNames from 'classnames'
import { connect } from 'react-redux'
import randomId from '../utils/randomString'
import { Uploader } from '../Uploader'
import Camera from '../Camera'
import Confirm from '../Confirm'
import { FaceTitle } from '../Face'
import { DocumentTitle } from '../Document'
import style from './style.css'
import { functionalSwitch, impurify, isDesktop, checkIfHasWebcam } from '../utils'
import { canvasToBase64Images } from '../utils/canvas.js'
import { base64toBlob, fileToBase64, isOfFileType, fileToLossyBase64Image } from '../utils/file.js'
import { postToServer } from '../utils/http.js'

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
      allowApiAdvancedValidation: true
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

  onServerResponse = (response) => {
    const { actions } = this.props
    const valid = response.valid
    this.validateCapture(response.id, valid)
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

  createPayload = (blob, base64) => ({
    id: randomId(), blob, base64
  })

  createJSONPayload = ({id, base64}) =>
    JSON.stringify({id, image: base64})

  handleDocument(payload) {
    const { token, serverUrl, documentType, unprocessedCaptures } = this.props
    if (unprocessedCaptures.length === this.maxAutomaticCaptures){
      console.warn('Server response is slow, waiting for responses before uploading more')
      return
    }
    payload = {...payload, documentType}
    if (this.props.useWebcam) {
      postToServer(this.createJSONPayload(payload), serverUrl, token,
        (response) => this.onServerResponse(response),
        (response) => this.onServerError(response)
      )
      this.setState({allowApiAdvancedValidation: false})
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

  onFileTypeError = () => {
    this.setState({error: 'INVALID_TYPE'})
  }

  onFileSizeError = () => {
    this.setState({error: 'INVALID_SIZE'})
  }

  onFileGeneralError = () => {
    this.setState({error: 'INVALID_CAPTURE'})
  }

  onServerError = () => {
    this.deleteCaptures()
    this.setState({error: 'SERVER_ERROR'})
  }

  onApiError = (error) => {
    this.deleteCaptures()
    this.setState({error})
  }

  deleteCaptures = () => {
    const {method, side, actions: {deleteCaptures}} = this.props
    deleteCaptures({method, side})
  }

  render ({method, side, validCaptures, useWebcam, unprocessedCaptures, ...other}) {
    const useCapture = (!this.state.uploadFallback && useWebcam && isDesktop && this.state.hasWebcam)
    const hasUnprocessedCaptures = unprocessedCaptures.length > 0
    return (
      <CaptureScreen {...{method, side, validCaptures, useCapture,
        onScreenshot: this.onScreenshot,
        onUploadFallback: this.onUploadFallback,
        onImageSelected: this.onImageFileSelected,
        onWebcamError: this.onWebcamError,
        onApiError: this.onApiError,
        allowApiAdvancedValidation: this.state.allowApiAdvancedValidation,
        uploading: hasUnprocessedCaptures,
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
      <Uploader {...{method,...other}}/>
    }
  </div>
))

const CaptureScreen = ({method, side, validCaptures, useCapture, allowApiAdvancedValidation, token, onApiError, ...other}) => {
  const hasCapture = validCaptures.length > 0
  return (<div className={classNames({
    [style.camera]: useCapture && !hasCapture,
    [style.uploader]: !useCapture && !hasCapture
  })}>
    {hasCapture ?
      <Confirm {...{ method, side, validCaptures, token, allowApiAdvancedValidation, onApiError, ...other}} /> :
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
