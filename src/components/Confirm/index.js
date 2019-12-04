import { h, Component } from 'preact'
import { connect } from 'react-redux'
import style from './style.css'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import { isOfMimeType } from '~utils/blob'
import { cleanFalsy } from '~utils/array'
import { uploadDocument, uploadLivePhoto, uploadLiveVideo } from '~utils/onfidoApi'
import CaptureViewer from './CaptureViewer'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Button from '../Button'
import Error from '../Error'
import Spinner from '../Spinner'
import PageTitle from '../PageTitle'
import { trackException, trackComponentAndMode, appendToTracking, sendEvent } from '../../Tracker'
import { localised } from '../../locales'

const RetakeAction = localised(({retakeAction, translate}) =>
  <Button
    onClick={retakeAction}
    className={style['btn-secondary']}
    variants={['secondary']}
  >
    {translate('confirm.redo')}
  </Button>
)

const ConfirmAction = localised(({ confirmAction, isUploading, translate, error }) =>
  <Button
    className={style['btn-primary']}
    variants={['primary']}
    onClick={confirmAction}
    disabled={isUploading}
  >
    { error.type === 'warn' ? translate('confirm.continue') : translate('confirm.confirm') }
  </Button>
)

const Actions = ({ retakeAction, confirmAction, isUploading, error }) => (
  <div className={style.actionsContainer}>
    <div className={classNames(
        style.actions,
        {[style.error]: error.type === 'error'}
      )}>
      <RetakeAction {...{retakeAction}} />
      { error.type === 'error' ?
        null : <ConfirmAction {...{ confirmAction, isUploading, error }} /> }
    </div>
  </div>
)

const Previews = localised(
  ({ capture, retakeAction, confirmAction, error, method, documentType, translate, isFullScreen, isUploading }) => {
  const methodNamespace = method === 'face' ? `confirm.face.${capture.variant}` : `confirm.${method}`
  const title = translate(`${methodNamespace}.title`)
  const imageAltTag = translate(`${methodNamespace}.alt`)
  const videoAriaLabel = translate('accessibility.replay_video')
  const message = method === 'face' ?
    translate(`confirm.face.${capture.variant}.message`) :
    translate(`confirm.${documentType}.message`)

  return (
    <div className={classNames(style.previewsContainer, theme.fullHeightContainer, {
      [style.previewsContainerIsFullScreen]: isFullScreen,
    })}>
      { isFullScreen ? null :
          error.type ?
            <Error {...{error, withArrow: true, role: "alert", focusOnMount: false}} /> :
            <PageTitle title={title} smaller={true} className={style.title}/> }
      <CaptureViewer {...{ capture, method, isFullScreen, imageAltTag, videoAriaLabel }} />
        {!isFullScreen &&
          <div>
            <p className={style.message}>
              {message}
            </p>
            <Actions {...{ retakeAction, confirmAction, isUploading, error }} />
          </div>
        }
    </div>
  )
  }
)

