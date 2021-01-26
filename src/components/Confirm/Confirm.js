import { h, Component } from 'preact'
import { trackException, sendEvent } from '../../Tracker'
import { isOfMimeType } from '~utils/blob'
import {
  uploadDocument,
  uploadLivePhoto,
  uploadDocumentVideo,
  uploadFaceVideo,
  sendMultiframeSelfie,
} from '~utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Spinner from '../Spinner'
import Previews from './Previews'

// The number of additional image quality retries
// that should return an error if an image quality validation is detected.
// This means that if image quality validations are detected, the user will only see an error
// on the first TWO upload attempt.
// From the third attempt, if image quality validations are detected, the user will see a warning
// and they use can choose to proceed regardless of the image quality warning
const MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR = 1
const IMAGE_QUALITY_KEYS_MAP = {
  detect_cutoff: 'CUTOFF_DETECTED', // error with the heighest priority
  detect_glare: 'GLARE_DETECTED',
  detect_blur: 'BLUR_DETECTED',
}
class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploadInProgress: false,
      error: {},
      capture: null,
    }
  }

  setError = (name) => {
    this.setState({ error: { name, type: 'error' }, uploadInProgress: false })
    this.props.resetSdkFocus()
  }

  setWarning = (name) => {
    this.setState({ error: { name, type: 'warn' }, uploadInProgress: false })
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

  handleImageQualityError = (errorField) => {
    for (const errorKey in IMAGE_QUALITY_KEYS_MAP) {
      if (Object.keys(errorField).includes(errorKey))
        return IMAGE_QUALITY_KEYS_MAP[errorKey]
    }
  }

  onfidoErrorReduce = ({ fields }) => {
    const imageQualityError = this.handleImageQualityError(fields)
    const [first] = Object.entries(fields).map(this.onfidoErrorFieldMap)
    return first || imageQualityError
  }

  onApiError = (error) => {
    let errorKey
    const status = error.status || ''
    const response = error.response || {}

    if (this.props.mobileFlow && status === 401) {
      this.props.triggerOnError({ status, response })
      return this.props.crossDeviceClientError()
    } else if (status === 422) {
      errorKey = this.onfidoErrorReduce(response.error) || 'REQUEST_ERROR'
    } else {
      this.props.triggerOnError({ status, response })
      trackException(`${status} - ${response}`)
      errorKey = 'REQUEST_ERROR'
    }

    this.setError(errorKey)
  }

  imageQualityWarnings = (warnings) => {
    for (const warnKey in IMAGE_QUALITY_KEYS_MAP) {
      if (Object.keys(warnings).includes(warnKey) && !warnings[warnKey].valid)
        return IMAGE_QUALITY_KEYS_MAP[warnKey]
    }
  }

  onImageQualityWarning = (apiResponse) => {
    const { sdk_warnings: warnings } = apiResponse
    if (!warnings) {
      return null
    }
    return this.imageQualityWarnings(warnings)
  }

  onApiSuccess = (apiResponse) => {
    const { method, nextStep, actions } = this.props
    const { capture } = this.state

    const duration = Math.round(performance.now() - this.startTime)
    sendEvent('Completed upload', { duration, method })

    actions.setCaptureMetadata({ capture, apiResponse })

    const imageQualityWarning = this.onImageQualityWarning(apiResponse)

    if (!imageQualityWarning) {
      // wait a tick to ensure the action completes before progressing
      setTimeout(nextStep, 0)
    } else {
      this.setWarning(imageQualityWarning)
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
    const { idDocumentIssuingCountry, poaDocumentType, country } = this.props
    const isPoA = poaDocumentTypes.includes(poaDocumentType)
    if (isPoA) {
      return { issuing_country: country || 'GBR' }
    }
    if (idDocumentIssuingCountry && idDocumentIssuingCountry.country_alpha3) {
      return { issuing_country: idDocumentIssuingCountry.country_alpha3 }
    }
    return {}
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
      imageQualityRetries,
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

    if (variant === 'video') {
      if (method === 'document') {
        const data = { blob, sdkMetadata }
        uploadDocumentVideo(
          data,
          url,
          token,
          this.onApiSuccess,
          this.onApiError
        )
        return
      }

      if (method === 'face') {
        const data = { challengeData, blob, language, sdkMetadata }
        uploadFaceVideo(data, url, token, this.onApiSuccess, this.onApiError)
        return
      }

      return
    }

    if (method === 'face') {
      this.handleSelfieUpload(capture, token)
      return
    }

    if (method === 'document') {
      const isPoA = poaDocumentTypes.includes(poaDocumentType)
      const shouldPerformImageQualityValidations =
        !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const shouldReturnErrorForImageQuality =
        imageQualityRetries <= MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR
      const imageQualityErrorType = shouldReturnErrorForImageQuality
        ? 'error'
        : 'warn'
      const validations = {
        ...(shouldDetectDocument ? { detect_document: 'error' } : {}),
        ...(shouldPerformImageQualityValidations
          ? {
              detect_cutoff: imageQualityErrorType,
              detect_glare: imageQualityErrorType,
              detect_blur: imageQualityErrorType,
            }
          : {}),
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
    }
  }

  onRetake = () => {
    const { actions, previousStep } = this.props

    // Retake on image quality error, increase image quality retries
    const isImageQualityError = Object.keys(IMAGE_QUALITY_KEYS_MAP).find(
      (key) => IMAGE_QUALITY_KEYS_MAP[key] === this.state.error.name
    )

    if (isImageQualityError && this.state.error.type === 'error') {
      actions.retryForImageQuality()
    }

    previousStep()
  }

  onConfirm = () => {
    if (this.state.error.type === 'warn') {
      this.props.actions.resetImageQualityRetries()
      this.props.nextStep()
    } else {
      this.uploadCaptureToOnfido()
    }
  }

  render = ({
    capture,
    method,
    documentType,
    poaDocumentType,
    isFullScreen,
  }) => {
    const { error, uploadInProgress } = this.state

    if (uploadInProgress) {
      return <Spinner />
    }

    return (
      <Previews
        isFullScreen={isFullScreen}
        capture={capture}
        retakeAction={this.onRetake}
        confirmAction={this.onConfirm}
        isUploading={uploadInProgress}
        error={error}
        method={method}
        documentType={documentType}
        poaDocumentType={poaDocumentType}
        forceRetake={error.type === 'error'}
      />
    )
  }
}

export default Confirm
