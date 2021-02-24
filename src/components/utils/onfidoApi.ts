import { hmac256 } from './blob'
import { parseJwt } from './jwt'
import { performHttpReq, HttpRequestParams } from './http'
import { forEach } from './object'

import type {
  ImageQualityValidationPayload,
  ApiRawError,
  UploadFileResponse,
  DocumentImageResponse,
  DocumentVideoResponse,
  ChallengeData,
  FaceVideoResponse,
  VideoChallengeResponse,
  SnapshotResponse,
  UploadBinaryMediaReponse,
  CreateV4DocumentResponse,
  SuccessCallback,
  ErrorCallback,
} from '~types/api'
import type { DocumentSides, SdkMetadata, FilePayload } from '~types/commons'
import type { SupportedLanguages } from '~types/locales'
import type { TrackedEventNames } from '~types/tracker'
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

type SelfiePayload = { blob?: Blob } & UploadPayload

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
  url: string,
  token: string,
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

export const uploadLivePhoto = (
  { sdkMetadata, ...data }: UploadLivePhotoPayload,
  url: string,
  token: string,
  onSuccess?: SuccessCallback<UploadFileResponse>,
  onError?: ErrorCallback
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
  url: string,
  token: string,
  onSuccess?: SuccessCallback<SnapshotResponse>,
  onError?: ErrorCallback
): void => {
  const endpoint = `${url}/v3/snapshots`
  sendFile(endpoint, payload, token, onSuccess, onError)
}

export const sendMultiframeSelfie = (
  snapshot: FilePayload,
  selfie: SelfiePayload,
  token: string,
  url: string,
  onSuccess: SuccessCallback<UploadFileResponse>,
  onError: ErrorCallback,
  sendEvent: (event: TrackedEventNames) => void
): void => {
  const snapshotData: UploadSnapshotPayload = {
    file: {
      blob: snapshot.blob,
      filename: snapshot.filename,
    },
  }
  const { blob, filename, sdkMetadata } = selfie

  new Promise<SnapshotResponse>((resolve, reject) => {
    sendEvent('Starting snapshot upload')
    uploadSnapshot(snapshotData, url, token, resolve, reject)
  })
    .then((res) => {
      sendEvent('Snapshot upload completed')
      sendEvent('Starting live photo upload')
      const snapshot_uuids = JSON.stringify([res.uuid])
      uploadLivePhoto(
        { file: { blob, filename }, sdkMetadata, snapshot_uuids },
        url,
        token,
        onSuccess,
        onError
      )
    })
    .catch((err) => onError(err))
}

export const uploadDocumentVideo = (
  { blob, sdkMetadata }: UploadVideoPayload,
  url: string,
  token: string,
  onSuccess?: SuccessCallback<DocumentVideoResponse>,
  onError?: ErrorCallback
): Promise<DocumentVideoResponse> => {
  const placeholderChallengeData = {
    languages: JSON.stringify([
      { source: 'sdk', language_code: 'PLACEHOLDER' },
    ]),
    challenge: JSON.stringify([
      {
        query: [-1, -1, -1],
        type: 'recite',
      },
      {
        query: 'PLACEHOLDER',
        type: 'movement',
      },
    ]),
    challenge_id: 'PLACEHOLDER',
    challenge_switch_at: -1,
  }

  const payload: SubmitLiveVideoPayload = {
    ...placeholderChallengeData,
    file: blob,
    sdk_metadata: JSON.stringify(sdkMetadata),
  }

  const endpoint = `${url}/v3/live_videos`

  return new Promise((resolve, reject) =>
    sendFile(endpoint, payload, token, onSuccess || resolve, onError || reject)
  )
}

export const uploadFaceVideo = (
  { challengeData, blob, language, sdkMetadata }: UploadVideoPayload,
  url: string,
  token: string,
  onSuccess?: SuccessCallback<FaceVideoResponse>,
  onError?: ErrorCallback
): Promise<FaceVideoResponse> => {
  const {
    challenges: challenge,
    id: challenge_id,
    switchSeconds: challenge_switch_at,
  } = challengeData

  const payload: SubmitLiveVideoPayload = {
    file: blob,
    languages: JSON.stringify([{ source: 'sdk', language_code: language }]),
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
  url: string,
  token: string,
  onSuccess: SuccessCallback<VideoChallengeResponse>,
  onError: ErrorCallback
): void => {
  const options: HttpRequestParams = {
    endpoint: `${url}/v3/live_video_challenge`,
    contentType: 'application/json',
    token: `Bearer ${token}`,
  }

  performHttpReq(options, onSuccess, (request) => formatError(request, onError))
}

/* v4 APIs */
export const uploadBinaryMedia = (
  { file, filename }: UploadDocumentPayload,
  url: string,
  token: string,
  includeHmacAuth = false
): Promise<UploadBinaryMediaReponse> =>
  new Promise((resolve, reject) => {
    try {
      const tokenData = parseJwt(token)
      const formData = new FormData()
      formData.append('media', file, filename)

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
  url: string,
  token: string
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

const objectToFormData = (object: SubmitPayload): FormData => {
  const formData = new FormData()

  forEach(object, (value, fieldName) => {
    if (typeof value === 'string' || value instanceof Blob) {
      formData.append(fieldName, value)
    } else if (typeof value === 'object') {
      formData.append(fieldName, value.blob, value.filename)
    }
  })

  return formData
}

const sendFile = (
  endpoint: string,
  data: SubmitPayload,
  token: string,
  onSuccess: SuccessCallback<UploadFileResponse>,
  onError: ErrorCallback
) => {
  const payload: SubmitPayload = {
    ...data,
    sdk_source: 'onfido_web_sdk',
    sdk_version: process.env.SDK_VERSION,
  }

  const requestParams: HttpRequestParams = {
    payload: objectToFormData(payload),
    endpoint,
    token: `Bearer ${token}`,
  }

  performHttpReq(requestParams, onSuccess, (request) =>
    formatError(request, onError)
  )
}