const chainMultiframeUpload = (snapshot, selfie, token, url, onSuccess, onError) => {
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
  uploadLivePhoto(
    snapshotData,
    url,
    token,
    () => uploadLivePhoto({ file: { blob, filename }, sdkMetadata }, url, token, onSuccess, onError),
    onError
  )
}

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      capture: null
    }
  }

  onGlareWarning = () => {
    this.setWarning('GLARE_DETECTED')
  }

  setError = name => this.setState({ error: { name, type: 'error' } })
  setWarning = name => this.setState({ error: { name, type: 'warn' } })

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

  onfidoErrorReduce = ({ fields }) => {
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first
  }

  onApiError = ({ status, response }) => {
    let errorKey
    if (this.props.mobileFlow && status === 401) {
      this.props.triggerOnError({ status, response })
      return this.props.crossDeviceClientError()
    } else if (status === 422) {
      errorKey = this.onfidoErrorReduce(response.error)
    } else {
      this.props.triggerOnError({ status, response })
      trackException(`${status} - ${response}`)
      errorKey = 'SERVER_ERROR'
    }

    this.setState({ uploadInProgress: false })
    this.setError(errorKey)
  }

  onApiSuccess = apiResponse => {
    const { method, nextStep, actions } = this.props
    const { capture } = this.state

    const duration = Math.round(performance.now() - this.startTime)
    sendEvent('Completed upload', { duration, method })

    actions.setCaptureMetadata({ capture, apiResponse })

    const warnings = apiResponse.sdk_warnings
    if (warnings && !warnings.detect_glare.valid) {
      this.setState({ uploadInProgress: false })
      this.onGlareWarning()
    } else {
      // wait a tick to ensure the action completes before progressing
      setTimeout(nextStep, 0)
    }
  }

  handleSelfieUpload = ({ snapshot, ...selfie }, token) => {
    const url = this.props.urls.onfido_api_url
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      sendEvent('Starting multiframe selfie upload')
      chainMultiframeUpload(snapshot, selfie, token, url, this.onApiSuccess, this.onApiError)
    } else {
      const { blob, filename, sdkMetadata } = selfie
      // filename is only present for images taken via webcam.
      // Captures that have been taken via the Uploader component do not have filename
      // and the blob is a File type
      const filePayload = filename ? { blob, filename } : blob
      uploadLivePhoto({ file: filePayload, sdkMetadata }, url, token, this.onApiSuccess, this.onApiError)
    }
  }

  uploadCaptureToOnfido = () => {
    const { urls, capture, method, side, token, poaDocumentType, language } = this.props
    const url = urls.onfido_api_url
    this.startTime = performance.now()
    sendEvent('Starting upload', { method })
    this.setState({ uploadInProgress: true })
    const { blob, documentType: type, variant, challengeData, sdkMetadata } = capture
    this.setState({ capture })

    if (method === 'document') {
      const isPoA = poaDocumentTypes.includes(poaDocumentType)
      const shouldDetectGlare = !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { detect_document: 'error' } : {}),
        ...(shouldDetectGlare ? { detect_glare: 'warn' } : {})
      }
      const issuingCountry = isPoA ? { issuing_country: this.props.country || 'GBR' } : {}
      const data = { file: blob, type, side, validations, ...issuingCountry }
      uploadDocument(data, url, token, this.onApiSuccess, this.onApiError)
    } else if (method === 'face') {
      if (variant === 'video') {
        const data = { challengeData, blob, language, sdkMetadata }
        uploadLiveVideo(data, url, token, this.onApiSuccess, this.onApiError)
      } else {
        this.handleSelfieUpload(capture, token)
      }
    }
  }

  onConfirm = () => {
    this.state.error.type === 'warn' ? this.props.nextStep() : this.uploadCaptureToOnfido()
  }

  render = ({ capture, previousStep, method, documentType, isFullScreen }) =>
    this.state.uploadInProgress ? (
      <Spinner />
    ) : (
      <Previews
        isFullScreen={isFullScreen}
        capture={capture}
        retakeAction={previousStep}
        confirmAction={this.onConfirm}
        isUploading={this.state.uploadInProgress}
        error={this.state.error}
        method={method}
        documentType={documentType}
      />
  )
}

const captureKey = (...args) => cleanFalsy(args).join('_')

const mapStateToProps = (state, { method, side }) => ({
  capture: state.captures[captureKey(method, side)],
  isFullScreen: state.globals.isFullScreen
})

const TrackedConfirmComponent = trackComponentAndMode(Confirm, 'confirmation', 'error')

const MapConfirm = connect(mapStateToProps)(localised(TrackedConfirmComponent))

const DocumentFrontWrapper = props => <MapConfirm {...props} method="document" side="front" />

const DocumentBackWrapper = props => <MapConfirm {...props} method="document" side="back" />

const BaseFaceConfirm = props => <MapConfirm {...props} method="face" />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const VideoConfirm = appendToTracking(BaseFaceConfirm, 'video')

export { DocumentFrontConfirm, DocumentBackConfirm, SelfieConfirm, VideoConfirm }
