import { h, Component } from 'preact'
import { connect } from 'react-redux'
import theme from '../Theme/style.css'
import style from './style.css'
import classNames from 'classnames'
import { isOfFileType } from '~utils/blob'
import { includes, cleanFalsy } from '~utils/array'
import { preventDefaultOnClick } from '~utils/index'
import { uploadDocument, uploadLivePhoto, uploadLiveVideo } from '~utils/onfidoApi'
import CaptureViewer from './CaptureViewer'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Error from '../Error'
import Spinner from '../Spinner'
import Title from '../Title'
import { trackException, trackComponentAndMode, appendToTracking, sendEvent } from '../../Tracker'
import { localised } from '../../locales'

const RetakeAction = localised(({retakeAction, translate}) =>
  <button onClick={retakeAction}
    className={`${theme.btn} ${theme['btn-outline']} ${style.retake}`}>
    {translate('confirm.redo')}
  </button>
)

const ConfirmAction = localised(({confirmAction, translate, error}) =>
  <button href='#' className={`${theme.btn} ${theme["btn-primary"]}`}
    onClick={preventDefaultOnClick(confirmAction)}>
    { error.type === 'warn' ? translate('confirm.continue') : translate('confirm.confirm') }
  </button>
)

const Actions = ({retakeAction, confirmAction, error}) =>
  <div className={style.actionsContainer}>
    <div className={classNames(
        theme.actions,
        style.actions,
        {[style.error]: error.type === 'error'}
      )}>
      <RetakeAction {...{retakeAction}} />
      { error.type === 'error' ?
        null : <ConfirmAction {...{confirmAction, error}} /> }
    </div>
  </div>


const Previews = localised(({capture, retakeAction, confirmAction, error, method, documentType, translate, isFullScreen}) => {
  const title = method === 'face' ?
    translate(`confirm.face.${capture.variant}.title`) :
    translate(`confirm.${method}.title`)

  const subTitle = method === 'face' ?
    translate(`confirm.face.${capture.variant}.message`) :
    translate(`confirm.${documentType}.message`)

  const previewableCapture = method === 'face' && capture.variant === 'standard' ?
    capture.selfie : capture

  return (
    <div className={classNames(style.previewsContainer, {
      [style.previewsContainerIsFullScreen]: isFullScreen,
    })}>
      { error.type ? <Error {...{error, withArrow: true}} /> :
        <Title title={title} subTitle={subTitle} smaller={true} className={style.title}/> }
        <CaptureViewer {...{ method, isFullScreen }} capture={previewableCapture} />
      <Actions {...{retakeAction, confirmAction, error}} />
    </div>
  )
})

const chainMultiframeUpload = (snapshot, selfie, token, onSuccess, onError) => {
  const snapshotData = {
    file: {
      blob: snapshot.blob,
      filename: snapshot.filename
    },
    sdkMetadata: snapshot.sdkMetadata,
    snapshot: true,
    advanced_validation: false
  }
  const { blob, filename, sdkMetadata } = selfie
  // try to upload snapshot first, if success upload selfie, else handle error
  uploadLivePhoto(snapshotData, token,
    () => uploadLivePhoto({ file: { blob, filename }, sdkMetadata }, token,
      onSuccess, onError
    ),
    onError
  )
}

class Confirm extends Component {

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
    if (this.props.mobileFlow && status === 401) {
      return this.props.crossDeviceClientError()
    }
    else if (status === 422) {
      errorKey = this.onfidoErrorReduce(response.error)
    }
    else {
      trackException(`${status} - ${response}`)
      errorKey = 'SERVER_ERROR'
    }

    this.setState({uploadInProgress: false})
    this.setError(errorKey)
  }

  onApiSuccess = (apiResponse) => {
    const duration = Math.round(performance.now() - this.startTime)
    sendEvent('Completed upload', {duration, method: this.props.method})
    this.setState({onfidoId: apiResponse.id})
    const warnings = apiResponse.sdk_warnings
    if (warnings && !warnings.detect_glare.valid) {
      this.setState({uploadInProgress: false})
      this.onGlareWarning()
    }
    else {
      this.props.nextStep()
    }
  }

  handleSelfieUpload = ({snapshot, selfie }, token) => {
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      chainMultiframeUpload(snapshot, selfie, token,
        this.onApiSuccess, this.onApiError
      )
    }
    else {
      const { blob, filename, sdkMetadata } = selfie
      // filename is only present for images taken via webcam.
      // Captures that have been taken via the Uploader component do not have filename
      // and the blob is a File type
      const filePayload = filename ? { blob, filename } : blob
      uploadLivePhoto({ file: filePayload, sdkMetadata }, token,
        this.onApiSuccess, this.onApiError
      )
    }
  }

  uploadCaptureToOnfido = () => {
    const {capture, method, side, token, documentType, language} = this.props
    this.startTime = performance.now()
    sendEvent('Starting upload', {method})
    this.setState({uploadInProgress: true})
    const {blob, documentType: type, id, variant, challengeData, sdkMetadata} = capture
    this.setState({captureId: id})

    if (method === 'document') {
      const isPoA = includes(poaDocumentTypes, documentType)
      const shouldDetectGlare = !isOfFileType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { 'detect_document': 'error' } : {}),
        ...(shouldDetectGlare ? { 'detect_glare': 'warn' } : {}),
      }
      const issuingCountry = isPoA ? { 'issuing_country': this.props.country || 'GBR' } : {}
      const data = { file: blob, type, side, validations, ...issuingCountry}
      uploadDocument(data, token, this.onApiSuccess, this.onApiError)
    }
    else if (method === 'face') {
      if (variant === 'video') {
        const data = { challengeData, blob, language, sdkMetadata}
        uploadLiveVideo(data, token, this.onApiSuccess, this.onApiError)
      }
      else {
        this.handleSelfieUpload(capture, token)
      }
    }
  }

  onConfirm = () => {
    this.state.error.type === 'warn' ?
      this.props.nextStep() : this.uploadCaptureToOnfido()
  }

  render = ({capture, previousStep, method, documentType, isFullScreen}) => (
    this.state.uploadInProgress ?
      <Spinner /> :
      <Previews
        isFullScreen={isFullScreen}
        capture={capture}
        retakeAction={previousStep}
        confirmAction={this.onConfirm}
        error={this.state.error}
        method={method}
        documentType={documentType}
      />
  )
}

const captureKey = (...args) => cleanFalsy(args).join('_')

const mapStateToProps = (state, { method, side }) => ({
  capture: state.captures[captureKey(method, side)],
  isFullScreen: state.globals.isFullScreen,
})

const TrackedConfirmComponent = trackComponentAndMode(Confirm, 'confirmation', 'error')

const MapConfirm = connect(mapStateToProps)(localised(TrackedConfirmComponent))

const DocumentFrontWrapper = (props) =>
  <MapConfirm {...props} method="document" side="front" />

const DocumentBackWrapper = (props) =>
  <MapConfirm {...props} method="document" side="back" />

const BaseFaceConfirm = (props) =>
  <MapConfirm {...props} method="face" />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const VideoConfirm = appendToTracking(BaseFaceConfirm, 'video')

export { DocumentFrontConfirm, DocumentBackConfirm, SelfieConfirm, VideoConfirm}
