import { hmac256, mimeType } from './blob'
import { parseJwt } from './jwt'
import { performHttpReq, HttpRequestParams } from './http'
import { forEach } from './object'
import { trackException } from '../../Tracker'

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
  WorkflowResponse,
} from '~types/api'
import type {
  DocumentSides,
  SdkMetadata,
  FilePayload,
  UrlsConfig,
} from '~types/commons'
import type { SupportedLanguages } from '~types/locales'
import type { LegacyTrackedEventNames } from '~types/tracker'
import type { DocumentTypes, PoaTypes } from '~types/steps'

type UploadPayload = {
  filename?: string
  sdkMetadata: SdkMetadata
}

type UploadDocumentPayload = {
  file: Blob
  issuing_country?: string
  side?: DocumentSides
  type?: DocumentTypes | PoaTypes | 'unknown'
  validations?: ImageQualityValidationPayload
} & UploadPayload

type UploadVideoPayload = {
  blob: Blob
  challengeData?: ChallengeData
  language?: SupportedLanguages
} & UploadPayload

type UploadSnapshotPayload = {
  file: Blob | FilePayload
}

type UploadLivePhotoPayload = {
  file: Blob | FilePayload
  snapshot_uuids?: string
} & UploadPayload

type SelfiePayload = { blob: Blob } & UploadPayload

