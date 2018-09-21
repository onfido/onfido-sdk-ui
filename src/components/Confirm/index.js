import { h, Component } from 'preact'
import { selectors } from '../../core'
import { connect } from 'react-redux'
import theme from '../Theme/style.css'
import style from './style.css'
import classNames from 'classnames'
import { isOfFileType } from '../utils/file'
import { includes } from '../utils/array'
import {preventDefaultOnClick} from '../utils'
import { uploadDocument, uploadLivePhoto, uploadLiveVideo } from '../utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import PdfViewer from './PdfPreview'
import EnlargedPreview from '../EnlargedPreview'
import Error from '../Error'
import Spinner from '../Spinner'
import Title from '../Title'
import { trackException, trackComponentAndMode, appendToTracking, sendEvent } from '../../Tracker'

const CaptureViewerPure = ({capture:{blob, base64, previewUrl, variant}, isDocument, i18n, isFullScreen, useFullScreen}) =>
  <div className={style.captures}>
    {isOfFileType(['pdf'], blob) ?
      <PdfViewer previewUrl={previewUrl} blob={blob}/> :
      variant === 'video' ?
        <video className={style.video} src={previewUrl} controls/> :
        <span className={classNames(style.imageWrapper, {
          [style.fullscreenImageWrapper]: isFullScreen,
        })}>
          {
            isDocument &&
              <EnlargedPreview
                {...{i18n, useFullScreen}}
                src={blob instanceof File ? base64 : previewUrl}
              />
          }
          <img className={style.image}
            //we use base64 if the capture is a File, since its base64 version is exif rotated
            //if it's not a File (just a Blob), it means it comes from the webcam,
            //so the base64 version is actually lossy and since no rotation is necessary
            //the blob is the best candidate in this case
            src={blob instanceof File ? base64 : previewUrl}
          />
        </span>
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
    const {capture, method, i18n, useFullScreen, isFullScreen} = this.props
    return <CaptureViewerPure
      i18n={i18n}
      useFullScreen={useFullScreen}
      isFullScreen={isFullScreen}
      isDocument={ method === 'document' }
      capture={{
        ...capture,
        previewUrl: this.state.previewUrl
      }}/>
  }
}

const RetakeAction = ({retakeAction, i18n}) =>
  <button onClick={retakeAction}
    className={`${theme.btn} ${theme['btn-outline']} ${style.retake}`}>
    {i18n.t('confirm.redo')}
  </button>

const ConfirmAction = ({confirmAction, i18n, error}) =>
    <button href='#' className={`${theme.btn} ${theme["btn-primary"]}`}
      onClick={preventDefaultOnClick(confirmAction)}>
      { error.type === 'warn' ? i18n.t('confirm.continue') : i18n.t('confirm.confirm') }
    </button>

const Actions = ({retakeAction, confirmAction, error, i18n}) =>
  <div className={style.actionsContainer}>
    <div className={classNames(
        theme.actions,
        style.actions,
        {[style.error]: error.type === 'error'}
      )}>
      <RetakeAction {...{retakeAction, i18n}} />
      { error.type === 'error' ?
        null : <ConfirmAction {...{confirmAction, i18n, error}} /> }
    </div>
  </div>

const Previews = ({capture, retakeAction, confirmAction, error, method, documentType, i18n, useFullScreen, isFullScreen}) => {
  const title = method === 'face' ?
    i18n.t(`confirm.face.${capture.variant}.title`) :
    i18n.t(`confirm.${method}.title`)

  const subTitle = method === 'face' ?
    i18n.t(`confirm.face.${capture.variant}.message`) :
    i18n.t(`confirm.${documentType}.message`)

  return (
    <div className={classNames(style.previewsContainer, {
      [style.previewsContainerIsFullScreen]: isFullScreen,
    })}>
      { error.type ? <Error {...{error, i18n, withArrow: true}} /> :
        <Title title={title} subTitle={subTitle} smaller={true} className={style.title}/> }
        <div className={classNames(theme.imageWrapper, {
          [style.videoWrapper]: capture.variant === 'video',
        })}>
          <CaptureViewer {...{capture, i18n, method, useFullScreen, isFullScreen }} />
        </div>
      <Actions {...{retakeAction, confirmAction, i18n, error}} />
    </div>
  )
}

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

  uploadCaptureToOnfido = () => {
    const {validCaptures, method, side, token, documentType} = this.props
    this.startTime = performance.now()
    sendEvent('Starting upload', {method})
    this.setState({uploadInProgress: true})
    const {blob, documentType: type, id, variant, challengeData} = validCaptures[0]
    this.setState({captureId: id})

    if (method === 'document') {
      const isPoA = includes(poaDocumentTypes, documentType)
      const shouldDetectGlare = !isOfFileType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { 'detect_document': 'error' } : {}),
        ...(shouldDetectGlare ? { 'detect_glare': 'warn' } : {}),
      }
      const data = { file: blob, type, side, validations}
      uploadDocument(data, token, this.onApiSuccess, this.onApiError)
    }
    else if  (method === 'face') {
      if (variant === 'video') {
        const data = { challengeData, blob, language: this.props.i18n.currentLocale }
        uploadLiveVideo(data, token, this.onApiSuccess, this.onApiError)
      } else {
        const data = { file: blob }
        uploadLivePhoto(data, token, this.onApiSuccess, this.onApiError)
      }
    }
  }

  onConfirm = () => {
    this.state.error.type === 'warn' ?
      this.props.nextStep() : this.uploadCaptureToOnfido()
  }

  render = ({validCaptures, previousStep, method, documentType, i18n, useFullScreen, isFullScreen}) => (
    this.state.uploadInProgress ?
      <Spinner /> :
      <Previews
        {...{i18n, useFullScreen, isFullScreen}}
        capture={validCaptures[0]}
        retakeAction={() => {
          previousStep()
        }}
        confirmAction={this.onConfirm}
        error={this.state.error}
        method={method}
        documentType={documentType}
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

const BaseFaceConfirm = (props) =>
  <MapConfirm {...props} method='face' />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const FaceConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const LivenessConfirm = appendToTracking(BaseFaceConfirm, 'video')

export { DocumentFrontConfirm, DocumentBackConfirm, FaceConfirm, LivenessConfirm}
