import { hmac256, mimeType } from './blob'
import { parseJwt } from './jwt'
import { performHttpRequest, HttpRequestParams } from '~core/Network'
import { forEach } from './object'
import { sendEvent, trackException } from '../../Tracker'
import detectSystem from './detectSystem'

import type {
  ImageQualityValidationPayload,
  ApiRawError,
  UploadFileResponse,
  DocumentImageResponse,
  ChallengeData,
  FaceVideoResponse,
  VideoChallengeResponse,
  SnapshotResponse,
  UploadBinaryMediaReponse,
  CreateV4DocumentResponse,
  SuccessCallback,
  ErrorCallback,
  SdkConfiguration,
  ApplicantConsent,
  ApplicantConsentStatus,
  PoASupportedCountry,
  ActiveVideoResponse,
} from '~types/api'
import type { DocumentSides, SdkMetadata, FilePayload } from '~types/commons'
import type { SupportedLanguages } from '~types/locales'
import type {
  AnalyticsTrackedEventNames,
  CaptureFormat,
  CaptureMethodRendered,
  LegacyTrackedEventNames,
} from '~types/tracker'
import type { DocumentTypes, PoaTypes } from '~types/steps'

export type UploadPayload = {
  filename?: string
  sdkMetadata: SdkMetadata
}

export type UploadDocumentPayload = {
  file: Blob | FilePayload
  issuing_country?: string
  side?: DocumentSides
  type?: DocumentTypes | PoaTypes | 'unknown'
  validations?: ImageQualityValidationPayload
} & UploadPayload

export type UploadDocumentAnalyticsPayload = {
  document_side: DocumentSides
  country_code?: string
  document_type?: DocumentTypes
  count_attempt: number
  max_retry_count: number
  capture_method_rendered: CaptureMethodRendered
  capture_format?: CaptureFormat
}

export type UploadDocumentVideoMediaPayload = {
  file: Blob | FilePayload
  document_id: string
  sdk_source?: string
  sdk_version?: string
} & Omit<UploadPayload, 'filename'>

export type UploadVideoPayload = {
  blob: Blob
  challengeData?: ChallengeData
  language?: SupportedLanguages
} & UploadPayload

export type UploadSnapshotPayload = {
  file: Blob | FilePayload
}

type UploadLivePhotoPayload = {
  file: Blob | FilePayload
  snapshot_uuids?: string
} & UploadPayload

type SelfiePayload = { blob: Blob } & UploadPayload

type SubmitPayload = Omit<UploadPayload, 'sdkMetadata'> & {
  file?: Blob | FilePayload
  document_id?: string
  sdk_metadata?: string
  sdk_source?: string
  sdk_validations?: string
  sdk_version?: string
}

type SubmitLiveVideoPayload = {
  challenge?: string
  challenge_id?: string
  challenge_switch_at?: number
  languages?: string
} & SubmitPayload

type SubmitActiveVideoPayload = {
  media: Blob
  type: 'liveness'
  metadata: string
} & SubmitPayload

export const formatError = (
  { response, status }: ApiRawError,
  onError: ErrorCallback
): void => {
  try {
    onError({ status, response: JSON.parse(response) })
  } catch {
    onError({ status, response: {} })
  }
}

export const uploadDocument = (
  payload: UploadDocumentPayload,
  url: string | undefined,
  token: string | undefined,
  onSuccess?: SuccessCallback<DocumentImageResponse>,
  onError?: ErrorCallback,
  analyticsPayload?: UploadDocumentAnalyticsPayload
): Promise<DocumentImageResponse> => {
  const { sdkMetadata, validations = {}, ...other } = payload
  const endpoint = `${url}/v3.3/documents`

  const data: SubmitPayload = {
    ...other,
    sdk_metadata: JSON.stringify(sdkMetadata),
    sdk_validations: JSON.stringify(validations),
  }
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'document_upload_started',
    'document_upload_completed',
  ]

  return new Promise((resolve, reject) => {
    sendFile(
      endpoint,
      data,
      token,
      analyticsEvents,
      onSuccess || resolve,
      onError || reject,
      undefined,
      {
        event: 'DOCUMENT_UPLOAD_STARTED',
        legacyEvent: 'document_upload_started',
        properties: analyticsPayload ?? {},
      },
      {
        event: 'DOCUMENT_UPLOAD_COMPLETED',
        legacyEvent: 'document_upload_completed',
        properties: {},
      }
    )
  })
}

export const uploadDocumentVideoMedia = (
  payload: UploadDocumentVideoMediaPayload,
  url: string | undefined,
  token: string | undefined,
  onSuccess?: SuccessCallback<string>,
  onError?: ErrorCallback
): Promise<string> => {
  const { sdkMetadata, ...other } = payload

  const data: SubmitPayload = {
    ...other,
    sdk_metadata: JSON.stringify(sdkMetadata),
  }
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'document_video_upload_started',
    'document_video_upload_completed',
  ]

  const endpoint = `${url}/v3/document_video_media`

  return new Promise((resolve, reject) =>
    sendFile(
      endpoint,
      data,
      token,
      analyticsEvents,
      onSuccess || resolve,
      onError || reject
    )
  )
}

export const uploadFacePhoto = (
  { sdkMetadata, ...data }: UploadLivePhotoPayload,
  url: string | undefined,
  token: string | undefined,
  onSuccess: SuccessCallback<UploadFileResponse>,
  onError: ErrorCallback
): void => {
  const endpoint = `${url}/v3/live_photos`
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'Starting live photo upload',
    'Live photo upload completed',
  ]

  sendFile(
    endpoint,
    { ...data, sdk_metadata: JSON.stringify(sdkMetadata) },
    token,
    analyticsEvents,
    onSuccess,
    onError
  )
}

export const uploadSnapshot = (
  payload: UploadSnapshotPayload,
  url: string | undefined,
  token: string | undefined,
  onSuccess: SuccessCallback<SnapshotResponse>,
  onError: ErrorCallback
): void => {
  const endpoint = `${url}/v3/snapshots`
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'Starting snapshot upload',
    'Snapshot upload completed',
  ]
  sendFile(endpoint, payload, token, analyticsEvents, onSuccess, onError)
}

export const sendMultiframeSelfie = (
  snapshot: FilePayload,
  selfie: SelfiePayload,
  token: string | undefined,
  url: string | undefined,
  onSuccess: SuccessCallback<UploadFileResponse>,
  onError: ErrorCallback
): void => {
  const snapshotData: UploadSnapshotPayload = {
    file: {
      blob: snapshot.blob,
      filename: snapshot.filename,
    },
  }
  const { blob, filename = 'selfie', sdkMetadata } = selfie

  new Promise<SnapshotResponse>((resolve, reject) => {
    uploadSnapshot(snapshotData, url, token, resolve, reject)
  })
    .then((res) => {
      const snapshot_uuids = JSON.stringify([res.uuid])
      uploadFacePhoto(
        { file: { blob, filename }, sdkMetadata, snapshot_uuids },
        url,
        token,
        onSuccess,
        onError
      )
    })
    .catch((err) => {
      // FIXME: the onError can also be a (e:Error) => void, as e.g. the test sendMultiframeSelfie - 'with invalid data' shows
      // that the callback is a type error
      onError(err)
    })
}

export const uploadFaceVideo = (
  { challengeData, blob, language, sdkMetadata }: UploadVideoPayload,
  url: string | undefined,
  token: string | undefined,
  onSuccess?: SuccessCallback<FaceVideoResponse>,
  onError?: ErrorCallback
): Promise<FaceVideoResponse> => {
  const {
    challenges: challenge,
    id: challenge_id,
    switchSeconds: challenge_switch_at,
  } = challengeData || {}

  // NOTE: important for automation - language_code string must be
  //       either 2-letter ISO, i.e. "en", or BCP-47 IIRC format, i.e. "en-US".
  const languageCodeForApi = language && language.split('_')[0]
  const payload: SubmitLiveVideoPayload = {
    file: blob,
    languages: JSON.stringify([
      { source: 'sdk', language_code: languageCodeForApi },
    ]),
    challenge: JSON.stringify(challenge),
    challenge_id,
    challenge_switch_at,
    sdk_metadata: JSON.stringify(sdkMetadata),
  }
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'face_video_upload_started',
    'face_video_upload_completed',
  ]

  const endpoint = `${url}/v3/live_videos`

  return new Promise((resolve, reject) =>
    sendFile(
      endpoint,
      payload,
      token,
      analyticsEvents,
      onSuccess || resolve,
      onError || reject
    )
  )
}

export const uploadActiveVideo = (
  media: Blob,
  metadata: string,
  url: string | undefined,
  token: string | undefined,
  onSuccess?: SuccessCallback<ActiveVideoResponse>,
  onError?: ErrorCallback
): Promise<ActiveVideoResponse> => {
  const endpoint = `${url}/v3/biometrics/media`
  const payload: SubmitActiveVideoPayload = {
    media,
    type: 'liveness',
    metadata,
  }
  const analyticsEvents: LegacyTrackedEventNames[] = [
    'active_video_upload_started',
    'active_video_upload_completed',
  ]
  return new Promise((resolve, reject) =>
    sendFile(
      endpoint,
      payload,
      token,
      analyticsEvents,
      onSuccess || resolve,
      onError || reject,
      { method: 'PUT' }
    )
  )
}

export const requestChallenges = (
  url: string | undefined,
  token: string | undefined,
  onSuccess: SuccessCallback<VideoChallengeResponse>,
  onError: ErrorCallback
): void => {
  if (!url) {
    return onError({
      response: {
        message: 'onfido_api_url not provided',
      },
    })
  }

  if (!token) {
    return onError({
      response: {
        message: 'token not provided',
      },
    })
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3/live_video_challenge`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
  }

  performHttpRequest(options, onSuccess, (request) =>
    formatError(request, onError)
  )
}

export const getPoASupportedCountries = (url?: string, token?: string) => {
  if (!url) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3.3/report_types/proof_of_address/supported_countries`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
    method: 'GET',
  }

  return new Promise<PoASupportedCountry[]>((resolve, reject) => {
    performHttpRequest(options, resolve, (request) =>
      formatError(request, reject)
    )
  })
}

export const getApplicantConsents = (
  applicantUUID: string,
  url?: string,
  token?: string
) => {
  if (!url) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3.3/applicants/${applicantUUID}/consents`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
    method: 'GET',
  }

  return new Promise<ApplicantConsentStatus[]>((resolve, reject) => {
    performHttpRequest(options, resolve, (request) =>
      formatError(request, reject)
    )
  })
}

export const updateApplicantConsents = (
  applicantUUID: string,
  applicantConsents: ApplicantConsent[],
  url?: string,
  token?: string
): Promise<void> => {
  if (!url) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3.3/applicants/${applicantUUID}/consents`,
    payload: JSON.stringify(applicantConsents),
    contentType: 'application/json',
    token: `Bearer ${token}`,
    method: 'PATCH',
  }

  return new Promise((resolve, reject) => {
    performHttpRequest(options, resolve, (request) =>
      formatError(request, reject)
    )
  })
}

export const updateApplicantLocation = (
  applicantUUID: string,
  url?: string,
  token?: string
): Promise<void> => {
  if (!url) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3.3/applicants/${applicantUUID}/location`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
    method: 'PATCH',
  }

  return new Promise<void>((resolve, reject) => {
    performHttpRequest(options, resolve, (request) =>
      formatError(request, reject)
    )
  })
}

export const uploadBinaryMedia = (
  { file, filename, sdkMetadata }: UploadDocumentPayload,
  url: string | undefined,
  token: string | undefined,
  includeHmacAuth = false
): Promise<UploadBinaryMediaReponse> =>
  new Promise((resolve, reject) => {
    try {
      const tokenData = parseJwt(token)
      const formData = new FormData()
      const blob = (file as FilePayload).blob || file
      formData.append(
        'media',
        blob,
        filename || `document_capture.${mimeType(blob)}`
      )
      formData.append('sdk_metadata', JSON.stringify(sdkMetadata))

      if (!includeHmacAuth) {
        const requestParams: HttpRequestParams = {
          endpoint: `${url}/v4/binary_media`,
          payload: formData,
          token: `Bearer ${token}`,
        }

        performHttpRequest(requestParams, resolve, (request) =>
          formatError(request, reject)
        )

        return
      }

      blob
        .arrayBuffer()
        .then((data) => hmac256(tokenData.uuid as string, data))
        .then((hmac) => {
          const requestParams: HttpRequestParams = {
            endpoint: `${url}/v4/binary_media`,
            headers: { 'X-Video-Auth': hmac },
            payload: formData,
            token: `Bearer ${token}`,
          }

          performHttpRequest(requestParams, resolve, (request) =>
            formatError(request, reject)
          )
        })
        .catch(reject)
    } catch (error) {
      reject(error)
    }
  })

export const createV4Document = (
  mediaIds: string[],
  url: string | undefined,
  token: string | undefined
): Promise<CreateV4DocumentResponse> =>
  new Promise((resolve, reject) => {
    try {
      const requestParams: HttpRequestParams = {
        contentType: 'application/json',
        payload: JSON.stringify({
          document_media: mediaIds.map((uuid) => ({ binary_media: { uuid } })),
        }),
        endpoint: `${url}/v4/documents`,
        token: `Bearer ${token}`,
      }

      performHttpRequest(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      reject(error)
    }
  })

export const objectToFormData = (object: SubmitPayload): FormData => {
  const formData = new FormData()

  forEach(object, (value, fieldName) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' || // challenge_switch_at is a numerical value & required for video automation
      value instanceof Blob
    ) {
      formData.append(fieldName, value)
    } else if (typeof value === 'object') {
      formData.append(fieldName, value.blob, value.filename)
    }
  })

  return formData
}

type ApiEvent = {
  legacyEvent: LegacyTrackedEventNames
  event: AnalyticsTrackedEventNames // not used, only for declarative purposes.
  properties: Record<string, unknown>
}

const sendFile = <T>(
  endpoint: string | undefined,
  data: SubmitPayload,
  token: string | undefined,
  analyticsEvents: LegacyTrackedEventNames[],
  onSuccess: SuccessCallback<T>,
  onError: ErrorCallback,
  options?: Partial<HttpRequestParams>,
  startEvent?: ApiEvent,
  successEvent?: ApiEvent
) => {
  if (!endpoint) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const payload: SubmitPayload = {
    ...data,
    sdk_source: process.env.SDK_SOURCE,
    sdk_version: process.env.SDK_VERSION,
  }

  const requestParams: HttpRequestParams = {
    ...options,
    payload: objectToFormData(payload),
    endpoint,
    token: `Bearer ${token}`,
  }

  const startTime = performance.now()
  if (startEvent) {
    sendEvent(startEvent.legacyEvent, startEvent.properties)
  } else {
    // Sends upload_started event
    sendEvent(analyticsEvents[0])
  }
  performHttpRequest(
    requestParams,
    (response: T) => {
      if (successEvent) {
        sendEvent(successEvent.legacyEvent, successEvent.properties)
      } else {
        // Sends upload_completed event
        sendEvent(analyticsEvents[1], {
          duration: Math.round(performance.now() - startTime),
        })
      }

      if (onSuccess) {
        onSuccess(response)
      }
    },
    (request) => {
      console.log('API error', request)
      formatError(request, onError)
    }
  )
}

export const sendAnalytics = (
  url: string | undefined,
  payload: string,
  token: string
): void => {
  const endpoint = `${url}/v4/analytics`

  performHttpRequest(
    {
      method: 'POST',
      contentType: 'application/json',
      endpoint,
      payload,
      token: `Bearer ${token}`,
    },
    () => {},
    (request) => {
      trackException(
        `analytics request error - status: ${request.status}, response: ${request.response}`
      )
    }
  )
}

export const getSdkConfiguration = (
  url: string,
  token: string
): Promise<SdkConfiguration> =>
  new Promise((resolve, reject) => {
    try {
      const browserInfo = detectSystem('browser')
      const osInfo = detectSystem('os')

      const requestParams: HttpRequestParams = {
        endpoint: `${url}/v3.3/sdk/configurations`,
        token: `Bearer ${token}`,
        contentType: 'application/json',
        method: 'POST',
        payload: JSON.stringify({
          sdk_source: process.env.SDK_SOURCE,
          sdk_version: process.env.SDK_VERSION,
          sdk_metadata: {
            system: {
              browser: browserInfo.name,
              browser_version: browserInfo.version,
              os: osInfo.name,
              os_version: osInfo.version,
            },
          },
        }),
      }

      performHttpRequest(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      reject(error)
    }
  })
