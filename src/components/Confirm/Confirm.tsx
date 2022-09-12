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
  UploadDocumentAnalyticsPayload,
} from '~utils/onfidoApi'
import { poaDocumentTypes } from '../DocumentSelector/documentTypes'
import Spinner from '../Spinner'
import Previews from './Previews'
import { ErrorProp, StepComponentBaseProps } from '~types/routers'
import { CapturePayload, DocumentCapture, FaceCapture } from '~types/redux'
import { CaptureMethods, DocumentSides, ErrorNames } from '~types/commons'
import {
  ApiRawError,
  ChallengeData,
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
import useSdkConfigurationService from '~core/SdkConfiguration/useSdkConfigurationService'
import {
  AnalyticsEventPropertiesWarnings,
  CaptureFormat,
  CaptureMethodRendered,
} from '~types/tracker'
import { buildStepFinder } from '~utils/steps'
import { shouldUseCameraForDocumentCapture } from '~utils/shouldUseCamera'

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
  isFullScreen?: boolean
  capture: CapturePayload
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

  const buildUploadDocumentAnalyticsPayload = ():
    | UploadDocumentAnalyticsPayload
    | undefined => {
    if (props.currentStepType !== 'document') {
      return
    }
    const findStep = buildStepFinder(props.steps)
    const doc = findStep('document')
    let capture_format: CaptureFormat | undefined
    if (doc?.options?.requestedVariant) {
      capture_format =
        doc?.options?.requestedVariant === 'standard' ? 'photo' : 'camera'
    }
    const capture_method_rendered: CaptureMethodRendered = shouldUseCameraForDocumentCapture(
      doc,
      props.deviceHasCameraSupport
    )
      ? 'camera'
      : 'upload'

    return {
      document_side: props.side,
      country_code: props.idDocumentIssuingCountry?.country_alpha2,
      document_type: props.documentType,
      count_attempt: props.imageQualityRetries,
      max_retry_count: sdkConfiguration.document_capture.max_total_retries,
      capture_method_rendered: capture_method_rendered,
      capture_format: capture_format,
    }
  }

  useEffect(() => {
    // 'DOCUMENT_CONFIRMATION'
    props.trackScreen(undefined, {
      document_type: props.documentType,
      country_code: props.idDocumentIssuingCountry?.country_alpha2,
      count_attempt: props.imageQualityRetries,
      max_retry_count: sdkConfiguration.document_capture.max_total_retries,
      warning_origin: 'device',
      warnings: undefined, // leave this empty to show that there are no on device warning.
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

  const setWarning = (
    name: ErrorNames,
    extraProps: Record<string, unknown>,
    imageQualityWarnings?: ImageQualityWarnings
  ) => {
    const warningAnalytics: AnalyticsEventPropertiesWarnings = {}

    if (imageQualityWarnings) {
      // build the warnings for analytics purposes
      const validationReasons = Object.keys(
        imageQualityWarnings
      ) as ImageQualityValidationTypes[]

      validationReasons.forEach((reason) => {
        if (imageQualityWarnings[reason]?.valid) {
          return
        }
        switch (reason) {
          case 'detect_blur':
            warningAnalytics.blur = 'warning'
            break
          case 'detect_cutoff':
            warningAnalytics.cutoff = 'warning'
            break
          case 'detect_glare':
            warningAnalytics.glare = 'warning'
            break
          case 'detect_document':
            warningAnalytics.document = 'warning'
            break
        }
      })
    }

    setErrorProp({
      name,
      type: 'warning',
      analyticsProperties: { ...extraProps, ...{ warnings: warningAnalytics } },
    })

    setUploadInProgress(false)
    props.resetSdkFocus()
  }

  /**
   * Transforms input into ErrorNames
   */
  const mapToErrorName = ([key, val]: [ValidationReasons, string[]]):
    | ErrorNames
    | undefined => {
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

  /**
   * Returns the first image quality error in terms of priority, or undefined if none is found
   */
  const returnFirstImageQualityErrorFound = (
    errorField: ValidationError['fields']
  ) => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >
    for (const errorKey of imageQualityKeys) {
      if (Object.keys(errorField).includes(errorKey))
        return IMAGE_QUALITY_KEYS_MAP[errorKey]
    }
  }

  /**
   * Transforms a backend response that can contain multiple errors into a single error, defined by priority.
   */
  const onfidoErrorReduce = ({ fields }: ValidationError) => {
    const imageQualityError = returnFirstImageQualityErrorFound(fields)
    const entriesOfFields = Object.entries(fields) as Array<
      [ValidationReasons, string[]]
    >

    const [first] = entriesOfFields.map(mapToErrorName)
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
      if (response?.error) {
        const validationError = response.error as ValidationError
        const errorKey = onfidoErrorReduce(validationError)
        setError(errorKey as ErrorNames)
        return
      }
      setError(REQUEST_ERROR)
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

  /**
   * Returns the first image quality warning found in the warnings, if no truthy 'valid' property is found.
   * The order depends on the IMAGE_QUALITY_KEYS_MAP map.
   */
  const returnFirstImageQualityWarning = (
    warnings: ImageQualityWarnings
  ): ImageQualityValidationNames | undefined => {
    const imageQualityKeys = Object.keys(IMAGE_QUALITY_KEYS_MAP) as Array<
      keyof typeof IMAGE_QUALITY_KEYS_MAP
    >

    const warningsKey = Object.keys(warnings) as Array<keyof typeof warnings>

    for (const warnKey of imageQualityKeys) {
      if (warningsKey.includes(warnKey) && !warnings[warnKey]?.valid)
        return IMAGE_QUALITY_KEYS_MAP[warnKey]
    }
  }

  const onImageQualityWarning = (
    apiResponse: DocumentImageResponse
  ): ImageQualityValidationNames | undefined => {
    const { sdk_warnings: warnings } = apiResponse
    if (!warnings) {
      return
    }
    return returnFirstImageQualityWarning(warnings)
  }

  const onApiSuccess = (
    apiResponse: DocumentImageResponse | FaceVideoResponse | UploadFileResponse
  ) => {
    const { nextStep, completeStep, actions, capture } = props

    actions.setCaptureMetadata({ capture, apiResponse })

    const documentImageResponse = apiResponse as DocumentImageResponse
    const imageQualityWarning = onImageQualityWarning(documentImageResponse)

    if (!imageQualityWarning) {
      completeStep([{ id: apiResponse.id }])
      nextStep()
    } else {
      setWarning(
        imageQualityWarning,
        {
          document_type: props.documentType,
          country_code: props.idDocumentIssuingCountry?.country_alpha2,
          warning_origin: 'remote',
          count_attempt: props.imageQualityRetries,
          max_retry_count: sdkConfiguration.document_capture.max_total_retries,
          // not sure what is_blocking refers to, but its the correct way to compute it
          is_blocking:
            props.imageQualityRetries >
            sdkConfiguration.document_capture.max_total_retries,
        },
        documentImageResponse.sdk_warnings
      )
      completeStep([{ id: apiResponse.id }])
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
      const blobName =
        filename || (blob as File).name || `document_capture.${mimeType(blob)}`
      const { documentType: type } = capture as DocumentCapture
      const data: UploadDocumentPayload = {
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
        uploadDocument(
          data,
          url,
          token,
          undefined,
          undefined,
          buildUploadDocumentAnalyticsPayload()
        )
          .then((res) => {
            // Multi Frame Capture video
            if (props.captures.document_video) {
              const {
                blob,
                filename = `document_video_capture.${mimeType(blob)}`,
                sdkMetadata,
              } = props.captures.document_video

              const data: UploadDocumentVideoMediaPayload = {
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
            onApiError,
            buildUploadDocumentAnalyticsPayload()
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
      const { blob, language, challengeData } = data as UploadVideoPayload
      const {
        challenges: challenge,
        id: challenge_id,
        switchSeconds: challenge_switch_at,
      } = challengeData as ChallengeData
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
      isFullScreen={!!props.isFullScreen}
      capture={props.capture}
      retakeAction={onRetake}
      confirmAction={onConfirm}
      isUploading={uploadInProgress}
      error={error}
      trackScreen={props.trackScreen}
      method={props.method}
      documentType={props.documentType || props.poaDocumentType}
      forceRetake={error?.type === 'error'}
      onVideoError={onVideoPreviewError}
    />
  )
}

export default Confirm