type SubmitPayload = Omit<UploadPayload, 'sdkMetadata'> & {
  file?: Blob | FilePayload
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
  onError?: ErrorCallback
): Promise<DocumentImageResponse> => {
  const { sdkMetadata, validations = {}, ...other } = payload

  const data: SubmitPayload = {
    ...other,
    sdk_metadata: JSON.stringify(sdkMetadata),
    sdk_validations: JSON.stringify(validations),
  }

  const endpoint = `${url}/v3/documents`

  return new Promise((resolve, reject) =>
    sendFile(endpoint, data, token, onSuccess || resolve, onError || reject)
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

  sendFile(
    endpoint,
    { ...data, sdk_metadata: JSON.stringify(sdkMetadata) },
    token,
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
  sendFile(endpoint, payload, token, onSuccess, onError)
}

export const sendMultiframeSelfie = (
  snapshot: FilePayload,
  selfie: SelfiePayload,
  token: string | undefined,
  url: string | undefined,
  onSuccess: SuccessCallback<UploadFileResponse>,
  onError: ErrorCallback,
  sendEvent: (
    event: LegacyTrackedEventNames,
    properties?: Record<string, unknown>
  ) => void
): void => {
  const snapshotData: UploadSnapshotPayload = {
    file: {
      blob: snapshot.blob,
      filename: snapshot.filename,
    },
  }
  const { blob, filename = 'selfie', sdkMetadata } = selfie

  new Promise<SnapshotResponse>((resolve, reject) => {
    sendEvent('Starting snapshot upload')
    uploadSnapshot(snapshotData, url, token, resolve, reject)
  })
    .then((res) => {
      sendEvent('Snapshot upload completed')
      sendEvent('Starting live photo upload')
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

  const endpoint = `${url}/v3/live_videos`

  return new Promise((resolve, reject) =>
    sendFile(endpoint, payload, token, onSuccess || resolve, onError || reject)
  )
}

export const requestChallenges = (
  url: string | undefined,
  token: string | undefined,
  onSuccess: SuccessCallback<VideoChallengeResponse>,
  onError: ErrorCallback
): void => {
  if (!url) {
    throw new Error('onfido_api_url not provided')
  }

  if (!token) {
    throw new Error('token not provided')
  }

  const options: HttpRequestParams = {
    endpoint: `${url}/v3/live_video_challenge`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
  }

  performHttpReq(options, onSuccess, (request) => formatError(request, onError))
}

/* v4 APIs */
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
      formData.append(
        'media',
        file,
        filename || `document_capture.${mimeType(file)}`
      )
      formData.append('sdk_metadata', JSON.stringify(sdkMetadata))

      if (!includeHmacAuth) {
        const requestParams: HttpRequestParams = {
          endpoint: `${url}/v4/binary_media`,
          payload: formData,
          token: `Bearer ${token}`,
        }

        performHttpReq(requestParams, resolve, (request) =>
          formatError(request, reject)
        )

        return
      }

      file
        .arrayBuffer()
        .then((data) => hmac256(tokenData.uuid as string, data))
        .then((hmac) => {
          const requestParams: HttpRequestParams = {
            endpoint: `${url}/v4/binary_media`,
            headers: { 'X-Video-Auth': hmac },
            payload: formData,
            token: `Bearer ${token}`,
          }

          performHttpReq(requestParams, resolve, (request) =>
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

      performHttpReq(requestParams, resolve, (request) =>
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

const sendFile = <T>(
  endpoint: string | undefined,
  data: SubmitPayload,
  token: string | undefined,
  onSuccess: SuccessCallback<T>,
  onError: ErrorCallback
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
    payload: objectToFormData(payload),
    endpoint,
    token: `Bearer ${token}`,
  }

  performHttpReq(requestParams, onSuccess, (request) => {
    console.log('API error', request)
    formatError(request, onError)
  })
}

export const sendAnalytics = (
  url: string | undefined,
  payload: string
): void => {
  const endpoint = `${url}/v3/analytics`
  const request = new XMLHttpRequest()
  request.open('POST', endpoint)
  request.setRequestHeader('Content-Type', 'application/json')

  request.onload = () => {
    const isSuccessfulRequest = request.status === 200 || request.status === 201
    if (!isSuccessfulRequest) {
      trackException(
        `analytics request error - status: ${request.status}, response: ${request.response}`
      )
    }
  }
  request.onerror = () =>
    trackException(
      `analytics request error - status: ${request.status}, response: ${request.response}`
    )

  request.send(payload)
}

export const getWorkflow = (
  isMfe: boolean,
  token: string | undefined,
  url: string | undefined,
  workflowRunId: string,
  applicantId: string
): Promise<WorkflowResponse> => {
  return new Promise((resolve, reject) => {
    try {
      const requestParams: HttpRequestParams = {
        method: 'GET',
        contentType: 'application/json',
        endpoint: `${url}/workflow_runs/${workflowRunId}`,
      }

      if (!isMfe) {
        requestParams.headers = { 'x-onfido-applicant-id': applicantId }
      }
      if (token) {
        requestParams.token = `Bearer ${token}`
      }

      performHttpReq(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      console.log('API error: ', error)
      reject(error)
    }
  })
}

export const completeWorkflow = (
  isMfe: boolean,
  token: string | undefined,
  url: string | undefined,
  workflowRunId: string,
  taskId: string,
  applicantId: string,
  personalData?: any,
  docData?: any
): Promise<WorkflowResponse> => {
  console.log('complete workflow call to API')

  return new Promise((resolve, reject) => {
    try {
      const requestParams: HttpRequestParams = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify({
          task_id: taskId,
          data: docData.length ? docData : personalData || {},
        }),
        endpoint: `${url}/workflow_runs/${workflowRunId}/complete`,
      }

      if (!isMfe) {
        requestParams.headers = { 'x-onfido-applicant-id': applicantId }
      }
      if (token) {
        requestParams.token = `Bearer ${token}`
      }

      performHttpReq(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      reject(error)
    }
  })
}

export const getWorkflowServiceUrl = (
  urls: UrlsConfig,
  isMfe: boolean
): string => {
  let workflowServiceUrl = `${urls.onfido_api_url}/v4` // this will be used in MFE mode always, and need v4 added

  const standaloneWorkflowServiceUrls = {
    development: 'https://api.onfido.com/v4', //'http://localhost:5000',
    staging: 'https://workflow-api.eu-west-1.dev.onfido.xyz',
    'pre-prod': 'https://workflow-api.eu-west-1.pre-prod.onfido.xyz',
  }

  // standalone service URLs set only when _not_ in MFE mode
  const env: null | 'development' | 'staging' | 'pre-prod' = 'development' // null is "production" build
  if (!isMfe && env && standaloneWorkflowServiceUrls[env]) {
    workflowServiceUrl = standaloneWorkflowServiceUrls[env]
  }

  return workflowServiceUrl
}
