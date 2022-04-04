import { Component, h } from 'preact'
import { sendEvent, trackException } from '../../Tracker'
import { isOfMimeType, mimeType } from '~utils/blob'
import {
  formatError,
  objectToFormData,
  sendMultiframeSelfie,
  uploadDocument,
  uploadDocumentVideoMedia,
  UploadDocumentPayload,
  uploadFacePhoto,
  uploadFaceVideo,
  UploadVideoPayload,
  UploadDocumentVideoMediaPayload,
} from '~utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Spinner from '../Spinner'
import Previews from './Previews'
import { ErrorProp, StepComponentBaseProps } from '~types/routers'
import { CapturePayload, DocumentCapture, FaceCapture } from '~types/redux'
import { CaptureMethods, DocumentSides, ErrorNames } from '~types/commons'
import {
  DocumentImageResponse,
  FaceVideoResponse,
  ImageQualityValidationPayload,
  ImageQualityValidationTypes,
  ImageQualityWarnings,
  ParsedError,
  UploadFileResponse,
  ValidationError,
  ValidationReasons,
} from '~types/api'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

type ImageQualityValidationNames =
  | 'CUTOFF_DETECTED'
  | 'GLARE_DETECTED'
  | 'BLUR_DETECTED'

type CallbackTypes = 'selfie' | 'video' | 'document'
type CallbackNames = 'onSubmitSelfie' | 'onSubmitVideo' | 'onSubmitDocument'

// The number of additional image quality retries
// that should return an error if an image quality validation is detected.
// This means that if image quality validations are detected, the user will only see an error
// on the first TWO upload attempt.
// From the third attempt, if image quality validations are detected, the user will see a warning
// and they use can choose to proceed regardless of the image quality warning
const MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR = 1

const IMAGE_QUALITY_KEYS_MAP: Partial<
  Record<ImageQualityValidationTypes, ImageQualityValidationNames>
> = {
  detect_cutoff: 'CUTOFF_DETECTED', // error with the heighest priority
  detect_glare: 'GLARE_DETECTED',
  detect_blur: 'BLUR_DETECTED',
}
const CALLBACK_TYPES: Record<CallbackTypes, CallbackNames> = {
  selfie: 'onSubmitSelfie',
  video: 'onSubmitVideo',
  document: 'onSubmitDocument',
}
const REQUEST_ERROR = 'REQUEST_ERROR'

export type ConfirmProps = {
  isFullScreen: boolean
  capture: DocumentCapture | FaceCapture
  method: CaptureMethods
  country: string
  side: DocumentSides
  error: string // for trackComponentAndMode
} & StepComponentBaseProps &
  WithLocalisedProps

type ConfirmState = {
  uploadInProgress: boolean
  error?: ErrorProp
  capture?: CapturePayload
}

class Confirm extends Component<ConfirmProps, ConfirmState> {
  startTime = 0

  constructor(props: ConfirmProps) {
    super(props)
    this.state = {
      uploadInProgress: false,
    }
  }

  setError = (name: ErrorNames, errorMessage?: unknown) => {
    const error: ErrorProp = { name, type: 'error' }
    if (errorMessage) {
      error.properties = { error_message: errorMessage }
    }

    this.setState({ error, uploadInProgress: false })
    this.props.resetSdkFocus()
  }

  setWarning = (name: ErrorNames) => {
    this.setState({ error: { name, type: 'warning' }, uploadInProgress: false })
    this.props.resetSdkFocus()
  }

  onfidoErrorFieldMap = ([key, val]: [ValidationReasons, string[]]) => {
    if (key === 'document_detection') return 'DOCUMENT_DETECTION'
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

  handleImageQualityError = (errorField: ValidationError['fields']) => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >
    for (const errorKey of imageQualityKeys) {
      if (Object.keys(errorField).includes(errorKey))
        return IMAGE_QUALITY_KEYS_MAP[errorKey]
    }
  }

  onfidoErrorReduce = ({ fields }: ValidationError) => {
    const imageQualityError = this.handleImageQualityError(fields)
    const entriesOfFields = Object.entries(fields) as Array<
      [ValidationReasons, string[]]
    >

    const [first] = entriesOfFields.map(this.onfidoErrorFieldMap)
    return first || imageQualityError
  }

  onApiError = (error: ParsedError) => {
    let errorKey, errorMessage
    const status = error.status || 0
    const response = error.response || {}

    if (this.props.mobileFlow && status === 401) {
      this.props.triggerOnError({ status, response })
      if (this.props.crossDeviceClientError) {
        return this.props.crossDeviceClientError()
      }
    } else if (status === 422) {
      errorKey = response?.error
        ? this.onfidoErrorReduce(response.error as ValidationError)
        : REQUEST_ERROR
    } else {
      this.props.triggerOnError({ status, response })
      trackException(`${status} - ${response}`)
      errorKey = REQUEST_ERROR
      errorMessage = response?.error?.message
    }

    //@ts-ignore
    this.setError(errorKey, errorMessage)
  }

  //@ts-ignore
  onVideoPreviewError = () => this.setError('VIDEO_ERROR')

  imageQualityWarnings = (warnings: ImageQualityWarnings) => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >

    const warningsKey = Object.keys(warnings) as Array<keyof typeof warnings>

    for (const warnKey of imageQualityKeys) {
      if (warningsKey.includes(warnKey) && !warnings[warnKey]?.valid)
        return IMAGE_QUALITY_KEYS_MAP[warnKey]
    }
  }

  onImageQualityWarning = (apiResponse: DocumentImageResponse) => {
    const { sdk_warnings: warnings } = apiResponse
    if (!warnings) {
      return null
    }
    return this.imageQualityWarnings(warnings)
  }

  onApiSuccess = (
    apiResponse: DocumentImageResponse | FaceVideoResponse | UploadFileResponse
  ) => {
    const { nextStep, completeStep, actions } = this.props
    const { capture } = this.state

    actions.setCaptureMetadata({ capture, apiResponse })

    const imageQualityWarning = this.onImageQualityWarning(
      apiResponse as DocumentImageResponse
    )

    if (!imageQualityWarning) {
      completeStep([apiResponse])
      nextStep()
    } else {
      this.setWarning(imageQualityWarning)
    }
  }

  handleSelfieUpload = (
    { snapshot, ...selfie }: FaceCapture,
    token: string
  ) => {
    const url = this.props.urls.onfido_api_url
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      sendMultiframeSelfie(
        snapshot,
        selfie,
        token,
        url,
        this.onApiSuccess,
        this.onApiError
      )
    } else {
      const { blob, filename, sdkMetadata } = selfie
      // filename is only present for images taken via webcam.
      // Captures that have been taken via the Uploader component do not have filename
      // and the blob is a File type
      const filePayload = filename ? { blob, filename } : blob
      uploadFacePhoto(
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
    const isPoA = poaDocumentType && poaDocumentTypes.includes(poaDocumentType)
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
      isDecoupledFromAPI,
    } = this.props

    if (!token) {
      throw new Error('token not provided')
    }

    const url = urls.onfido_api_url
    this.setState({ uploadInProgress: true })
    const { blob, filename, variant, challengeData, sdkMetadata } = capture
    this.setState({ capture })

    if (method === 'document' || method === 'poa') {
      const isPoA =
        poaDocumentType && poaDocumentTypes.includes(poaDocumentType)
      const shouldPerformImageQualityValidations =
        !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const shouldReturnErrorForImageQuality =
        imageQualityRetries <= MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR
      const imageQualityErrorType = shouldReturnErrorForImageQuality
        ? 'error'
        : 'warn'
      const validations: ImageQualityValidationPayload = {
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

      // Make sure documents always have a filename
      // A `filename` might have been defined when the capture is created
      // if filename is not present, check if `blob` has a property `name` (only available for File types, which come from the html5 file picker)
      // alternatively use default filename
      //
      const blobName =
        // @ts-ignore todo issue with blob type
        filename || blob?.name || `document_capture.${mimeType(blob)}`
      const { documentType: type } = capture as DocumentCapture
      const data: UploadDocumentPayload = {
        //@ts-ignore todo issue with blob type
        file: { blob, filename: blobName },
        type,
        side,
        validations,
        sdkMetadata,
        ...issuingCountry,
      }

      if (isDecoupledFromAPI) {
        this.onSubmitCallback(data, CALLBACK_TYPES.document)
      } else {
        uploadDocument(data, url, token)
          .then((res) => {
            // Multi Frame Capture video
            if (this.props.captures.document_video) {
              const {
                blob,
                filename,
                sdkMetadata,
              } = this.props.captures.document_video

              const data: UploadDocumentVideoMediaPayload = {
                //@ts-ignore todo issue with blob type
                file: { blob, filename },
                sdkMetadata,
                document_id: res.id,
              }
              return uploadDocumentVideoMedia(data, url, token).then(() => res)
            }

            return res
          })
          .then(this.onApiSuccess)
          .catch(this.onApiError)
      }
    } else if (variant === 'video') {
      const data: UploadVideoPayload = {
        challengeData,
        blob,
        language,
        sdkMetadata,
      }
      if (isDecoupledFromAPI) this.onSubmitCallback(data, CALLBACK_TYPES.video)
      else uploadFaceVideo(data, url, token, this.onApiSuccess, this.onApiError)
    } else if (isDecoupledFromAPI) {
      this.onSubmitCallback(capture, CALLBACK_TYPES.selfie)
    } else this.handleSelfieUpload(capture as FaceCapture, token)
  }

  onSubmitCallback = async (
    data: FaceCapture | UploadVideoPayload | UploadDocumentPayload,
    callbackName: CallbackNames
  ) => {
    const { enterpriseFeatures, method, token, urls } = this.props

    if (!token) {
      throw new Error('token not provided')
    }

    if (!enterpriseFeatures) {
      throw new Error('no enterprise features')
    }

    const url = urls.onfido_api_url
    const formDataPayload = this.prepareCallbackPayload(data, callbackName)

    const startTime = performance.now()
    // @ts-ignore
    sendEvent(`Triggering ${callbackName} callback`)
    sendEvent('Starting upload', { method })

    try {
      const enterpriseFeaturesCallback = enterpriseFeatures[callbackName]

      if (!enterpriseFeaturesCallback) {
        throw new Error('no enterprise features')
      }

      const {
        continueWithOnfidoSubmission,
        onfidoSuccessResponse,
      } = await enterpriseFeaturesCallback(formDataPayload)

      if (onfidoSuccessResponse) {
        // @ts-ignore
        sendEvent(`Success response from ${callbackName}`)
        sendEvent('Completed upload', {
          method,
          duration: Math.round(performance.now() - startTime),
        })
        this.onApiSuccess(onfidoSuccessResponse)
      } else if (continueWithOnfidoSubmission) {
        if (callbackName === CALLBACK_TYPES.document) {
          uploadDocument(
            data as UploadDocumentPayload,
            url,
            token,
            this.onApiSuccess,
            this.onApiError
          )
          return
        }

        if (callbackName === CALLBACK_TYPES.video) {
          uploadFaceVideo(
            data as UploadVideoPayload,
            url,
            token,
            this.onApiSuccess,
            this.onApiError
          )
          return
        }

        if (callbackName === CALLBACK_TYPES.selfie) {
          this.handleSelfieUpload(data as FaceCapture, token)
          return
        }
      } else {
        console.error(`Invalid return statement from ${callbackName}`)
      }
    } catch (errorResponse) {
      // @ts-ignore
      sendEvent(`Error response from ${callbackName}`)
      formatError(errorResponse, this.onApiError)
    }
  }

  prepareCallbackPayload = (
    data: FaceCapture | UploadVideoPayload | UploadDocumentPayload,
    callbackName: CallbackNames
  ) => {
    let payload
    if (callbackName === CALLBACK_TYPES.selfie) {
      const { blob, filename, snapshot } = data as FaceCapture
      payload = {
        file: filename ? { blob, filename } : blob,
        snapshot,
      }
    } else if (callbackName === CALLBACK_TYPES.video) {
      const {
        blob,
        language,
        challengeData: {
          //@ts-ignore
          challenges: challenge,
          //@ts-ignore
          id: challenge_id,
          //@ts-ignore
          switchSeconds: challenge_switch_at,
        },
      } = data as UploadVideoPayload
      payload = {
        file: blob,
        challenge: JSON.stringify(challenge),
        challenge_id,
        challenge_switch_at,
        languages: JSON.stringify([{ source: 'sdk', language_code: language }]),
      }
    } else if (callbackName === CALLBACK_TYPES.document) {
      const { file, side, type, validations } = data as UploadDocumentPayload
      payload = {
        file,
        side,
        type,
        sdk_validations: JSON.stringify(validations),
      }
    }
    return objectToFormData({
      sdk_metadata: JSON.stringify(data.sdkMetadata),
      sdk_source: process.env.SDK_SOURCE,
      sdk_version: process.env.SDK_VERSION,
      ...payload,
    })
  }

  onRetake = () => {
    const { actions, previousStep } = this.props

    const imageQualitiesKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >
    // Retake on image quality error, increase image quality retries
    const isImageQualityError = imageQualitiesKeys.find(
      (key) => IMAGE_QUALITY_KEYS_MAP[key] === this.state.error?.name
    )

    if (isImageQualityError && this.state.error?.type === 'error') {
      actions.retryForImageQuality()
    }

    previousStep()
  }

  onConfirm = () => {
    if (this.state.error?.type === 'warning') {
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
    trackScreen,
  }: ConfirmProps) => {
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
        trackScreen={trackScreen}
        method={method}
        //@ts-ignore todo optional in Previews
        documentType={documentType}
        //@ts-ignore todo optional in Previews
        poaDocumentType={poaDocumentType}
        forceRetake={error?.type === 'error'}
        onVideoError={this.onVideoPreviewError}
      />
    )
  }
}

export default Confirm
