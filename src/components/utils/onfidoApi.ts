import { performHttpReq, HttpRequestParams } from './http'
import { forEach } from './object'

import type {
  ImageQualityValidationPayload,
  ApiRawError,
  UploadFileResponse,
  DocumentImageResponse,
  ChallengeData,
  FaceVideoResponse,
  VideoChallengeResponse,
  SnapshotResponse,
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

export const uploadLiveVideo = (
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
