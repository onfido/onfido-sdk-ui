import { h, Component } from 'preact'
import { trackException, sendEvent } from '../../Tracker'
import { isOfMimeType } from '~utils/blob'
import {
  uploadDocument,
  uploadLivePhoto,
  uploadLiveVideo,
  sendMultiframeSelfie,
} from '~utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Spinner from '../Spinner'
import Previews from './Previews'

// const MAX_RETRIES_FOR_FAIL_FAST = 2

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      capture: null,
      /**
       * Number of retries on fail-fast reasons: cut-off, glare, blurry
       * If the API returns warning on one of those reasons, increase this state by 1 and ask for redo
       * After at most MAX_RETRIES_FOR_FAIL_FAST retries and there's still warning, allow user to process
       */
      failFastRetries: 0,
    }
  }

  setError = (name) => {
    this.setState({ error: { name, type: 'error' } })
    this.props.resetSdkFocus()
  }

  setWarning = (name) => {
    this.setState({ error: { name, type: 'warn' } })
    this.props.resetSdkFocus()
  }

  onfidoErrorFieldMap = ([key, val]) => {
    if (key === 'document_detection') return 'INVALID_CAPTURE'
    // on corrupted PDF or other unsupported file types
    if (key === 'file') return 'INVALID_TYPE'
    // hit on PDF/invalid file type submission for face detection
    if (key === 'attachment' || key === 'attachment_content_type')
      return 'UNSUPPORTED_FILE'
    if (key === 'face_detection') {
      return val[0].indexOf('Multiple faces') === -1
        ? 'NO_FACE_ERROR'
        : 'MULTIPLE_FACES_ERROR'
    }
  }

  onfidoErrorReduce = ({ fields }) => {
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first
  }

  onApiError = (error) => {
    let errorKey
    const status = error.status || ''
    const response = error.response || {}

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

  onApiSuccess = (apiResponse) => {
    const { method, nextStep, actions } = this.props
    const { capture } = this.state

    const duration = Math.round(performance.now() - this.startTime)
    sendEvent('Completed upload', { duration, method })

    actions.setCaptureMetadata({ capture, apiResponse })

    const failFastWarningType = this.getFailFastWarningType(apiResponse)

    // No fail-fast warnings detected
    if (!failFastWarningType) {
      // wait a tick to ensure the action completes before progressing
      setTimeout(nextStep, 0)
    } else {
      this.setState({ uploadInProgress: false })
      this.setWarning(failFastWarningType)
    }
  }

  getFailFastWarningType = (apiResponse) => {
    const { sdk_warnings: warnings } = apiResponse

    // No warnings at all
    if (!warnings) {
      return null
    }

    // Glare
    if (!warnings.detect_glare.valid) {
      return 'GLARE_DETECTED'
    }

    // Not interested in any other warnings
    return null
  }

  handleSelfieUpload = ({ snapshot, ...selfie }, token) => {
    const url = this.props.urls.onfido_api_url
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      sendMultiframeSelfie(
        snapshot,
        selfie,
        token,
        url,
        this.onApiSuccess,
        this.onApiError,
        sendEvent
      )
    } else {
      const { blob, filename, sdkMetadata } = selfie
      // filename is only present for images taken via webcam.
      // Captures that have been taken via the Uploader component do not have filename
      // and the blob is a File type
      const filePayload = filename ? { blob, filename } : blob
      uploadLivePhoto(
        { file: filePayload, sdkMetadata },
        url,
        token,
        this.onApiSuccess,
        this.onApiError
      )
    }
  }

  uploadCaptureToOnfido = () => {
    const {
      urls,
      capture,
      method,
      side,
      token,
      poaDocumentType,
      language,
    } = this.props
    const url = urls.onfido_api_url
    this.startTime = performance.now()
    sendEvent('Starting upload', { method })
    this.setState({ uploadInProgress: true })
    const {
      blob,
      documentType: type,
      variant,
      challengeData,
      sdkMetadata,
    } = capture
    this.setState({ capture })

    if (method === 'document') {
      const isPoA = poaDocumentTypes.includes(poaDocumentType)
      const shouldWarnForFailFast = !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { detect_document: 'error' } : {}),
        ...(shouldWarnForFailFast
          ? {
              detect_cut_off: 'warn',
              detect_glare: 'warn',
              detect_blurry: 'warn',
            }
          : {}),
      }
      const issuingCountry = isPoA
        ? { issuing_country: this.props.country || 'GBR' }
        : {}
      const data = {
        file: blob,
        type,
        side,
        validations,
        sdkMetadata,
        ...issuingCountry,
      }
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
    this.state.error.type === 'warn'
      ? this.props.nextStep()
      : this.uploadCaptureToOnfido()
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

export default Confirm
