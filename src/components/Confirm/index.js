import { h, Component } from 'preact'
import { events, selectors } from '../../core'
import { connect } from 'react-redux'
import theme from '../Theme/style.css'
import style from './style.css'
import classNames from 'classnames'
import { isOfFileType } from '../utils/file'
import {preventDefaultOnClick} from '../utils'
import { uploadDocument, uploadLivePhoto } from '../utils/onfidoApi'
import PdfViewer from './PdfPreview'
import Error from '../Error'
import Spinner from '../Spinner'
import { sendError, trackComponentAndMode, appendToTracking } from '../../Tracker'

const CaptureViewerPure = ({capture:{blob, base64, previewUrl}}) =>
  <div className={style.captures}>
    {isOfFileType(['pdf'], blob) ?
      <PdfViewer previewUrl={previewUrl} blob={blob}/> :
      <img className={style.image}
        //we use base64 if the capture is a File, since its base64 version is exif rotated
        //if it's not a File (just a Blob), it means it comes from the webcam,
        //so the base64 version is actually lossy and since no rotation is necessary
        //the blob is the best candidate in this case
        src={blob instanceof File ? base64 : previewUrl}
      />
    }
  </div>

class CaptureViewer extends Component {
  constructor (props) {
    super(props)
    const {capture:{blob}} = props
    this.state = this.previewUrlState(blob)
  }

  previewUrlState = blob =>
    blob ? { previewUrl: URL.createObjectURL(blob) } : {}

  updateBlobPreview(blob) {
    this.revokePreviewURL()
    this.setState(this.previewUrlState(blob))
  }

  revokePreviewURL(){
    URL.revokeObjectURL(this.state.previewUrl)
  }

  componentWillReceiveProps({capture:{blob}}) {
    if (this.props.capture.blob !== blob) this.updateBlobPreview(blob)
  }

  componentWillUnmount() {
    this.revokePreviewURL()
  }

  render () {
    const {capture} = this.props
    return <CaptureViewerPure
      capture={{
        ...capture,
        previewUrl: this.state.previewUrl
      }}/>
  }
}

const PreviewHeader = () =>
  <div>
    <h1 className={theme.title}>Confirm capture</h1>
    <p>Please confirm that you are happy with this photo.</p>
  </div>

const RetakeAction = ({retakeAction}) =>
  <button onClick={retakeAction}
    className={`${theme.btn} ${style["btn-outline"]}`}>
    Take again
  </button>

const ConfirmAction = ({confirmAction, error}) =>
    <a href='#' className={`${theme.btn} ${theme["btn-primary"]}`}
      onClick={preventDefaultOnClick(confirmAction)}>
      { error.type === 'warn' ? 'Continue' : 'Confirm' }
    </a>

const Actions = ({retakeAction, confirmAction, error}) =>
  <div>
    <div className={classNames(
        theme.actions,
        style.actions,
        {[style.error]: error.type === 'error'}
      )}>
      <RetakeAction retakeAction={retakeAction} />
      { error.type === 'error' ?
        null : <ConfirmAction confirmAction={confirmAction} error={error}/> }
    </div>
  </div>

const Previews = ({capture, retakeAction, confirmAction, error} ) =>
  <div className={`${theme.previews} ${theme.step}`}>
    {error.type ? <Error error={error} /> : <PreviewHeader /> }
    <CaptureViewer capture={capture} />
    <Actions retakeAction={retakeAction} confirmAction={confirmAction} error={error} />
  </div>

const ProcessingApiRequest = () =>
  <div className={theme.center}>
    <Spinner />
  </div>

class Confirm extends Component  {

  constructor(props){
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      captureId: null,
      onfidoId: null,
     }
  }

  onGlareWarning = () => {
    this.setWarning('GLARE_DETECTED')
  }

  setError = (name) => this.setState({error: {name, type: 'error'}})
  setWarning = (name) => this.setState({error: {name, type: 'warn'}})

  onfidoErrorFieldMap = ([key, val]) => {
    if (key === 'document_detection') return 'INVALID_CAPTURE'
    // on corrupted PDF or other unsupported file types
    if (key === 'file') return 'INVALID_TYPE'
    // hit on PDF/invalid file type submission for face detection
    if (key === 'attachment' || key === 'attachment_content_type') return 'UNSUPPORTED_FILE'
    if (key === 'face_detection') {
      return val[0].indexOf('Multiple faces') === -1 ? 'NO_FACE_ERROR' : 'MULTIPLE_FACES_ERROR'
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

  onApiSuccess = (apiResponse) => {
    this.setState({onfidoId: apiResponse.id})
    const warnings = apiResponse.sdk_warnings
    if (warnings && !warnings.detect_glare.valid) {
      this.setState({uploadInProgress: false})
      this.onGlareWarning()
    }
    else {
      this.confirmAndProceed(apiResponse)
    }
  }

  confirmEvent = (method, side) => {
    if (method === 'document') {
      if (side === 'front') events.emit('documentCapture')
      else if (side === 'back') events.emit('documentBackCapture')
    }
    else if (method === 'face') events.emit('faceCapture')
  }

  confirmAndProceed = () => {
    const {method, side, nextStep, actions: {confirmCapture}} = this.props
    confirmCapture({method, id: this.state.captureId, onfidoId: this.state.onfidoId})
    this.confirmEvent(method, side)
    nextStep()
  }

  uploadCaptureToOnfido = () => {
    this.setState({uploadInProgress: true})
    const {validCaptures, method, side, token} = this.props
    const {blob, documentType, id} = validCaptures[0]
    this.setState({captureId: id})

    if (method === 'document') {
      const data = { file: blob, type: documentType, side}
      uploadDocument(data, token, this.onApiSuccess, this.onApiError)
    }
    else if  (method === 'face') {
      const data = { file: blob }
      uploadLivePhoto(data, token, this.onApiSuccess, this.onApiError)
    }
  }

  onConfirm = () => {
    this.state.error.type === 'warn' ?
      this.confirmAndProceed() : this.uploadCaptureToOnfido()
  }

  render = ({validCaptures, previousStep}) => (
    this.state.uploadInProgress ?
      <ProcessingApiRequest /> :
      <Previews
        capture={validCaptures[0]}
        retakeAction={() => {
          previousStep()
        }}
        confirmAction={this.onConfirm}
        error={this.state.error}
      />
  )
}

const mapStateToProps = (state, props) => {
  return {
    validCaptures: selectors.currentValidCaptures(state, props),
    unprocessedCaptures: selectors.unprocessedCaptures(state, props)
  }
}

const TrackedConfirmComponent = trackComponentAndMode(Confirm, 'confirmation', 'error')

const MapConfirm = connect(mapStateToProps)(TrackedConfirmComponent)

const DocumentFrontWrapper = (props) =>
  <MapConfirm {...props} method= 'document' side= 'front' />

const DocumentBackWrapper = (props) =>
  <MapConfirm {...props} method= 'document' side= 'back' />

const FaceConfirm = (props) =>
  <MapConfirm {...props} method= 'face' />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfrim = appendToTracking(DocumentBackWrapper, 'back')

export { DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm }
