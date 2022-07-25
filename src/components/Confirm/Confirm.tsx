import { h } from 'preact'
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
import { DocumentCapture, FaceCapture } from '~types/redux'
import { CaptureMethods, DocumentSides, ErrorNames } from '~types/commons'
import {
  ApiRawError,
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
import { WithLocalisedProps } from '~types/hocs'
import { useEffect, useState } from 'preact/hooks'
import useSdkConfigurationService from '~contexts/useSdkConfigurationService'

type ImageQualityValidationNames =
  | 'CUTOFF_DETECTED'
  | 'GLARE_DETECTED'
  | 'BLUR_DETECTED'

type CallbackTypes = 'selfie' | 'video' | 'document'
type CallbackNames = 'onSubmitSelfie' | 'onSubmitVideo' | 'onSubmitDocument'

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
  error: string
} & StepComponentBaseProps &
  WithLocalisedProps

export const Confirm = (props: ConfirmProps) => {
  const [uploadInProgress, setUploadInProgress] = useState(false)
  const [error, setErrorProp] = useState<ErrorProp | undefined>(undefined)
  const sdkConfiguration = useSdkConfigurationService()

  useEffect(() => {
    props.trackScreen(undefined, {
      document_type: props.documentType,
      country_code: props.idDocumentIssuingCountry?.country_alpha2,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setError = (name: ErrorNames, errorMessage?: unknown) => {
    const error: ErrorProp = { name, type: 'error' }
    if (errorMessage) {
      error.properties = { error_message: errorMessage }
    }

    setErrorProp(error)
    setUploadInProgress(false)
    props.resetSdkFocus()
  }

  const setWarning = (name: ErrorNames) => {
    setErrorProp({ name, type: 'warning' })
    setUploadInProgress(false)
    props.resetSdkFocus()
  }

  const onfidoErrorFieldMap = ([key, val]: [ValidationReasons, string[]]) => {
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

  const handleImageQualityError = (errorField: ValidationError['fields']) => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >
    for (const errorKey of imageQualityKeys) {
      if (Object.keys(errorField).includes(errorKey))
        return IMAGE_QUALITY_KEYS_MAP[errorKey]
    }
  }

  const onfidoErrorReduce = ({ fields }: ValidationError) => {
    const imageQualityError = handleImageQualityError(fields)
    const entriesOfFields = Object.entries(fields) as Array<
      [ValidationReasons, string[]]
    >

    const [first] = entriesOfFields.map(onfidoErrorFieldMap)
    return first || imageQualityError
  }

  const onApiError = (error: ParsedError) => {
    const status = error.status || 0
    const response = error.response || {}

    if (props.mobileFlow && status === 401) {
      props.triggerOnError({ status, response })
      if (props.crossDeviceClientError) {
        return props.crossDeviceClientError()
      }
      return
    }
    if (status === 422) {
      const errorKey = response?.error
        ? onfidoErrorReduce(response.error as ValidationError)
        : REQUEST_ERROR
      setError(errorKey as ErrorNames)
      return
    }
    if (status === 403 && response.error?.type === 'geoblocked_request') {
      setError(
        'GEOBLOCKED_ERROR',
        'generic.errors.geoblocked_error.instruction'
      )
      return
    }

    props.triggerOnError({ status, response })
    trackException(`${status} - ${response}`)
    setError(REQUEST_ERROR, response?.error?.message)
  }

  const onVideoPreviewError = () => setError('VIDEO_ERROR' as ErrorNames)

  const imageQualityWarnings = (warnings: ImageQualityWarnings) => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >

    const warningsKey = Object.keys(warnings) as Array<keyof typeof warnings>

    for (const warnKey of imageQualityKeys) {
      if (warningsKey.includes(warnKey) && !warnings[warnKey]?.valid)
        return IMAGE_QUALITY_KEYS_MAP[warnKey]
    }
  }

  const onImageQualityWarning = (apiResponse: DocumentImageResponse) => {
    const { sdk_warnings: warnings } = apiResponse
    if (!warnings) {
      return null
    }
    return imageQualityWarnings(warnings)
  }

  const onApiSuccess = (
    apiResponse: DocumentImageResponse | FaceVideoResponse | UploadFileResponse
  ) => {
    const { nextStep, completeStep, actions, capture } = props

    actions.setCaptureMetadata({ capture, apiResponse })

    const imageQualityWarning = onImageQualityWarning(
      apiResponse as DocumentImageResponse
    )

    if (!imageQualityWarning) {
      completeStep([{ id: apiResponse.id }])
      nextStep()
    } else {
      setWarning(imageQualityWarning)
    }
  }

  const handleSelfieUpload = (
    { snapshot, ...selfie }: FaceCapture,
    token: string
  ) => {
    const url = props.urls.onfido_api_url
    // if snapshot is present, it needs to be uploaded together with the user initiated selfie
    if (snapshot) {
      sendMultiframeSelfie(
        snapshot,
        selfie,
        token,
        url,
        onApiSuccess,
        onApiError
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
        onApiSuccess,
        onApiError
      )
    }
  }

  const getIssuingCountry = () => {
    const {
      idDocumentIssuingCountry,
      poaDocumentType,
      poaDocumentCountry,
    } = props

    const isPoA = poaDocumentType && poaDocumentTypes.includes(poaDocumentType)

    if (isPoA) {
      return { issuing_country: poaDocumentCountry?.country_alpha3 || 'GBR' }
    }
    if (idDocumentIssuingCountry && idDocumentIssuingCountry.country_alpha3) {
      return { issuing_country: idDocumentIssuingCountry.country_alpha3 }
    }
    return {}
  }

  const uploadCaptureToOnfido = () => {
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
    } = props

    if (!token) {
      throw new Error('token not provided')
    }

    const url = urls.onfido_api_url
    setUploadInProgress(true)
    const { blob, filename, variant, challengeData, sdkMetadata } = capture

    if (method === 'document' || method === 'poa') {
      const isPoA =
        poaDocumentType && poaDocumentTypes.includes(poaDocumentType)
      const shouldPerformImageQualityValidations =
        !isOfMimeType(['pdf'], blob) && !isPoA
      const shouldDetectDocument = !isPoA
      const shouldReturnErrorForImageQuality =
        imageQualityRetries <=
        sdkConfiguration.document_capture.max_total_retries
      const imageQualityErrorType = shouldReturnErrorForImageQuality
        ? 'error'
        : 'warn'

      // create sdk validation payload to send to the backend.
      // if the specific document detection (for example, detect_glare) issue happens on the backend:
      //  - if it was requested as an 'error', then an error 422 will be sent from the backend.
      //  - if it was requested as a 'warn', then there will be no HTTP error.
      // If an error is returned from the backend, the idea is to force the user to retry with a new document capture.
      // If a warning is returned, the end user can either retry a new document capture or upload the current document anyway.
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
      const issuingCountry = getIssuingCountry()

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
        onSubmitCallback(data, CALLBACK_TYPES.document)
      } else {
        uploadDocument(data, url, token)
          .then((res) => {
            // Multi Frame Capture video
            if (props.captures.document_video) {
              const {
                blob,
                filename,
                sdkMetadata,
              } = props.captures.document_video

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
          .then(onApiSuccess)
          .catch(onApiError)
      }
    } else if (variant === 'video') {
      const data: UploadVideoPayload = {
        challengeData,
        blob,
        language,
        sdkMetadata,
      }
      if (isDecoupledFromAPI) onSubmitCallback(data, CALLBACK_TYPES.video)
      else uploadFaceVideo(data, url, token, onApiSuccess, onApiError)
    } else if (isDecoupledFromAPI) {
      onSubmitCallback(capture, CALLBACK_TYPES.selfie)
    } else handleSelfieUpload(capture as FaceCapture, token)
  }

  const onSubmitCallback = async (
    data: FaceCapture | UploadVideoPayload | UploadDocumentPayload,
    callbackName: CallbackNames
  ) => {
    const { enterpriseFeatures, method, token, urls } = props

    if (!token) {
      throw new Error('token not provided')
    }

    if (!enterpriseFeatures) {
      throw new Error('no enterprise features')
    }

    const url = urls.onfido_api_url
    const formDataPayload = prepareCallbackPayload(data, callbackName)

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
        onApiSuccess(onfidoSuccessResponse)
      } else if (continueWithOnfidoSubmission) {
        if (callbackName === CALLBACK_TYPES.document) {
          uploadDocument(
            data as UploadDocumentPayload,
            url,
            token,
            onApiSuccess,
            onApiError
          )
          return
        }

        if (callbackName === CALLBACK_TYPES.video) {
          uploadFaceVideo(
            data as UploadVideoPayload,
            url,
            token,
            onApiSuccess,
            onApiError
          )
          return
        }

        if (callbackName === CALLBACK_TYPES.selfie) {
          handleSelfieUpload(data as FaceCapture, token)
          return
        }
      } else {
        console.error(`Invalid return statement from ${callbackName}`)
      }
    } catch (errorResponse: unknown) {
      // @ts-ignore
      sendEvent(`Error response from ${callbackName}`)
      formatError(errorResponse as ApiRawError, onApiError)
    }
  }

  const prepareCallbackPayload = (
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

  const onRetake = () => {
    const { actions, previousStep, trackScreen, capture } = props

    trackScreen('retake_button_clicked', {
      count_attempt: capture.sdkMetadata.take_number,
    })

    const imageQualitiesKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >
    // Retake on image quality error, increase image quality retries
    const isImageQualityError = imageQualitiesKeys.find(
      (key) => IMAGE_QUALITY_KEYS_MAP[key] === error?.name
    )

    if (isImageQualityError && error?.type === 'error') {
      actions.retryForImageQuality()
    }

    previousStep()
  }

  const onConfirm = () => {
    const { actions, nextStep, trackScreen, capture } = props

    trackScreen('upload_button_clicked', {
      count_attempt: capture.sdkMetadata.take_number,
    })

    if (error?.type === 'warning') {
      actions.resetImageQualityRetries()
      nextStep()
    } else {
      uploadCaptureToOnfido()
    }
  }

  if (uploadInProgress) {
    return <Spinner />
  }

  return (
    <Previews
      isFullScreen={props.isFullScreen}
      capture={props.capture}
      retakeAction={onRetake}
      confirmAction={onConfirm}
      isUploading={uploadInProgress}
      error={error}
      trackScreen={props.trackScreen}
      method={props.method}
      //@ts-ignore todo optional in Previews
      documentType={props.documentType}
      //@ts-ignore todo optional in Previews
      poaDocumentType={props.poaDocumentType}
      forceRetake={error?.type === 'error'}
      onVideoError={onVideoPreviewError}
    />
  )
}

export default Confirm
