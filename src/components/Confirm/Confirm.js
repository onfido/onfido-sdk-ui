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

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      capture: null,
    }
  }

  onGlareWarning = () => {
    this.setWarning('GLARE_DETECTED')
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
    // return a generic error if the status is 422 and the key is none of the above
    return 'SERVER_ERROR'
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

  getIssuingCountry = () => {
    const {
      documentType,
      idDocumentIssuingCountry,
      poaDocumentType,
      country,
    } = this.props
    const isPoA = poaDocumentTypes.includes(poaDocumentType)
    if (isPoA) {
      return { issuing_country: country || 'GBR' }
    }
    if (documentType === 'passport') {
      return {}
    }
    return { issuing_country: idDocumentIssuingCountry.country_alpha3 }
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
      const shouldDetectGlare = !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const validations = {
        ...(shouldDetectDocument ? { detect_document: 'error' } : {}),
        ...(shouldDetectGlare ? { detect_glare: 'warn' } : {}),
      }
      const issuingCountry = this.getIssuingCountry()
      // API does not support 'residence_permit' type but does accept 'unknown'
      // See https://documentation.onfido.com/#document-types
      const data = {
        file: blob,
        type: type === 'residence_permit' ? 'unknown' : type,
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
